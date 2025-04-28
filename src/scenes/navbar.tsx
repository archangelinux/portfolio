import React, {useState } from 'react';
import { Bars3Icon, XMarkIcon, CloudIcon } from "@heroicons/react/24/solid";
import GitLogo from "@/assets/github.svg";
import LinkedinLogo from "@/assets/linkedin.svg";

import { SelectedPage } from "@/utils/types.ts";
import useMediaQuery from "@/hooks/useMediaQuery.ts";



const Navbar: React.FC = () => {
    const flexBetween = "flex justify-between items-center"; // moves to opposite ends
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();

        //smooth scroll to the element
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        if (isMenuToggled) {
            setIsMenuToggled(false);
        }
    };

    return (
        <nav>
            <div className={`${flexBetween} bg-[#3F534E] fixed top-8 z-30 max-w-[calc(100%-5rem)] left-20 right-20 py-6 px-10 rounded-xl`}>
                <div className={`${flexBetween} mx-auto w-full`}>
                    <div className={`${flexBetween} w-full gap-14 hidden md:flex`}>
                        <a href="#home" onClick={(e) => handleLinkClick(e, "#home")}><CloudIcon className="h-7 w-7 text-[#00000]" /></a>
                        <div className={`${flexBetween} w-full`}>
                            <div className={`${flexBetween} gap-8 text-sm`}>
                                <a
                                    href="#experience"
                                    className="font-semibold hover:text-[#ff6600] transition duration-300"
                                    onClick={(e) => handleLinkClick(e, "#experience")}
                                    >
                                    Experience
                                </a>
                                <a
                                    href="#projects"
                                    className="font-semibold hover:text-[#ff6600] transition duration-300"
                                    onClick={(e) => handleLinkClick(e, "#projects")}
                                    >
                                    Projects
                                </a>
                                <a
                                    href="#connect"
                                    className="font-semibold hover:text-[#ff6600] transition duration-300"
                                    onClick={(e) => handleLinkClick(e, "#connect")}
                                    >
                                    Connect
                                </a>
                            </div>
                            <div className={`${flexBetween} gap-8 text-sm`}>
                                <a
                                    href="https://github.com/archangelinux"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-70 transition duration-300"
                                >
                                    <img src={GitLogo} className="h-7 w-7" alt="GitHub" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/angelinabai/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-70 transition duration-300"
                                >
                                    <img src={LinkedinLogo} className="h-7 w-7" alt="LinkedIn" />
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* menu popup toggle*/}
                    <div className="md:hidden flex justify-end w-full">
                        <button
                            className="rounded-full bg-[#3F534E] p-2"
                            onClick={() => setIsMenuToggled(!isMenuToggled)}
                        >
                            <Bars3Icon className="h-6 w-6 text-[#ff6600]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* menu popup */}
            {!isAboveMediumScreens && isMenuToggled && (
                <div className="fixed  z-40  left-20 right-20 py-6 px-10 mt-10 h-[80vh] rounded-xl bg-[#3F534E] p-6 drop-shadow-xl">
                    <div className="flex justify-end">
                        <button onClick={() => setIsMenuToggled(false)}>
                            <XMarkIcon className="h-6 w-6 text-[#ff6600]" />
                        </button>
                    </div>
                    <div className="mt-20 flex flex-col gap-6 text-center text-3xl">
                        <a
                            href="#experience"
                            className="font-semibold hover:text-[#ff6600] transition duration-300"
                            onClick={() => {
                                setIsMenuToggled(false);
                            }}
                        >
                            Experience
                        </a>
                        <a
                            href="#projects"
                            className="font-semibold hover:text-[#ff6600] transition duration-300"
                            onClick={() => {
                                setIsMenuToggled(false);
                            }}
                        >
                            Projects
                        </a>
                        <a
                            href="#connect"
                            className="font-semibold hover:text-[#ff6600] transition duration-300"
                            onClick={() => {
                                setIsMenuToggled(false);
                            }}
                        >
                            Connect
                        </a>
                        <div className="flex justify-center gap-4 mt-2">
                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-70 transition duration-300"
                            >
                                <img src={GitLogo} className="h-7 w-7" alt="GitHub" />
                            </a>
                            <a
                                href="https://linkedin.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-70 transition duration-300"
                            >
                                <img src={LinkedinLogo} className="h-7 w-7" alt="LinkedIn" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;