import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const steps = [
  {
    title: "The movement",
    number: "01",
    label: "A HEART THAT NEVER HURRIES",
    copy: "A mechanical watch makes time tangible. A wound spring stores energy; a train of gears releases it, one beautifully measured beat at a time.",
    value: "28,800",
    unit: "BEATS PER HOUR",
    extra: "An illustrative high-frequency automatic calibre.",
  },
  {
    title: "The material",
    number: "02",
    label: "CHARACTER YOU CAN FEEL",
    copy: "Brushed steel, polished edges, a dial that changes with the light. We look for materials that do more than catch your eye — they reward years of wear.",
    value: "316L",
    unit: "STAINLESS STEEL",
    extra: "A considered balance of resilience and finish.",
  },
  {
    title: "The perspective",
    number: "03",
    label: "CHOSEN WITH INTENTION",
    copy: "Proportion. Legibility. The way a bracelet settles on the wrist. Our perspective starts with the little things that turn a timepiece into your timepiece.",
    value: "40",
    unit: "MILLIMETRES",
    extra: "Balanced dimensions, beyond passing trends.",
  },
];
function Gear({
  x,
  y,
  r,
  teeth,
  className,
}: {
  x: number;
  y: number;
  r: number;
  teeth: number;
  className: string;
}) {
  const points = Array.from({ length: teeth * 4 }, (_, i) => {
    const a = (i / (teeth * 4)) * Math.PI * 2;
    const rr = r * (i % 4 === 1 || i % 4 === 2 ? 1 : 0.91);
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(" ");
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={className}>
        <polygon points={points} fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle r={r * 0.69} fill="none" stroke="currentColor" strokeWidth=".6" />
        <circle r={r * 0.25} fill="none" stroke="currentColor" strokeWidth="1.2" />
        {Array.from({ length: 6 }, (_, i) => (
          <path
            key={i}
            d={`M${r * 0.3} -8 L${r * 0.62} -13 L${r * 0.66} 13 L${r * 0.3} 8 Z`}
            fill="none"
            stroke="currentColor"
            strokeWidth=".8"
            transform={`rotate(${i * 60})`}
          />
        ))}
      </g>
      <circle r="4" fill="#b69158" />
    </g>
  );
}
export default function Craft() {
  const [selected, setSelected] = useState(0);
  const step = steps[selected]!;
  return (
    <section id="craft" className="craft-section">
      <div className="section-topline">
        <span className="eyebrow">02 / THE INNER WORLD</span>
        <span className="eyebrow muted">UNDERSTAND WHAT MOVES YOU</span>
      </div>
      <div className="craft-heading">
        <h2 className="reveal-heading">
          Beauty is only
          <br />
          <em>the beginning.</em>
        </h2>
        <p>
          A good watch tells the time.
          <br />
          An extraordinary one tells you more.
          <br />
          Step inside the details that matter.
        </p>
      </div>
      <div className="craft-exhibit">
        <div className={`mechanism step-${selected}`}>
          <svg
            viewBox="0 0 680 580"
            className="mechanism-svg"
            aria-label="Animated schematic of an interconnected mechanical watch movement"
          >
            <title>Interconnected mechanical watch movement</title>
            <defs>
              <radialGradient id="mechanismGlow">
                <stop stopColor="#b48d54" stopOpacity=".11" />
                <stop offset="1" stopColor="#b48d54" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="335" cy="285" r="276" fill="url(#mechanismGlow)" />
            <g className="diagram-orbit">
              <circle
                cx="335"
                cy="285"
                r="252"
                fill="none"
                stroke="#827050"
                strokeOpacity=".4"
                strokeWidth=".7"
              />
              <circle
                cx="335"
                cy="285"
                r="239"
                fill="none"
                stroke="#827050"
                strokeOpacity=".4"
                strokeWidth=".6"
                strokeDasharray="1 7"
              />
            </g>
            <path
              className="diagram-path"
              d="M68 166H155L209 236H310L424 164H576M162 444L240 366L335 285L453 363H585M335 36V122L335 285V534"
              fill="none"
              stroke="#a1875c"
              strokeWidth=".7"
              strokeDasharray="7 5"
            />
            <g style={{ color: "#a88b5b" }}>
              <Gear x={335} y={285} r={107} teeth={44} className="gear-clockwise" />
              <Gear x={467} y={202} r={61} teeth={30} className="gear-counter" />
              <Gear x={219} y={197} r={60} teeth={28} className="gear-counter" />
              <Gear x={225} y={384} r={55} teeth={26} className="gear-counter" />
              <Gear x={430} y={386} r={49} teeth={24} className="gear-counter" />
            </g>
            <g fill="none" stroke="#d0b88d" strokeWidth=".7">
              <circle cx="335" cy="285" r="35" />
              {[13, 17, 21, 25, 29].map((r) => (
                <circle key={r} cx="335" cy="285" r={r} />
              ))}
            </g>
            <g stroke="#93805d" strokeWidth=".7" fill="none">
              <path d="M335 180L350 134H459M269 367L248 431H107M473 199L530 132H597" />
              <circle cx="335" cy="180" r="3" />
              <circle cx="269" cy="367" r="3" />
              <circle cx="473" cy="199" r="3" />
            </g>
            <g fontFamily="Manrope, sans-serif" fontSize="9" letterSpacing="1.5" fill="#b8aa8b">
              <text x="354" y="125">
                BALANCE WHEEL
              </text>
              <text x="108" y="448">
                ESCAPEMENT
              </text>
              <text x="531" y="123">
                GEAR TRAIN
              </text>
            </g>
            <g fill="#a99470">
              {[
                [68, 166],
                [576, 164],
                [162, 444],
                [585, 363],
                [335, 36],
                [335, 534],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3" />
              ))}
            </g>
          </svg>
          <span className="diagram-caption">FIG. 01 — A STUDY IN HARMONY</span>
        </div>
        <div className="craft-content">
          <div className="craft-tabs" role="tablist" aria-label="Discover watchmaking">
            {steps.map((s, i) => (
              <button
                key={s.number}
                role="tab"
                aria-selected={selected === i}
                aria-controls="craft-detail"
                id={`craft-tab-${i}`}
                onClick={() => setSelected(i)}
                className={selected === i ? "active" : ""}
              >
                <span>{s.number}</span>
                {s.title}
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
          <div
            className="craft-detail"
            id="craft-detail"
            role="tabpanel"
            aria-labelledby={`craft-tab-${selected}`}
            key={selected}
          >
            <span className="eyebrow accent">{step.label}</span>
            <p>{step.copy}</p>
            <div className="craft-value">
              <strong>{step.value}</strong>
              <span>{step.unit}</span>
            </div>
            <small>{step.extra}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
