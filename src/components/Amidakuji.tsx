import { Ladder, tracePath } from "@/lib/ladder";

export const PATH_COLORS = [
  "#4f46e5",
  "#be185d",
  "#047857",
  "#b45309",
  "#0369a1",
  "#7e22ce",
  "#a21caf",
  "#0f766e",
  "#b91c1c",
  "#4338ca",
  "#3f6212",
  "#9a3412",
];

interface Props {
  ladder: Ladder;
  revealed: boolean;
  selected: number | null;
}

export default function Amidakuji({ ladder, revealed, selected }: Props) {
  const width = ladder.startPoints.length * 112;
  const height = Math.max(320, (ladder.rungs.length + 1) * 12);
  const x = (column: number) => column * 112 + 56;
  const y = (level: number) =>
    16 + (level * (height - 32)) / (ladder.rungs.length + 1);

  function pathFor(start: number): string {
    const columns = tracePath(ladder.rungs, start);
    let path = `M ${x(start)} ${y(0)}`;
    ladder.rungs.forEach((_, level) => {
      path += ` L ${x(columns[level])} ${y(level + 1)} L ${x(columns[level + 1])} ${y(level + 1)}`;
    });
    return `${path} L ${x(columns[columns.length - 1])} ${y(ladder.rungs.length + 1)}`;
  }

  return (
    <div
      className="ladder-scroll"
      tabIndex={0}
      role="region"
      aria-label="Ladder diagram; scroll horizontally for more participants"
    >
      <div className="ladder-content" style={{ minWidth: width }}>
        <div
          className="ladder-labels"
          style={{
            gridTemplateColumns: `repeat(${ladder.startPoints.length}, 1fr)`,
          }}
        >
          {ladder.startPoints.map((name, i) => (
            <span key={i}>
              <b className="column-number">{i + 1}</b>
              {name}
            </span>
          ))}
        </div>
        <svg
          className="ladder-svg"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby="ladder-title ladder-description"
        >
          <title id="ladder-title">Amidakuji ladder</title>
          <desc id="ladder-description">
            {ladder.startPoints.length} columns and {ladder.rungs.length} rungs.
            Follow a line down, crossing at every rung.{" "}
            {revealed
              ? "The results are listed below the diagram."
              : "Show the solution to read the results."}
          </desc>
          <g
            fill="none"
            stroke="#858ca4"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            {ladder.startPoints.map((_, i) => (
              <line
                key={i}
                x1={x(i)}
                y1={y(0)}
                x2={x(i)}
                y2={y(ladder.rungs.length + 1)}
              />
            ))}
            {ladder.rungs.map((column, i) => (
              <line
                className="rung"
                key={i}
                x1={x(column)}
                y1={y(i + 1)}
                x2={x(column + 1)}
                y2={y(i + 1)}
              />
            ))}
          </g>
          {revealed &&
            ladder.startPoints.map((_, i) => (
              <path
                className="solution-path"
                key={i}
                d={pathFor(i)}
                fill="none"
                stroke={PATH_COLORS[i]}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={selected === null || selected === i ? 1 : 0.08}
              />
            ))}
          {ladder.startPoints.map((_, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(0)}
              r="5"
              fill={revealed ? PATH_COLORS[i] : "#4f46e5"}
            />
          ))}
          {ladder.endPoints.map((_, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(ladder.rungs.length + 1)}
              r="4"
              fill="#6b7280"
            />
          ))}
        </svg>
        <div
          className="ladder-labels outcomes"
          style={{
            gridTemplateColumns: `repeat(${ladder.endPoints.length}, 1fr)`,
          }}
        >
          {ladder.endPoints.map((name, i) => (
            <span key={i}>{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
