"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, Variants, useAnimation, useInView, AnimatePresence } from "framer-motion";
import {
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Maximize2
} from "lucide-react";
import { 
  FaLinkedin, 
  FaInstagram, 
  FaReact, 
  FaHtml5, 
  FaCss3Alt, 
  FaNodeJs,
  FaGithub,
  FaFigma,
  FaPhp,
  FaPython
} from "react-icons/fa";
import { 
  SiNextdotjs, 
  SiTailwindcss, 
  SiJavascript, 
  SiTypescript,
  SiMysql,
  SiLaravel
} from "react-icons/si";
import Image from "next/image";

const Typewriter = ({ text, speed = 30, delay = 0 }: { text: string, speed?: number, delay?: number }) => {
  const [displayedText, setDisplayedText] = React.useState("");
  const [start, setStart] = React.useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStart(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  
  useEffect(() => {
    if (!start) return;
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);
    return () => clearInterval(typingInterval);
  }, [text, speed, start]);

  return <span>{displayedText}<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2 h-4 ml-1 bg-amber-400 align-middle"/></span>;
};

// Multilingual Greeting with Typewriter & Backspace effect
const MULTILINGUAL_GREETINGS = [
  "Hello",
  "Hola",
  "Bonjour",
  "Halo",
  "Konnichiwa",
  "Guten Tag",
  "Ciao",
  "Annyeong",
  "Olá",
  "Nǐ Hǎo",
  "Namaste",
];

const MultilingualGreeting = () => {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initial delay so user sees "Hello" typed right after loading screen opens
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsReady(true);
    }, 2000);
    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const currentWord = MULTILINGUAL_GREETINGS[index];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase: type letter by letter
      if (displayedText.length < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        }, 120);
      } else {
        // Full word typed: pause so it can be read, then start backspacing
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      // Deleting phase: backspace letter by letter
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length - 1));
        }, 60);
      } else {
        // Fully backspaced: short pause, then move to next word and start typing
        timer = setTimeout(() => {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % MULTILINGUAL_GREETINGS.length);
        }, 350);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, index, isReady]);

  return (
    <span className="inline-flex items-center min-w-[20px]">
      <span className="text-amber-400 font-bold drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
        {displayedText}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        className="inline-block w-[2px] h-[1.1em] bg-amber-400 ml-1 rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.8)] align-middle"
      />
    </span>
  );
};

// Animated Number Counter
const AnimatedNumber = ({ value }: { value: string }) => {
  const finalNumber = parseInt(value);
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const duration = 1200; // 1.2 seconds scramble
      
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        if (progress < 1) {
          setDisplayValue(Math.floor(Math.random() * 100).toString());
          requestAnimationFrame(step);
        } else {
          setDisplayValue(finalNumber.toString());
        }
      };
      
      requestAnimationFrame(step);
    }
  }, [isInView, finalNumber]);

  return <span ref={ref}>{displayValue}%</span>;
};


