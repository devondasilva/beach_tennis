import { RollText as FCRollText } from "@/components/ui/ArrowButton";

/** Lettres qui roulent au survol d'un parent `.roll-trigger` ou `.btn-motion` (style Formation Continue). */
export default function RollText({ children }: { children: string; className?: string }) {
  return (
    <>
      <span className="sr-only">{children}</span>
      <FCRollText text={children} />
    </>
  );
}
