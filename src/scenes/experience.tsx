import {
  AnimatePresence,
  motion,
  useInView,
} from "framer-motion";
import React, { useState, useRef } from "react";
import SSPrev from "@/assets/ss-prev.svg";
import GGPrev from "@/assets/gg-group.svg";
import DBFBPrev from "@/assets/db-truck.svg";
import HondaPrev from "@/assets/honda.svg";

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

const experienceData = [
  {
    year: 2021,
    growth: 12,
    title: "Project Development Intern",
    company: "Springboard Services",
    story:
      "During the pandemic, I began my first job at 15, working remotely to develop rehabilitative module content that supported at-risk groups in employment, finance, anger management, and mental health. It was a valuable opportunity to solve immediate real-world challenges creatively while using data-driven approaches to ensure that high-risk clients received the targeted support they needed. Through this experience, my passion for working with data to drive meaningful impact and frame creative solutions began to grow.",
    image: SSPrev,
    link: "https://www.communitylearninghub.ca/",
  },
  {
    year: 2023,
    growth: 25,
    title: "Computer Programming Tutor",
    company: "Go Green Youth Centre",
    story:
      "During March Break, I worked full-time as a tutor and camp counsellor for a non-profit sports and academics camp, where I designed curriculum for large student cohorts and mentored participants through hands-on projects that blended learning with creativity. Guiding students with bright ideas and tremendous potential was especially meaningful to me, as someone who discovered coding later on but was shaped by small early experiences with simple concepts and robotics. It felt meaningful to help spark curiosity in a new generation, knowing firsthand how even simple introductions to tech at a young age can open life-changing opportunities. I continued my love for teaching code through Canada Learning Code as a Teen Ambassador, and taught web development for school clubs.",
    image: GGPrev,
    link: "https://www.gogreenyouthcentre.ca/",
  },
  {
    year: 2024,
    growth: 35,
    title: "Data / Development Intern",
    company: "Corporate & Community Partnerships | Daily Bread Food Bank",
    story:
      "Across two summer internships and volunteer work (2023-2024), I contributed to both frontline community support and internal process optimization. I led data analysis projects to re-engage major donors, developed automation solutions that eliminated manual errors and improved operational efficiency by over 95%, and designed programs to foster new corporate partnerships. Beyond technical contributions, I worked closely with independent organizers to resolve inquiries and supported broader community initiatives to address food insecurity. Working with the team at Daily Bread not only deepened my belief in thoughtful systems design but moreover the power of collaboration and a shared vision.",
    image: DBFBPrev,
    link: "https://www.dailybread.ca/",
  },
  {
    year: 2025,
    growth: 60,
    title: "Cloud Engineering Student",
    company: "Honda Canada Inc.",
    story:
      "Spearheading a cost-optimization project; working with IBM to adopt Turbonomic for auto-scaling Redhat OpenShift on AWS-managed Kubernetes clusters. Preparing analyses and system design documents for cloud resources, DevOps pipelines, and VDI configurations for an Azure migration project to align with Honda's global cloud architecture.",
    image: HondaPrev,
    link: "https://www.hondacanada.ca/home",
  },
  {
    year: 2026,
    growth: 80,
    title: "TBD",
    company: "?",
    story: "Coming soon!",
    image: "",
    link: "",
  },
];

