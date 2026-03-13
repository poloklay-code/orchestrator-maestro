import { motion } from "framer-motion";
import orchestratorImg from "@/assets/orchestrator-robot.png";

interface Props {
  className?: string;
  size?: "full" | "medium" | "small";
}

export default function OrchestratorBust({ className = "", size = "full" }: Props) {
  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 1.2, bounce: 0.2 }}
    >
      {/* Glow behind robot */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full blur-3xl glow-pulse"
          style={{
            width: size === "full" ? "60%" : "40%",
            height: size === "full" ? "60%" : "40%",
            background: "radial-gradient(circle, hsl(35 80% 55% / 0.3), transparent 70%)",
          }}
        />
      </div>

      <motion.img
        src={orchestratorImg}
        alt="AETHER Orchestrator"
        className={`relative z-10 drop-shadow-2xl ${
          size === "full" ? "w-full max-w-lg" : size === "medium" ? "w-48" : "w-24"
        }`}
        style={{ filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.8))" }}
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
