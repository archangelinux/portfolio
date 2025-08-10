import React from "react";
import { CloudIcon } from "@heroicons/react/24/solid";
import GitLogo from "@/assets/github.svg";
import LinkedinLogo from "@/assets/linkedin.svg";

const Navbar: React.FC = () => {
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();

    //smooth scroll to the element
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav>
      <div
        className="bg-[#3F534E] fixed top-8 z-30 py-4 px-8 rounded-xl mx-auto left-1/2 transform -translate-x-1/2"
      >
        <div className="flex items-center justify-center gap-6 md:gap-8 lg:gap-12 px-4">
          {/* Cloud Icon */}
          <a 
            href="#home" 
            onClick={(e) => handleLinkClick(e, "#home")}
            className="hover:opacity-70 transition duration-300"
          >
            <CloudIcon className="h-6 w-6 text-white" />
          </a>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <a
              href="#experience"
              className="font-medium text-white hover:text-[#ff6600] transition duration-300 text-sm"
              onClick={(e) => handleLinkClick(e, "#experience")}
            >
              Work
            </a>
            <a
              href="#projects"
              className="font-medium text-white hover:text-[#ff6600] transition duration-300 text-sm"
              onClick={(e) => handleLinkClick(e, "#projects")}
            >
              Build
            </a>
            <a
              href="#connect"
              className="font-medium text-white hover:text-[#ff6600] transition duration-300 text-sm"
              onClick={(e) => handleLinkClick(e, "#connect")}
            >
              Connect
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="https://github.com/archangelinux"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition duration-300"
            >
              <img src={GitLogo} className="h-6 w-6" alt="GitHub" />
            </a>
            <a
              href="https://www.linkedin.com/in/angelinabai/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition duration-300"
            >
              <img src={LinkedinLogo} className="h-6 w-6" alt="LinkedIn" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
