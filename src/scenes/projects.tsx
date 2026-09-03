import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Shell,
  Satellite,
  Globe,
  NotebookPen,
  MapPin,
  HeartPulse,
  Droplets,
  Dumbbell,
  Film,
  BoomBox,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import CorallTN from "@/assets/corall-thumbnail.png";
import HaloTN from "@/assets/halo.png";
import EcoscoreTN from "@/assets/ecoscore-thumbnail.png";
import ThoughtMirrorTN from "@/assets/thoughtmirror-thumbnail.svg";
import RouviaTN from "@/assets/rouvia_thumbnail 1.svg";
import MedUnityTN from "@/assets/medunity-thumbnail.png";
import LooTN from "@/assets/loolooloo-thumbnail.svg";
import BeFitTN from "@/assets/befit-thumbnail-1.svg";
import WamTN from "@/assets/sample-wam-thumbnail.svg";
import RadBotTN from "@/assets/radiobot-thumbnail.svg";

interface Project {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  button1: string;
  button2: string;
  b1src: string;
  b2src: string;
  tags: string[];
}

const projects: Project[] = [
  {
    title: "Corall",
    description:
      "The intelligence layer for your network. An AI-powered platform that turns real-world interactions into lasting, searchable connections with smart LinkedIn syncing, second-degree discovery, contextual AI search, and automated follow-ups.",
    image: CorallTN,
    icon: <Shell className="w-4 h-4" />,
    button1: "Site",
    button2: "Chrome Extension",
    b1src: "https://corall.co",
    b2src: "https://chromewebstore.google.com/detail/corall-linkedin-sync/iddhdggpdifeiiejfnemhmhddhdadbgg",
    tags: ["Full-Stack Dev", "Product Design"],
  },
  {
    title: "HALO",
    description:
      "Google DeepMind Build With Gemma Kaggle Competition | Hypothesis Arbitration for Link Outages — lets satellites diagnose why a comms link failed and respond on their own, onboard, in real-time. Gemma 4 E4B reads each node's observations and returns a cause, a confidence, and a rationale a flight controller can actually read, with evidence gossiped between passing satellites in 24-byte packets. Simulates real Iridium-NEXT orbits, proves when two failure causes are physically indistinguishable, and replays it all in a React + Three.js UI.",
    image: HaloTN,
    icon: <Satellite className="w-4 h-4" />,
    button1: "Kaggle",
    button2: "Github",
    b1src: "https://www.kaggle.com/competitions/build-with-gemma-triage-in-light-speed/writeups/new-writeup-1785614353507",
    b2src: "https://github.com/archangelinux/halo",
    tags: ["Gemma", "Python", "React", "TypeScript", "Three.js"],
  },
  {
    title: "Ecoscore",
    description:
      "ElleHacks 2026 | Winner of Best Use of Solana | Makes hidden environmental impact visible during purchase, with product scoring and on-chain corporate donations to NGOs.",
    image: EcoscoreTN,
    icon: <Globe className="w-4 h-4" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/ecoscore-zh63x0",
    b2src: "https://github.com/archangelinux/ecoscore",
    tags: ["Solana", "React", "TypeScript", "Python"],
  },
  {
    title: "ThoughtMirror",
    description:
      "An AI-powered journaling assistant that identifies cognitive distortions in real-time, offering therapist-inspired guidance, and visually tracking thought patterns over time. Built by fine-tuning Gemini-2.0 on clinician-annotated data and integrating a RAG pipeline using LangChain and real therapist responses to deliver personalized, judgment-free feedback. Winner of Best Generative AI Technology Hack (1st place out of 160+ projects and 600+ participants).",
    image: ThoughtMirrorTN,
    icon: <NotebookPen className="w-4 h-4" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/thoughtmirror",
    b2src: "https://github.com/archangelinux/thought-mirror",
    tags: ["Next.js", "FastAPI", "TypeScript", "Tailwind", "Python", "Firebase"],
  },
  {
    title: "Rouvia",
    description:
      "A voice-first navigation system that transforms natural language into intelligent route planning. Built to address safety concerns in traditional GPS by enabling hands-free control through OpenAI Whisper transcription and Google Gemini intent parsing. Features a multi-stage processing pipeline that handles unstructured voice input, implements trendiness scoring using Cohere's AI, and integrates MongoDB for personalized location memory.",
    image: RouviaTN,
    icon: <MapPin className="w-4 h-4" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/rouvia",
    b2src: "https://github.com/archangelinux/rouvia",
    tags: ["OpenAI Whisper", "Google Gemini", "Cohere", "MongoDB", "Python"],
  },
  {
    title: "MedUnity",
    description:
      "A longitudinal health platform that creates a shared layer of medical intelligence. Features an AI-powered triage system fine-tuned on CTAS 2025 (the Canadian Triage and Acuity Scale), real-time ER demand projections for healthcare providers with cluster detection and diversion recommendations, and community health resource dashboards. Fine-tuned Gemini 2.5 Flash on Vertex AI achieving 77% validation accuracy on 5-class CTAS classification, with an agentic Railtracks framework powering deterministic ER analytics.",
    image: MedUnityTN,
    icon: <HeartPulse className="w-4 h-4" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/medunity",
    b2src: "https://github.com/archangelinux/medunity",
    tags: ["Next.js", "FastAPI", "Gemini", "Vertex AI", "Supabase", "TypeScript", "Python"],
  },
  {
    title: "www.LooLooLoo",
    description:
      "Hack The North 2024 - Sponsor Award Winner (Defang) | A full-stack web app that detects nearby water fountains and routes users to bathrooms using a ESP32-based Bluetooth beacon. Features a notification system (Twilio's API), dynamic routing (MappedIn's API), and a mobile UI for hydration tracking.",
    image: LooTN,
    icon: <Droplets className="w-4 h-4" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/waterwaterwater-loolooloo",
    b2src: "https://github.com/archangelinux/loolooloo",
    tags: ["ESP32", "React", "Express.js", "TypeScript", "Docker"],
  },
  {
    title: "Befit",
    description:
      "Hack Western 2024 - Sponsor Award Winner (Tempolabs) | An AI-driven fitness trainer designed to enhance workouts through real-time form correction and scoring with OpenCV. Compares user performance against workout videos using Mediapipe, generates gamified workout plans, and integrates intuitive hand-gesture controls.",
    image: BeFitTN,
    icon: <Dumbbell className="w-4 h-4" />,
    button1: "DoraHacks",
    button2: "Github",
    b1src: "https://dorahacks.io/buidl/20376",
    b2src: "https://github.com/archangelinux/be-fit",
    tags: ["Typescript", "Tailwind", "React", "JavaScript"],
  },
  {
    title: "Wat-A-Moment",
    description:
      "A digital photo booth platform that enables users to instantly upload and share photos with their social networks. Features automated metadata management, secure token-based authentication, and cloud storage.",
    image: WamTN,
    icon: <Film className="w-4 h-4" />,
    button1: "",
    button2: "",
    b1src: "",
    b2src: "",
    tags: ["Raspberry Pi", "Flask", "Express.js", "SQL", "Python", "HTML/CSS"],
  },
  {
    title: "RadBot",
    description:
      "A portable FM radio system paired with a rotary encoder and TEA5767 module, enhanced with a car attachment that uses ultrasonic and infrared sensors to autonomously follow the user.",
    image: RadBotTN,
    icon: <BoomBox className="w-4 h-4" />,
    button1: "",
    button2: "Github",
    b1src: "",
    b2src: "https://github.com/archangelinux/fm-radio-bot",
    tags: ["Arduino", "C++"],
  },
];

