"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useVelocity,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { Mail, Maximize2, ArrowUpRight, GripHorizontal } from "lucide-react";
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
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiMysql,
  SiLaravel,
} from "react-icons/si";
import Image from "next/image";

/**
 * Client-side Two-Background Alpha Matting Canvas:
 * Compares `/fardanportofolio - Diedit.png` (grey studio bg) with
 * `/fardantanpabackground.png` (white bg) to extract a 100% solid opaque
 * subject silhouette (head, chin, neck, and jacket collar) with zero background
 * and zero white halo on hair strands.
 */
const CutoutPortraitCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isCancelled = false;
    const imgGrey = new window.Image();
    const imgWhite = new window.Image();
    imgGrey.crossOrigin = "anonymous";
    imgWhite.crossOrigin = "anonymous";

    let loadedCount = 0;
    const onBothLoaded = () => {
      if (isCancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // Retina resolution buffer matching exact isotropic aspect ratio (1664 : 1920 = 1 : 1.154)
      // Covers top of hair (y=80) down to full neck, tee neckline & jacket shoulders (y=2000)
      const outW = 540;
      const outH = 623;
      canvas.width = outW;
      canvas.height = outH;

      const sx = 0;
      const sy = 80;
      const sw = imgGrey.naturalWidth || 1664;
      const sh = 1920;

      const offG = document.createElement("canvas");
      offG.width = outW;
      offG.height = outH;
      const ctxG = offG.getContext("2d", { willReadFrequently: true });

      const offW = document.createElement("canvas");
      offW.width = outW;
      offW.height = outH;
      const ctxW = offW.getContext("2d", { willReadFrequently: true });

      if (!ctxG || !ctxW) return;

      ctxG.drawImage(imgGrey, sx, sy, sw, sh, 0, 0, outW, outH);
      ctxW.drawImage(imgWhite, sx, sy, sw, sh, 0, 0, outW, outH);

      const dataG = ctxG.getImageData(0, 0, outW, outH);
      const dataW = ctxW.getImageData(0, 0, outW, outH);
      const outImg = ctx.createImageData(outW, outH);

      const gBuf = dataG.data;
      const wBuf = dataW.data;
      const oBuf = outImg.data;

      for (let i = 0; i < gBuf.length; i += 4) {
        const pxIndex = i >> 2;
        const py = Math.floor(pxIndex / outW);

        const rG = gBuf[i];
        const gG = gBuf[i + 1];
        const bG = gBuf[i + 2];

        const rW = wBuf[i];
        const gW = wBuf[i + 1];
        const bW = wBuf[i + 2];

        const lumG = 0.299 * rG + 0.587 * gG + 0.114 * bG;
        const lumW = 0.299 * rW + 0.587 * gW + 0.114 * bW;

        // Background pixels differ strongly between white-bg and grey-bg versions;
        // subject pixels (face, eyes, neck, hair, jacket) are identical (diff ~ 0).
        const diff = lumW - lumG;

        let alpha = 255;
        if (diff >= 42) {
          alpha = 0;
        } else if (diff > 10) {
          alpha = Math.round(((42 - diff) / 32) * 255);
        }

        if (alpha === 0) {
          oBuf[i + 3] = 0;
          continue;
        }

        // Subtle dark shading near the very bottom edge (last 8%) so jacket grounds smoothly
        let bottomShade = 1;
        if (py > outH * 0.92) {
          const t = (py - outH * 0.92) / (outH * 0.08);
          bottomShade = 1 - t * 0.22;
        }

        // Clean high-contrast studio grayscale from the un-haloed grey-bg source
        const contrasted = Math.max(
          0,
          Math.min(
            255,
            Math.round(((lumG - 128) * 1.14 + 128) * bottomShade)
          )
        );

        oBuf[i] = contrasted;
        oBuf[i + 1] = contrasted;
        oBuf[i + 2] = contrasted;
        oBuf[i + 3] = alpha;
      }

      ctx.putImageData(outImg, 0, 0);
    };

    const handleLoad = () => {
      loadedCount += 1;
      if (loadedCount === 2) onBothLoaded();
    };

    imgGrey.onload = handleLoad;
    imgWhite.onload = handleLoad;
    imgGrey.src = "/fardanportofolio - Diedit.png";
    imgWhite.src = "/fardantanpabackground.png";

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Muhammad Fardan"
      className="w-full h-full object-fill pointer-events-none select-none [filter:drop-shadow(0_6px_14px_rgba(0,0,0,0.45))]"
    />
  );
};

