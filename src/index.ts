import express, { Request, Response } from "express";
import path from "path";
import { schoolBreaks } from "./breaks";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.static(path.join(__dirname, "..", "images"), { index: false }));

app.get("/", (_req: Request, res: Response) => {
  // Find the next upcoming break (where start date is in the future)
  const now = new Date();
  const nextBreak = schoolBreaks
    .filter((b) => new Date(b.start) > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];

  const breaksJson = JSON.stringify(schoolBreaks);
  const nextBreakJson = JSON.stringify(nextBreak ?? null);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hello Misha!</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: sans-serif;
            background: #f0f0f0;
            gap: 1.5rem;
            transition: background 0.5s;
          }
          body.animating {
            background: #e8f4ff;
          }
          h1 {
            font-size: 3rem;
            color: #333;
          }
          #countdown-label {
            font-size: 1.1rem;
            color: #666;
            text-align: center;
          }
          #countdown-label.celebrate {
            font-size: 2rem;
            font-weight: 700;
            color: #3b82f6;
            animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
          @keyframes popIn {
            0%   { opacity: 0; transform: scale(0.5); }
            70%  { transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
          #countdown {
            display: flex;
            gap: 1.5rem;
            text-align: center;
          }
          .unit {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: white;
            border-radius: 12px;
            padding: 1rem 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            min-width: 80px;
            transition: box-shadow 0.3s, transform 0.3s;
          }
          body.animating .unit {
            box-shadow: 0 4px 20px rgba(59,130,246,0.25);
            transform: scale(1.04);
          }
          .unit .value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #333;
            font-variant-numeric: tabular-nums;
            transition: color 0.3s;
          }
          body.animating .unit .value {
            color: #3b82f6;
          }
          .unit .label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #999;
            margin-top: 4px;
          }
          #go-to-break {
            margin-top: 0.5rem;
            padding: 0.75rem 2rem;
            font-size: 1rem;
            font-weight: 600;
            color: white;
            background: #3b82f6;
            border: none;
            border-radius: 999px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(59,130,246,0.4);
            transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
          }
          #go-to-break:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(59,130,246,0.5);
          }
          #go-to-break:active:not(:disabled) {
            transform: translateY(0);
          }
          #go-to-break:disabled {
            background: #93c5fd;
            cursor: not-allowed;
          }
        </style>
      </head>
      <body>
        <img src="/mascots.png" alt="Mascots" style="max-width: 300px; width: 100%;" />
        <h1>Hello Misha!</h1>
        <p id="countdown-label">Loading...</p>
        <div id="countdown">
          <div class="unit"><span class="value" id="days">--</span><span class="label">Days</span></div>
          <div class="unit"><span class="value" id="hours">--</span><span class="label">Hours</span></div>
          <div class="unit"><span class="value" id="minutes">--</span><span class="label">Minutes</span></div>
          <div class="unit"><span class="value" id="seconds">--</span><span class="label">Seconds</span></div>
        </div>
        <button id="go-to-break">I can't wait!</button>

        <script>
          const breaks = ${breaksJson};
          const nextBreak = ${nextBreakJson};

          let animating = false;

          function pad(n) {
            return String(Math.floor(Math.max(n, 0))).padStart(2, '0');
          }

          function updateDisplay(diff) {
            const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            document.getElementById('days').textContent    = pad(days);
            document.getElementById('hours').textContent   = pad(hours);
            document.getElementById('minutes').textContent = pad(minutes);
            document.getElementById('seconds').textContent = pad(seconds);
          }

          function tick() {
            if (animating) return;
            if (!nextBreak) {
              document.getElementById('countdown-label').textContent = 'No upcoming breaks found.';
              return;
            }

            const now = Date.now();
            const target = new Date(nextBreak.start + 'T00:00:00').getTime();
            const diff = target - now;

            if (diff <= 0) {
              document.getElementById('countdown-label').textContent =
                nextBreak.name + ' is happening now!';
              updateDisplay(0);
              return;
            }

            document.getElementById('countdown-label').textContent =
              'Until ' + nextBreak.name + ' (' + nextBreak.start + ')';
            updateDisplay(diff);
          }

          tick();
          setInterval(tick, 1000);

          // --- "Take me to break" animation ---
          function easeIn(t) {
            // Cubic ease-in: starts slow, accelerates to the end
            return t * t * t;
          }

          document.getElementById('go-to-break').addEventListener('click', () => {
            if (animating || !nextBreak) return;

            animating = true;
            document.getElementById('go-to-break').disabled = true;
            document.getElementById('countdown-label').textContent = '🚀 Zooming to break...';
            document.body.classList.add('animating');

            const now = Date.now();
            const target = new Date(nextBreak.start + 'T00:00:00').getTime();
            const startDiff = Math.max(target - now, 0);
            const DURATION = 5000; // 5 seconds
            const startTime = performance.now();

            function frame(ts) {
              const elapsed = ts - startTime;
              const progress = Math.min(elapsed / DURATION, 1);
              const easedProgress = easeIn(progress);
              const simulatedDiff = startDiff * (1 - easedProgress);

              updateDisplay(simulatedDiff);

              if (progress < 1) {
                requestAnimationFrame(frame);
              } else {
                // Landed! Keep animating=true so tick() stays suppressed.
                updateDisplay(0);
                const label = document.getElementById('countdown-label');
                label.textContent = '🎉 Enjoy your ' + nextBreak.name + '!';
                label.classList.remove('celebrate'); // reset to retrigger animation
                void label.offsetWidth;             // force reflow
                label.classList.add('celebrate');
                document.body.classList.remove('animating');
                const btn = document.getElementById('go-to-break');
                btn.textContent = 'Go back';
                btn.disabled = false;
              }
            }

            requestAnimationFrame(frame);
          });

          // "Go back" — resume the real countdown
          document.getElementById('go-to-break').addEventListener('click', () => {
            if (!animating) return; // only active in post-animation state
            const btn = document.getElementById('go-to-break');
            if (btn.textContent !== 'Go back') return;
            animating = false;
            btn.textContent = "I can't wait!";
            const label = document.getElementById('countdown-label');
            label.classList.remove('celebrate');
            label.textContent = '';
            tick(); // refresh immediately so there's no 1-second gap
          });
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
