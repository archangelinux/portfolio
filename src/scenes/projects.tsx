import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ExternalLink,
  Shell,
  Satellite,
  NotebookPen,
  MapPin,
  HeartPulse,
  Globe,
  BoomBox,
  Droplets,
  Dumbbell,
  Film,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import CorallTN from "@/assets/corall-thumbnail.png";
import HaloTN from "@/assets/halo.png";
import ThoughtMirrorTN from "@/assets/thoughtmirror-thumbnail.svg";
import RouviaTN from "@/assets/rouvia_thumbnail 1.svg";
import MedUnityTN from "@/assets/medunity-thumbnail.png";
import EcoscoreTN from "@/assets/ecoscore-thumbnail.png";
import LooTN from "@/assets/loolooloo-thumbnail.svg";
import BeFitTN from "@/assets/befit-thumbnail-1.svg";
import WamTN from "@/assets/sample-wam-thumbnail.svg";
import RadBotTN from "@/assets/radiobot-thumbnail.svg";
import "./projects.css";

export interface Project {
  title: string;
  blurb: string;
  rowTags: string[];
  description: string;
  image: string;
  icon: React.ReactNode;
  button1: string;
  button2: string;
  b1src: string;
  b2src: string;
  tags: string[];
  /** Is the image dark (white text on a dark panel) or light (dark text on a light panel)? */
  tone: "dark" | "light";
  /** Which part of the image to keep when it's cropped to the card. */
  imagePosition?: string;
}

