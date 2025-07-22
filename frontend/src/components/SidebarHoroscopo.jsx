import { useEffect, useRef, useState } from "react";
import { fetchHoroscope } from "../utils/api";
import {
  GiAries,
  GiTaurus,
  GiGemini,
  GiCancer,
  GiLeo,
  GiVirgo,
  GiLibra,
  GiScorpio,
  GiSagittarius,
  GiCapricorn,
  GiAquarius,
  GiPisces,
} from "react-icons/gi";
import { IoChevronForwardOutline, IoCloseOutline } from "react-icons/io5";

const signosZodiacales = [
  {
    name: "aries",
    icon: <GiAries className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "taurus",
    icon: <GiTaurus className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "gemini",
    icon: <GiGemini className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "cancer",
    icon: <GiCancer className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "leo",
    icon: <GiLeo className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "virgo",
    icon: <GiVirgo className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "libra",
    icon: <GiLibra className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "scorpio",
    icon: <GiScorpio className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "sagittarius",
    icon: <GiSagittarius className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "capricorn",
    icon: <GiCapricorn className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "aquarius",
    icon: <GiAquarius className="inline mr-2 text-[--color-primary]" />,
  },
  {
    name: "pisces",
    icon: <GiPisces className="inline mr-2 text-[--color-primary]" />,
  },
];

const SidebarHoroscopo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSign, setSelectedSign] = useState(null);
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSignClick = async (signo) => {
    setSelectedSign(signo);
    setLoading(true);
    try {
      const data = await fetchHoroscope(signo);
      setHoroscopeData(data);
    } catch (error) {
      console.error("Error al obtener horóscopo:", error);
      setHoroscopeData(null);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const closeModal = () => {
    setHoroscopeData(null);
    setSelectedSign(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    if (selectedSign && horoscopeData) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedSign, horoscopeData]);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-[70px] left-0 z-50 p-0.5 bg-goldLight text-[primary] border-secondary rounded-r-md shadow-md hover:bg-tertiary/40 transition cursor-pointer"
        aria-label="Abrir barra de signos"
      >
        <IoChevronForwardOutline size={12} />
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-primary/90 shadow-xl z-40 p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#B09245]">
            Signos Zodiacales
          </h2>
          <button
            onClick={toggleSidebar}
            aria-label="Cerrar sidebar"
            className="hover:text-goldDark transition text-[#B09245] cursor-pointer"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>
        <ul className="space-y-2">
          {signosZodiacales.map(({ name, icon }) => (
            <li key={name}>
              <button
                onClick={() => handleSignClick(name)}
                className="w-full flex items-center text-left px-4 py-2 rounded hover:bg-goldLight/40 capitalize text-[#B09245] cursor-pointer"
              >
                {icon} {name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {selectedSign && horoscopeData && (
        <div className="fixed inset-0 z-50 flex text-tertiary items-center justify-center bg-white/20 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-gradient-to-l from-primary to-secondary max-w-md w-full rounded-2xl shadow-xl p-6 relative border border-goldLight"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-[#B09245] hover:text-secondary cursor-pointer transition"
              aria-label="Cerrar modal"
            >
              <IoCloseOutline size={20} />
            </button>
            <h3 className="text-2xl font-semibold mb-4 capitalize text-[#B09245]">
              {selectedSign}
            </h3>
            <p className="mb-2">
              <strong className="text-[#B09245]">Fecha:</strong>{" "}
              {horoscopeData.date}
            </p>
            <p>
              <strong className="text-[#B09245]">Horóscopo:</strong>{" "}
              {horoscopeData.horoscope}
            </p>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm">
          <div className="bg-primary p-4 rounded shadow-md text-[#B09245]">
            Cargando horóscopo...
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarHoroscopo;
