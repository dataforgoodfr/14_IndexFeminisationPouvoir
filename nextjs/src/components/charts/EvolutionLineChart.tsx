"use client";

interface DataPoint {
  annee: number;
  valeur: number;
}

interface President {
  nom: string;
  debut: number;
  fin: number | null;
}

interface EvolutionLineChartProps {
  data: DataPoint[];
  presidents?: President[];
}

const SVG_WIDTH = 1164;
const SVG_HEIGHT = 608;

const MARGIN = {
  top: 40,
  right: 20,
  bottom: 140,
  left: 75,
};

const CHART_WIDTH = SVG_WIDTH - MARGIN.left - MARGIN.right;
const CHART_HEIGHT = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

const Y_TICKS = [0, 20, 40, 60, 80, 100];

const LABEL_TEXT_HEIGHT = 12;
const LABEL_TEXT_WIDTH = 25;
const LABEL_SHIFT_STEP = 4;
const LABEL_MAX_ITERATIONS = 50;

type LabelPosition = {
  cx: number;
  cy: number;
  y_text: number;
};

type TextBox = { left: number; right: number; top: number; bottom: number };

function textBoxAt(cx: number, y_text: number): TextBox {
  return {
    left: cx - LABEL_TEXT_WIDTH / 2,
    right: cx + LABEL_TEXT_WIDTH / 2,
    top: y_text - LABEL_TEXT_HEIGHT,
    bottom: y_text,
  };
}

function overlaps(a: TextBox, b: TextBox): boolean {
  return (
    a.bottom > b.top && a.top < b.bottom && a.right > b.left && a.left < b.right
  );
}

function computeLabelPositions(
  data: DataPoint[],
  x: (year: number) => number,
): LabelPosition[] {
  const positions: LabelPosition[] = [];
  let prevBox: TextBox = { left: 0, right: 0, top: 0, bottom: 0 };

  for (const [idx, d] of data.entries()) {
    const cx = x(d.annee);
    const cy = yPos(d.valeur);
    let y_text = cy - 8;

    if (idx > 0) {
      let iterations = 0;
      while (
        overlaps(textBoxAt(cx, y_text), prevBox) &&
        iterations < LABEL_MAX_ITERATIONS
      ) {
        y_text -= LABEL_SHIFT_STEP;
        iterations++;
      }
    }

    prevBox = textBoxAt(cx, y_text);
    positions.push({ cx, cy, y_text });
  }

  return positions;
}

function xPos(year: number, minYear: number, maxYear: number): number {
  return MARGIN.left + ((year - minYear) / (maxYear - minYear)) * CHART_WIDTH;
}

function yPos(pct: number): number {
  return MARGIN.top + ((100 - pct) / 100) * CHART_HEIGHT;
}

