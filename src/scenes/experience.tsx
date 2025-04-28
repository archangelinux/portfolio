import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { useState, useRef } from "react";
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
} from "recharts";

const experienceData = [
  {
    year: 2021,
    growth: 12,
    title: "Project Development Intern",
    company: "Springboard Services",
    story: "During the pandemic, I began my first job at the age of 15, working remotely to develop rehabilitative module content that supported at-risk groups in employment, finance, anger management, and mental health. It was a valuable opportunity to solve immediate real-world challenges creatively while using data-driven approaches to ensure that high-risk clients received the targeted support they needed. Through this experience, my passion for working with data to drive meaningful impact and frame creative solutions began to grow.",
    image: "src/assets/ss-prev.svg",
    link: "https://www.communitylearninghub.ca/",
  },
  {
    year: 2023,
    growth: 25,
    title: "Computer Programming Tutor",
    company: "Go Green Youth Centre",
    story: "During March Break, I worked full-time as a tutor and camp counsellor for a non-profit sports and academics camp, where I designed curriculum for large student cohorts and mentored participants through hands-on projects that blended learning with creativity. Guiding students with bright ideas and tremendous potential was especially meaningful to me, as someone who discovered coding later on but was shaped by small early experiences with simple concepts and robotics. It felt meaningful to help spark curiosity in a new generation, knowing firsthand how even simple introductions to tech at a young age can open life-changing opportunities. I continued my love for teaching code through Canada Learning Code as a Teen Ambassador, and taught web development for school clubs.",
    image: "src/assets/gg-group.svg",
    link: "https://www.gogreenyouthcentre.ca/",
  },
  {
    year: 2024,
    growth: 35,
    title: "Data/Development Intern",
    company: "Corporate & Community Partnerships | Daily Bread Food Bank",
    story: "Across two summer internships and volunteer work (2023-2024), I contributed to both frontline community support and internal process optimization. I led data analysis projects to re-engage major donors, developed automation solutions that eliminated manual errors and improved operational efficiency by over 95%, and designed programs to foster new corporate partnerships. Beyond technical contributions, I worked closely with independent organizers to resolve inquiries and supported broader community initiatives to address food insecurity. Working with the team at Daily Bread not only deepened my belief in thoughtful systems design but moreover the power of collaboration and a shared vision.",
    image: "src/assets/db-truck.svg",
    link: "https://www.dailybread.ca/",
  },
  {
    year: 2025,
    growth: 60,
    title: "Cloud Engineering Student",
    company: "Honda Canada Inc.",
    story: "Preheating...",
    image: "src/assets/honda.svg",
    link: "https://www.hondacanada.ca/home",
  },
  {
    year: 2026,
    growth: 80,
    title: "TBD",
    company: "Your Company",
    story: "Coming soon!",
    image: "",
    link: "",
  },
];

const Experience: React.FC = () => {
  const [selected, setSelected] = useState(experienceData[2]); //default to DBFB
  const [hovered, setHovered] = useState<typeof experienceData[0] | null>(null);
  const thisRef = useRef<HTMLDivElement>(null);
  
  //scroll animations
  const { scrollYProgress } = useScroll({
    target: thisRef,
    offset: ["start end", "end start"]
  });
  const chartOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );
  const chartY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [50, 0, 0, -50]
  );
  const isChartVisible = useInView(thisRef, { once: false, margin: "-50px" });
  
  return (
    <div ref={thisRef} className="mt-12 mx-10 rounded-2xl">
      <motion.div
        style={{ opacity: chartOpacity, y: chartY }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            data={experienceData}
            margin={{ top: 20, right: 40, bottom: 20, left: 20 }}
            onMouseMove={(state: any) => {
              if (state.isTooltipActive && state.activePayload?.length) {
                setHovered(state.activePayload[0].payload);
              } else {
                setHovered(null);
              }
            }}
            // clear when you mouse out
            onMouseLeave={() => setHovered(null)}
            // click anywhere in the chart => swap in the hovered point
            onClick={() => {
              if (hovered) setSelected(hovered);
            }}
          >
            <CartesianGrid stroke="#555" strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              type="number"
              domain={[2021, 2027]}
              tickFormatter={(y) => String(y)}
              axisLine={{ stroke: "#C0B283" }}
              tick={{ fill: "#EEE", fontSize: 12 }}
            />
            <YAxis
              dataKey="growth"
              type="number"
              domain={[0, 100]}
              axisLine={{ stroke: "#C0B283" }}
              tick={{ fill: "#EEE", fontSize: 12 }}
              label={{
                value: "Growth-to-date (%)",
                angle: -90,
                position: "insideLeft",
                fill: "#EEE",
              }}
            />
            <Tooltip
              cursor={{ stroke: "#ff6600", strokeWidth: 1.5 }}
              contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
            />
            <Line
              type="linear"
              dataKey="growth"
              isAnimationActive={isChartVisible}
              animationBegin={0}
              animationDuration={800}
              stroke="#ff6600"
              strokeWidth={2}
              dot={false}
            />
            <Scatter
              data={experienceData}
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                const isActive = payload.year === selected.year;
                return (
                  <Dot
                    cx={cx}
                    cy={cy}
                    r={isActive ? 10 : 6}
                    fill={isActive ? "#FDAA35" : "#ff6666"}
                    stroke={isActive ? "#fff" : undefined}
                    strokeWidth={isActive ? 2 : 0}
                  />
                );
              }}
              isAnimationActive={isChartVisible}
              animationBegin={0}
              animationDuration={600}
              onClick={(e: any) => setSelected(e.payload)}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      <div ref={thisRef} className="mt-8 flex flex-col md:flex-row gap-10 p-5">
        <motion.div
          ref={thisRef}
          layout
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-150px" }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-8 border-2 border-slate-100 rounded-lg"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl text-slate-100 font-semibold underline mb-4">{selected.title}</h3>
              <h3 className="text-xl text-slate-100 font-semibold mb-4">{selected.company}</h3>
              <p>{selected.story}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          layout
          ref={thisRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-150px" }}
          transition={{duration: 0.3}}
          className="w-full md:w-1/3 flex"
        >
          <AnimatePresence mode="wait">
            {selected.image && (
              <motion.div
                ref={thisRef}
                key={`image-${selected.title}`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg overflow-hidden shadow-xl flex-1 flex self-stretch"
                style={{
                  perspective: 900,
                  transformStyle: 'preserve-3d',
                  minHeight: '40vh',
                  alignSelf: 'stretch'
                }}
              >
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <img
                    src={selected.image}
                    alt={selected.company}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Experience;