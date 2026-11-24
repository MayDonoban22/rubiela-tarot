import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

// El número de Rubiela está confirmado.
// El correo y las redes se muestran como pendientes hasta disponer de sus datos reales.
const contactInfo = {
  phoneDisplay: "+57 320 982 1747",
  phoneDial: "+573209821747",
  whatsapp: "573209821747",
  email: "", // Colocar aquí el correo oficial cuando exista.
  emailExample: "contacto@luzderubi.com", // Solo referencia visual, NO se utiliza como enlace.
  instagram: "", // Colocar URL oficial cuando exista.
  facebook: "", // Colocar URL oficial cuando exista.
};

const footerLinks = [
  { label: "Inicio", to: "/" },
  { label: "Consultas", to: "/consultas" },
  { label: "Sobre mí", to: "/sobre-mi" },
  { label: "Contacto", to: "/contacto" },
];

const focusStyles =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6B967]";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden border-t border-[#BB9B49]/25 bg-[#101827] font-inter text-[#F8F6F0]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-44 h-[410px] w-[410px] rounded-full bg-[#3D578D]/15 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-36 h-[400px] w-[400px] rounded-full bg-[#BB9B49]/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BB9B49]/70 to-transparent"
      />

      <div className="ldr-container relative z-10 pt-14 pb-10 sm:pt-16 lg:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <Link
              to="/"
              aria-label="Luz de Rubí, volver al inicio"
              className={`inline-flex items-center rounded-md ${focusStyles}`}
            >
              <img
                src="/assets/images/logo-oficial.png"
                alt="Luz de Rubí"
                className="h-[72px] w-auto max-w-[180px] object-contain transition-transform duration-300 hover:scale-[1.03]"
                loading="lazy"
              />
            </Link>
            <p className="mt-5 font-Abhaya text-[27px] leading-tight text-[#E8D8B5] sm:text-[30px]">
              Un espacio para{" "}
              <span className="block italic text-[#D6B967]">
                conectar contigo.
              </span>
            </p>
            <p className="mt-5 max-w-[350px] text-[13px] leading-[1.9] text-[#F8F6F0]/65 sm:text-sm">
              Luz de Rubí es un espacio de orientación espiritual, reflexión y
              conexión interior, acompañado por Rubiela Pineda Cortés.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-9 bg-[#BB9B49]" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#D6B967]">
                Luz de Rubí
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-Abhaya text-[23px] font-semibold text-[#E8D8B5]">
              Explora
            </h2>
            <div
              aria-hidden="true"
              className="mt-3 h-px w-10 bg-[#BB9B49]/75"
            />
            <nav aria-label="Enlaces del pie de página" className="mt-6">
              <ul className="space-y-4">
                {footerLinks.map(({ label, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`group inline-flex items-center gap-3 rounded-sm text-[13px] text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-[#D6B967] ${focusStyles}`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-[3px] w-[3px] rounded-full bg-[#BB9B49]/70 transition-all duration-300 group-hover:w-3"
                      />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="min-w-0">
            <h2 className="font-Abhaya text-[23px] font-semibold text-[#E8D8B5]">
              Estamos para escucharte
            </h2>
            <div
              aria-hidden="true"
              className="mt-3 h-px w-10 bg-[#BB9B49]/75"
            />
            <p className="mt-6 max-w-[320px] text-[13px] leading-[1.85] text-white/65">
              ¿Deseas conocer más acerca de nuestras consultas? Puedes
              escribirnos y resolver tus inquietudes.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href={`tel:${contactInfo.phoneDial}`}
                className={`flex w-fit items-center gap-3 rounded-sm text-[13px] text-white/80 transition-colors hover:text-[#D6B967] ${focusStyles}`}
              >
                <FaPhoneAlt
                  aria-hidden="true"
                  className="shrink-0 text-[#D6B967]"
                />
                {contactInfo.phoneDisplay}
              </a>
              {contactInfo.email ? (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className={`flex w-fit max-w-full items-center gap-3 break-all rounded-sm text-[13px] text-white/75 transition-colors hover:text-[#D6B967] ${focusStyles}`}
                >
                  <FaEnvelope
                    aria-hidden="true"
                    className="shrink-0 text-[#D6B967]"
                  />
                  {contactInfo.email}
                </a>
              ) : (
                <p className="flex items-start gap-3 text-[12px] leading-relaxed text-white/45">
                  <FaEnvelope
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[#D6B967]/65"
                  />
                  Correo electrónico: próximamente
                </p>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-[#BB9B49]/65 px-5 py-2.5 text-[13px] font-medium text-[#E8D8B5] transition-all duration-300 hover:border-[#D6B967] hover:bg-[#BB9B49]/10 ${focusStyles}`}
              >
                <FaWhatsapp aria-hidden="true" size={15} /> WhatsApp
                <FaArrowRight
                  size={11}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <Link
                to="/contacto"
                className={`inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-[13px] text-white/80 transition-all duration-300 hover:border-[#D6B967] hover:text-[#D6B967] ${focusStyles}`}
              >
                Ver contacto
              </Link>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-[10px] uppercase tracking-[0.18em] text-[#D6B967]">
                Síguenos
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {contactInfo.instagram ? (
                  <a
                    href={contactInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de Luz de Rubí"
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#BB9B49]/40 bg-white/5 text-[#D6B967] transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B967] hover:bg-[#BB9B49]/15 ${focusStyles}`}
                  >
                    <FaInstagram size={18} aria-hidden="true" />
                  </a>
                ) : (
                  <span
                    aria-label="Instagram próximamente"
                    title="Instagram próximamente"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#BB9B49]/20 bg-white/5 text-[#D6B967]/50"
                  >
                    <FaInstagram size={18} aria-hidden="true" />
                  </span>
                )}
                {contactInfo.facebook ? (
                  <a
                    href={contactInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook de Luz de Rubí"
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#BB9B49]/40 bg-white/5 text-[#D6B967] transition-all duration-300 hover:-translate-y-1 hover:border-[#D6B967] hover:bg-[#BB9B49]/15 ${focusStyles}`}
                  >
                    <FaFacebookF size={17} aria-hidden="true" />
                  </a>
                ) : (
                  <span
                    aria-label="Facebook próximamente"
                    title="Facebook próximamente"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#BB9B49]/20 bg-white/5 text-[#D6B967]/50"
                  >
                    <FaFacebookF size={17} aria-hidden="true" />
                  </span>
                )}
                <span className="text-[11px] text-white/45">
                  Redes próximamente
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-14 h-px bg-gradient-to-r from-transparent via-[#BB9B49]/35 to-transparent lg:mt-18"
        />
        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] leading-relaxed text-white/45 sm:text-xs">
            © {currentYear} Luz de Rubí. Todos los derechos reservados.
          </p>
          <p className="text-[11px] tracking-[0.04em] text-[#E8D8B5]/65 sm:text-xs">
            Rubiela Pineda Cortés
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
