import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaJava,
  FaPython,
  FaHtml5,
  FaJs,
  FaDocker,
  FaAws,
  FaGoogle,
  FaFigma,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaLinux,
} from "react-icons/fa";
import { FaMicrosoft } from "react-icons/fa";
import {
  SiTypescript,
  SiCplusplus,
  SiPostgresql,
  SiExpress,
  SiNextdotjs,
  SiFlask,
  SiFastapi,
  SiTerraform,
  SiFirebase,
  SiElixir,
  SiPhoenixframework,
  SiLangchain,
  SiPytorch,
  SiTensorflow,
  SiKubernetes,
  SiSupabase,
  SiMongodb,
} from "react-icons/si";
import {
  Code2,
  Box,
  Cloud,
  Wrench,
  Globe,
  Plug,
  Cpu,
  Brain,
  RefreshCw,
  GitBranch,
  Database,
} from "lucide-react";

interface Tool {
  icon: React.ReactNode;
  label: string;
  color: string; // per-tool color
}

interface Category {
  id: string;
  label: string;
  drawerIcon: React.ReactNode;
  tools: Tool[];
}

const categories: Category[] = [
  {
    id: "languages",
    label: "Languages",
    drawerIcon: <Code2 className="w-4 h-4" />,
    tools: [
      { icon: <FaPython />, label: "Python", color: "blue" },
      { icon: <FaJava />, label: "Java", color: "rose" },
      { icon: <SiCplusplus />, label: "C++/C", color: "blue" },
      { icon: <SiTypescript />, label: "TypeScript", color: "blue" },
      { icon: <FaJs />, label: "JavaScript", color: "yellow" },
      { icon: <Database className="w-5 h-5" />, label: "SQL", color: "blue" },
      { icon: <FaHtml5 />, label: "HTML/CSS", color: "copper" },
      { icon: <SiElixir />, label: "Elixir/Erlang", color: "purple" },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    drawerIcon: <Box className="w-4 h-4" />,
    tools: [
      { icon: <FaReact />, label: "React", color: "blue" },
      { icon: <SiNextdotjs />, label: "Next.js", color: "space-gray" },
      { icon: <SiExpress />, label: "Express.js", color: "space-gray" },
      { icon: <FaNodeJs />, label: "Node.js", color: "emerald" },
      { icon: <SiFastapi />, label: "FastAPI", color: "teal" },
      { icon: <SiFlask />, label: "Flask", color: "space-gray" },
      { icon: <SiPhoenixframework />, label: "Phoenix", color: "copper" },
      { icon: <SiLangchain />, label: "LangChain", color: "emerald" },
      { icon: <Brain className="w-5 h-5" />, label: "CrewAI", color: "copper" },
      { icon: <SiPytorch />, label: "PyTorch", color: "rose" },
      { icon: <SiTensorflow />, label: "TensorFlow", color: "copper" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Data",
    drawerIcon: <Cloud className="w-4 h-4" />,
    tools: [
      { icon: <FaAws />, label: "AWS", color: "gold" },
      { icon: <FaMicrosoft />, label: "Azure", color: "blue" },
      { icon: <FaGoogle />, label: "GCP", color: "blue" },
      { icon: <SiTerraform />, label: "Terraform", color: "purple" },
      { icon: <FaDocker />, label: "Docker", color: "blue" },
      { icon: <SiKubernetes />, label: "Kubernetes", color: "blue" },
      { icon: <SiPostgresql />, label: "PostgreSQL", color: "blue" },
      { icon: <SiSupabase />, label: "Supabase", color: "emerald" },
      { icon: <SiFirebase />, label: "Firebase", color: "yellow" },
      { icon: <SiMongodb />, label: "MongoDB", color: "emerald" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    drawerIcon: <Wrench className="w-4 h-4" />,
    tools: [
      { icon: <FaGitAlt />, label: "Git", color: "rose" },
      { icon: <FaLinux />, label: "Linux", color: "yellow" },
      { icon: <Globe className="w-5 h-5" />, label: "RESTful APIs", color: "teal" },
      { icon: <Plug className="w-5 h-5" />, label: "WebSockets", color: "copper" },
      { icon: <Cpu className="w-5 h-5" />, label: "Distributed Sys", color: "blue" },
      { icon: <Brain className="w-5 h-5" />, label: "GenAI/LLMs", color: "purple" },
      { icon: <RefreshCw className="w-5 h-5" />, label: "SDLC/Agile", color: "teal" },
      { icon: <GitBranch className="w-5 h-5" />, label: "CI/CD", color: "emerald" },
      { icon: <FaFigma />, label: "Figma", color: "purple" },
    ],
  },
];

// Static class map for per-tool colors (Tailwind-safe)
const toolColors: Record<string, { text: string; textFaint: string }> = {
  gold: { text: "text-gold", textFaint: "text-gold/60" },
  teal: { text: "text-teal", textFaint: "text-teal/60" },
  copper: { text: "text-copper", textFaint: "text-copper/60" },
  emerald: { text: "text-emerald", textFaint: "text-emerald/60" },
  rose: { text: "text-rose", textFaint: "text-rose/60" },
  blue: { text: "text-blue", textFaint: "text-blue/60" },
  purple: { text: "text-purple", textFaint: "text-purple/60" },
  yellow: { text: "text-yellow", textFaint: "text-yellow/60" },
  "space-gray": { text: "text-space-gray", textFaint: "text-space-gray/60" },
};


const ToolsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const active = categories.find((c) => c.id === activeCategory) ?? categories[0];

  return (
    <div className="w-full">
      <div className="bg-base-100 rounded-sm overflow-hidden border border-teal/25">
        {/* Panel header */}
        <div className="px-6 py-3 border-b border-teal/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal" />
            <span className="text-[10px] font-mono text-teal uppercase tracking-widest">inventory</span>
            <span className="text-[10px] font-mono text-teal/40 uppercase tracking-widest">| tools / concepts</span>
          </div>
          <span className="text-[10px] font-mono text-space-gray/50">{active.tools.length} items</span>
        </div>

        {/* Mobile: horizontal tabs */}
        <div className="flex sm:hidden border-b border-teal/25 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "text-teal border-b-2 border-teal bg-teal/5"
                  : "text-space-gray hover:text-teal"
              }`}
            >
              {cat.drawerIcon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Desktop: drawer sidebar + grid */}
        <div className="flex">
          {/* Drawer sidebar (hidden on mobile) */}
          <div className="hidden sm:flex w-36 flex-shrink-0 flex-col border-r border-teal/25 py-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider transition-all ${
                  activeCategory === cat.id
                    ? "bg-teal/5 text-teal border-l-2 border-teal"
                    : "text-space-gray hover:text-teal border-l-2 border-transparent"
                }`}
              >
                {cat.drawerIcon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tool grid */}
          <div className="flex-1 p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
              >
                {active.tools.map((tool, i) => {
                  const tc = toolColors[tool.color] ?? toolColors.teal;
                  return (
                    <motion.div
                      key={tool.label}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.12, delay: i * 0.025 }}
                      whileHover={{ y: -2 }}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-sm border border-teal/10 hover:border-teal/30 hover:bg-teal/5 transition-colors cursor-default"
                    >
                      <span className={`text-2xl ${tc.text}`}>{tool.icon}</span>
                      <span className={`text-[10px] ${tc.textFaint} font-mono text-center leading-tight`}>{tool.label}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsSection;