export const projects: Project[] = [
  {
    title: "Corall",
    tone: "light",
    blurb: "the intelligence layer for your network",
    rowTags: ["product", "social"],
    description:
      "The intelligence layer for your network. An AI-powered platform that turns real-world interactions into lasting, searchable connections with smart LinkedIn syncing, second-degree discovery, contextual AI search, and automated follow-ups.",
    image: CorallTN,
    icon: <Shell className="w-4 h-4" />,
    button1: "Site",
    button2: "Chrome Extension",
    b1src: "https://corall.co",
    b2src:
      "https://chromewebstore.google.com/detail/corall-linkedin-sync/iddhdggpdifeiiejfnemhmhddhdadbgg",
    tags: ["Full-Stack Dev", "Product Design"],
  },
  {
    title: "HALO",
    tone: "dark",
    blurb: "Hypothesis Arbitration for Link Outages",
    rowTags: ["Google DeepMind Build With Gemma", "connectivity"],
    description:
      "Google DeepMind Build With Gemma Kaggle Competition | Hypothesis Arbitration for Link Outages — lets satellites diagnose why a comms link failed and respond on their own, onboard, in real-time. Gemma 4 E4B reads each node's observations and returns a cause, a confidence, and a rationale a flight controller can actually read, with evidence gossiped between passing satellites in 24-byte packets. Simulates real Iridium-NEXT orbits, proves when two failure causes are physically indistinguishable, and replays it all in a React + Three.js UI.",
    image: HaloTN,
    icon: <Satellite className="w-4 h-4" />,
    button1: "Kaggle",
    button2: "Github",
    b1src:
      "https://www.kaggle.com/competitions/build-with-gemma-triage-in-light-speed/writeups/new-writeup-1785614353507",
    b2src: "https://github.com/archangelinux/halo",
    tags: ["Gemma", "Python", "React", "TypeScript", "Three.js"],
  },
  {
    title: "MedUnity",
    tone: "light",
    blurb: "a shared layer of medical intelligence",
    rowTags: ["GenAI Genesis 2026 winner", "solo hack", "healthcare"],
    description:
      "A longitudinal health platform that creates a shared layer of medical intelligence. Features an AI-powered triage system fine-tuned on CTAS 2025 (the Canadian Triage and Acuity Scale), real-time ER demand projections for healthcare providers with cluster detection and diversion recommendations, and community health resource dashboards. Fine-tuned Gemini 2.5 Flash on Vertex AI achieving 77% validation accuracy on 5-class CTAS classification, with an agentic Railtracks framework powering deterministic ER analytics.",
    image: MedUnityTN,
    icon: <HeartPulse className="w-4 h-4" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/medunity",
    b2src: "https://github.com/archangelinux/medunity",
    tags: [
      "Next.js",
      "FastAPI",
      "Gemini",
      "Vertex AI",
      "Supabase",
      "TypeScript",
      "Python",
    ],
  },
  {
    title: "ThoughtMirror",
    tone: "light",
    blurb: "journalling that detects cognitive distortions",
    rowTags: ["GenAI Genesis 2024 1st place", "mental health"],
    description:
      "An AI-powered journaling assistant that identifies cognitive distortions in real-time, offering therapist-inspired guidance, and visually tracking thought patterns over time. Built by fine-tuning Gemini-2.0 on clinician-annotated data and integrating a RAG pipeline using LangChain and real therapist responses to deliver personalized, judgment-free feedback. Winner of Best Generative AI Technology Hack (1st place out of 160+ projects and 600+ participants).",
    image: ThoughtMirrorTN,
    icon: <NotebookPen className="w-4 h-4" />,
    button1: "Devpost",
    button2: "Github",
    b1src: "https://devpost.com/software/thoughtmirror",
    b2src: "https://github.com/archangelinux/thought-mirror",
    tags: [
      "Next.js",
      "FastAPI",
      "TypeScript",
      "Tailwind",
      "Python",
      "Firebase",
    ],
    imagePosition: "left center",
  },
  {
    title: "Rouvia",
    tone: "light",
    blurb: "voice-first, natural-language navigation",
    rowTags: ["Hack the North 2025", "mobility", "navigation"],
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
    title: "Ecoscore",
    tone: "light",
    blurb: "environmental impact made visible at checkout",
    rowTags: ["ElleHacks 2026 winner", "web3/solana"],
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
    title: "www.LooLooLoo",
    tone: "light",
    blurb: "routes you to nearby fountains and bathrooms",
    rowTags: ["Hack The North 2024", "ESP32"],
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
    tone: "light",
    blurb: "real-time workout form correction and scoring",
    rowTags: ["Hack Western 2025 winner", "Computer Vision"],
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
    tone: "light",
    blurb: "a photo booth that shares straight to your socials",
    rowTags: ["Raspberry Pi"],
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
    tone: "light",
    blurb: "a portable FM radio that follows you around",
    rowTags: ["Arduino"],
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

/* Semantic tag colors: gold = hackathons & awards, orange = hardware,
   cyan = everything else (domains & tech) */
const EVENT_TAGS = new Set(
  [
    "GenAI Genesis 2024 1st place",
    "GenAI Genesis 2026 winner",
    "Google DeepMind Build With Gemma",
    "Hack the North 2025",
    "Hack The North 2024",
    "Hack Western 2025 winner",
    "ElleHacks 2026 winner",
    "solo hack",
  ].map((t) => t.toLowerCase()),
);
const RED_TAGS = new Set(
  ["mobility", "Computer Vision", "connectivity"].map((t) => t.toLowerCase()),
);
const ORANGE_TAGS = new Set(
  ["ESP32", "Raspberry Pi", "Arduino", "web3/solana"].map((t) =>
    t.toLowerCase(),
  ),
);
const tagColor = (tag: string) => {
  const t = tag.toLowerCase();
  if (EVENT_TAGS.has(t)) return "text-acc-gold";
  if (RED_TAGS.has(t)) return "text-acc-red";
  if (ORANGE_TAGS.has(t)) return "text-acc-orange";
  if (t === "product") return "text-acc-purple";
  return "text-acc-cyan";
};

const Tags = React.forwardRef<HTMLParagraphElement, { tags: string[]; className?: string }>(({ tags, className = "" }, ref) => (
  <p ref={ref} className={`flex flex-wrap gap-x-3 gap-y-0.5 text-[10.5px] leading-relaxed ${className}`}>
    {tags.map((tag) => (
      <span key={tag} className={tagColor(tag)}>
        {tag.toLowerCase()}
      </span>
    ))}
  </p>
));
Tags.displayName = "Tags";

const Links: React.FC<{ p: Project }> = ({ p }) => {
  const cls = `inline-flex items-center gap-1 text-[11px] underline underline-offset-2 transition-colors ${
    p.tone === "dark" ? "text-white decoration-white/50 hover:decoration-white" : "text-ink decoration-faint hover:decoration-ink"
  }`;
  return (
  <>
    {p.b1src && (
      <a
        href={p.b1src}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={cls}
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
        className={cls}
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
};

/**
 * A project card: the image fills the card, with a translucent dark panel
 * along the bottom holding the name, one-liner and tags in white. On hover
 * (or keyboard focus) the panel extends upward over the image to reveal the
 * long description, full tags and links; on touch screens a tap opens it.
 */
const ProjectCard: React.FC<{ p: Project }> = ({ p }) => {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLParagraphElement>(null);
  // No scrolling: make the card at least as tall as its fully open panel
  // (plus room for the panel's faded top edge), whatever the width.
  useLayoutEffect(() => {
    const card = cardRef.current, panel = panelRef.current, more = moreRef.current, tags = tagsRef.current;
    if (!card || !panel || !more || !tags) return;
    const fit = () => {
      const closed = panel.offsetHeight;
      const tagsH = tags.offsetHeight + parseFloat(getComputedStyle(tags).marginTop || "0");
      const open = closed - tagsH + more.scrollHeight;
      card.style.minHeight = `${Math.ceil(open + 12)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);
  const tap = () => {
    if (window.matchMedia("(hover: none)").matches) setOpen((o) => !o);
  };
  const dark = p.tone === "dark";
  const strong = dark ? "text-white" : "text-ink";
  const soft = dark ? "text-white/90" : "text-ink/90";
  const summary = (
    <>
      <div className="flex items-center gap-2">
        <span className={dark ? "text-white/85" : "text-ink/80"}>{p.icon}</span>
        <h3 className={`text-[14px] font-bold leading-tight ${strong}`}>{p.title}</h3>
      </div>
      <p className={`text-[12px] ${soft} mt-1.5 leading-snug`}>{p.blurb}</p>
    </>
  );
  return (
    <div
      ref={cardRef}
      className={`card pg-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "")} ${dark ? "is-dark" : "is-light"}${open ? " is-open" : ""}`}
      onClick={tap}
      tabIndex={0}
      aria-label={`${p.title}: ${p.blurb}`}
    >
      <div className="card-image">
        <img src={p.image} alt="" loading="lazy" draggable={false} />
      </div>
      <div ref={panelRef} className={`card-panel ${dark ? "is-dark" : "is-light"}`}>
        {summary}
        <div className="card-more">
          <div ref={moreRef}>
            <p className={`text-[11.5px] ${soft} mt-3 leading-relaxed`}>{p.description}</p>
            <Tags tags={p.tags} className="mt-3" />
            {(p.b1src || p.b2src) && <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">{<Links p={p} />}</div>}
          </div>
        </div>
        <Tags ref={tagsRef} tags={p.rowTags} className="card-row-tags mt-2" />
      </div>
    </div>
  );
};

/** Reading order matches the grid rows in projects.css. */
const ROWS = ["Corall", "Ecoscore", "ThoughtMirror", "HALO", "Rouvia", "MedUnity", "www.LooLooLoo", "Befit", "Wat-A-Moment", "RadBot"];

/**
 * Cards "deal in" as they scroll into view: each rises with a slight backward
 * tilt and settles, the second card in a row a beat after the first, its image
 * sharpening as it lands (see .deal in projects.css). Once per card.
 */
const useDealIn = (ref: React.RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const items = Array.from(grid.children).filter((el): el is HTMLElement => el instanceof HTMLElement && !el.hasAttribute("aria-hidden"));
    items.forEach((el, i) => {
      el.classList.add("deal");
      el.style.setProperty("--deal-delay", `${(i % 2) * 0.12}s`);
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-dealt");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
};

const Projects: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useDealIn(ref);
  return (
  <div ref={ref} className="cards relative">
    {ROWS.map((key) => {
      const p = projects.find((q) => q.title === key);
      return p && <ProjectCard key={key} p={p} />;
    })}
  </div>
  );
};

export default Projects;
