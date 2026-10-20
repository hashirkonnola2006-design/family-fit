"use client";

import React, { useState, useEffect, useRef, useId, useMemo, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, KeyRound, Loader2, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Clean self-contained cn utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dark mode helper
export const useDarkMode = (): boolean => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDark = () => {
      const isHtmlDark = document.documentElement.classList.contains("dark");
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      return isHtmlDark || mediaQuery.matches;
    };

    setIsDark(checkDark());

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setIsDark(checkDark());
    mediaQuery.addEventListener("change", handler);

    const observer = new MutationObserver(() => setIsDark(checkDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mediaQuery.removeEventListener("change", handler);
      observer.disconnect();
    };
  }, []);

  return isDark;
};

// Liquid Glass Presets
export const GLASS_PRESETS = {
  subtle: {
    backgroundOpacity: 0.06,
    saturation: 1.1,
    brightness: 55,
    blur: 8,
    displace: 0.3,
    distortionScale: -20,
    redOffset: -1,
    greenOffset: 1,
    blueOffset: 3,
    mixBlendMode: "difference",
  },
  default: {
    backgroundOpacity: 0.1,
    saturation: 1.4,
    brightness: 55,
    blur: 10,
    displace: 0.4,
    distortionScale: -35,
    redOffset: 0,
    greenOffset: 2,
    blueOffset: 4,
    mixBlendMode: "difference",
  },
  bold: {
    backgroundOpacity: 0.18,
    saturation: 1.8,
    brightness: 60,
    blur: 12,
    displace: 0.6,
    distortionScale: -55,
    redOffset: 1,
    greenOffset: 3,
    blueOffset: 6,
    mixBlendMode: "screen",
  },
  ghost: {
    backgroundOpacity: 0,
    saturation: 1,
    brightness: 55,
    blur: 6,
    displace: 0,
    distortionScale: 0,
    redOffset: 0,
    greenOffset: 0,
    blueOffset: 0,
    mixBlendMode: "difference",
  },
};

export type GlassVariant = keyof typeof GLASS_PRESETS;

export const GLASS_DEFAULTS = {
  width: "auto",
  height: "auto",
  borderRadius: 16,
  borderWidth: 0.03,
  opacity: 0.93,
  xChannel: "R",
  yChannel: "G",
};

export interface GlassProps {
  variant?: GlassVariant;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: "R" | "G" | "B" | "A";
  yChannel?: "R" | "G" | "B" | "A";
  mixBlendMode?: string;
  dark?: boolean;
}

