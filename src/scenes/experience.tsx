import { useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import SSPrev from "@/assets/ss-prev.svg";
import DBFBPrev from "@/assets/db-truck.svg";
import HondaPrev from "@/assets/honda.svg";
import InvisionPrev from "@/assets/invision.png";
import SpringboardLogo from "@/assets/springboard_logo.png";
import DBFBLogo from "@/assets/dbfb_logo.png";
import HondaLogo from "@/assets/honda_logo.png";
import InvisionLogo from "@/assets/invision_logo.png";
import WatoPrev from "@/assets/wato_banner.png";
import WatoLogo from "@/assets/wato_logo.jpeg";
import WealthsimplePrev from "@/assets/wealthsimple_banner.jpg";
import WealthsimpleLogo from "@/assets/wealthsimple_logo.jpeg";

import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Scatter,
  Dot,
  Area,
  ReferenceLine,
} from "recharts";

// "year" is a layout-only position along the x-axis (not a literal calendar
// year) so that the three 2026 experiences can be spread apart instead of
// stacking on top of each other; "yearLabel" is what actually gets displayed.
const experienceData = [
  {
    year: 2020.35,
    yearLabel: "2021",
    growth: 8,
    title: "Project Development Intern",
    company: "Springboard Services",
    story:
      "Rehabilitative programming to support at-risk groups in employment, finance, anger-management and mental health",
    image: SSPrev,
    logo: SpringboardLogo,
    link: "https://www.communitylearninghub.ca/",
  },
  {
    year: 2021.6,
    yearLabel: "2023",
    growth: 14,
    title: "Data / Development Intern",
    company: "Daily Bread Food Bank",
    story:
      "Summer of 2023 and 2024\ndonor statistics, corporate partnerships and data automation",
    image: DBFBPrev,
    logo: DBFBLogo,
    extraDrop: -45,
    link: "https://www.dailybread.ca/",
  },
  {
    year: 2022.9,
    yearLabel: "2025",
    growth: 24,
    title: "Cloud Engineering Student",
    company: "Honda Canada Inc.",
    story: "DevOps, FinOps, and connectivity",
    image: HondaPrev,
    logo: HondaLogo,
    boxedLogo: true,
    extraDrop: -70,
    link: "https://www.hondacanada.ca/home",
  },
  {
    year: 2024.1,
    yearLabel: "2026",
    growth: 39,
    title: "Software Engineer Intern",
    company: "Invision AI",
    story:
      "Edge computing + 3D perception for transit systems\nAutomated Incident Detection",
    image: InvisionPrev,
    logo: InvisionLogo,
    link: "https://invision.ai/",
  },
  {
    year: 2025.4,
    yearLabel: "2026",
    growth: 62,
    title: "Autonomous Vehicle Developer",
    company: "WATonomous",
    story: "Perception software\nSensor fusion",
    image: WatoPrev,
    logo: WatoLogo,
    extraDrop: -35,
    link: "https://www.watonomous.ca/",
  },
  {
    year: 2026.65,
    yearLabel: "2026",
    growth: 90,
    title: "Software Engineering Intern",
    company: "Wealthsimple",
    story: "Incoming Fall 2026",
    image: WealthsimplePrev,
    logo: WealthsimpleLogo,
    extraDrop: -60,
    link: "https://www.wealthsimple.com/",
  },
];

type ExperienceItem = (typeof experienceData)[0];

// Chart geometry — chart fills its container; cards live outside the box
const DESKTOP_CHART_HEIGHT = 240;
const DESKTOP_TOP_MARGIN = 24;
const DESKTOP_BOTTOM_MARGIN = 30;
const DESKTOP_RIGHT_MARGIN = 30;
const Y_AXIS_WIDTH = 70;
const WRAPPER_PT = 16; // pt-4 around chart
const WRAPPER_PX = 8; // px-2 around chart
const CARD_WIDTH = 330;
const CARD_AREA_HEIGHT = 270; // padding above/below box for cards
const CARD_OVERLAP = 12; // how far cards extend into the box border for the layered effect

const X_DOMAIN_MIN = 2020;
const X_DOMAIN_MAX = 2027;
const X_DOMAIN_RANGE = X_DOMAIN_MAX - X_DOMAIN_MIN;