/* Deterministic accent per tag so the same tech reads the same color everywhere */
const TAG_COLORS = [
  "text-acc-gold",
  "text-acc-orange",
  "text-acc-cyan",
  "text-acc-blue",
  "text-acc-red",
];
const tagColor = (tag: string) => {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) % 997;
  return TAG_COLORS[h % TAG_COLORS.length];
};

const Tags: React.FC<{ tags: string[]; className?: string }> = ({ tags, className = "" }) => (
  <p className={`text-[10px] leading-relaxed ${className}`}>
    {tags.map((tag, i) => (
      <span key={tag}>
        <span className={tagColor(tag)}>{tag.toLowerCase()}</span>
        {i < tags.length - 1 && <span className="text-faint"> · </span>}
      </span>
    ))}
  </p>
);

const Links: React.FC<{ p: Project }> = ({ p }) => (
  <>
    {p.b1src && (
      <a
        href={p.b1src}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 text-[11px] text-ink/70 hover:text-ink underline underline-offset-2 decoration-faint hover:decoration-ink transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        {p.button1.toLowerCase()}
      </a>
    )}
    {p.b2src && (
      <a
        href={p.b2src}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 text-[11px] text-ink/70 hover:text-ink underline underline-offset-2 decoration-faint hover:decoration-ink transition-colors"
      >
        {p.button2 === "Github" ? (
          <FaGithub className="w-3 h-3" />
        ) : (
          <ExternalLink className="w-3 h-3" />
        )}
        {p.button2.toLowerCase()}
      </a>
    )}
  </>
);

