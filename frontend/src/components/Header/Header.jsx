import { fetchHoroscope } from "../../utils/api";
import Navbar from "../Navbar/Navbar";
import { useEffect } from "react";

function Header() {
  useEffect(() => {
    fetchHoroscope();
  }, []);
  return (
    <header className="relative">
      <div className="bg-goldLight relative z-30 text-tertiary text-xs md:text-sm py-2 text-center font-inter">
        ✨ Bienvenidos a Luz de Rubí: guía espiritual y tarot ✨
      </div>
      <Navbar />
    </header>
  );
}

export default Header;
