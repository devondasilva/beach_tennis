import PageTransition from "@/components/motion/PageTransition";

/** Transition douce à chaque changement de page (App Router `template`). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