export const Glass: React.FC<GlassProps> = (rawProps) => {
  const {
    variant = "default",
    children,
    className = "",
    style = {},
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    backgroundOpacity,
    saturation,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode,
    dark,
  } = rawProps;

  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);

  const systemDarkMode = useDarkMode();
  const isDarkMode = dark !== undefined ? dark : systemDarkMode;

  const v = useMemo(() => {
    const p = GLASS_PRESETS[variant] ?? GLASS_PRESETS.default;
    return {
      ...GLASS_DEFAULTS,
      ...p,
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...(borderRadius !== undefined && { borderRadius }),
      ...(borderWidth !== undefined && { borderWidth }),
      ...(brightness !== undefined && { brightness }),
      ...(opacity !== undefined && { opacity }),
      ...(blur !== undefined && { blur }),
      ...(displace !== undefined && { displace }),
      ...(backgroundOpacity !== undefined && { backgroundOpacity }),
      ...(saturation !== undefined && { saturation }),
      ...(distortionScale !== undefined && { distortionScale }),
      ...(redOffset !== undefined && { redOffset }),
      ...(greenOffset !== undefined && { greenOffset }),
      ...(blueOffset !== undefined && { blueOffset }),
      ...(xChannel !== undefined && { xChannel }),
      ...(yChannel !== undefined && { yChannel }),
      ...(mixBlendMode !== undefined && { mixBlendMode }),
    };
  }, [
    variant,
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    backgroundOpacity,
    saturation,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode,
  ]);

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (v.borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${v.borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${v.borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${v.mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${
      actualWidth - edgeSize * 2
    }" height="${
      actualHeight - edgeSize * 2
    }" rx="${v.borderRadius}" fill="hsl(0 0% ${v.brightness}% / ${
      v.opacity
    })" style="filter:blur(${v.blur}px)" />
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    if (feImageRef.current) {
      feImageRef.current.setAttribute("href", generateDisplacementMap());
    }
  };

  useEffect(() => {
    updateDisplacementMap();
    [
      { ref: redChannelRef, offset: v.redOffset },
      { ref: greenChannelRef, offset: v.greenOffset },
      { ref: blueChannelRef, offset: v.blueOffset },
    ].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute(
          "scale",
          (v.distortionScale + offset).toString()
        );
        ref.current.setAttribute("xChannelSelector", v.xChannel);
        ref.current.setAttribute("yChannelSelector", v.yChannel);
      }
    });

    if (gaussianBlurRef.current) {
      gaussianBlurRef.current.setAttribute(
        "stdDeviation",
        v.displace.toString()
      );
    }
  }, [
    v.width,
    v.height,
    v.borderRadius,
    v.borderWidth,
    v.brightness,
    v.opacity,
    v.blur,
    v.displace,
    v.distortionScale,
    v.redOffset,
    v.greenOffset,
    v.blueOffset,
    v.xChannel,
    v.yChannel,
    v.mixBlendMode,
    variant,
  ]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateDisplacementMap, 0);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    setTimeout(updateDisplacementMap, 0);
  }, [v.width, v.height]);

  const [svgFilterSupported, setSvgFilterSupported] = useState(true);

  useEffect(() => {
    const checkSupport = () => {
      const isWebkit =
        typeof navigator !== "undefined" &&
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent);
      const isFirefox = typeof navigator !== "undefined" && /Firefox/.test(navigator.userAgent);
      setSvgFilterSupported(!isWebkit && !isFirefox);
    };
    checkSupport();
  }, [filterId]);

  const getContainerStyles = (): React.CSSProperties => {
    const baseStyles = {
      ...style,
      ...(v.width && v.width !== "auto" && { width: typeof v.width === "number" ? `${v.width}px` : v.width }),
      ...(v.height && v.height !== "auto" && { height: typeof v.height === "number" ? `${v.height}px` : v.height }),
      borderRadius: `${v.borderRadius}px`,
      "--glass-frost": v.backgroundOpacity,
      "--glass-saturation": v.saturation,
    };

    if (svgFilterSupported) {
      return {
        ...baseStyles,
        background: isDarkMode
          ? `hsl(0 0% 0% / ${v.backgroundOpacity})`
          : `hsl(0 0% 100% / ${v.backgroundOpacity})`,
        backdropFilter: `url(#${filterId}) saturate(${v.saturation})`,
        border: isDarkMode
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow: isDarkMode
          ? `0 0 1px 0 rgba(255, 255, 255, 0.1) inset,
             0px 4px 16px rgba(17, 17, 26, 0.05)`
          : `0 0 1px 0 rgba(0, 0, 0, 0.05) inset,
             0px 4px 16px rgba(17, 17, 26, 0.05)`,
      } as React.CSSProperties;
    } else {
      return {
        ...baseStyles,
        background: isDarkMode
          ? "rgba(0, 0, 0, 0.3)"
          : "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.06)",
      } as React.CSSProperties;
    }
  };

  const glassClasses =
    "relative flex items-center justify-center overflow-hidden transition-all duration-[260ms] ease-out";

  return (
    <div
      ref={containerRef}
      className={cn(glassClasses, className)}
      style={getContainerStyles()}
    >
      <svg
        className="w-full h-full pointer-events-none absolute inset-0 opacity-0 -z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feImage
              ref={feImageRef}
              href={
                generateDisplacementMap() ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
              }
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              ref={redChannelRef}
              in="SourceGraphic"
              in2="map"
              id="redchannel"
              result="dispRed"
            />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              id="greenchannel"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />
            <feDisplacementMap
              ref={blueChannelRef}
              in="SourceGraphic"
              in2="map"
              id="bluechannel"
              result="dispBlue"
            />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur
              ref={gaussianBlurRef}
              in="output"
              stdDeviation="0.7"
            />
          </filter>
        </defs>
      </svg>

      <div className="w-full h-full flex items-center justify-center p-0 rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  );
};

