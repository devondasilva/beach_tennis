import type { ComponentType } from "react";

export default function IllustrationBlock({
  Illustration,
  className = "",
  clipPath,
  hoverScale = false,
}: {
  Illustration: ComponentType<{ className?: string }>;
  className?: string;
  clipPath?: string;
  hoverScale?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${hoverScale ? "group" : ""} ${className}`}
      style={clipPath ? { clipPath } : undefined}
    >
      <Illustration
        className={`w-full h-full ${
          hoverScale ? "transition-transform duration-700 group-hover:scale-110" : ""
        }`}
      />
    </div>
  );
}