export function EvolutionLineChart({
  data,
  presidents = [],
}: EvolutionLineChartProps) {
  if (data.length === 0) return null;

  const minYear = data[0].annee;
  const maxYear = data[data.length - 1].annee;
  const baseline = MARGIN.top + CHART_HEIGHT;

  const x = (year: number) => xPos(year, minYear, maxYear);

  const linePath = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${x(d.annee).toFixed(1)} ${yPos(d.valeur).toFixed(1)}`,
    )
    .join(" ");

  const areaPath = [
    `M ${x(data[0].annee).toFixed(1)} ${baseline}`,
    ...data.map(
      (d) => `L ${x(d.annee).toFixed(1)} ${yPos(d.valeur).toFixed(1)}`,
    ),
    `L ${x(data[data.length - 1].annee).toFixed(1)} ${baseline}`,
    "Z",
  ].join(" ");

  // President eras — clamp to data range
  const presidentEras = presidents
    .map((p) => ({
      ...p,
      startX: x(Math.max(p.debut, minYear)),
      endX: x(Math.min(p.fin ?? maxYear, maxYear)),
    }))
    .filter((p) => p.startX < x(maxYear) && p.endX > x(minYear));

  const presidentLabelY = baseline + 75;

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="w-full"
      aria-label="Graphique d'évolution du taux de féminisation"
    >
      {/* Background */}
      <rect
        x={0}
        y={0}
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        rx={14}
        className="fill-foundations-violet-tres-clair"
      />

      {/* Y-axis grid lines and labels */}
      {Y_TICKS.map((tick) => {
        const y = yPos(tick);
        return (
          <g key={tick}>
            <line
              x1={MARGIN.left}
              y1={y}
              x2={MARGIN.left + CHART_WIDTH}
              y2={y}
              className="stroke-foundations-violet-clair"
              strokeWidth={1}
              strokeDasharray={tick === 0 ? "none" : "4 3"}
            />
            <text
              x={MARGIN.left - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={12}
              fontFamily="Lato, sans-serif"
              fontWeight={700}
              fill="#000000"
            >
              {tick === 0 ? "0 %" : `${tick}%`}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="rgba(81,56,147,0.12)" />

      {/* Line */}
      <path
        d={linePath}
        strokeWidth={2}
        className="stroke-foundations-violet-principal"
        fill="none"
        strokeLinejoin="round"
      />

      {/* President separator lines */}
      {presidents.length > 0 && presidentEras.map((p) => (
        <line
          key={`sep-${p.nom}`}
          x1={p.startX}
          y1={baseline}
          x2={p.startX}
          y2={presidentLabelY + 20}
          className="stroke-foundations-violet-principal"
          strokeWidth={1}
          opacity={0.4}
        />
      ))}
      {/* Final separator */}
      <line
        x1={x(maxYear)}
        y1={baseline}
        x2={x(maxYear)}
        y2={presidentLabelY + 20}
        className="stroke-foundations-violet-principal"
        strokeWidth={1}
        opacity={0.4}
      />

      {/* President labels */}
      {presidentEras.map((p) => {
        const midX = (p.startX + p.endX) / 2;
        const [firstName, ...rest] = p.nom.split(" ");
        const lastName = rest.join(" ");
        const years = `${p.debut}–${p.fin ?? "présent"}`;
        return (
          <g key={`lbl-${p.nom}`}>
            <text
              x={midX}
              y={presidentLabelY}
              textAnchor="middle"
              fontSize={11}
              fontFamily="Lato, sans-serif"
              fontWeight={700}
              fill="#000000"
            >
              {firstName}
            </text>
            <text
              x={midX}
              y={presidentLabelY + 14}
              textAnchor="middle"
              fontSize={11}
              fontFamily="Lato, sans-serif"
              fontWeight={700}
              fill="#000000"
            >
              {lastName}
            </text>
            <text
              x={midX}
              y={presidentLabelY + 28}
              textAnchor="middle"
              fontSize={11}
              fontFamily="Lato, sans-serif"
              fontWeight={400}
              fill="#000000"
            >
              {years}
            </text>
          </g>
        );
      })}

      {/* X-axis year labels (rotated) */}
      {data.map((d) => (
        <text
          key={`yr-${d.annee}`}
          x={x(d.annee)}
          y={baseline + 8}
          textAnchor="end"
          fontSize={11}
          fontFamily="Lato, sans-serif"
          fontWeight={700}
          fill="#000000"
          transform={`rotate(-90, ${x(d.annee)}, ${baseline + 8})`}
        >
          {d.annee}
        </text>
      ))}

      {/* Data point squares + percentage labels */}
      {computeLabelPositions(data, x).map((pos, idx) => (
        <g key={`pt-${data[idx].annee}`}>
          <rect
            x={pos.cx - 3}
            y={pos.cy - 3}
            width={6}
            height={6}
            className="fill-foundations-violet-principal"
          />
          <text
            x={pos.cx}
            y={pos.y_text}
            textAnchor="middle"
            fontSize={12}
            fontFamily="Lato, sans-serif"
            fontWeight={700}
            className="fill-foundations-violet-principal"
          >
            {data[idx].valeur}%
          </text>
        </g>
      ))}
    </svg>
  );
}
