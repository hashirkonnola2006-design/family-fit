"use client";

import React, { useState, useEffect, useRef, useId, useMemo, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, KeyRound, Loader2, Check, Sparkles, Heart, Leaf } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Liquid Botanical Glass Presets tailored for Healthy Theme
export const HEALTHY_GLASS_PRESETS = {
  subtle: {
    backgroundOpacity: 0.12,
    saturation: 1.2,
    brightness: 95,
    blur: 10,
    displace: 0.3,
    distortionScale: -20,
    redOffset: -1,
    greenOffset: 2,
    blueOffset: 1,
    mixBlendMode: "screen",
  },
  default: {
    backgroundOpacity: 0.22,
    saturation: 1.35,
    brightness: 95,
    blur: 12,
    displace: 0.4,
    distortionScale: -30,
    redOffset: 0,
    greenOffset: 3,
    blueOffset: 1,
    mixBlendMode: "screen",
  },
  bold: {
    backgroundOpacity: 0.35,
    saturation: 1.5,
    brightness: 98,
    blur: 16,
    displace: 0.5,
    distortionScale: -45,
    redOffset: 1,
    greenOffset: 4,
    blueOffset: 2,
    mixBlendMode: "screen",
  },
};

export type HealthyGlassVariant = keyof typeof HEALTHY_GLASS_PRESETS;

export interface HealthyGlassProps {
  variant?: HealthyGlassVariant;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
}

export const HealthyGlass: React.FC<HealthyGlassProps> = ({
  variant = "default",
  children,
  className = "",
  style = {},
  width,
  height,
  borderRadius = 16,
  borderWidth = 0.03,
}) => {
  const p = HEALTHY_GLASS_PRESETS[variant] ?? HEALTHY_GLASS_PRESETS.default;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden transition-all duration-200",
        className
      )}
      style={{
        ...style,
        ...(width && width !== "auto" && { width: typeof width === "number" ? `${width}px` : width }),
        ...(height && height !== "auto" && { height: typeof height === "number" ? `${height}px` : height }),
        borderRadius: `${borderRadius}px`,
        background: `rgba(255, 255, 255, ${p.backgroundOpacity})`,
        backdropFilter: `blur(${p.blur}px) saturate(${p.saturation})`,
        WebkitBackdropFilter: `blur(${p.blur}px) saturate(${p.saturation})`,
        border: "2px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 32px 0 rgba(88, 204, 2, 0.08), inset 0 0 1px 1px rgba(255, 255, 255, 0.6)",
      }}
    >
      <div className="w-full h-full flex items-center justify-center p-0 rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  );
};

export interface HealthyGlassInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: HealthyGlassVariant;
  containerClassName?: string;
  rightElement?: React.ReactNode;
  borderRadius?: number;
  height?: number | string;
}

export const HealthyGlassInput = forwardRef<HTMLInputElement, HealthyGlassInputProps>(
  (
    {
      variant = "default",
      className = "",
      containerClassName = "",
      rightElement,
      borderRadius = 16,
      height = 54,
      ...inputProps
    },
    ref
  ) => {
    return (
      <HealthyGlass
        variant={variant}
        borderRadius={borderRadius}
        height={height}
        className={cn(
          "w-full h-[54px] min-h-[54px] transition-all duration-200 focus-within:border-[#58CC02] focus-within:ring-4 focus-within:ring-[#58CC02]/20",
          containerClassName
        )}
      >
        <div className="relative w-full h-[54px] min-h-[54px] flex items-center px-4">
          <input
            ref={ref}
            className={cn(
              "w-full h-full bg-transparent text-[#2E432A] placeholder:text-[#8D9B8B] border-none outline-none text-[15px] font-bold leading-none",
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
      </HealthyGlass>
    );
  }
);

HealthyGlassInput.displayName = "HealthyGlassInput";

// Interactive Botanical Leaves & Sparkles Canvas
function BotanicalLeafField() {
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
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      isLeaf: boolean;
    }

    let particles: Particle[] = [];
    const colors = ["#58CC02", "#1CB0F6", "#FFC800", "#76DC28", "#88E23B"];

    const initParticles = () => {
      particles = [];
      const count = Math.floor((width * height) / 14000) + 20;

      for (let i = 0; i < count; i++) {
        const isLeaf = Math.random() < 0.35;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: isLeaf ? Math.random() * 8 + 6 : Math.random() * 3 + 1.5,
          speedY: Math.random() * 0.4 + 0.15,
          speedX: Math.sin(Math.random() * Math.PI) * 0.3 - 0.15,
          opacity: Math.random() * 0.45 + 0.2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          color: colors[Math.floor(Math.random() * colors.length)],
          isLeaf,
        });
      }
    };

    initParticles();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.isLeaf) {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.45, Math.PI / 4, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}