// Group items that share a yearLabel (the three 2026 roles) into a single
// axis tick, positioned at their average x, so the axis reads one label
// per year instead of repeating "2026" three times.
const tickGroups = new Map<string, number[]>();
experienceData.forEach((d) => {
  const years = tickGroups.get(d.yearLabel) ?? [];
  years.push(d.year);
  tickGroups.set(d.yearLabel, years);
});
const X_TICKS: number[] = [];
const X_TICK_LABELS: Record<number, string> = {};
tickGroups.forEach((years, label) => {
  const avg = years.reduce((sum, y) => sum + y, 0) / years.length;
  X_TICKS.push(avg);
  X_TICK_LABELS[avg] = label;
});
X_TICKS.sort((a, b) => a - b);

const tooltipContent = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: ExperienceItem }>;
}) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  if (!data) return null;
  return (
    <div className="bg-space-dark border border-teal/30 rounded-sm px-3 py-2 text-xs">
      <p className="text-teal font-semibold">{data.title}</p>
      <p className="text-silver/70">{data.company}</p>
      <p className="text-copper mt-1">Growth: {data.growth}%</p>
    </div>
  );
};

const scatterShape = (props: unknown) => {
  const { cx, cy } = props as { cx: number; cy: number };
  return (
    <Dot cx={cx} cy={cy} r={5} fill="#C67D4B" stroke="#ECEFF4" strokeWidth={1} />
  );
};

