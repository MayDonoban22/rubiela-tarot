import Navbar from "../Navbar/Navbar";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Franja editorial: discreta y alineada con la identidad del Hero. */}
      <div className="relative overflow-hidden border-b border-[#E8D8B5]/15 bg-[#BB9B49] px-4 py-1.5 text-center">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#8C7239]/35 via-transparent to-[#8C7239]/35"
          aria-hidden="true"
        />
        <p className="relative mx-auto max-w-6xl font-inter text-[10px] font-medium tracking-[0.08em] text-[#111827] sm:text-[11px] sm:tracking-[0.14em]">
          <span aria-hidden="true" className="mr-2 text-[#554621]">
            ✦
          </span>
          Un espacio para conectar contigo
          <span className="mx-2 text-[#554621]/55" aria-hidden="true">
            ·
          </span>
          Tarot y orientación espiritual
          <span aria-hidden="true" className="ml-2 text-[#554621]">
            ✦
          </span>
        </p>
      </div>
      <Navbar />
    </header>
  );
}

export default Header;
