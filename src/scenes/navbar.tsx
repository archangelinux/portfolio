import React from "react";
import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaRegEnvelope,
} from "react-icons/fa6";

export type SectionId = "me" | "work" | "projects";

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: "me", label: "me" },
  { id: "work", label: "work" },
  { id: "projects", label: "projects" },
];

const CONTACT_ITEMS = [
  {
    icon: <FaRegEnvelope className="w-[15px] h-[15px]" />,
    label: "a498wang@uwaterloo.ca",
    href: "mailto:a498wang@uwaterloo.ca",
    aria: "Email",
  },
  {
    icon: <FaGithub className="w-[15px] h-[15px]" />,
    label: "/archangelinux",
    href: "https://github.com/archangelinux",
    aria: "GitHub",
  },
  {
    icon: <FaLinkedinIn className="w-[15px] h-[15px]" />,
    label: "/angelinabai",
    href: "https://www.linkedin.com/in/angelinabai/",
    aria: "LinkedIn",
  },
  {
    icon: <FaXTwitter className="w-[15px] h-[15px]" />,
    label: "/angie_bw",
    href: "https://x.com/angie_bw",
    aria: "X",
  },
];

const scrollTo = (id: SectionId) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* Left menu — each pill grows from the screen edge and hugs its own label,
   so the right edge is jagged; current = darker, hover = fainter */
export const SideNav: React.FC<{ active: SectionId }> = ({ active }) => (
  <nav className="hidden md:flex fixed top-9 left-0 z-50 flex-col items-start gap-[6px]">
    {NAV_ITEMS.map((item) => (
      <button
        key={item.id}
        onClick={() => scrollTo(item.id)}
        className={`text-[12px] leading-none tracking-tight h-[18px] pl-11 pr-2.5 rounded-r-full transition-colors duration-300 ${
          active === item.id
            ? "bg-pill text-ink"
            : "bg-transparent text-ink hover:bg-pill-faint"
        }`}
      >
        {item.label}
      </button>
    ))}
  </nav>
);

/* Right contact rail — labels pull out smoothly from behind the icons on hover */
export const ContactRail: React.FC = () => (
  <div className="hidden md:flex fixed top-[34px] right-12 z-50 flex-col items-end gap-[5px]">
    {CONTACT_ITEMS.map((item) => (
      <a
        key={item.aria}
        href={item.href}
        target={item.href.startsWith("mailto") ? undefined : "_blank"}
        rel="noopener noreferrer"
        aria-label={item.aria}
        className="group flex items-center justify-end h-[22px] text-ink"
      >
        <span className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          {item.icon}
        </span>
        <span className="inline-block overflow-hidden max-w-0 group-hover:max-w-[240px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <span className="inline-block pl-2 text-[12px] whitespace-nowrap translate-x-2 group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
            {item.label}
          </span>
        </span>
      </a>
    ))}
  </div>
);

/* Mobile header — stacked pills top-left, icons + name top-right */
export const MobileHeader: React.FC<{ active: SectionId }> = ({ active }) => (
  <header className="md:hidden flex items-start justify-between pt-7 pb-2">
    <nav className="flex flex-col items-start gap-[7px]">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className={`text-[12px] leading-none h-[18px] pl-6 pr-2.5 rounded-r-full transition-colors duration-300 ${
            active === item.id ? "bg-pill text-ink" : "bg-pill-faint/80 text-ink"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
    <div className="flex flex-col items-end gap-3 pr-6">
      <div className="flex items-center gap-4">
        {CONTACT_ITEMS.map((item) => (
          <a
            key={item.aria}
            href={item.href}
            target={item.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={item.aria}
            className="text-ink opacity-80 active:opacity-100"
          >
            {item.icon}
          </a>
        ))}
      </div>
      <h1 className="font-noto text-[22px] font-extrabold tracking-[0.03em] leading-none">
        Angelina Wang
      </h1>
    </div>
  </header>
);