const ExperienceCard: React.FC<{ d: ExperienceItem }> = ({ d }) => {
  const lines = d.story.split("\n").filter((l) => l.trim().length > 0);
  const isMulti = lines.length > 1;
  return (
    <div className="w-full bg-base-100 border border-teal/40 rounded-sm overflow-hidden shadow-[0_10px_24px_-8px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.08)]">
      <div className="relative h-16 bg-base-200 border-b border-teal/15 overflow-hidden">
        <img
          src={d.image}
          alt={d.company}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="px-3.5 py-3">
        <div className="flex items-center gap-3">
          {d.boxedLogo ? (
            <div className="w-10 h-10 flex-shrink-0 rounded-sm bg-base-100 flex items-center justify-center p-1 overflow-hidden shadow-[0_2px_6px_-1px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.06)]">
              <img
                src={d.logo}
                alt={d.company}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <img
              src={d.logo}
              alt={d.company}
              className="w-10 h-10 flex-shrink-0 object-contain"
            />
          )}
          <div className="flex-1 min-w-0">
            <h5 className="text-[15px] font-semibold text-teal leading-tight whitespace-nowrap">
              {d.title}
            </h5>
            <p className="text-[13px] text-copper/90 mt-0.5">{d.company}</p>
          </div>
        </div>
        {isMulti ? (
          <ul className="mt-2.5 space-y-0.5">
            {lines.map((line, i) => (
              <li
                key={i}
                className="text-[11px] text-base-content/70 leading-snug pl-3 relative"
              >
                <span className="absolute left-0 top-0 text-teal/50">·</span>
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[11px] text-base-content/70 leading-snug mt-2.5">
            {d.story}
          </p>
        )}
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  const thisRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const isChartVisible = useInView(thisRef, { once: false, margin: "-50px" });

  const [chartBox, setChartBox] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateBox = () => {
      const wrapper = wrapperRef.current;
      const chart = chartContainerRef.current;
      if (!wrapper || !chart) return;
      const wRect = wrapper.getBoundingClientRect();
      const cRect = chart.getBoundingClientRect();
      setChartBox({
        top: cRect.top - wRect.top,
        left: cRect.left - wRect.left,
        width: cRect.width,
        height: cRect.height,
      });
    };
    updateBox();
    const observer = new ResizeObserver(updateBox);
    if (chartContainerRef.current) observer.observe(chartContainerRef.current);
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    window.addEventListener("resize", updateBox);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateBox);
    };
  }, []);

  // Box edges in wrapper coordinates
  const boxTop = CARD_AREA_HEIGHT;
  const boxBottom = chartBox.top + chartBox.height;

  const dataAreaLeft = chartBox.left + WRAPPER_PX + Y_AXIS_WIDTH;
  const dataAreaWidth =
    chartBox.width -
    WRAPPER_PX -
    Y_AXIS_WIDTH -
    WRAPPER_PX -
    DESKTOP_RIGHT_MARGIN;
  const dataAreaTop = chartBox.top + WRAPPER_PT + DESKTOP_TOP_MARGIN;
  const dataAreaHeight =
    DESKTOP_CHART_HEIGHT - DESKTOP_TOP_MARGIN - DESKTOP_BOTTOM_MARGIN;

  return (
    <div ref={thisRef} className="relative w-full">
      <div
        ref={wrapperRef}
        className="relative md:pt-[270px] md:pb-[270px]"
      >
        <div className="bg-base-100 rounded-sm overflow-hidden md:overflow-visible border border-teal/25 relative">
          {/* Panel header */}
          <div className="px-6 py-3 border-b border-teal/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal" />
              <span className="text-[10px] font-mono text-teal uppercase tracking-widest">
                trajectory
              </span>
              <span className="text-[10px] font-mono text-teal/40 uppercase tracking-widest">
                | experience
              </span>
            </div>
            <span className="text-[10px] font-mono text-space-gray/50">
              2021 — present
            </span>
          </div>

          {/* Desktop chart */}
          <div
            ref={chartContainerRef}
            className="hidden md:block relative px-2 pt-4 pb-4"
          >
            <ResponsiveContainer width="100%" height={DESKTOP_CHART_HEIGHT}>
              <ComposedChart
                data={experienceData}
                margin={{
                  top: DESKTOP_TOP_MARGIN,
                  right: DESKTOP_RIGHT_MARGIN,
                  bottom: DESKTOP_BOTTOM_MARGIN,
                  left: 0,
                }}
              >
                <defs>
                  <linearGradient id="areaGradientDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4E8A8A" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4E8A8A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(78,138,138,0.1)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={[X_DOMAIN_MIN, X_DOMAIN_MAX]}
                  ticks={X_TICKS}
                  tickFormatter={(y) => X_TICK_LABELS[y] ?? ""}
                  axisLine={{ stroke: "#86868B" }}
                  tick={{ fill: "#86868B", fontSize: 10 }}
                />
                <YAxis
                  dataKey="growth"
                  type="number"
                  domain={[0, 100]}
                  axisLine={{ stroke: "#86868B" }}
                  tick={{ fill: "#86868B", fontSize: 10 }}
                  width={Y_AXIS_WIDTH}
                  label={{
                    value: "Growth (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#86868B",
                    fontSize: 11,
                    offset: 10,
                  }}
                />
                <ReferenceLine
                  y={50}
                  stroke="#86868B"
                  strokeDasharray="6 4"
                  strokeOpacity={0.3}
                />
                <Tooltip
                  cursor={{ stroke: "#4E8A8A", strokeWidth: 1 }}
                  content={tooltipContent}
                  wrapperStyle={{ zIndex: 50 }}
                />
                <Area
                  type="linear"
                  dataKey="growth"
                  fill="url(#areaGradientDesktop)"
                  stroke="none"
                  isAnimationActive={isChartVisible}
                  animationDuration={800}
                />
                <Line
                  type="linear"
                  dataKey="growth"
                  stroke="#4E8A8A"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={isChartVisible}
                  animationBegin={0}
                  animationDuration={800}
                />
                <Scatter
                  data={experienceData}
                  shape={scatterShape}
                  isAnimationActive={isChartVisible}
                  animationBegin={0}
                  animationDuration={600}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Mobile view: compact chart + stacked card list */}
          <div className="md:hidden">
            <div className="px-2 pt-4">
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart
                  data={experienceData}
                  margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                >
                  <defs>
                    <linearGradient id="areaGradientMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4E8A8A" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#4E8A8A" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="rgba(78,138,138,0.1)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="year"
                    type="number"
                    domain={[X_DOMAIN_MIN, X_DOMAIN_MAX]}
                    ticks={X_TICKS}
                    tickFormatter={(y) => X_TICK_LABELS[y] ?? ""}
                    axisLine={{ stroke: "#86868B" }}
                    tick={{ fill: "#86868B", fontSize: 10 }}
                  />
                  <YAxis
                    dataKey="growth"
                    type="number"
                    domain={[0, 100]}
                    axisLine={{ stroke: "#86868B" }}
                    tick={{ fill: "#86868B", fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={50}
                    stroke="#86868B"
                    strokeDasharray="6 4"
                    strokeOpacity={0.3}
                  />
                  <Tooltip
                    cursor={{ stroke: "#4E8A8A", strokeWidth: 1 }}
                    content={tooltipContent}
                  />
                  <Area
                    type="linear"
                    dataKey="growth"
                    fill="url(#areaGradientMobile)"
                    stroke="none"
                    isAnimationActive={isChartVisible}
                    animationDuration={800}
                  />
                  <Line
                    type="linear"
                    dataKey="growth"
                    stroke="#4E8A8A"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={isChartVisible}
                    animationDuration={800}
                  />
                  <Scatter
                    data={experienceData}
                    shape={scatterShape}
                    isAnimationActive={isChartVisible}
                    animationDuration={600}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="px-4 py-4 grid grid-cols-1 gap-2">
              {[...experienceData].reverse().map((d) => (
                <div
                  key={d.year}
                  className="relative flex gap-3 p-2 rounded-sm border border-teal/20 bg-base-100 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: `url(${d.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {d.boxedLogo ? (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-sm bg-base-100 flex items-center justify-center p-2 shadow-[0_2px_6px_-1px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.06)]">
                      <img
                        src={d.logo}
                        alt={d.company}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <img
                      src={d.logo}
                      alt={d.company}
                      className="relative w-16 h-16 flex-shrink-0 object-contain"
                    />
                  )}
                  <div className="relative flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-gold-light tracking-widest">
                      {d.yearLabel}
                    </span>
                    <h5 className="text-xs font-semibold text-teal leading-tight">
                      {d.title}
                    </h5>
                    <p className="text-[10px] text-copper/90">{d.company}</p>
                    <p className="text-[10px] text-base-content/60 mt-0.5 leading-snug whitespace-pre-line">
                      {d.story}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Callout lines — connect each card edge through box to its data point */}
        {dataAreaWidth > 0 && (
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{
              opacity: isChartVisible ? 1 : 0,
              transition: "opacity 600ms ease-out",
            }}
          >
            {experienceData.map((d, i) => {
              const xPct = (d.year - X_DOMAIN_MIN) / X_DOMAIN_RANGE;
              const yPct = 1 - d.growth / 100;
              const cardCenterX = dataAreaLeft + xPct * dataAreaWidth;
              const dataPointY = dataAreaTop + yPct * dataAreaHeight;
              const above = i % 2 === 1;
              const drop = d.extraDrop ?? 0;
              const cardEdgeY = above
                ? boxTop + CARD_OVERLAP + drop
                : boxBottom - CARD_OVERLAP - drop;
              const lineTop = Math.min(cardEdgeY, dataPointY);
              const lineHeight = Math.abs(dataPointY - cardEdgeY);
              return (
                <div
                  key={d.year}
                  className="absolute"
                  style={{
                    left: cardCenterX,
                    top: lineTop,
                    height: lineHeight,
                    width: 1,
                    transform: "translateX(-0.5px)",
                    backgroundImage:
                      "linear-gradient(to bottom, #4E8A8A 50%, transparent 50%)",
                    backgroundSize: "1px 6px",
                    opacity: 0.6,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Above cards — anchored bottom to (boxTop + overlap) */}
        {dataAreaWidth > 0 && (
          <div
            className="hidden md:block absolute left-0 right-0 pointer-events-none"
            style={{
              top: 0,
              height: CARD_AREA_HEIGHT + CARD_OVERLAP,
              opacity: isChartVisible ? 1 : 0,
              transition: "opacity 600ms ease-out",
              zIndex: 20,
            }}
          >
            {experienceData.map((d, i) => {
              const above = i % 2 === 1;
              if (!above) return null;
              const drop = d.extraDrop ?? 0;
              const xPct = (d.year - X_DOMAIN_MIN) / X_DOMAIN_RANGE;
              const cardCenterX = dataAreaLeft + xPct * dataAreaWidth;
              return (
                <div
                  key={d.year}
                  className="absolute pointer-events-auto"
                  style={{
                    left: cardCenterX - CARD_WIDTH / 2,
                    bottom: -drop,
                    width: CARD_WIDTH,
                  }}
                >
                  <ExperienceCard d={d} />
                </div>
              );
            })}
          </div>
        )}

        {/* Below cards — anchored top to (boxBottom - overlap) */}
        {dataAreaWidth > 0 && (
          <div
            className="hidden md:block absolute left-0 right-0 pointer-events-none"
            style={{
              bottom: 0,
              height: CARD_AREA_HEIGHT + CARD_OVERLAP,
              opacity: isChartVisible ? 1 : 0,
              transition: "opacity 600ms ease-out",
              zIndex: 20,
            }}
          >
            {experienceData.map((d, i) => {
              const above = i % 2 === 1;
              if (above) return null;
              const drop = d.extraDrop ?? 0;
              const xPct = (d.year - X_DOMAIN_MIN) / X_DOMAIN_RANGE;
              const cardCenterX = dataAreaLeft + xPct * dataAreaWidth;
              return (
                <div
                  key={d.year}
                  className="absolute pointer-events-auto"
                  style={{
                    left: cardCenterX - CARD_WIDTH / 2,
                    top: -drop,
                    width: CARD_WIDTH,
                  }}
                >
                  <ExperienceCard d={d} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Experience;
