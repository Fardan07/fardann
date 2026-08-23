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
  GraduationCap
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
  FaPython,
  FaJava
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

export default function Portfolio() {
  const [selectedCert, setSelectedCert] = useState<{image: string, title: string} | null>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [projectDir, setProjectDir] = useState<number>(1);
  const [activeCert, setActiveCert] = useState(0);
  const [certDir, setCertDir] = useState<number>(1);

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

  const nameControls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // 1. Startup flicker (broken light trying to turn on)
      await nameControls.start({
        opacity: [0.1, 0.1, 0.8, 0.1, 0.9, 0.2, 1],
        textShadow: [
          "0 0 0px rgba(251,191,36,0)",
          "0 0 0px rgba(251,191,36,0)",
          "0 0 20px rgba(251,191,36,0.8)",
          "0 0 0px rgba(251,191,36,0)",
          "0 0 25px rgba(251,191,36,1)",
          "0 0 5px rgba(251,191,36,0.2)",
          "0 0 40px rgba(251,191,36,1)"
        ],
        transition: { duration: 2, times: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1], ease: "linear", delay: 0.5 }
      });
      // 2. Infinite random occasional flickers (like a dying light)
      nameControls.start({
        opacity: [1, 1, 0.5, 0.9, 0.3, 1, 1, 1, 0.6, 1, 1],
        textShadow: [
          "0 0 40px rgba(251,191,36,1)",
          "0 0 40px rgba(251,191,36,1)",
          "0 0 15px rgba(251,191,36,0.5)",
          "0 0 35px rgba(251,191,36,0.9)",
          "0 0 10px rgba(251,191,36,0.3)",
          "0 0 40px rgba(251,191,36,1)",
          "0 0 40px rgba(251,191,36,1)",
          "0 0 40px rgba(251,191,36,1)",
          "0 0 20px rgba(251,191,36,0.6)",
          "0 0 40px rgba(251,191,36,1)",
          "0 0 40px rgba(251,191,36,1)"
        ],
        transition: {
          duration: 10,
          times: [0, 0.4, 0.41, 0.43, 0.45, 0.47, 0.5, 0.8, 0.82, 0.84, 1],
          ease: "linear",
          repeat: Infinity
        }
      });
    };
    sequence();
  }, [nameControls]);


  return (
    <main className="min-h-screen relative bg-transparent text-slate-50 selection:bg-amber-500 selection:text-black overflow-hidden">
      <ScreenPowerOn />
      <FloatingParticles />
      
      {/* Navbar / Top Menu */}
      <nav className="fixed w-full top-0 z-50 px-2 sm:px-6 py-4 flex justify-center items-center backdrop-blur-md bg-[#0a0a0a]/80 border-b border-neutral-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-10 text-[10px] sm:text-xs font-mono tracking-widest text-slate-300">
          <a href="#about" className="hover:text-amber-400 transition-colors font-bold">START</a>
          <a href="#skills" className="hover:text-amber-400 transition-colors font-bold">OPTIONS</a>
          <a href="#projects" className="hover:text-amber-400 transition-colors font-bold">PROJECTS</a>
          <a href="#contact" className="hover:text-amber-400 transition-colors font-bold">EXIT</a>
        </div>
      </nav>

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
            <motion.h1 variants={titleVariants} className="text-huge font-extrabold mb-2 uppercase">
              PORTFOLIO <br className="hidden lg:block"/>
              <span className="text-stroke">2026</span>
            </motion.h1>
            
            <div className="mt-8">
              <motion.h2 variants={itemVariants} className="text-amber-400 font-mono tracking-[0.2em] text-sm mb-2 uppercase">
                Hello, I Am
              </motion.h2>
              {/* Glitch Name Effect */}
              <h3 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="glitch-text-effect" data-text="Muhammad Fardan">
                  Muhammad Fardan
                </span>
              </h3>
              <motion.p variants={itemVariants} className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 min-h-[100px]">
                <Typewriter 
                  text="Hi, I'm Muhammad Fardan. I'm building a portfolio at the end of the year. I learned a lot of things from web development, UI/UX design, and database management. I learned mostly autodidact, and I have skills that I learn from year to year." 
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
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <span className="w-8 h-1 bg-amber-500 rounded"></span> SOFTWARE SKILLS
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                {[
                  { icon: <FaHtml5 className="w-7 h-7 text-neutral-300 group-hover:text-orange-500 transition-colors" />, name: "HTML" },
                  { icon: <FaCss3Alt className="w-7 h-7 text-neutral-300 group-hover:text-blue-500 transition-colors" />, name: "CSS" },
                  { icon: <SiJavascript className="w-7 h-7 text-neutral-300 group-hover:text-yellow-400 transition-colors" />, name: "JS" },
                  { icon: <FaPhp className="w-7 h-7 text-neutral-300 group-hover:text-indigo-400 transition-colors" />, name: "PHP" },
                  { icon: <SiTypescript className="w-7 h-7 text-neutral-300 group-hover:text-blue-400 transition-colors" />, name: "TS" },
                  { icon: <FaPython className="w-7 h-7 text-neutral-300 group-hover:text-yellow-300 transition-colors" />, name: "Python" },
                  { icon: <FaJava className="w-7 h-7 text-neutral-300 group-hover:text-red-500 transition-colors" />, name: "Java" },
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
                    <span className="absolute -top-10 bg-neutral-800 text-amber-400 border border-amber-500/30 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Language */}
            <div>
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <span className="w-8 h-1 bg-neutral-400 rounded"></span> LANGUAGE
              </h3>
              <div className="space-y-8 glass p-8 rounded-2xl border border-neutral-800/50">
                {[
                  { name: "INDONESIA", percent: "95%" },
                  { name: "ENGLISH", percent: "75%" },
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
            className="grid grid-cols-1 md:grid-cols-2 gap-16"
          >
            {/* Left Column: Education */}
            <div>
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <span className="w-8 h-1 bg-amber-600 rounded"></span> EDUCATION
              </h3>
              <div className="relative ml-4 space-y-10 pb-4">
                {/* Background Line */}
                <div className="absolute left-0 top-2 bottom-0 w-[1px] bg-neutral-700/80" />
                {/* Animated Progress Line (SD to SMK) */}
                <motion.div 
                  className="absolute left-0 bottom-0 w-[1px] bg-gradient-to-t from-yellow-400 via-amber-500 to-amber-600 origin-bottom"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  viewport={{ once: true }}
                  style={{ height: "100%" }}
                />
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 }}
                  className="relative pl-8 group"
                >
                  <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-600 shadow-[0_0_10px_#d97706] group-hover:scale-150 transition-transform"></span>
                  <p className="text-amber-600 text-xs font-mono mb-1 font-bold">SMK</p>
                  <h4 className="text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">SMK TELKOM SIDOARJO</h4>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="relative pl-8 group"
                >
                  <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b] group-hover:scale-150 transition-transform"></span>
                  <p className="text-amber-500 text-xs font-mono mb-1 font-bold">SMP</p>
                  <h4 className="text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">SMPN 1 BUDURAN</h4>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0 }}
                  className="relative pl-8 group"
                >
                  <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_10px_#facc15] group-hover:scale-150 transition-transform"></span>
                  <p className="text-yellow-400 text-xs font-mono mb-1 font-bold">SD</p>
                  <h4 className="text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">MI ANNAHDLIYIN</h4>
                </motion.div>
              </div>
            </div>

            {/* Right Column: Work Experience */}
            <div>
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <span className="w-8 h-1 bg-yellow-500 rounded"></span> WORK EXPERIENCE
              </h3>
              <div className="relative border-l border-neutral-700/80 ml-4 space-y-10 pb-4">
                <div className="relative pl-8 group">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-yellow-600 shadow-[0_0_10px_#ca8a04] group-hover:scale-150 transition-transform"></span>
                  <p className="text-yellow-600 text-xs font-mono mb-1 font-bold">Juni 2025</p>
                  <h4 className="text-lg font-bold text-neutral-100 mb-2 group-hover:text-amber-400 transition-colors">Proyek Ujian Kenaikan Kelas</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed text-justify">
                    Mengembangkan website berbasis edukasi, merancang tata letak, alur informasi, dan UX copywriting persuasif untuk platform edukasi lingkungan (artikel, jurnal, dan e-book). Menggunakan HTML, CSS, PHP, dan SQL sebagai sistem pengelolaan data.
                  </p>
                </div>
                
                <div className="relative pl-8 group">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308] group-hover:scale-150 transition-transform"></span>
                  <p className="text-yellow-500 text-xs font-mono mb-1 font-bold">Mei 2026</p>
                  <h4 className="text-lg font-bold text-neutral-100 mb-2 group-hover:text-amber-400 transition-colors">Proyek Ujian Digital Talent Program</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed text-justify">
                    Merancang alur sistem, antarmuka, dan UX Copy pada aplikasi web Facility Helpdesk untuk mendigitalisasi pelaporan fasilitas sekolah, serta mempresentasikan progres proyek langsung di hadapan manajemen industri.
                  </p>
                </div>
                
                <div className="relative pl-8 group">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24] group-hover:scale-150 transition-transform"></span>
                  <p className="text-amber-400 text-xs font-mono mb-1 font-bold">2026</p>
                  <h4 className="text-lg font-bold text-neutral-100 mb-2 group-hover:text-amber-400 transition-colors">Proyek Proposal & Pitch Deck</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed text-justify">
                    Merancang struktur narasi problem-solution, value proposition, dan materi presentasi pitch deck untuk platform prediksi karir berbasis AI.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col items-center text-center"
          >
            <motion.h2 
              initial={{ opacity: 0.1, textShadow: "0 0 0px rgba(251,191,36,0)" }}
              animate={nameControls}
              className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2 text-amber-50"
            >
              RECAP PROJECT 2026
            </motion.h2>
            <p className="text-amber-400 font-mono text-sm">NON AI / REAL CODE</p>
          </motion.div>

          {/* 3D Rotating Project Carousel Container */}
          <div className="relative min-h-[440px] md:min-h-[460px] flex items-center justify-center [perspective:1200px]">
            <AnimatePresence custom={projectDir} mode="wait">
              <motion.div
                key={activeProject}
                custom={projectDir}
                variants={{
                  enter: (dir: number) => ({
                    x: dir > 0 ? 160 : -160,
                    scale: 0.85,
                    opacity: 0,
                    filter: "blur(6px)",
                  }),
                  center: {
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  },
                  exit: (dir: number) => ({
                    x: dir > 0 ? -160 : 160,
                    scale: 0.85,
                    opacity: 0,
                    filter: "blur(6px)",
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ transformStyle: "preserve-3d" }}
                className="w-full max-w-3xl relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950/90 shadow-[0_0_40px_rgba(251,191,36,0.12)] p-6 md:p-10 flex flex-col justify-between min-h-[380px] md:min-h-[420px]"
              >
                {/* Cyberpunk corner markers */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500/70 z-20"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500/70 z-20"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500/70 z-20"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500/70 z-20"></div>

                {/* Project Image Background */}
                <Image 
                  src={[
                    { title: "Admin Dashboard", category: "Web App", desc: "Sistem manajemen tugas & dashboard administrator modern dengan analitik intuitif.", image: "/foto-project/assignment-admindashboard.png", github: "https://github.com/Fardan07/assigment-management" },
                    { title: "Facility Helpdesk", category: "System", desc: "Digitalisasi pelaporan fasilitas sekolah dengan alur tiket terpadu dan UX interaktif.", image: "/foto-project/weblaporfasilitas.png", github: "https://github.com/Fardan07/project_ukl_sija2" },
                    { title: "Web Dinamis", category: "Fullstack", desc: "Platform web edukasi & artikel dinamis berbasis PHP & SQL dengan UX copywriting persuasif.", image: "/foto-project/projectwebdinamis.png", github: "https://github.com/Fardan07/web-dinamis-project" },
                  ][activeProject].image} 
                  alt={[
                    { title: "Admin Dashboard", category: "Web App", desc: "Sistem manajemen tugas & dashboard administrator modern dengan analitik intuitif.", image: "/foto-project/assignment-admindashboard.png", github: "https://github.com/Fardan07/assigment-management" },
                    { title: "Facility Helpdesk", category: "System", desc: "Digitalisasi pelaporan fasilitas sekolah dengan alur tiket terpadu dan UX interaktif.", image: "/foto-project/weblaporfasilitas.png", github: "https://github.com/Fardan07/project_ukl_sija2" },
                    { title: "Web Dinamis", category: "Fullstack", desc: "Platform web edukasi & artikel dinamis berbasis PHP & SQL dengan UX copywriting persuasif.", image: "/foto-project/projectwebdinamis.png", github: "https://github.com/Fardan07/web-dinamis-project" },
                  ][activeProject].title} 
                  fill 
                  className="object-cover opacity-35 hover:opacity-60 transition-opacity duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

                {/* Top Badge Info */}
                <div className="relative z-20 flex justify-between items-center">
                  <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-mono font-bold text-amber-400 backdrop-blur-md rounded-md">
                    {[
                      { title: "Admin Dashboard", category: "Web App", desc: "Sistem manajemen tugas & dashboard administrator modern dengan analitik intuitif.", image: "/foto-project/assignment-admindashboard.png", github: "https://github.com/Fardan07/assigment-management" },
                      { title: "Facility Helpdesk", category: "System", desc: "Digitalisasi pelaporan fasilitas sekolah dengan alur tiket terpadu dan UX interaktif.", image: "/foto-project/weblaporfasilitas.png", github: "https://github.com/Fardan07/project_ukl_sija2" },
                      { title: "Web Dinamis", category: "Fullstack", desc: "Platform web edukasi & artikel dinamis berbasis PHP & SQL dengan UX copywriting persuasif.", image: "/foto-project/projectwebdinamis.png", github: "https://github.com/Fardan07/web-dinamis-project" },
                    ][activeProject].category}
                  </div>
                  <div className="text-xs font-mono text-neutral-400">
                    ITEM <span className="text-amber-400 font-bold">0{activeProject + 1}</span> / 03
                  </div>
                </div>

                {/* Project Content Bottom */}
                <div className="relative z-20 mt-16 md:mt-24">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-mono">
                    {[
                      { title: "Admin Dashboard", category: "Web App", desc: "Sistem manajemen tugas & dashboard administrator modern dengan analitik intuitif.", image: "/foto-project/assignment-admindashboard.png", github: "https://github.com/Fardan07/assigment-management" },
                      { title: "Facility Helpdesk", category: "System", desc: "Digitalisasi pelaporan fasilitas sekolah dengan alur tiket terpadu dan UX interaktif.", image: "/foto-project/weblaporfasilitas.png", github: "https://github.com/Fardan07/project_ukl_sija2" },
                      { title: "Web Dinamis", category: "Fullstack", desc: "Platform web edukasi & artikel dinamis berbasis PHP & SQL dengan UX copywriting persuasif.", image: "/foto-project/projectwebdinamis.png", github: "https://github.com/Fardan07/web-dinamis-project" },
                    ][activeProject].title}
                  </h3>
                  <p className="text-sm text-neutral-300 font-mono max-w-xl mb-6 leading-relaxed">
                    {[
                      { title: "Admin Dashboard", category: "Web App", desc: "Sistem manajemen tugas & dashboard administrator modern dengan analitik intuitif.", image: "/foto-project/assignment-admindashboard.png", github: "https://github.com/Fardan07/assigment-management" },
                      { title: "Facility Helpdesk", category: "System", desc: "Digitalisasi pelaporan fasilitas sekolah dengan alur tiket terpadu dan UX interaktif.", image: "/foto-project/weblaporfasilitas.png", github: "https://github.com/Fardan07/project_ukl_sija2" },
                      { title: "Web Dinamis", category: "Fullstack", desc: "Platform web edukasi & artikel dinamis berbasis PHP & SQL dengan UX copywriting persuasif.", image: "/foto-project/projectwebdinamis.png", github: "https://github.com/Fardan07/web-dinamis-project" },
                    ][activeProject].desc}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-neutral-800/80">
                    <a 
                      href={[
                        { title: "Admin Dashboard", category: "Web App", desc: "Sistem manajemen tugas & dashboard administrator modern dengan analitik intuitif.", image: "/foto-project/assignment-admindashboard.png", github: "https://github.com/Fardan07/assigment-management" },
                        { title: "Facility Helpdesk", category: "System", desc: "Digitalisasi pelaporan fasilitas sekolah dengan alur tiket terpadu dan UX interaktif.", image: "/foto-project/weblaporfasilitas.png", github: "https://github.com/Fardan07/project_ukl_sija2" },
                        { title: "Web Dinamis", category: "Fullstack", desc: "Platform web edukasi & artikel dinamis berbasis PHP & SQL dengan UX copywriting persuasif.", image: "/foto-project/projectwebdinamis.png", github: "https://github.com/Fardan07/web-dinamis-project" },
                      ][activeProject].github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-black bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-full transition-all hover:scale-105 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                    >
                      <FaGithub className="w-4 h-4" /> VIEW CODE
                    </a>

                    <div className="text-[10px] font-mono text-amber-500/70 tracking-widest hidden sm:block">
                      3D_SYSTEM // ROTATED
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
            {/* Direct Jump Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { title: "Admin Dashboard" },
                { title: "Facility Helpdesk" },
                { title: "Web Dinamis" },
              ].map((proj, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setProjectDir(idx > activeProject ? 1 : -1);
                    setActiveProject(idx);
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-full border transition-all ${
                    idx === activeProject 
                      ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold shadow-[0_0_10px_rgba(251,191,36,0.2)]" 
                      : "border-neutral-800 text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  0{idx + 1}. {proj.title}
                </button>
              ))}
            </div>

            {/* Prev/Next Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setProjectDir(-1);
                  setActiveProject((prev) => (prev - 1 + 3) % 3);
                }}
                className="p-3 rounded-full border border-neutral-800 hover:border-amber-500 bg-neutral-900/80 text-neutral-300 hover:text-amber-400 transition-all hover:scale-110 active:scale-95 shadow-md"
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-xs font-mono text-neutral-400 px-2 font-bold">
                <span className="text-amber-400">0{activeProject + 1}</span> / 03
              </div>

              <button
                onClick={() => {
                  setProjectDir(1);
                  setActiveProject((prev) => (prev + 1) % 3);
                }}
                className="p-3 rounded-full border border-neutral-800 hover:border-amber-500 bg-neutral-900/80 text-neutral-300 hover:text-amber-400 transition-all hover:scale-110 active:scale-95 shadow-md"
                aria-label="Next Project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-24 px-4 relative z-10 bg-neutral-900/40 border-t border-neutral-800/50 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col items-center text-center"
          >
            <motion.h2 
              initial={{ opacity: 0.1, textShadow: "0 0 0px rgba(251,191,36,0)" }}
              whileInView={{ opacity: 1, textShadow: "0 0 20px rgba(251,191,36,0.6)" }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2 text-amber-50"
            >
              CERTIFICATES
            </motion.h2>
            <p className="text-amber-400 font-mono text-sm">ACHIEVEMENTS & VALIDATIONS</p>
          </motion.div>

          {/* 3D Rotating Certificate Carousel Container */}
          <div className="relative min-h-[360px] md:min-h-[420px] flex items-center justify-center [perspective:1200px]">
            <AnimatePresence custom={certDir} mode="wait">
              <motion.div
                key={activeCert}
                custom={certDir}
                variants={{
                  enter: (dir: number) => ({
                    x: dir > 0 ? 160 : -160,
                    scale: 0.85,
                    opacity: 0,
                    filter: "blur(6px)",
                  }),
                  center: {
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  },
                  exit: (dir: number) => ({
                    x: dir > 0 ? -160 : 160,
                    scale: 0.85,
                    opacity: 0,
                    filter: "blur(6px)",
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => setSelectedCert({ 
                  image: [
                    { title: "DigiUp Certification", image: "/foto-sertifikat/DigiUp Fardan.png", desc: "Sertifikasi keahlian digital Telkom University." },
                    { title: "ElevAlte Event", image: "/foto-sertifikat/ElevAlte - Fardan.png", desc: "Penghargaan partisipasi pada event ElevAlte." },
                    { title: "FicpactCup", image: "/foto-sertifikat/FicpactCup - Fardan.jpeg", desc: "Prestasi dan keikutsertaan kompetisi FicpactCup." },
                    { title: "Sefest", image: "/foto-sertifikat/Sefest - Fardan.png", desc: "Sertifikat penghargaan Sefest Exhibition." },
                  ][activeCert].image, 
                  title: [
                    { title: "DigiUp Certification", image: "/foto-sertifikat/DigiUp Fardan.png", desc: "Sertifikasi keahlian digital Telkom University." },
                    { title: "ElevAlte Event", image: "/foto-sertifikat/ElevAlte - Fardan.png", desc: "Penghargaan partisipasi pada event ElevAlte." },
                    { title: "FicpactCup", image: "/foto-sertifikat/FicpactCup - Fardan.jpeg", desc: "Prestasi dan keikutsertaan kompetisi FicpactCup." },
                    { title: "Sefest", image: "/foto-sertifikat/Sefest - Fardan.png", desc: "Sertifikat penghargaan Sefest Exhibition." },
                  ][activeCert].title 
                })}
                className="w-full max-w-3xl aspect-[1.5] relative rounded-xl overflow-hidden border border-amber-500/40 bg-neutral-950 p-4 md:p-8 cursor-pointer group shadow-[0_0_40px_rgba(251,191,36,0.15)] flex items-center justify-center"
              >
                {/* Cyberpunk corner markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500 group-hover:border-amber-300 transition-colors z-20"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500 group-hover:border-amber-300 transition-colors z-20"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500 group-hover:border-amber-300 transition-colors z-20"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500 group-hover:border-amber-300 transition-colors z-20"></div>
                
                {/* Tech label */}
                <div className="absolute top-3 right-3 bg-amber-500/20 border border-amber-500/40 px-2 py-1 text-[8px] md:text-[10px] font-mono font-bold text-amber-400 z-20 rounded">
                  VERIFIED // CLICK TO ENLARGE
                </div>

                <div className="relative w-full h-full z-10">
                  <Image 
                    src={[
                      { title: "DigiUp Certification", image: "/foto-sertifikat/DigiUp Fardan.png", desc: "Sertifikasi keahlian digital Telkom University." },
                      { title: "ElevAlte Event", image: "/foto-sertifikat/ElevAlte - Fardan.png", desc: "Penghargaan partisipasi pada event ElevAlte." },
                      { title: "FicpactCup", image: "/foto-sertifikat/FicpactCup - Fardan.jpeg", desc: "Prestasi dan keikutsertaan kompetisi FicpactCup." },
                      { title: "Sefest", image: "/foto-sertifikat/Sefest - Fardan.png", desc: "Sertifikat penghargaan Sefest Exhibition." },
                    ][activeCert].image} 
                    alt={[
                      { title: "DigiUp Certification", image: "/foto-sertifikat/DigiUp Fardan.png", desc: "Sertifikasi keahlian digital Telkom University." },
                      { title: "ElevAlte Event", image: "/foto-sertifikat/ElevAlte - Fardan.png", desc: "Penghargaan partisipasi pada event ElevAlte." },
                      { title: "FicpactCup", image: "/foto-sertifikat/FicpactCup - Fardan.jpeg", desc: "Prestasi dan keikutsertaan kompetisi FicpactCup." },
                      { title: "Sefest", image: "/foto-sertifikat/Sefest - Fardan.png", desc: "Sertifikat penghargaan Sefest Exhibition." },
                    ][activeCert].title} 
                    fill 
                    className="object-contain opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500" 
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-20">
                   <h3 className="text-xl md:text-2xl font-bold text-amber-400 font-mono translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     {[
                       { title: "DigiUp Certification", image: "/foto-sertifikat/DigiUp Fardan.png", desc: "Sertifikasi keahlian digital Telkom University." },
                       { title: "ElevAlte Event", image: "/foto-sertifikat/ElevAlte - Fardan.png", desc: "Penghargaan partisipasi pada event ElevAlte." },
                       { title: "FicpactCup", image: "/foto-sertifikat/FicpactCup - Fardan.jpeg", desc: "Prestasi dan keikutsertaan kompetisi FicpactCup." },
                       { title: "Sefest", image: "/foto-sertifikat/Sefest - Fardan.png", desc: "Sertifikat penghargaan Sefest Exhibition." },
                     ][activeCert].title}
                   </h3>
                   <p className="text-xs text-neutral-200 font-mono mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 border-l-2 border-amber-500 pl-2 leading-relaxed">
                     {[
                       { title: "DigiUp Certification", image: "/foto-sertifikat/DigiUp Fardan.png", desc: "Sertifikasi keahlian digital Telkom University." },
                       { title: "ElevAlte Event", image: "/foto-sertifikat/ElevAlte - Fardan.png", desc: "Penghargaan partisipasi pada event ElevAlte." },
                       { title: "FicpactCup", image: "/foto-sertifikat/FicpactCup - Fardan.jpeg", desc: "Prestasi dan keikutsertaan kompetisi FicpactCup." },
                       { title: "Sefest", image: "/foto-sertifikat/Sefest - Fardan.png", desc: "Sertifikat penghargaan Sefest Exhibition." },
                     ][activeCert].desc}
                   </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
            {/* Direct Jump Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { title: "DigiUp" },
                { title: "ElevAlte" },
                { title: "FicpactCup" },
                { title: "Sefest" },
              ].map((cert, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCertDir(idx > activeCert ? 1 : -1);
                    setActiveCert(idx);
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-full border transition-all ${
                    idx === activeCert 
                      ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold shadow-[0_0_10px_rgba(251,191,36,0.2)]" 
                      : "border-neutral-800 text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  0{idx + 1}. {cert.title}
                </button>
              ))}
            </div>

            {/* Prev/Next Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCertDir(-1);
                  setActiveCert((prev) => (prev - 1 + 4) % 4);
                }}
                className="p-3 rounded-full border border-neutral-800 hover:border-amber-500 bg-neutral-900/80 text-neutral-300 hover:text-amber-400 transition-all hover:scale-110 active:scale-95 shadow-md"
                aria-label="Previous Certificate"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-xs font-mono text-neutral-400 px-2 font-bold">
                <span className="text-amber-400">0{activeCert + 1}</span> / 04
              </div>

              <button
                onClick={() => {
                  setCertDir(1);
                  setActiveCert((prev) => (prev + 1) % 4);
                }}
                className="p-3 rounded-full border border-neutral-800 hover:border-amber-500 bg-neutral-900/80 text-neutral-300 hover:text-amber-400 transition-all hover:scale-110 active:scale-95 shadow-md"
                aria-label="Next Certificate"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Footer / Contact */}
      <section id="contact" className="py-20 px-6 relative z-10 border-t border-neutral-800/50 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12"
          >
            {/* Socials & Contact Links */}
            <div className="flex flex-col sm:flex-row gap-12 text-center sm:text-left w-full justify-between">
              <div>
                <h4 className="text-white font-bold mb-4 font-mono">SOCIALS</h4>
                <div className="flex flex-col gap-2 text-sm text-neutral-400">
                  <a href="https://github.com/Fardan07" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">GitHub</a>
                  <a href="https://www.linkedin.com/in/muhammad-fardan-5a32a4423/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">LinkedIn</a>
                  <a href="https://www.instagram.com/pardannnn7/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Instagram</a>
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 font-mono">CONTACT</h4>
                <div className="flex flex-col gap-2 text-sm text-neutral-400">
                  <a href="mailto:contact.fardan07@gmail.com" className="hover:text-amber-400 transition-colors break-all">contact.fardan07@gmail.com</a>
                  <p>Sidoarjo, Indonesia</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-neutral-500">
            <p>© {new Date().getFullYear()} MUHAMMAD FARDAN. ALL RIGHTS RESERVED.</p>
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
