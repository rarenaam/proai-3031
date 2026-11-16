import { useId } from "react";

export default function WatchArt({
  color = "olive",
  strap = "steel",
  label = "Meridian concept watch",
}: {
  color?: string;
  strap?: string;
  label?: string;
}) {
  const id = useId().replace(/:/g, "");
  const dial =
    color === "ivory"
      ? ["#ece7d5", "#c2b9a1"]
      : color === "black"
        ? ["#363732", "#11140f"]
        : ["#626e50", "#253528"];
  const light = color === "ivory" ? "#333b2f" : "#e4e2ce";
  return (
    <svg className="watch-art" viewBox="0 0 400 520" aria-label={label}>
      <title>{label}</title>
      <defs>
        <linearGradient id={`${id}metal`}>
          <stop stopColor="#777c76" />
          <stop offset=".15" stopColor="#dadbd4" />
          <stop offset=".32" stopColor="#888f87" />
          <stop offset=".47" stopColor="#f0f0e6" />
          <stop offset=".58" stopColor="#9da296" />
          <stop offset=".78" stopColor="#e4e7dc" />
          <stop offset="1" stopColor="#727971" />
        </linearGradient>
        <linearGradient id={`${id}case`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e2e4da" />
          <stop offset=".25" stopColor="#727d71" />
          <stop offset=".47" stopColor="#edf0e6" />
          <stop offset=".65" stopColor="#858f80" />
          <stop offset="1" stopColor="#d9decf" />
        </linearGradient>
        <radialGradient id={`${id}dial`} cx="40%" cy="30%">
          <stop stopColor={dial[0]} />
          <stop offset="1" stopColor={dial[1]} />
        </radialGradient>
        <linearGradient id={`${id}glass`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" stopOpacity=".16" />
          <stop offset=".48" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity=".04" />
        </linearGradient>
        <filter id={`${id}shadow`} x="-50%" y="-30%" width="200%" height="180%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
      </defs>
      <ellipse
        cx="209"
        cy="458"
        rx="89"
        ry="18"
        fill="#24241c"
        opacity=".2"
        filter={`url(#${id}shadow)`}
      />
      <g transform="rotate(-10 200 260)">
        {[-1, 1].map((s) => (
          <g key={s}>
            {strap === "leather" ? (
              <g>
                <path
                  d={
                    s === -1
                      ? "M153 173 L151 38 Q200 21 249 38 L247 173Z"
                      : "M153 347 L151 482 Q200 495 249 482 L247 347Z"
                  }
                  fill="#352c23"
                />
                <path
                  d={
                    s === -1 ? "M160 161L159 42M240 161L241 42" : "M160 358L159 478M240 358L241 478"
                  }
                  stroke="#ad9174"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
              </g>
            ) : (
              Array.from({ length: 10 }, (_, i) => (
                <g key={i} transform={`translate(151 ${s === -1 ? 40 + i * 13 : 350 + i * 13})`}>
                  <rect width="98" height="12" rx="3" fill={`url(#${id}metal)`} />
                  <path d="M28 1V11M70 1V11" stroke="#70776b" strokeWidth="1" />
                  <rect x="30" width="38" height="12" rx="2" fill={`url(#${id}case)`} />
                </g>
              ))
            )}
            <path
              d={
                s === -1
                  ? "M129 179L143 143L164 149L163 177M236 177L237 149L258 143L271 179"
                  : "M129 341L143 377L164 371L163 343M236 343L237 371L258 377L271 341"
              }
              fill={`url(#${id}case)`}
              stroke="#788273"
            />
          </g>
        ))}
        <rect x="294" y="248" width="18" height="25" rx="5" fill={`url(#${id}metal)`} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${298 + i * 2.5} 250v21`} stroke="#6a7366" />
        ))}
        <circle
          cx="200"
          cy="260"
          r="105"
          fill={`url(#${id}case)`}
          stroke="#6f786c"
          strokeWidth="1"
        />
        <circle
          cx="200"
          cy="260"
          r="96"
          fill={`url(#${id}metal)`}
          stroke="#f0f1df"
          strokeWidth="1"
        />
        <circle
          cx="200"
          cy="260"
          r="89"
          fill={`url(#${id}dial)`}
          stroke="#77816d"
          strokeWidth="1.5"
        />
        {Array.from({ length: 100 }, (_, i) => (
          <path
            key={i}
            d="M200 260L200 172"
            stroke={light}
            strokeOpacity=".02"
            transform={`rotate(${i * 3.6} 200 260)`}
          />
        ))}
        <circle
          cx="200"
          cy="260"
          r="79"
          fill="none"
          stroke={light}
          strokeOpacity=".3"
          strokeWidth=".5"
        />
        {Array.from({ length: 60 }, (_, i) => (
          <path
            key={i}
            d={`M200 177V${i % 5 === 0 ? 182 : 180}`}
            stroke={light}
            strokeWidth={i % 5 === 0 ? 1.2 : 0.65}
            transform={`rotate(${i * 6} 200 260)`}
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 30} 200 260)`}>
            <rect x="198" y="185" width="4" height="12" fill={`url(#${id}case)`} />
            <rect x="199.2" y="186.5" width="1.5" height="9" fill={light} />
          </g>
        ))}
        <text
          x="200"
          y="227"
          textAnchor="middle"
          fontFamily="Georgia"
          fontSize="10"
          letterSpacing="1.5"
          fill={light}
        >
          MERIDIAN
        </text>
        <text
          x="200"
          y="237"
          textAnchor="middle"
          fontFamily="Arial"
          fontSize="4.3"
          letterSpacing="1.3"
          fill={light}
        >
          OBJECTS OF TIME
        </text>
        <text
          x="200"
          y="293"
          textAnchor="middle"
          fontFamily="Georgia"
          fontStyle="italic"
          fontSize="8"
          fill={light}
        >
          Automatic
        </text>
        <text
          x="200"
          y="304"
          textAnchor="middle"
          fontFamily="Arial"
          fontSize="4"
          letterSpacing="1"
          fill={light}
        >
          SERIES 01
        </text>
        <rect
          x="264"
          y="255"
          width="14"
          height="10"
          fill="#eee9db"
          stroke="#a3aa94"
          strokeWidth=".7"
        />
        <text x="271" y="263" textAnchor="middle" fontFamily="Arial" fontSize="7" fill="#34382d">
          16
        </text>
        <g transform="rotate(-60 200 260)">
          <path
            d="M197 267L198 214L200 205L202 214L203 267Z"
            fill={`url(#${id}case)`}
            stroke="#9ea68e"
            strokeWidth=".5"
          />
          <path d="M199 253V216L200 211L201 216V253Z" fill={light} />
        </g>
        <g transform="rotate(60 200 260)">
          <path d="M198 272L198.5 196L200 188L201.5 196L202 272Z" fill={`url(#${id}case)`} />
          <path d="M199.5 256V198L200 193L200.5 198V256Z" fill={light} />
        </g>
        <path d="M183 280L253 198" stroke="#c65e3a" strokeWidth="1" />
        <circle cx="200" cy="260" r="3" fill={`url(#${id}metal)`} />
        <circle cx="200" cy="260" r="89" fill={`url(#${id}glass)`} />
      </g>
    </svg>
  );
}
