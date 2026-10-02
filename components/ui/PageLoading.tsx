/** Écran de chargement cohérent avec les bandeaux de page. */
export default function PageLoading() {
  return (
    <div className="bg-sandlight min-h-screen">
      <div className="bg-ink pt-[calc(var(--nav-height,4.5rem)+3rem)] pb-28">
        <div className="max-w-content mx-auto px-6 space-y-5">
          <div className="h-8 w-56 rounded-full bg-white/10 animate-pulse" />
          <div className="h-14 w-full max-w-lg rounded-2xl bg-white/10 animate-pulse" />
          <div className="h-5 w-full max-w-md rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
      <div className="max-w-content mx-auto px-6 -mt-12 grid md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-64 rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}
