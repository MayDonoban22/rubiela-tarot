import Navbar from "../Navbar/Navbar";

function Header() {
  return (
    <header>
      <div className="bg-goldLight text-tertiary text-xs md:text-sm py-2 text-center font-inter">
        ✨ Bienvenidos a Luz de Rubí: guía espiritual y tarot ✨
      </div>
      <Navbar />
    </header>
  );
}

export default Header;