export interface GlassInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: GlassVariant;
  containerClassName?: string;
  rightElement?: React.ReactNode;
  borderRadius?: number;
  height?: number | string;
  glassProps?: Partial<GlassProps>;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      variant = "default",
      className = "",
      containerClassName = "",
      rightElement,
      borderRadius = 14,
      height = 52,
      glassProps,
      ...inputProps
    },
    ref
  ) => {
    return (
      <Glass
        variant={variant}
        borderRadius={borderRadius}
        dark={true}
        height={height}
        className={cn(
          "w-full h-[52px] min-h-[52px] transition-all duration-200",
          containerClassName
        )}
        {...glassProps}
      >
        <div className="relative w-full h-[52px] min-h-[52px] flex items-center px-4">
          <input
            ref={ref}
            className={cn(
              "w-full h-full bg-transparent text-neutral-100 placeholder:text-neutral-400/70 border-none outline-none text-[15px] font-medium leading-none",
              rightElement ? "pr-10" : "pr-0",
              className
            )}
            {...inputProps}
          />
          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
      </Glass>
    );
  }
);

GlassInput.displayName = "GlassInput";

export interface SpaceLoginProps {
  title?: string;
  subtitle?: string;
  astronautSrc?: string;
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => Promise<void> | void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onSocialLogin?: (provider: "google" | "github" | "facebook" | "windows" | "passkey") => void;
  className?: string;
  defaultEmail?: string;
  showSocialButtons?: boolean;
  glassVariant?: GlassVariant;
}

function SparkleStar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-4 h-4 pointer-events-none select-none", className)}
      style={style}
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.75-1.551L24 0v11.551h-13.25V1.898zM0 12.449h9.75v9.451L0 20.551v-8.102zm10.75 0H24V24l-13.25-1.898v-9.653z" />
    </svg>
  );
}

function CosmicStarfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener("resize", handleResize);

    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      baseOpacity: number;
      twinkleSpeed: number;
      color: string;
      isSparkle?: boolean;
    }

    let stars: Star[] = [];
    const starColors = ["#ffffff", "#e0f2fe", "#fdf4ff", "#fbcfe8", "#bae6fd"];

    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 3200);

      for (let i = 0; i < count; i++) {
        const isSparkle = Math.random() < 0.08;
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const baseOpacity = isSparkle ? 0.6 + Math.random() * 0.4 : 0.2 + Math.random() * 0.7;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: isSparkle ? Math.random() * 1.8 + 1.2 : Math.random() * 1.3 + 0.5,
          opacity: baseOpacity,
          baseOpacity,
          twinkleSpeed: 0.008 + Math.random() * 0.02,
          color,
          isSparkle,
        });
      }
    };

    initStars();

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.03;
      targetMouseY = (e.clientY - height / 2) * 0.03;
    };

    window.addEventListener("mousemove", handleMouseMove);

    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      life: number;
    }

    let shootingStars: ShootingStar[] = [];

    const maybeAddShootingStar = () => {
      if (Math.random() < 0.012 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.5),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 9 + 7,
          angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
          opacity: 1,
          life: 1,
        });
      }
    };

    let tick = 0;

    const render = () => {
      tick++;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.opacity = star.baseOpacity + Math.sin(tick * star.twinkleSpeed + i) * 0.35;
        const boundedOpacity = Math.max(0.1, Math.min(1, star.opacity));

        const posX = star.x + currentMouseX * (star.size * 0.8);
        const posY = star.y + currentMouseY * (star.size * 0.8);

        ctx.fillStyle = star.color;
        ctx.globalAlpha = boundedOpacity;

        if (star.isSparkle) {
          const s = star.size * 2.2;
          ctx.beginPath();
          ctx.moveTo(posX, posY - s);
          ctx.lineTo(posX + s * 0.25, posY - s * 0.25);
          ctx.lineTo(posX + s, posY);
          ctx.lineTo(posX + s * 0.25, posY + s * 0.25);
          ctx.lineTo(posX, posY + s);
          ctx.lineTo(posX - s * 0.25, posY + s * 0.25);
          ctx.lineTo(posX - s, posY);
          ctx.lineTo(posX - s * 0.25, posY - s * 0.25);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.arc(posX, posY, star.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(posX, posY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      maybeAddShootingStar();

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life -= 0.015;

        if (ss.life <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${ss.life * 0.8})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x - Math.cos(ss.angle) * ss.length,
          ss.y - Math.sin(ss.angle) * ss.length
        );
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}

// Unsplash stock astronaut fallback
export const DEFAULT_ASTRONAUT_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80";

export function SpaceLogin({
  title = "Sign In",
  subtitle,
  astronautSrc = DEFAULT_ASTRONAUT_IMAGE,
  onSubmit,
  onForgotPassword,
  onSignUp,
  onSocialLogin,
  className,
  defaultEmail = "",
  showSocialButtons = true,
  glassVariant = "default",
}: SpaceLoginProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mouse-follow parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleGlobalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ email, password, rememberMe });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (err) {
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      className={cn(
        "relative min-h-screen w-full bg-[#03060f] text-white flex flex-col items-center justify-center overflow-hidden px-4 select-none",
        className
      )}
    >
      {/* Dynamic Starfield Canvas */}
      <CosmicStarfield />

      {/* Atmospheric Horizon / Planet Glow at the bottom */}
      <div className="absolute -bottom-48 sm:-bottom-56 md:-bottom-64 left-1/2 -translate-x-1/2 w-[160vw] max-w-[1900px] h-[480px] sm:h-[550px] md:h-[620px] pointer-events-none z-0">
        <div
          className="w-full h-full rounded-[100%]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(224, 102, 70, 0.95) 0%, rgba(199, 81, 58, 0.75) 20%, rgba(67, 142, 145, 0.5) 42%, rgba(20, 48, 70, 0.25) 60%, transparent 80%)",
            filter: "blur(32px)",
          }}
        />
        <div
          className="absolute inset-0 rounded-[100%] opacity-40 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(255, 170, 110, 0.6) 0%, rgba(94, 219, 210, 0.4) 30%, transparent 65%)",
            filter: "blur(48px)",
          }}
        />
      </div>

      {/* Cosmic Floating Astronaut with Parallax and Pink Accent Star */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-center">
        <motion.div
          animate={{
            x: mousePos.x * 1.5,
            y: mousePos.y * 1.5,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 60 }}
          className="hidden md:block absolute left-2 lg:left-12 xl:left-20 top-1/2 -translate-y-[65%] pointer-events-none z-20"
        >
          <motion.div
            animate={{
              y: [-12, 14, -12],
              rotate: [-2, 3, -2],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <img
              src={astronautSrc}
              alt="Floating Astronaut"
              className="w-40 sm:w-44 lg:w-52 h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] filter contrast-125 select-none rounded-3xl"
              draggable={false}
            />

            <motion.div
              animate={{
                scale: [0.85, 1.25, 0.85],
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-3 top-1/2 -translate-y-1/2"
            >
              <SparkleStar className="w-6 h-6 text-[#ff4bb8] drop-shadow-[0_0_12px_#ff4bb8]" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Central Sign In Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center"
        >
          {/* Main Title */}
          <h1 className="text-4xl sm:text-[42px] font-extrabold tracking-tight text-white mb-8 sm:mb-9 text-center drop-shadow-sm font-sans">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-neutral-400 -mt-6 mb-7 text-center">
              {subtitle}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {/* Email Field with Liquid Glass */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="space-email"
                className="text-base font-semibold text-neutral-200 tracking-wide select-none"
              >
                Email
              </label>
              <GlassInput
                id="space-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant={glassVariant}
                borderRadius={14}
              />
            </div>

            {/* Password Field with Liquid Glass */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="space-password"
                className="text-base font-semibold text-neutral-200 tracking-wide select-none"
              >
                Password
              </label>
              <GlassInput
                id="space-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant={glassVariant}
                borderRadius={14}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="p-1 text-neutral-400 hover:text-neutral-200 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 transition-transform active:scale-90" />
                    ) : (
                      <Eye className="w-5 h-5 transition-transform active:scale-90" />
                    )}
                  </button>
                }
              />
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs sm:text-[13px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={cn(
                    "w-4 h-4 rounded-[4px] border transition-all duration-150 flex items-center justify-center cursor-pointer",
                    rememberMe
                      ? "bg-neutral-200 border-neutral-200 text-black"
                      : "border-neutral-600 bg-white/5 group-hover:border-neutral-400"
                  )}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-neutral-300 group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-neutral-300 hover:text-white font-medium transition-colors hover:underline underline-offset-4 select-none"
              >
                Forget Password ?
              </button>
            </div>

            {/* Submit / Sign In Button */}
            <motion.button
              type="submit"
              disabled={isLoading || isSuccess}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative w-full h-12 mt-2 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center overflow-hidden shadow-lg select-none cursor-pointer",
                isSuccess
                  ? "bg-emerald-600 text-white shadow-emerald-500/25"
                  : "bg-[#252831] hover:bg-[#2d313c] active:bg-[#22252e] text-neutral-100 hover:text-white border border-white/10 hover:border-white/20 shadow-black/40"
              )}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
                    <span>Signing in...</span>
                  </motion.div>
                ) : isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-white"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Welcome Back!</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Don't have an account link */}
            <div className="text-center text-xs sm:text-[13px] text-neutral-400 mt-1">
              <span>Don’t Have an Account ? </span>
              <button
                type="button"
                onClick={onSignUp}
                className="text-white font-bold hover:underline underline-offset-4 transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>

            {/* Subtle Divider */}
            {showSocialButtons && (
              <div className="w-full flex items-center gap-3 my-1">
                <div className="flex-1 h-[1px] bg-white/[0.08]" />
              </div>
            )}

            {/* Social Logins */}
            {showSocialButtons && (
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 w-full">
                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSocialLogin?.("google")}
                  aria-label="Sign in with Google"
                  className="w-10 h-10 rounded-xl bg-[#242730]/80 hover:bg-[#2e323e] border border-white/10 hover:border-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors backdrop-blur-md shadow-md cursor-pointer"
                >
                  <GoogleIcon className="w-4 h-4" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSocialLogin?.("github")}
                  aria-label="Sign in with GitHub"
                  className="w-10 h-10 rounded-xl bg-[#242730]/80 hover:bg-[#2e323e] border border-white/10 hover:border-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors backdrop-blur-md shadow-md cursor-pointer"
                >
                  <GitHubIcon className="w-4 h-4" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSocialLogin?.("facebook")}
                  aria-label="Sign in with Facebook"
                  className="w-10 h-10 rounded-xl bg-[#242730]/80 hover:bg-[#2e323e] border border-white/10 hover:border-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors backdrop-blur-md shadow-md cursor-pointer"
                >
                  <FacebookIcon className="w-4 h-4" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSocialLogin?.("windows")}
                  aria-label="Sign in with Windows"
                  className="w-10 h-10 rounded-xl bg-[#242730]/80 hover:bg-[#2e323e] border border-white/10 hover:border-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors backdrop-blur-md shadow-md cursor-pointer"
                >
                  <WindowsIcon className="w-3.5 h-3.5" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSocialLogin?.("passkey")}
                  aria-label="Sign in with Passkey"
                  className="w-10 h-10 rounded-xl bg-[#242730]/80 hover:bg-[#2e323e] border border-white/10 hover:border-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors backdrop-blur-md shadow-md cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 -rotate-45" />
                </motion.button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default SpaceLogin;