const Experience: React.FC = () => {
  const [selected, setSelected] = useState(experienceData[3]);
  const [hovered, setHovered] = useState<(typeof experienceData)[0] | null>(null);
  const thisRef = useRef<HTMLDivElement>(null);
  const isChartVisible = useInView(thisRef, { once: false, margin: "-50px" });

  return (
    <div ref={thisRef} className="relative w-full">
      <div className="bg-base-100 rounded-sm overflow-hidden border border-teal/25">
        {/* Panel header */}
        <div className="px-6 py-3 border-b border-teal/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal" />
            <span className="text-[10px] font-mono text-teal uppercase tracking-widest">trajectory</span>
            <span className="text-[10px] font-mono text-teal/40 uppercase tracking-widest">| experience</span>
          </div>
          <span className="text-[10px] font-mono text-space-gray/50">2021 — present</span>
        </div>

        {/* Chart area */}
        <div className="px-2 pt-4">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart
              data={experienceData}
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
              onMouseMove={(state: { isTooltipActive?: boolean; activePayload?: Array<{ payload: typeof experienceData[0] }> }) => {
                if (state.isTooltipActive && state.activePayload?.length) {
                  setHovered(state.activePayload[0].payload);
                } else {
                  setHovered(null);
                }
              }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                if (hovered) setSelected(hovered);
              }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4E8A8A" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#4E8A8A" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(78,138,138,0.1)" strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                type="number"
                domain={[2021, 2027]}
                tickFormatter={(y) => String(y)}
                axisLine={{ stroke: "#86868B" }}
                tick={{ fill: "#86868B", fontSize: 10 }}
              />
              <YAxis
                dataKey="growth"
                type="number"
                domain={[0, 100]}
                axisLine={{ stroke: "#86868B" }}
                tick={{ fill: "#86868B", fontSize: 10 }}
                label={{
                  value: "Growth (%)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#86868B",
                  fontSize: 11,
                  offset: 10,
                }}
              />
              <ReferenceLine y={50} stroke="#86868B" strokeDasharray="6 4" strokeOpacity={0.3} />
              <Tooltip
                cursor={{ stroke: "#4E8A8A", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload as typeof experienceData[0];
                  return (
                    <div className="bg-space-dark border border-teal/30 rounded-sm px-3 py-2 text-xs">
                      <p className="text-teal font-semibold">{data.title}</p>
                      <p className="text-silver/70">{data.company}</p>
                      <p className="text-copper mt-1">Growth: {data.growth}%</p>
                    </div>
                  );
                }}
              />
              <Area
                type="linear"
                dataKey="growth"
                fill="url(#areaGradient)"
                stroke="none"
                isAnimationActive={isChartVisible}
                animationDuration={800}
              />
              <Line
                type="linear"
                dataKey="growth"
                isAnimationActive={isChartVisible}
                animationBegin={0}
                animationDuration={800}
                stroke="#4E8A8A"
                strokeWidth={2}
                dot={false}
              />
              <Scatter
                data={experienceData}
                shape={(props: unknown) => {
                  const { cx, cy, payload } = props as { cx: number; cy: number; payload: typeof experienceData[0] };
                  const isActive = payload.year === selected.year;
                  return (
                    <Dot
                      cx={cx}
                      cy={cy}
                      r={isActive ? 8 : 5}
                      fill={isActive ? "#C93A2A" : "#C67D4B"}
                      stroke={isActive ? "#ECEFF4" : "#ECEFF4"}
                      strokeWidth={isActive ? 2 : 1}
                    />
                  );
                }}
                isAnimationActive={isChartVisible}
                animationBegin={0}
                animationDuration={600}
                onClick={(e: { payload: typeof experienceData[0] }) => setSelected(e.payload)}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Detail panel */}
        <div className="px-6 py-5 border-t border-teal/25">
          <div className="flex flex-col md:flex-row gap-5">
            <motion.div
              layout
              className="flex-1"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="text-lg md:text-xl text-teal font-semibold mb-1">
                    {selected.title}
                  </h3>
                  <h4 className="text-sm text-copper mb-3">
                    {selected.company}
                  </h4>
                  <p className="hidden min-[450px]:block text-base-content/70 text-sm leading-relaxed">{selected.story}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <AnimatePresence mode="wait">
              {selected.image && (
                <motion.div
                  key={`image-${selected.title}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="w-full md:w-48 lg:w-56 flex-shrink-0"
                >
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={selected.image}
                      alt={selected.company}
                      className="w-full h-32 md:h-full object-cover rounded-sm border border-teal/20"
                    />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
