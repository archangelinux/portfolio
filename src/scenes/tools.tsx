import React from "react";
import { motion } from "framer-motion";
import {
  FaJava,
  FaPython,
  FaHtml5,
  FaJs,
  FaDocker,
  FaAws,
  FaGoogle,
  FaReact,
  FaNodeJs,
  FaMicrosoft,
} from "react-icons/fa";
import {
  SiTypescript,
  SiCplusplus,
  SiPostgresql,
  SiExpress,
  SiNextdotjs,
  SiFastapi,
  SiTerraform,
  SiFirebase,
  SiElixir,
  SiPhoenixframework,
  SiLangchain,
  SiPytorch,
  SiKubernetes,
  SiSupabase,
  SiMongodb,
} from "react-icons/si";
import { Database } from "lucide-react";

interface Tool {
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface Category {
  id: string;
  label: string;
  tools: Tool[];
}

const categories: Category[] = [
  {
    id: "languages",
    label: "languages",
    tools: [
      { icon: <FaPython />, label: "Python", color: "blue" },
      { icon: <FaJava />, label: "Java", color: "red" },
      { icon: <SiCplusplus />, label: "C++/C", color: "blue" },
      { icon: <SiTypescript />, label: "TypeScript", color: "blue" },
      { icon: <FaJs />, label: "JavaScript", color: "gold" },
      { icon: <Database className="w-3.5 h-3.5" />, label: "SQL", color: "blue" },
      { icon: <FaHtml5 />, label: "HTML/CSS", color: "orange" },
      { icon: <SiElixir />, label: "Elixir/Erlang", color: "purple" },
    ],
  },
  {
    id: "frameworks",
    label: "frameworks",
    tools: [
      { icon: <FaReact />, label: "React", color: "cyan" },
      { icon: <SiNextdotjs />, label: "Next.js", color: "ink" },
      { icon: <SiExpress />, label: "Express.js", color: "ink" },
      { icon: <FaNodeJs />, label: "Node.js", color: "cyan" },
      { icon: <SiFastapi />, label: "FastAPI", color: "cyan" },
      { icon: <SiPhoenixframework />, label: "Phoenix", color: "orange" },
      { icon: <SiLangchain />, label: "LangChain", color: "cyan" },
      { icon: <SiPytorch />, label: "PyTorch", color: "red" },
    ],
  },
  {
    id: "cloud",
    label: "cloud & data",
    tools: [
      { icon: <FaAws />, label: "AWS", color: "gold" },
      { icon: <FaMicrosoft />, label: "Azure", color: "blue" },
      { icon: <FaGoogle />, label: "GCP", color: "blue" },
      { icon: <SiTerraform />, label: "Terraform", color: "purple" },
      { icon: <FaDocker />, label: "Docker", color: "blue" },
      { icon: <SiKubernetes />, label: "Kubernetes", color: "blue" },
      { icon: <SiPostgresql />, label: "PostgreSQL", color: "blue" },
      { icon: <SiSupabase />, label: "Supabase", color: "cyan" },
      { icon: <SiFirebase />, label: "Firebase", color: "gold" },
      { icon: <SiMongodb />, label: "MongoDB", color: "cyan" },
    ],
  },
];

const iconColor: Record<string, string> = {
  gold: "text-acc-gold",
  orange: "text-acc-orange",
  cyan: "text-acc-cyan",
  blue: "text-acc-blue",
  red: "text-acc-red",
  crimson: "text-acc-crimson",
  purple: "text-acc-purple",
  ink: "text-ink/90",
};

const ToolsSection: React.FC = () => {
  return (
  <div className="relative md:flex">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 w-full">
    {categories.map((cat, ci) => (
      <motion.div
        key={cat.id}
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, delay: ci * 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <h3 className="text-[13px] font-bold mb-3">{cat.label}</h3>
        <ul className="flex flex-col gap-[7px]">
          {cat.tools.map((tool) => (
            <li key={tool.label} className="flex items-center gap-2.5 text-[12px] text-ink">
              <span className={`text-[14px] leading-none ${iconColor[tool.color] ?? "text-ink/90"}`}>
                {tool.icon}
              </span>
              {tool.label}
            </li>
          ))}
        </ul>
      </motion.div>
    ))}
    </div>
  </div>
  );
};

export default ToolsSection;
