"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface SlotMachineTextProps {
  from: string;
  to: string;
  href: string;
  className?: string;
}

export function SlotMachineRollText({
  from,
  to,
  href,
  className = "",
}: SlotMachineTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  const length = Math.max(from.length, to.length);
  const start = from.padEnd(length, " ");
  const end = to.padEnd(length, " ");

  return (
    <a
      href={href}
      className={`inline-flex font-bold ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {Array.from({ length }, (_, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{
            height: "1.1em",
            lineHeight: "1.1em",
            width: "0.65em",
            textAlign: "center",
          }}
        >
          <motion.span
            className="flex flex-col"
            animate={{
              y: isHovered ? "-1.1em" : "0em",
            }}
            transition={{
              duration: 0.35,
              delay: isHovered ? i * 0.025 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="block h-[1.1em] shrink-0">{start[i]}</span>
            <span className="block h-[1.1em] shrink-0">{end[i]}</span>
          </motion.span>
        </span>
      ))}
    </a>
  );
}
