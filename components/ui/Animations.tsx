"use client";

import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

// Variantes de animacao reutilizaveis
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Componente de Page Wrapper com animacao
interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Componente de Section animada
interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedSection({ children, delay = 0, className = "", ...props }: AnimatedSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

// Componente para animar lista de items com stagger
interface StaggerListProps {
  children: ReactNode;
  className?: string;
}

export function StaggerList({ children, className = "" }: StaggerListProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: StaggerListProps) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

// Componente de texto com reveal
interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}

// Componente de imagem com zoom suave
interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function AnimatedImage({ src, alt, className = "", containerClassName = "" }: AnimatedImageProps) {
  return (
    <motion.div
      className={`overflow-hidden ${containerClassName}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={className}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}

// Componente de botao com hover effect
interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export function AnimatedButton({ children, variant = "primary", className = "", ...props }: AnimatedButtonProps) {
  const baseStyles = "relative overflow-hidden px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold transition-colors";

  const variants = {
    primary: "bg-[#C5A059] text-black hover:bg-white",
    secondary: "bg-white text-black hover:bg-[#C5A059]",
    outline: "bg-transparent border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black",
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Componente de card com hover lift
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className = "" }: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

// Componente de contador animado
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 2, className = "" }: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.span>
    </motion.span>
  );
}

// Linha animada decorativa
interface AnimatedLineProps {
  className?: string;
  direction?: "horizontal" | "vertical";
}

export function AnimatedLine({ className = "", direction = "horizontal" }: AnimatedLineProps) {
  return (
    <motion.div
      className={`bg-[#C5A059] ${direction === "horizontal" ? "h-[1px]" : "w-[1px]"} ${className}`}
      initial={{ scaleX: direction === "horizontal" ? 0 : 1, scaleY: direction === "vertical" ? 0 : 1 }}
      whileInView={{ scaleX: 1, scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ originX: 0, originY: 0 }}
    />
  );
}

// Hero text com animacao especial
interface HeroTextProps {
  children: ReactNode;
  className?: string;
}

export function HeroTitle({ children, className = "" }: HeroTextProps) {
  return (
    <motion.h1
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.h1>
  );
}

export function HeroSubtitle({ children, className = "" }: HeroTextProps) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.p>
  );
}