// Floating particles for the background
const FloatingParticles = () => {
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-amber-500/10 rounded-full blur-2xl"
          style={{
            width: Math.random() * 150 + 50,
            height: Math.random() * 150 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};


// Initial Screen Intro Animation (Pure Modern Minimalist LOADING)
const ScreenPowerOn = () => {
  const [progress, setProgress] = React.useState(0);
  const [stage, setStage] = React.useState(0);

  useEffect(() => {
    // Smooth counter from 0 to 100
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 25);

    // Trigger curtain split exit after 1.8s
    const timer1 = setTimeout(() => setStage(1), 1800);
    // Unmount completely after animation
    const timer2 = setTimeout(() => setStage(2), 2600);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (stage === 2) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col select-none overflow-hidden">
      {/* Top Half Panel */}
      <motion.div
        animate={stage === 1 ? { y: "-100%" } : { y: "0%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="w-full h-1/2 bg-[#050505] flex items-end justify-center relative z-20 border-b border-neutral-800/40"
      >
        <div className="pb-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl font-black font-mono text-white tracking-[0.5em] uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            LOADING
          </motion.h1>
        </div>
      </motion.div>

      {/* Middle Thin Golden Line Sweep */}
      <div className="relative w-full h-0 z-30 flex items-center justify-center">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: [0, 1, 1, 0.8] }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_rgba(251,191,36,1)] origin-center"
        />
      </div>

      {/* Bottom Half Panel */}
      <motion.div
        animate={stage === 1 ? { y: "100%" } : { y: "0%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="w-full h-1/2 bg-[#050505] flex items-start justify-center relative z-20 border-t border-neutral-800/40"
      >
        <div className="pt-6 flex flex-col items-center gap-3">
          <div className="w-48 sm:w-64 h-[2px] bg-neutral-800/80 rounded-full overflow-hidden relative">
            <div 
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.8)] transition-all duration-75 rounded-full"
            />
          </div>
          <div className="text-amber-400 font-mono text-xs md:text-sm tracking-[0.3em] font-bold">
            {progress < 10 ? `0${progress}` : progress} %
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const projectsData = [
  {
    title: "Admin Dashboard",
    category: "Web Application",
    year: "2025",
    desc: "Sistem dashboard administrator & manajemen tugas dengan analitik terstruktur dan kontrol akses intuitif.",
    tech: ["HTML5", "Tailwind CSS", "JavaScript", "REST API"],
    image: "/foto-project/assignment-admindashboard.png",
    github: "https://github.com/Fardan07/assigment-management",
  },
  {
    title: "Facility Helpdesk",
    category: "Internal System",
    year: "2026",
    desc: "Platform digitalisasi pelaporan dan tiket fasilitas sekolah dengan status penanganan real-time.",
    tech: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    image: "/foto-project/weblaporfasilitas.png",
    github: "https://github.com/Fardan07/project_ukl_sija2",
  },
  {
    title: "Web Dinamis Edukasi",
    category: "Fullstack Platform",
    year: "2025",
    desc: "Website edukasi lingkungan interaktif berbasis PHP dan SQL dengan pengelolaan konten dinamis.",
    tech: ["HTML/CSS", "PHP", "MySQL", "UX Copy"],
    image: "/foto-project/projectwebdinamis.png",
    github: "https://github.com/Fardan07/web-dinamis-project",
  }
];

const certificatesData = [
  {
    title: "DigiUp Certification",
    issuer: "Telkom University",
    year: "2025",
    category: "Validasi Keterampilan Digital",
    image: "/foto-sertifikat/DigiUp Fardan.png",
  },
  {
    title: "ElevAlte Event",
    issuer: "ElevAlte Exhibition",
    year: "2025",
    category: "Acara & Workshop Teknologi",
    image: "/foto-sertifikat/ElevAlte - Fardan.png",
  },
  {
    title: "FicpactCup Competition",
    issuer: "Ficpact Tech Committee",
    year: "2025",
    category: "Kompetisi Kejuruan",
    image: "/foto-sertifikat/FicpactCup - Fardan.jpeg",
  },
  {
    title: "Sefest Exhibition",
    issuer: "Sefest Organization",
    year: "2025",
    category: "Pameran Proyek & Expo",
    image: "/foto-sertifikat/Sefest - Fardan.png",
  }
];

export default function Portfolio() {
  const [selectedCert, setSelectedCert] = useState<{image: string, title: string} | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(12px)", scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)", 
      scale: 1, 
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (!target) return;

    if (typeof window !== "undefined" && (window as any).lenis) {
      (window as any).lenis.scrollTo(target, {
        offset: -40,
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen relative bg-transparent text-slate-50 selection:bg-amber-500 selection:text-black overflow-hidden">
      <div className="crt-scanlines" />
      <ScreenPowerOn />
      <FloatingParticles />
      
      {/* Floating High-Contrast Retro-Industrial Navbar */}
      <header className="fixed top-5 sm:top-6 inset-x-0 z-50 flex justify-center items-center pointer-events-none px-4">
        <nav className="pointer-events-auto flex items-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#121214]/95 backdrop-blur-xl border border-neutral-700 hover:border-amber-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(251,191,36,0.12)] transition-colors">
          <div className="flex items-center gap-1 sm:gap-3 text-[11px] sm:text-xs font-mono tracking-widest text-slate-200">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono tracking-wider mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
              SYS.ONLINE
            </span>
            <a 
              href="#about" 
              onClick={(e) => scrollToSection(e, "#about")}
              className="px-3 py-1 rounded-full hover:text-amber-400 hover:bg-amber-400/10 transition-all font-bold cursor-pointer"
            >
              START
            </a>
            <span className="text-amber-500/40 select-none text-[10px]">•</span>
            <a 
              href="#skills" 
              onClick={(e) => scrollToSection(e, "#skills")}
              className="px-3 py-1 rounded-full hover:text-amber-400 hover:bg-amber-400/10 transition-all font-bold cursor-pointer"
            >
              OPTIONS
            </a>
            <span className="text-amber-500/40 select-none text-[10px]">•</span>
            <a 
              href="#projects" 
              onClick={(e) => scrollToSection(e, "#projects")}
              className="px-3 py-1 rounded-full hover:text-amber-400 hover:bg-amber-400/10 transition-all font-bold cursor-pointer"
            >
              PROJECTS
            </a>
            <span className="text-amber-500/40 select-none text-[10px]">•</span>
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, "#contact")}
              className="px-3 py-1 rounded-full hover:text-amber-400 hover:bg-amber-400/10 transition-all font-bold cursor-pointer"
            >
              EXIT
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="about" className="min-h-screen flex flex-col justify-center items-center px-4 pt-24 pb-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-16"
        >
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Animated Multilingual Greeting */}
            <motion.div variants={itemVariants} className="text-amber-400 font-mono tracking-[0.2em] text-base sm:text-lg md:text-xl font-bold mb-3 uppercase flex items-center justify-center lg:justify-start">
              <MultilingualGreeting />
              <span className="ml-1.5 text-neutral-300">, I AM</span>
            </motion.div>

            {/* Main Name Title in Plain Clean Full Capital without animation */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 uppercase tracking-tight text-white leading-[1.05]">
              MUHAMMAD FARDAN
            </h1>
            
            <div>
              <motion.p variants={itemVariants} className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 min-h-[100px]">
                <Typewriter 
                  text="Halo, saya Muhammad Fardan. Saya mempelajari banyak hal mulai dari web development, desain UI/UX, hingga manajemen basis data. Sebagian besar saya pelajari secara otodidak dan terus mengembangkan keterampilan saya dari tahun ke tahun." 
                  delay={1000} 
                  speed={25} 
                />
              </motion.p>

              {/* Social Media Links */}
              <motion.div variants={itemVariants} className="mt-8 flex gap-4 justify-center lg:justify-start">
                <a href="mailto:contact.fardan07@gmail.com" aria-label="Email" className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-400 hover:bg-amber-400/10 transition-all">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/pardannnn7/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-400 hover:bg-amber-400/10 transition-all">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/muhammad-fardan-5a32a4423/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-400 hover:bg-amber-400/10 transition-all">
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com/Fardan07" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-400 hover:bg-amber-400/10 transition-all">
                  <FaGithub className="w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </div>

          {/* Profile Picture */}
          <motion.div
            variants={itemVariants}
            className="flex-1 flex justify-center items-center relative"
          >
            {/* Decorative background for image */}
            {/* Street Punk / Cyberpunk Profile Frame */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto group">
              {/* Outer HUD Rings */}
              <div className="absolute inset-[-10px] rounded-full border border-amber-500/40 border-dashed border-[3px] animate-[spin_10s_linear_infinite] opacity-70 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              <div className="absolute inset-[-20px] rounded-full border border-amber-400/20 border-dotted border-[4px] animate-[spin_15s_linear_infinite_reverse] z-0" />
              
              {/* Tech Corner Brackets */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500 opacity-50 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300 z-10" />
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 z-10" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500 opacity-50 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:translate-y-1 transition-all duration-300 z-10" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-300 z-10" />

              {/* Tech Label / Tape */}
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 rotate-90 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 tracking-widest uppercase shadow-[0_0_10px_rgba(251,191,36,0.5)] z-20 pointer-events-none group-hover:scale-110 transition-transform">
                FRDN-2026 //
              </div>

              {/* Picture Container (Octagon Clip Path) */}
              <div 
                className="absolute inset-0 bg-neutral-900 border-[3px] border-amber-500/50 group-hover:border-amber-500 transition-colors duration-500 z-10"
                style={{ clipPath: "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)" }}
              >
                <Image
                  src="/fardanportofolio - Diedit.png"
                  alt="Muhammad Fardan"
                  fill
                  className="profile-pic object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-out"
                  priority
                />
              </div>
            </div>
            
            {/* Cyberpunk/Street Style Floating Elements */}
            <motion.div 
              animate={{ y: [0, -5, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-6 md:-right-12 top-16 md:top-20 bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 p-2 flex flex-col gap-1 hidden sm:flex shadow-2xl overflow-hidden rounded-sm z-20 scale-90 md:scale-100 origin-left"
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-amber-500/70"></div>
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-amber-500/70"></div>
              
              <span className="text-[7px] text-amber-500/80 font-mono tracking-[0.4em] uppercase">SYS.OP</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]"></div>
                <span className="text-[10px] text-neutral-100 font-mono tracking-widest font-bold">OPTIMAL</span>
              </div>
              {/* Fake scanning line */}
              <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-amber-500/40 blur-[1px]"
              />
            </motion.div>

            <motion.div 
              animate={{ y: [0, 5, 0] }} 
              transition={{ duration: 6, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
              className="absolute -left-10 md:-left-16 bottom-20 md:bottom-24 flex flex-col items-start gap-1.5 hidden sm:flex opacity-70 hover:opacity-100 transition-opacity p-2 border-l-2 border-b-2 border-neutral-800/80 bg-neutral-900/30 backdrop-blur-sm z-20 scale-90 md:scale-100 origin-right"
            >
              <div className="text-[7px] text-amber-500 font-mono tracking-[0.3em] flex items-center gap-1.5">
                <div className="w-[1px] h-2 bg-amber-500"></div>
                GEO: SDJ.ID
              </div>
              <div className="text-[8px] md:text-[9px] text-neutral-300 font-mono tracking-[0.2em] leading-tight">
                LAT: -7.44 <br/> 
                LNG: 112.71
              </div>
              <div className="flex gap-[2px] h-3 items-end mt-0.5">
                <div className="w-1 h-1.5 bg-neutral-500"></div>
                <div className="w-0.5 h-2 bg-neutral-500"></div>
                <div className="w-1.5 h-3 bg-amber-500"></div>
                <div className="w-0.5 h-1 bg-neutral-500"></div>
                <div className="w-[1px] h-3 bg-neutral-500"></div>
                <div className="w-0.5 h-2 bg-neutral-500"></div>
                <div className="w-1.5 h-1.5 bg-neutral-500"></div>
                <div className="w-0.5 h-3 bg-amber-500/50"></div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Skills & Info Section */}
      <section id="skills" className="py-24 px-4 relative z-10 bg-neutral-900/40 border-y border-neutral-800/50">
        <div className="max-w-6xl mx-auto">
          
          {/* Top Row: Skills and Language */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20"
          >
            {/* Left Column: Software Skills */}
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2 font-mono">
                  <span className="w-8 h-1 bg-amber-500 rounded"></span> SOFTWARE SKILLS
                </h3>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                {[
                  { icon: <FaHtml5 className="w-7 h-7 text-neutral-300 group-hover:text-orange-500 transition-colors" />, name: "HTML" },
                  { icon: <FaCss3Alt className="w-7 h-7 text-neutral-300 group-hover:text-blue-500 transition-colors" />, name: "CSS" },
                  { icon: <SiJavascript className="w-7 h-7 text-neutral-300 group-hover:text-yellow-400 transition-colors" />, name: "JS" },
                  { icon: <FaPhp className="w-7 h-7 text-neutral-300 group-hover:text-indigo-400 transition-colors" />, name: "PHP" },
                  { icon: <SiTypescript className="w-7 h-7 text-neutral-300 group-hover:text-blue-400 transition-colors" />, name: "TS" },
                  { icon: <FaPython className="w-7 h-7 text-neutral-300 group-hover:text-yellow-300 transition-colors" />, name: "Python" },
                  { icon: <SiMysql className="w-7 h-7 text-neutral-300 group-hover:text-blue-400 transition-colors" />, name: "MySQL" },
                  { icon: <FaReact className="w-7 h-7 text-neutral-300 group-hover:text-sky-400 transition-colors" />, name: "React" },
                  { icon: <SiNextdotjs className="w-7 h-7 text-neutral-300 group-hover:text-white transition-colors" />, name: "Next.js" },
                  { icon: <SiLaravel className="w-7 h-7 text-neutral-300 group-hover:text-red-500 transition-colors" />, name: "Laravel" },
                  { icon: <SiTailwindcss className="w-7 h-7 text-neutral-300 group-hover:text-teal-400 transition-colors" />, name: "Tailwind" },
                  { icon: <FaNodeJs className="w-7 h-7 text-neutral-300 group-hover:text-green-500 transition-colors" />, name: "Node.js" },
                  { icon: <FaFigma className="w-7 h-7 text-neutral-300 group-hover:text-pink-500 transition-colors" />, name: "Figma" },
                ].map((skill, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05, type: "spring", stiffness: 200 }}
                    className="glass p-3 aspect-square rounded-xl flex items-center justify-center group hover:bg-neutral-800 transition-colors cursor-help relative border border-neutral-700 hover:border-amber-500/50 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(251,191,36,0.15)]"
                  >
                    {skill.icon}
                    <span className="absolute -top-10 bg-neutral-800 text-amber-400 border border-amber-500/30 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-mono">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Language */}
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2 font-mono">
                  <span className="w-8 h-1 bg-neutral-400 rounded"></span> BAHASA
                </h3>
              </div>
              <div className="space-y-8 glass p-8 rounded-2xl border border-neutral-800/50">
                {[
                  { name: "BAHASA INDONESIA", percent: "95%" },
                  { name: "BAHASA INGGRIS", percent: "75%" },
                ].map((lang, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-mono mb-3 text-neutral-400">
                      <span className="font-bold">{lang.name}</span>
                      <span className="text-amber-400 font-bold"><AnimatedNumber value={lang.percent} /></span>
                    </div>
                    <div className="progress-bar-bg h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: lang.percent }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        className="progress-bar-fill shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom Row: Education and Experience Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14"
          >
            {/* Left Column: Education */}
            <div className="flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 font-mono">
                  <span className="w-8 h-1 bg-amber-500 rounded"></span> PENDIDIKAN
                </h3>
              </div>

              {/* Retro Institution Spec Card */}
              <div className="relative rounded-2xl bg-neutral-950/90 border border-neutral-800/90 p-6 md:p-7 hover:border-amber-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between flex-1 group">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-500/70 group-hover:border-amber-400 transition-colors"></div>
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-500/70 group-hover:border-amber-400 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-500/70 group-hover:border-amber-400 transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-500/70 group-hover:border-amber-400 transition-colors"></div>

                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-mono">
                    <span className="text-amber-500 font-bold tracking-widest flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]"></span>
                      SEKOLAH MENENGAH KEJURUAN
                    </span>
                    <span className="text-neutral-500">2023 &mdash; 2027</span>
                  </div>

                  <h4 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors mb-2 font-mono">
                    SMK TELKOM SIDOARJO
                  </h4>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-4">
                    <span>JURUSAN: SIJA</span>
                  </div>

                  {/* 1-sentence clean summary */}
                  <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed">
                    Sistem Informatika, Jaringan, dan Aplikasi &mdash; Program kejuruan 4 tahun berbasis integrasi software, jaringan komputer, dan sistem server.
                  </p>

                  {/* 4 Clean Compact Retro Tags Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                    <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 flex items-center gap-2">
                      <span className="text-amber-400 font-bold">[01]</span>
                      <span>Web & Software Dev</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 flex items-center gap-2">
                      <span className="text-amber-400 font-bold">[02]</span>
                      <span>Network Engineering</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 flex items-center gap-2">
                      <span className="text-amber-400 font-bold">[03]</span>
                      <span>Linux & SysAdmin</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 flex items-center gap-2">
                      <span className="text-amber-400 font-bold">[04]</span>
                      <span>IoT Integration</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Metadata Log */}
                <div className="mt-6 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span>LOC: SIDOARJO, ID</span>
                  <span className="text-amber-500/80">TELKOM SCHOOLS</span>
                </div>
              </div>
            </div>

            {/* Right Column: Work Experience */}
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 font-mono">
                  <span className="w-8 h-1 bg-amber-500 rounded"></span> PENGALAMAN KERJA
                </h3>
              </div>

              <div className="relative border-l border-neutral-800 ml-3 space-y-6 pb-2">
                <div className="relative pl-6 group">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b] group-hover:scale-150 transition-transform"></span>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-500 text-xs font-mono font-bold">[EXP_01]</span>
                    <span className="text-neutral-500 text-xs font-mono">Juni 2025</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-neutral-100 mb-1 group-hover:text-amber-400 transition-colors">
                    Proyek Ujian Kenaikan Kelas (UKK)
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-2">
                    Pengembangan website edukasi lingkungan interaktif berbasis HTML, PHP, dan SQL.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["HTML/CSS", "PHP", "MySQL", "UX Copy"].map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="relative pl-6 group">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b] group-hover:scale-150 transition-transform"></span>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-500 text-xs font-mono font-bold">[EXP_02]</span>
                    <span className="text-neutral-500 text-xs font-mono">Mei 2026</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-neutral-100 mb-1 group-hover:text-amber-400 transition-colors">
                    Proyek Digital Talent Program
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-2">
                    Perancangan antarmuka dan alur sistem web Facility Helpdesk untuk pelaporan fasilitas sekolah.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Facility Helpdesk", "System Flow", "UI/UX"].map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="relative pl-6 group">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24] group-hover:scale-150 transition-transform"></span>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-400 text-xs font-mono font-bold">[EXP_03]</span>
                    <span className="text-neutral-400 text-xs font-mono">2026</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-neutral-100 mb-1 group-hover:text-amber-400 transition-colors">
                    Proyek Proposal & Pitch Deck
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-2">
                    Penyusunan narasi problem-solution dan materi pitch deck untuk platform prediksi karir AI.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Pitch Deck", "Value Proposition", "AI Concept"].map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <span className="text-xs font-mono text-amber-400 tracking-[0.2em] uppercase font-bold mb-2 block">
              KARYA PILIHAN
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-amber-50">
              PROYEK
            </h2>
          </motion.div>

          {/* 3-Column Minimalist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {projectsData.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl bg-neutral-950/70 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1.5 shadow-lg"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900/60 border-b border-neutral-800/80">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-mono font-bold text-neutral-300 bg-black/85 border border-neutral-700 px-2.5 py-0.5 rounded shadow-md tracking-wider">
                      CASE // 0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    {/* Category & Year */}
                    <div className="flex items-center justify-between text-xs font-mono mb-3">
                      <span className="text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                        {project.category}
                      </span>
                      <span className="text-neutral-500">{project.year}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-neutral-400 leading-relaxed mb-5">
                      {project.desc}
                    </p>
                  </div>

                  <div>
                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tech.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* GitHub Link */}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-neutral-300 hover:text-amber-400 transition-colors group/link"
                    >
                      <FaGithub className="w-4 h-4 text-neutral-400 group-hover/link:text-amber-400 transition-colors" />
                      <span>Lihat Source Code</span>
                      <span className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-24 px-4 relative z-10 border-t border-neutral-800/50 bg-neutral-950/40">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <span className="text-xs font-mono text-amber-400 tracking-[0.2em] uppercase font-bold mb-2 block">
              SERTIFIKASI & PENGHARGAAN
            </span>
            <motion.h2 
              initial={{ opacity: 0.1, textShadow: "0 0 0px rgba(251,191,36,0)" }}
              whileInView={{ opacity: 1, textShadow: "0 0 20px rgba(251,191,36,0.6)" }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black uppercase tracking-tight text-amber-50"
            >
              SERTIFIKAT
            </motion.h2>
          </motion.div>

          {/* 4-Column Minimalist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificatesData.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedCert({ image: cert.image, title: cert.title })}
                className="rounded-2xl bg-neutral-950/70 border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1.5 shadow-lg"
              >
                {/* Certificate Document Preview */}
                <div className="relative aspect-[1.414] w-full overflow-hidden bg-neutral-900/60 p-3 flex items-center justify-center border-b border-neutral-800/80">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-black/80 px-3 py-1.5 rounded-full border border-amber-500/40 shadow-lg flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" /> Perbesar
                    </span>
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-2 text-neutral-500">
                      <span>{cert.issuer}</span>
                      <span className="text-amber-500/80">{cert.year}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                      {cert.title}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-400 mt-2 font-sans">
                    {cert.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer / Contact */}
      <section id="contact" className="py-20 px-6 relative z-10 border-t border-neutral-800/50 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          {/* Retro Industrial Status Header */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between pb-6 mb-10 border-b border-neutral-800/80 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
              <span className="text-xs font-mono text-neutral-300 font-bold tracking-widest uppercase">
                TERMINAL // TERBUKA UNTUK KOLABORASI & KERJASAMA
              </span>
            </div>
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, "#about")}
              className="text-[11px] font-mono text-neutral-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer bg-neutral-900 border border-neutral-700/80 px-3.5 py-1 rounded-full hover:border-amber-500/40"
            >
              <span>KEMBALI KE ATAS [ ↑ ]</span>
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12"
          >
            {/* Socials & Contact Links */}
            <div className="flex flex-col sm:flex-row gap-12 text-center sm:text-left w-full justify-between">
              <div>
                <h4 className="text-white font-bold mb-4 font-mono">MEDIA SOSIAL</h4>
                <div className="flex flex-col gap-2 text-sm text-neutral-400">
                  <a href="https://github.com/Fardan07" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">GitHub</a>
                  <a href="https://www.linkedin.com/in/muhammad-fardan-5a32a4423/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">LinkedIn</a>
                  <a href="https://www.instagram.com/pardannnn7/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Instagram</a>
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 font-mono">KONTAK</h4>
                <div className="flex flex-col gap-2 text-sm text-neutral-400">
                  <a href="mailto:contact.fardan07@gmail.com" className="hover:text-amber-400 transition-colors break-all">contact.fardan07@gmail.com</a>
                  <p>Sidoarjo, Indonesia</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-neutral-500">
            <p>© {new Date().getFullYear()} MUHAMMAD FARDAN. HAK CIPTA DILINDUNGI.</p>
            <div className="flex gap-6">
              <span className="text-amber-500 font-bold tracking-widest">PORTFOLIO v3.0</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modal / Lightbox for Certificates */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          onClick={() => setSelectedCert(null)}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative w-full max-w-3xl aspect-[1.414] bg-[#050505]/95 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl cursor-default flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Subtle glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent pointer-events-none"></div>
            
            {/* Minimalist Close button */}
            <button 
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-30 text-neutral-500 hover:text-white bg-neutral-900/50 hover:bg-neutral-800 w-8 h-8 rounded-full flex items-center justify-center transition-all border border-neutral-800"
            >
              ✕
            </button>

            {/* Minimalist Title */}
            <div className="absolute top-5 left-6 z-30 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
               <span className="text-xs font-mono text-neutral-300 tracking-wider">
                 {selectedCert.title}
               </span>
            </div>

            <div className="relative w-[85%] h-[80%] mt-8">
              <Image 
                src={selectedCert.image} 
                alt={selectedCert.title} 
                fill 
                className="object-contain" 
              />
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