const ProjectCard: React.FC<{ p: Project; index: number; onOpen: (i: number) => void }> = ({
  p,
  index,
  onOpen,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    onClick={() => onOpen(index)}
    className="group break-inside-avoid mb-5 rounded-lg bg-card cursor-pointer hover:-translate-y-1 hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.2)] transition-[transform,box-shadow] duration-300"
  >
    <div className="overflow-hidden rounded-t-lg">
      <img
        src={p.image}
        alt={p.title}
        className="w-full h-[110px] object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
      />
    </div>
    <div className="px-4 pt-3.5 pb-4">
      <h3 className="text-[13px] font-bold leading-tight">{p.title}</h3>
      <p className="text-[11px] text-ink/70 mt-2 leading-relaxed line-clamp-3">{p.description}</p>
      <Tags tags={p.tags} className="mt-3" />
      {(p.b1src || p.b2src) && <div className="flex gap-4 mt-3">{<Links p={p} />}</div>}
    </div>
  </motion.div>
);

const Spotlight: React.FC<{
  index: number;
  onClose: () => void;
  onSelect: (i: number) => void;
}> = ({ index, onClose, onSelect }) => {
  const p = projects[index];
  const prev = () => onSelect((index - 1 + projects.length) % projects.length);
  const next = () => onSelect((index + 1) % projects.length);

  return (
    <motion.div
      key="spotlight"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-[12px] text-mute hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          back to all projects
        </button>
        <div className="flex items-center gap-4">
          {/* horizontal icon rail — one per project */}
          <div className="flex items-center gap-1">
            {projects.map((proj, i) => (
              <button
                key={proj.title}
                onClick={() => onSelect(i)}
                aria-label={proj.title}
                title={proj.title}
                className={`relative w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                  i === index ? "text-ink" : "text-faint hover:text-ink"
                }`}
              >
                {i === index && (
                  <motion.span
                    layoutId="spotlightIcon"
                    className="absolute inset-0 bg-pill rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{proj.icon}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous project"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-card hover:bg-pill-faint transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={next}
              aria-label="Next project"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-card hover:bg-pill-faint transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={p.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col md:flex-row gap-8"
        >
          <div className="md:w-[55%] shrink-0">
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-auto rounded-lg shadow-[0_14px_30px_-16px_rgba(0,0,0,0.25)]"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-bold leading-tight">{p.title}</h3>
            <p className="text-[12px] text-ink/75 mt-4 leading-relaxed">{p.description}</p>
            <Tags tags={p.tags} className="mt-5" />
            {(p.b1src || p.b2src) && <div className="flex gap-5 mt-4">{<Links p={p} />}</div>}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const [spotlight, setSpotlight] = useState<number | null>(null);

  const open = (i: number) => {
    setSpotlight(i);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {spotlight === null ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:columns-2 md:columns-3 gap-5"
          >
            {projects.map((p, i) => (
              <ProjectCard key={p.title} p={p} index={i} onOpen={open} />
            ))}
          </motion.div>
        ) : (
          <Spotlight
            index={spotlight}
            onClose={() => setSpotlight(null)}
            onSelect={setSpotlight}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