const InteractiveLanyardCard = () => {
  const [isDragging, setIsDragging] = useState(false);
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Raw target displacement from resting equilibrium (0, 0)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Subtle 3D hover tilt motion values (when cursor moves over card)
  const hoverTiltX = useMotionValue(0);
  const hoverTiltY = useMotionValue(0);

  // Smooth elastic pendulum spring physics (stiffness: 110, damping: 12, mass: 1)
  const pendulumSpring = { stiffness: 110, damping: 12, mass: 1 };
  const x = useSpring(rawX, pendulumSpring);
  const y = useSpring(rawY, pendulumSpring);

  // Real-time velocity tracking for realistic momentum swing
  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  // Natural resting tilt (-1.5deg) + position & velocity pendulum swing
  const targetRotateZ = useTransform(
    [x, xVelocity],
    ([latestX, latestVx]: number[]) => {
      const baseTilt = -1.5;
      const posAngle = -(latestX as number) * 0.09;
      const velAngle = Math.max(
        -20,
        Math.min(20, -(latestVx as number) * 0.014)
      );
      return Math.max(-30, Math.min(30, baseTilt + posAngle + velAngle));
    }
  );
  const rotateZ = useSpring(targetRotateZ, {
    stiffness: 110,
    damping: 12,
    mass: 1,
  });

  // 3D pitch (rotateX) and yaw (rotateY) from drag + velocity + pointer hover
  const targetRotateX = useTransform(
    [y, yVelocity, hoverTiltX],
    ([latestY, latestVy, hX]: number[]) => {
      const dragPitch = -(latestY as number) * 0.05;
      const velPitch = Math.max(
        -10,
        Math.min(10, -(latestVy as number) * 0.006)
      );
      return Math.max(
        -22,
        Math.min(22, dragPitch + velPitch + (hX as number))
      );
    }
  );
  const targetRotateY = useTransform(
    [x, xVelocity, hoverTiltY],
    ([latestX, latestVx, hY]: number[]) => {
      const dragYaw = (latestX as number) * 0.07;
      const velYaw = Math.max(
        -12,
        Math.min(12, (latestVx as number) * 0.008)
      );
      return Math.max(-24, Math.min(24, dragYaw + velYaw + (hY as number)));
    }
  );

  const rotateX = useSpring(targetRotateX, {
    stiffness: 110,
    damping: 12,
    mass: 1,
  });
  const rotateY = useSpring(targetRotateY, {
    stiffness: 110,
    damping: 12,
    mass: 1,
  });

  // Subtle specular glare position across the card base
  const glareX = useTransform(
    [x, rotateY],
    ([lx, ry]: number[]) => 50 + (lx as number) * 0.18 + (ry as number) * 1.4
  );
  const glareY = useTransform(
    [y, rotateX],
    ([ly, rx]: number[]) => 35 + (ly as number) * 0.15 - (rx as number) * 1.4
  );
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%)`;

  // SVG Coordinate System: viewBox="0 0 400 680"
  // Anchor mounted at very top ceiling: center (200, 0)
  // Longer lanyard drop — resting clasp joint at: (200, 195)
  const claspY = useTransform(y, (val) => Math.max(55, 195 + val));

  // Cubic Bezier control points for fluid, long-radius lanyard straps
  const c1LeftX = useTransform(x, (val) => 176 + val * 0.22);
  const c1LeftY = useTransform(y, (val) => 70 + Math.max(-25, val * 0.25));
  const c2LeftX = useTransform(x, (val) => 188 + val * 0.68);
  const c2LeftY = useTransform(y, (val) => 140 + val * 0.65);
  const endLeftX = useTransform(x, (val) => 195 + val);

  const c1RightX = useTransform(x, (val) => 224 + val * 0.22);
  const c1RightY = useTransform(y, (val) => 70 + Math.max(-25, val * 0.25));
  const c2RightX = useTransform(x, (val) => 212 + val * 0.68);
  const c2RightY = useTransform(y, (val) => 140 + val * 0.65);
  const endRightX = useTransform(x, (val) => 205 + val);

  const leftStrapPath = useMotionTemplate`M 172 -4 C ${c1LeftX} ${c1LeftY}, ${c2LeftX} ${c2LeftY}, ${endLeftX} ${claspY}`;
  const rightStrapPath = useMotionTemplate`M 228 -4 C ${c1RightX} ${c1RightY}, ${c2RightX} ${c2RightY}, ${endRightX} ${claspY}`;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    hoverTiltX.set(0);
    hoverTiltY.set(0);
    pointerStartRef.current = {
      x: e.clientX - rawX.get(),
      y: e.clientY - rawY.get(),
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const deltaX = e.clientX - pointerStartRef.current.x;
      const deltaY = e.clientY - pointerStartRef.current.y;

      const clampedX = Math.max(-190, Math.min(190, deltaX * 0.92));
      const clampedY = Math.max(-115, Math.min(200, deltaY * 0.92));

      rawX.set(clampedX);
      rawY.set(clampedY);
      return;
    }

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      hoverTiltX.set(-relY * 12);
      hoverTiltY.set(relX * 14);
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      hoverTiltX.set(0);
      hoverTiltY.set(0);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div className="relative w-full max-w-[400px] h-[680px] mx-auto flex flex-col items-center select-none">
      {/* Top Ceiling Anchor Hardware */}
      <div className="relative z-20 flex flex-col items-center">
        <div className="w-20 h-2.5 bg-gradient-to-b from-neutral-800 to-neutral-950 border-x border-b border-white/15 rounded-b-lg shadow-[0_6px_20px_rgba(0,0,0,0.8)] flex items-center justify-between px-2.5">
          <span className="w-1 h-1 rounded-full bg-neutral-500 shadow-inner" />
          <span className="text-[7px] font-mono tracking-widest text-neutral-400">
            MNT-07
          </span>
          <span className="w-1 h-1 rounded-full bg-neutral-500 shadow-inner" />
        </div>
      </div>

      {/* Dynamic 60fps SVG Lanyard Ribbon Assembly */}
      <svg
        viewBox="0 0 400 680"
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
      >
        <defs>
          <linearGradient id="strapFabricLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f0f12" />
            <stop offset="50%" stopColor="#1c1c21" />
            <stop offset="100%" stopColor="#121215" />
          </linearGradient>
          <linearGradient id="strapFabricRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#141418" />
            <stop offset="50%" stopColor="#242429" />
            <stop offset="100%" stopColor="#101013" />
          </linearGradient>
          <filter id="strapDropShadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.65" />
          </filter>
        </defs>

        {/* Left Lanyard Strap */}
        <g filter="url(#strapDropShadow)">
          <motion.path
            d={leftStrapPath}
            fill="none"
            stroke="#09090b"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <motion.path
            d={leftStrapPath}
            fill="none"
            stroke="url(#strapFabricLeft)"
            strokeWidth="13.5"
            strokeLinecap="round"
          />
          <motion.path
            d={leftStrapPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="8.5"
            strokeDasharray="2 5"
          />
        </g>

        {/* Right Lanyard Strap */}
        <g filter="url(#strapDropShadow)">
          <motion.path
            d={rightStrapPath}
            fill="none"
            stroke="#09090b"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <motion.path
            d={rightStrapPath}
            fill="none"
            stroke="url(#strapFabricRight)"
            strokeWidth="13.5"
            strokeLinecap="round"
          />
          <motion.path
            d={rightStrapPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="8.5"
            strokeDasharray="2 5"
          />
        </g>
      </svg>

      {/* Interactive Pendulum Graphic Badge + Metallic Clip Assembly */}
      <motion.div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        style={{
          x,
          y,
          rotateZ,
          rotateX,
          rotateY,
          transformOrigin: "top center",
          transformPerspective: 1200,
        }}
        className={`relative z-20 mt-[168px] flex flex-col items-center touch-none will-change-transform ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Metallic Clip / Clasp overlapping the top slot */}
        <div className="flex flex-col items-center -mb-4 z-30 pointer-events-none">
          <div className="w-7 h-2 rounded-t-sm bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-400 border border-neutral-500 shadow-xs" />
          <div className="w-6 h-7 rounded-b-sm bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-400 border border-neutral-500 shadow-[0_5px_10px_rgba(0,0,0,0.45)] flex flex-col items-center justify-between py-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-400 border border-neutral-500 shadow-inner" />
            <div className="w-4 h-[1.5px] bg-neutral-600/60" />
          </div>
        </div>

        {/* Graphic Badge White Card (w-[268px]) */}
        <div
          className="relative w-[268px] rounded-[19px] bg-[#f4f4f5] text-[#0a0a0a] p-3.5 pt-2.5 pb-3.5 shadow-[0_26px_55px_-12px_rgba(0,0,0,0.9),0_4px_14px_rgba(0,0,0,0.45)] border border-white/90 overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(130deg, rgba(255,255,255,0.92) 0%, rgba(244,244,245,0.5) 40%, rgba(228,228,231,0.65) 55%, rgba(244,244,245,0.95) 100%)
            `,
          }}
        >
          {/* Subtle Specular Glare on Card Base Only (z-0) */}
          <motion.div
            style={{ background: glareBackground }}
            className="absolute inset-0 pointer-events-none z-0"
          />

          {/* Top Oval Punch Slot */}
          <div className="relative z-10 w-10 h-2.5 mx-auto mb-2 rounded-full bg-[#18181b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]" />

          {/* 1. HEADER ROW: Stacked Tilted Red Labels (Left) + Condensed Number (Right) */}
          <div className="relative z-20 flex items-start justify-between mb-2.5">
            {/* Left: Two Stacked Red Labels ("SMK" / "TELKOM") */}
            <div className="flex flex-col items-start gap-0.5 -rotate-2">
              <div className="bg-[#dc2626] text-white px-2.5 py-0.5 shadow-xs">
                <span className="block text-[12px] font-black uppercase tracking-[0.15em] leading-tight">
                  SMK
                </span>
              </div>
              <div className="bg-[#dc2626] text-white px-2.5 py-0.5 shadow-xs">
                <span className="block text-[12px] font-black uppercase tracking-[0.13em] leading-tight">
                  TELKOM
                </span>
              </div>
            </div>

            {/* Right: Bold Condensed Black Number ("07.26") */}
            <div className="text-[36px] font-black tracking-tighter text-neutral-950 leading-[0.84] scale-y-110 origin-top-right">
              07.26
            </div>
          </div>

          {/* 2. CENTER PHOTO AREA: Isotropic Frame (h-[258px]) + Pop-Out Hair Top + Full Edge-to-Edge Shoulders */}
          <div className="relative z-20 mb-2.5">
            {/* Layer Belakang (z-0): Red Box with 2px Solid Black Border + 3D Perspective Wireframe Grid */}
            <div className="relative w-full h-[258px] bg-[#dc2626] border-2 border-neutral-950 overflow-hidden">
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,#ef4444_0%,#dc2626_65%,#b91c1c_100%)]">
                <svg
                  viewBox="0 0 300 320"
                  className="w-full h-full pointer-events-none"
                  fill="none"
                >
                  {/* Perspective depth rectangles */}
                  <rect
                    x="66"
                    y="54"
                    width="168"
                    height="212"
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="1"
                  />
                  <rect
                    x="42"
                    y="32"
                    width="216"
                    height="256"
                    stroke="rgba(255,255,255,0.32)"
                    strokeWidth="0.9"
                  />
                  <rect
                    x="18"
                    y="14"
                    width="264"
                    height="292"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="0.8"
                  />
                  {/* Back wall vertical grid lines */}
                  <line x1="100" y1="54" x2="100" y2="266" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="134" y1="54" x2="134" y2="266" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="166" y1="54" x2="166" y2="266" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="200" y1="54" x2="200" y2="266" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  {/* Back wall horizontal grid lines */}
                  <line x1="66" y1="96" x2="234" y2="96" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="66" y1="138" x2="234" y2="138" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="66" y1="180" x2="234" y2="180" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="66" y1="222" x2="234" y2="222" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  {/* Corner perspective rays */}
                  <line x1="0" y1="0" x2="66" y2="54" stroke="rgba(255,255,255,0.52)" strokeWidth="1.1" />
                  <line x1="300" y1="0" x2="234" y2="54" stroke="rgba(255,255,255,0.52)" strokeWidth="1.1" />
                  <line x1="0" y1="320" x2="66" y2="266" stroke="rgba(255,255,255,0.52)" strokeWidth="1.1" />
                  <line x1="300" y1="320" x2="234" y2="266" stroke="rgba(255,255,255,0.52)" strokeWidth="1.1" />
                  {/* Side & ceiling perspective rays */}
                  <line x1="0" y1="80" x2="66" y2="96" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="0" y1="160" x2="66" y2="160" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="0" y1="240" x2="66" y2="222" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="300" y1="80" x2="234" y2="96" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="300" y1="160" x2="234" y2="160" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="300" y1="240" x2="234" y2="222" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="80" y1="0" x2="100" y2="54" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="150" y1="0" x2="150" y2="54" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                  <line x1="220" y1="0" x2="200" y2="54" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
                </svg>
              </div>
            </div>

            {/* Layer Depan (z-10): Solid Cutout Portrait (1:1 isotropic fit from left border to right border, pop-out at top) */}
            <div className="absolute -top-3.5 bottom-[2px] inset-x-[2px] z-10 overflow-hidden pointer-events-none">
              <CutoutPortraitCanvas />
            </div>
          </div>

          {/* 3. MIDDLE POSTER TYPOGRAPHY SECTION */}
          <div className="relative z-20 flex items-stretch justify-between gap-1.5 mb-2.5">
            {/* Left Group: 4-Line Bold Black Name + 2 Vertical Badges */}
            <div className="flex items-stretch gap-1 shrink-0">
              <div className="flex flex-col justify-between text-left font-black uppercase text-neutral-950 text-[12.5px] leading-[1.03] tracking-tight">
                <span>MUHAMMAD</span>
                <span>FARDAN</span>
                <span>TELKOM</span>
                <span>SIDOARJO</span>
              </div>

              {/* 2 Vertical Badges ("FRONTEND" Red & "BACKEND" Black) */}
              <div className="flex items-stretch gap-0.5 shrink-0">
                <div className="bg-[#dc2626] text-white px-1 py-0.5 flex items-center justify-center">
                  <span className="text-[7px] font-black uppercase tracking-[0.1em] leading-none [writing-mode:vertical-rl] rotate-180">
                    FRONTEND
                  </span>
                </div>
                <div className="bg-neutral-950 text-white px-1 py-0.5 flex items-center justify-center">
                  <span className="text-[7px] font-black uppercase tracking-[0.1em] leading-none [writing-mode:vertical-rl] rotate-180">
                    BACKEND
                  </span>
                </div>
              </div>
            </div>

            {/* Right Group: Display Text ("FARDAN" Black / "WEB DEV" Red) */}
            <div className="flex-1 flex flex-col justify-between text-right leading-[0.85] overflow-hidden">
              <span className="block text-[29px] font-black uppercase tracking-tighter text-neutral-950 scale-y-110 origin-top-right">
                FARDAN
              </span>
              <span className="block text-[25px] font-black uppercase tracking-tighter text-[#dc2626] scale-y-110 origin-bottom-right">
                WEB DEV
              </span>
            </div>
          </div>

          {/* 4. BOTTOM FOOTER SECTION (Wide Black Quote/Barcode Box + Split Square SIJA/26 Box) */}
          <div className="relative z-20 grid grid-cols-12 gap-1.5 items-stretch">
            {/* Left: Wide Black Box with 4-Line Technical Copy + Bottom-Right White Barcode */}
            <div className="col-span-8 bg-neutral-950 text-white p-2 flex flex-col justify-between relative overflow-hidden">
              <div className="text-[7.2px] font-mono font-extrabold uppercase leading-[1.28] tracking-wide text-white text-left">
                <div>SISWA SIJA SMK TELKOM</div>
                <div>SIDOARJO, FOKUS PADA</div>
                <div>WEB MODERN REACT,</div>
                <div>NEXT.JS &amp; BACKEND.</div>
              </div>

              {/* White Barcode + Serial Code at Bottom-Right of Black Box */}
              <div className="self-end mt-1 flex flex-col items-end">
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-24 text-white"
                  viewBox="0 0 110 18"
                  fill="currentColor"
                >
                  <rect x="0" y="0" width="2" height="18" />
                  <rect x="4" y="0" width="1" height="18" />
                  <rect x="7" y="0" width="3" height="18" />
                  <rect x="12" y="0" width="1" height="18" />
                  <rect x="15" y="0" width="2.5" height="18" />
                  <rect x="20" y="0" width="1" height="18" />
                  <rect x="23" y="0" width="3.5" height="18" />
                  <rect x="29" y="0" width="1.5" height="18" />
                  <rect x="33" y="0" width="1" height="18" />
                  <rect x="36" y="0" width="3" height="18" />
                  <rect x="41" y="0" width="1.5" height="18" />
                  <rect x="45" y="0" width="2.5" height="18" />
                  <rect x="50" y="0" width="1" height="18" />
                  <rect x="53" y="0" width="3.5" height="18" />
                  <rect x="59" y="0" width="1.5" height="18" />
                  <rect x="63" y="0" width="1" height="18" />
                  <rect x="66" y="0" width="3" height="18" />
                  <rect x="71" y="0" width="1.5" height="18" />
                  <rect x="75" y="0" width="2.5" height="18" />
                  <rect x="80" y="0" width="1" height="18" />
                  <rect x="83" y="0" width="3" height="18" />
                  <rect x="88" y="0" width="1.5" height="18" />
                  <rect x="92" y="0" width="2" height="18" />
                  <rect x="96" y="0" width="1" height="18" />
                  <rect x="99" y="0" width="3.5" height="18" />
                  <rect x="105" y="0" width="1.5" height="18" />
                  <rect x="108" y="0" width="2" height="18" />
                </svg>
                <span className="text-[5.5px] font-mono font-bold tracking-[0.24em] text-neutral-300 mt-0.5">
                  07062026
                </span>
              </div>
            </div>

            {/* Right: Split Square Box (Top Black "SIJA" / Bottom White with Thick Black Border "26") */}
            <div className="col-span-4 border-2 border-neutral-950 flex flex-col items-stretch justify-between bg-[#f4f4f5]">
              <div className="bg-neutral-950 text-white py-1 flex items-center justify-center">
                <span className="text-[13px] font-black uppercase tracking-[0.18em] leading-none">
                  SIJA
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center py-0.5">
                <span className="text-[30px] font-black text-neutral-950 leading-none tracking-tighter">
                  26
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <p className="mt-3.5 text-[11px] font-mono text-neutral-400 tracking-wide flex items-center gap-1.5">
        <GripHorizontal className="w-3.5 h-3.5 text-[#dc2626]" />
        <span>Tarik dan lepaskan kartu ID untuk mengayunkan</span>
      </p>
    </div>
  );
};

const projectsData = [
  {
    title: "Admin Dashboard",
    category: "Web Application",
    year: "2025",
    desc: "Dashboard manajemen tugas dengan tabel analitik, filter penugasan, dan pengaturan hak akses pengguna.",
    tech: ["HTML5", "Tailwind CSS", "JavaScript", "REST API"],
    image: "/foto-project/assignment-admindashboard.png",
    github: "https://github.com/Fardan07/assigment-management",
  },
  {
    title: "Facility Helpdesk",
    category: "Internal System",
    year: "2026",
    desc: "Aplikasi pelaporan kerusakan fasilitas sekolah berbasis tiket dengan pelacakan status perbaikan.",
    tech: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    image: "/foto-project/weblaporfasilitas.png",
    github: "https://github.com/Fardan07/project_ukl_sija2",
  },
  {
    title: "Web Dinamis Edukasi",
    category: "Fullstack Platform",
    year: "2025",
    desc: "Portal artikel dan modul edukasi lingkungan dengan manajemen konten berbasis PHP dan database relasional MySQL.",
    tech: ["HTML/CSS", "PHP", "MySQL"],
    image: "/foto-project/projectwebdinamis.png",
    github: "https://github.com/Fardan07/web-dinamis-project",
  },
];

const certificatesData = [
  {
    title: "DigiUp Certification",
    issuer: "Telkom University",
    year: "2025",
    category: "Sertifikasi Kompetensi Digital",
    image: "/foto-sertifikat/DigiUp Fardan.png",
  },
  {
    title: "ElevAlte Event",
    issuer: "ElevAlte Exhibition",
    year: "2025",
    category: "Workshop & Ekshibisi Teknologi",
    image: "/foto-sertifikat/ElevAlte - Fardan.png",
  },
  {
    title: "FicpactCup Competition",
    issuer: "Ficpact Tech Committee",
    year: "2025",
    category: "Kompetisi Pengembangan Web",
    image: "/foto-sertifikat/FicpactCup - Fardan.jpeg",
  },
  {
    title: "Sefest Exhibition",
    issuer: "Sefest Organization",
    year: "2025",
    category: "Pameran Proyek Perangkat Lunak",
    image: "/foto-sertifikat/Sefest - Fardan.png",
  },
];

export default function Portfolio() {
  const [selectedCert, setSelectedCert] = useState<{
    image: string;
    title: string;
  } | null>(null);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (!target) return;

    const win = window as unknown as {
      lenis?: {
        scrollTo: (
          target: Element,
          options: {
            offset: number;
            duration: number;
            easing: (t: number) => number;
          }
        ) => void;
      };
    };

    if (typeof window !== "undefined" && win.lenis) {
      win.lenis.scrollTo(target, {
        offset: -40,
        duration: 1.1,
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
    <main className="min-h-screen relative bg-transparent text-neutral-100 selection:bg-[#dc2626] selection:text-white overflow-x-hidden">
      {/* Clean Top Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0c]/75 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, "#about")}
            className="text-xs font-mono font-bold tracking-wider text-neutral-100 hover:text-[#ef4444] transition-colors"
          >
            M.FARDAN
          </a>

          <nav className="flex items-center gap-4 sm:gap-6 text-xs font-mono text-neutral-400">
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, "#about")}
              className="hover:text-neutral-100 transition-colors"
            >
              Profil
            </a>
            <a
              href="#skills"
              onClick={(e) => scrollToSection(e, "#skills")}
              className="hover:text-neutral-100 transition-colors"
            >
              Keahlian
            </a>
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, "#projects")}
              className="hover:text-neutral-100 transition-colors"
            >
              Proyek
            </a>
            <a
              href="#certificates"
              onClick={(e) => scrollToSection(e, "#certificates")}
              className="hover:text-neutral-100 transition-colors hidden sm:inline"
            >
              Sertifikat
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="hover:text-neutral-100 transition-colors"
            >
              Kontak
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section (Lanyard hangs directly from top ceiling right under the 56px navbar) */}
      <section
        id="about"
        className="min-h-screen flex items-start lg:items-center justify-center px-4 sm:px-6 pt-14 pb-16 border-b border-white/10"
      >
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Direct Technical Bio */}
          <div className="lg:col-span-7 text-left order-2 lg:order-1 pt-4 lg:pt-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-900/70 backdrop-blur-md text-[11px] font-mono text-neutral-200 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
              <span>Frontend &amp; Web Developer — Sidoarjo, ID</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
              MUHAMMAD FARDAN
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
              Siswa Sistem Informatika, Jaringan, dan Aplikasi (SIJA) di SMK
              Telkom Sidoarjo yang berfokus pada pengembangan antarmuka web
              menggunakan React, Next.js, Tailwind CSS, serta sistem backend
              berbasis PHP dan MySQL.
            </p>

            {/* Primary Links */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                onClick={(e) => scrollToSection(e, "#projects")}
                className="px-4 py-2.5 rounded-lg bg-[#dc2626] text-white text-xs font-mono font-bold hover:bg-[#b91c1c] transition-colors"
              >
                Lihat Proyek
              </a>
              <a
                href="mailto:contact.fardan07@gmail.com"
                aria-label="Email"
                className="w-10 h-10 rounded-lg surface-card flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/Fardan07"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-lg surface-card flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/muhammad-fardan-5a32a4423/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-lg surface-card flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/pardannnn7/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-lg surface-card flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Hanging Lanyard ID Card anchored to top */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 self-start">
            <InteractiveLanyardCard />
          </div>
        </div>
      </section>

      {/* Skills & Languages Section */}
      <section
        id="skills"
        className="py-20 px-4 sm:px-6 border-b border-white/10 bg-neutral-950/30"
      >
        <div className="max-w-6xl mx-auto">
          {/* Stack & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Software Skills */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                <span>01 // Teknologi &amp; Perangkat</span>
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {[
                  { icon: <FaHtml5 className="w-5 h-5" />, name: "HTML5" },
                  { icon: <FaCss3Alt className="w-5 h-5" />, name: "CSS3" },
                  {
                    icon: <SiJavascript className="w-5 h-5" />,
                    name: "JavaScript",
                  },
                  {
                    icon: <SiTypescript className="w-5 h-5" />,
                    name: "TypeScript",
                  },
                  { icon: <FaReact className="w-5 h-5" />, name: "React" },
                  {
                    icon: <SiNextdotjs className="w-5 h-5" />,
                    name: "Next.js",
                  },
                  {
                    icon: <SiTailwindcss className="w-5 h-5" />,
                    name: "Tailwind",
                  },
                  { icon: <FaPhp className="w-5 h-5" />, name: "PHP" },
                  { icon: <SiLaravel className="w-5 h-5" />, name: "Laravel" },
                  { icon: <SiMysql className="w-5 h-5" />, name: "MySQL" },
                  { icon: <FaNodeJs className="w-5 h-5" />, name: "Node.js" },
                  { icon: <FaPython className="w-5 h-5" />, name: "Python" },
                  { icon: <FaFigma className="w-5 h-5" />, name: "Figma" },
                ].map((skill, i) => (
                  <div
                    key={i}
                    className="surface-card p-3 flex items-center gap-2.5 text-neutral-200 hover:text-white"
                  >
                    <span className="text-neutral-300">{skill.icon}</span>
                    <span className="text-xs font-mono truncate">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                <span>02 // Bahasa</span>
              </h2>
              <div className="surface-card p-6 space-y-6">
                {[
                  {
                    name: "Bahasa Indonesia",
                    level: "Penutur Asli",
                    percent: "95%",
                  },
                  {
                    name: "Bahasa Inggris",
                    level: "Profesional Dasar",
                    percent: "75%",
                  },
                ].map((lang, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline text-xs font-mono mb-2">
                      <span className="text-neutral-100 font-semibold">
                        {lang.name}
                      </span>
                      <span className="text-neutral-400">
                        {lang.level} ({lang.percent})
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: lang.percent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-20 px-4 sm:px-6 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                <span>03 // Portofolio</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Proyek Terpilih
              </h2>
            </div>
            <a
              href="https://github.com/Fardan07"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
            >
              <span>Arsip GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectsData.map((project, idx) => (
              <article
                key={idx}
                className="surface-card overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950 border-b border-white/10">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                      <span className="text-neutral-200 font-semibold">
                        {project.category}
                      </span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
                      {project.desc}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono text-neutral-300 bg-black/40 border border-white/10 px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-neutral-100 hover:text-[#ef4444] transition-colors"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                      <span>Kode Sumber</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section
        id="certificates"
        className="py-20 px-4 sm:px-6 border-b border-white/10 bg-neutral-950/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
              <span>04 // Kredensial</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Sertifikat &amp; Partisipasi
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certificatesData.map((cert, idx) => (
              <div
                key={idx}
                onClick={() =>
                  setSelectedCert({ image: cert.image, title: cert.title })
                }
                className="surface-card overflow-hidden flex flex-col cursor-pointer group"
              >
                <div className="relative aspect-[1.414] w-full overflow-hidden bg-neutral-950/80 p-3 flex items-center justify-center border-b border-white/10">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-mono text-neutral-100 bg-neutral-900/90 px-3 py-1.5 rounded border border-white/15 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-[#ef4444]" /> Perbesar
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1.5 text-neutral-400">
                      <span>{cert.issuer}</span>
                      <span className="text-neutral-300">{cert.year}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">
                      {cert.title}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-300 mt-2">
                    {cert.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer
        id="contact"
        className="py-16 px-4 sm:px-6 bg-[#070709]/85 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-10 border-b border-white/10 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
              <span className="text-xs font-mono text-neutral-200">
                Terbuka untuk magang dan kolaborasi proyek web
              </span>
            </div>
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, "#about")}
              className="text-xs font-mono text-neutral-300 hover:text-white transition-colors border border-white/15 bg-white/[0.03] px-3 py-1.5 rounded-lg"
            >
              Kembali ke atas ↑
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                Kontak Langsung
              </h4>
              <a
                href="mailto:contact.fardan07@gmail.com"
                className="text-base sm:text-lg font-medium text-white hover:text-[#ef4444] transition-colors break-all"
              >
                contact.fardan07@gmail.com
              </a>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Sidoarjo, Jawa Timur, Indonesia
              </p>
            </div>

            <div className="sm:text-right">
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                Tautan
              </h4>
              <div className="flex sm:justify-end gap-5 text-sm text-neutral-300 font-mono">
                <a
                  href="https://github.com/Fardan07"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/muhammad-fardan-5a32a4423/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/pardannnn7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-neutral-400">
            <p>© {new Date().getFullYear()} Muhammad Fardan.</p>
            <span>Next.js &amp; Tailwind CSS</span>
          </div>
        </div>
      </footer>

      {/* Modal / Lightbox for Certificates */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative w-full max-w-3xl aspect-[1.414] bg-[#0d0d10] rounded-xl overflow-hidden border border-white/15 cursor-default flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-30 text-neutral-400 hover:text-white bg-neutral-900 w-8 h-8 rounded-lg flex items-center justify-center transition-colors border border-white/15"
              aria-label="Tutup pratinjau"
            >
              ✕
            </button>

            <div className="absolute top-4 left-5 z-30">
              <span className="text-xs font-mono text-neutral-200">
                {selectedCert.title}
              </span>
            </div>

            <div className="relative w-[88%] h-[82%] mt-6">
              <Image
                src={selectedCert.image}
                alt={selectedCert.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