// Unsplash Fresh Kerala Bowl Hero Image
export const DEFAULT_HEALTHY_HERO_IMAGE =
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80";

export interface HealthyLoginProps {
  title?: string;
  subtitle?: string;
  heroImageSrc?: string;
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => Promise<void> | void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onSocialLogin?: (provider: "google" | "github" | "facebook" | "windows" | "passkey") => void;
  className?: string;
  defaultEmail?: string;
  showSocialButtons?: boolean;
}

export function HealthyLogin({
  title = "Welcome Back to FamilyFit",
  subtitle = "Nourish your family with fresh Kerala wellness & balanced meal plans.",
  heroImageSrc = DEFAULT_HEALTHY_HERO_IMAGE,
  onSubmit,
  onForgotPassword,
  onSignUp,
  onSocialLogin,
  className,
  defaultEmail = "",
  showSocialButtons = true,
}: HealthyLoginProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
      onMouseMove={handleMouseMove}
      className={cn(
        "relative min-h-screen w-full bg-gradient-to-b from-[#F2F8EE] via-[#EBF5E7] to-[#F7FAF4] text-[#2E432A] flex flex-col items-center justify-center overflow-hidden px-4 select-none",
        className
      )}
    >
      {/* Interactive Botanical Particle Field */}
      <BotanicalLeafField />

      {/* Fresh Horizon Botanical Glow */}
      <div className="absolute -bottom-48 sm:-bottom-56 left-1/2 -translate-x-1/2 w-[160vw] max-w-[1800px] h-[520px] pointer-events-none z-0">
        <div
          className="w-full h-full rounded-[100%]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(88, 204, 2, 0.35) 0%, rgba(28, 176, 246, 0.2) 30%, rgba(255, 200, 0, 0.15) 50%, transparent 75%)",
            filter: "blur(48px)",
          }}
        />
      </div>

      {/* Floating Nutritious Meal Bowl with Parallax */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-center">
        <motion.div
          animate={{
            x: mousePos.x * 1.5,
            y: mousePos.y * 1.5,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 60 }}
          className="hidden md:block absolute left-2 lg:left-12 xl:left-16 top-1/2 -translate-y-[60%] pointer-events-none z-20"
        >
          <motion.div
            animate={{
              y: [-10, 12, -10],
              rotate: [-1.5, 2, -1.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="w-48 sm:w-56 lg:w-64 aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 p-2 bg-white/40 backdrop-blur-md">
              <img
                src={heroImageSrc}
                alt="Nutritious Balanced Bowl"
                className="w-full h-full object-cover rounded-2xl filter contrast-105"
                draggable={false}
              />
            </div>

            {/* Sparkle Badge */}
            <motion.div
              animate={{
                scale: [0.9, 1.15, 0.9],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-4 -bottom-3 px-3 py-1.5 rounded-full bg-[#58CC02] border-2 border-white text-white font-black text-xs flex items-center gap-1 shadow-lg"
            >
              <Leaf size={14} fill="#ffffff" />
              <span>100% Healthy</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Central Sign In Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[440px] mx-auto flex flex-col items-center bg-white/70 backdrop-blur-xl p-8 sm:p-9 rounded-3xl border-2 border-white shadow-xl"
        >
          {/* Logo Badge */}
          <div className="w-14 h-14 rounded-2xl bg-[#58CC02] border-2 border-[#58A700] border-b-4 border-b-[#458500] flex items-center justify-center text-white mb-4 shadow-sm">
            <Heart size={28} strokeWidth={2.5} fill="#FFFFFF" />
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#2E432A] text-center">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs sm:text-sm font-bold text-[#6D8269] mt-2 mb-6 text-center leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Email Field with Liquid Glass */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="healthy-email"
                className="text-xs font-black uppercase tracking-wider text-[#52684E] select-none"
              >
                Email Address
              </label>
              <HealthyGlassInput
                id="healthy-email"
                type="email"
                required
                placeholder="family@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                borderRadius={16}
              />
            </div>

            {/* Password Field with Liquid Glass */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="healthy-password"
                className="text-xs font-black uppercase tracking-wider text-[#52684E] select-none"
              >
                Password
              </label>
              <HealthyGlassInput
                id="healthy-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderRadius={16}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="p-1 text-[#6D8269] hover:text-[#2E432A] focus:outline-none transition-colors cursor-pointer"
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
            <div className="flex items-center justify-between text-xs sm:text-[13px] pt-1 font-bold">
              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={cn(
                    "w-4 h-4 rounded-md border-2 transition-all flex items-center justify-center cursor-pointer",
                    rememberMe
                      ? "bg-[#58CC02] border-[#58A700] text-white"
                      : "border-[#C5D6C1] bg-white group-hover:border-[#58CC02]"
                  )}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[#52684E] group-hover:text-[#2E432A] transition-colors">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[#58CC02] hover:text-[#458500] hover:underline underline-offset-4 cursor-pointer select-none"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit / Chunky 3D Sign In Button */}
            <motion.button
              type="submit"
              disabled={isLoading || isSuccess}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full h-12 mt-2 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center overflow-hidden cursor-pointer border-2 border-b-4",
                isSuccess
                  ? "bg-[#58CC02] border-[#58A700] text-white"
                  : "bg-[#58CC02] border-[#58A700] border-b-[#458500] hover:bg-[#52be02] active:translate-y-[2px] active:border-b-2 text-white shadow-md"
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
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
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
                    <span>Welcome to FamilyFit!</span>
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
            <div className="text-center text-xs sm:text-[13px] text-[#6D8269] font-bold mt-1">
              <span>Don’t Have an Account? </span>
              <button
                type="button"
                onClick={onSignUp}
                className="text-[#58CC02] font-black hover:underline underline-offset-4 transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>

            {/* Subtle Divider */}
            {showSocialButtons && (
              <div className="w-full flex items-center gap-3 my-1">
                <div className="flex-1 h-[2px] bg-[#E2EBE0]" />
                <span className="text-[11px] font-black uppercase text-[#8D9B8B] tracking-wider">or</span>
                <div className="flex-1 h-[2px] bg-[#E2EBE0]" />
              </div>
            )}

            {/* Social Logins in Healthy 3D style */}
            {showSocialButtons && (
              <div className="flex items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => onSocialLogin?.("google")}
                  aria-label="Sign in with Google"
                  className="w-10 h-10 rounded-2xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#CECECE] hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 flex items-center justify-center text-[#4B4B4B] cursor-pointer transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => onSocialLogin?.("passkey")}
                  aria-label="Sign in with Passkey"
                  className="w-10 h-10 rounded-2xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#CECECE] hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 flex items-center justify-center text-[#58CC02] cursor-pointer transition-all"
                >
                  <KeyRound className="w-4 h-4 -rotate-45" />
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default HealthyLogin;
