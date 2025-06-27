import { useState } from "react";

function SobreMi() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="w-full">
      <section className="relative w-full">
        <img
          src="/assets/images/Frame-second-page.png"
          alt="Banner"
          className="w-full object-cover object-center absolute h-full"
        />
        <div
          className="relative inset-0 flex flex-col justify-center items-center text-tertiary px-4 sm:px-6 md:px-10 lg:px-[65px] py-[44px] 
        gap-6 md:gap-8 lg:gap-10 z-10 text-shadow-[0_2px_4px_rgba(0,0,0,0.5)"
        >
          <div className="text-center max-w-[800px] px-2 mx-auto">
            <h1 className="text-[32px] md:text-[48px] lg:text-[60px] font-Abhaya text-[var(--color-goldLight)] leading-tight">
              Sobre Mí
            </h1>
            <p className="text-[15px] md:text-[18px] lg:text-[22px] font-Abhaya leading-tight mt-4">
              Para poder guiarte en tu camino espiritual, debes saber quién soy.
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-[95px] pt-10">
        <h2 className="mb-6 text-center text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-medium text-[var(--color-goldLight)] animate-pulse">
          Haz clic en la carta y descubre quién soy 🌟
        </h2>

        <div
          className="w-[90%] sm:w-[280px] md:w-[380px] lg:w-[470px] perspective cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative w-full h-[500px] sm:h-[600px] md:h-[650px] lg:h-[707px] transition-transform duration-700 transform-style-preserve-3d ${
              flipped ? "rotate-y-180" : ""
            }`}
          >
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden rounded-xl shadow-xl">
              <img
                src="/assets/images/card-la-emperatriz.png"
                alt="La Emperatriz"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl bg-gradient-to-b from-primary to-secondary p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto shadow-xl">
              <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-Abhaya text-goldLight text-center mb-4">
                Rubiela Pineda Cortés
              </h2>
              <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-light text-justify text-tertiary leading-relaxed">
                Soy guía espiritual y lectora de tarot con más de 32 años de
                experiencia. Desde muy joven descubrí mi don, heredado de mi
                abuela, quien me enseñó a leer las cartas y a conectar con la
                energía de cada ser.
                <br />
                <br />
                Mi propósito es ayudarte a encontrar claridad, amor y
                abundancia, iluminando tu camino con mensajes positivos y
                sabiduría ancestral.
                <br />
                <br />
                Cada consulta es un espacio sagrado para descubrir tu verdad y
                acercarte a tu destino con esperanza.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 relative text-center overflow-hidden px-4 sm:px-6 md:px-10 lg:px-[65px] py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 z-0"></div>
        <div className="relative z-10 max-w-[900px] mx-auto">
          <h2 className="text-[24px] sm:text-[32px] md:text-[40px] lg:text-[55px] font-Abhaya text-[#9E874D] mb-4 ">
            Mi Misión
          </h2>
          <p className="text-[16px] sm:text-[20px] md:text-[24px] lg:text-[30px] font-inter text-[#7C7C70] leading-relaxed ">
            Mi misión es ofrecer un acompañamiento espiritual auténtico y
            profundo. A través de valores sólidos, brindo confianza, comprensión
            y guía a cada persona que acude a mí.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap justify-center gap-6 mt-10">
          {[
            {
              title: "Compromiso",
              desc: "Dedicación total al bienestar y crecimiento espiritual de mis consultantes.",
            },
            {
              title: "Experiencia",
              desc: "Años de práctica y conocimiento en lectura de tarot y guía espiritual.",
            },
            {
              title: "Confianza",
              desc: "Espacio seguro y confidencial para todas tus consultas.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="w-[90%] sm:w-[300px] md:w-[320px] lg:w-[350px] h-[220px] rounded-xl bg-[#526B9F] p-10 flex flex-col justify-baseline"
            >
              <h3 className="text-[18px] sm:text-[22px] md:text-[24px] lg:text-[27px] font-Abhaya text-[#9E874D] mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-inter text-tertiary text-center leading-snug drop-shadow-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-20 text-center px-4 sm:px-6 md:px-10 lg:px-[65px] py-4">
        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[55px] font-Abhaya text-[#7C7C70] mb-12">
          Testimonios
        </h2>
        <div className="flex flex-wrap justify-center gap-[30px] max-w-[1200px] mx-auto mb-25">
          {[
            {
              name: "May Donoban",
              location: "Bogotá, Colombia",
              comment:
                "Rubiela cambió mi vida por completo. Sus lecturas fueron increíblemente precisas y los consejos que me dio me ayudaron a tomar decisiones importantes. Gracias a ella encontré el amor verdadero.",
            },
            {
              name: "Juliana Quiñones",
              location: "Medellín, Colombia",
              comment:
                "Llegué a Rubiela en un momento muy difícil de mi vida. Sus consejos y rituales me ayudaron a superar una crisis financiera. Ahora mi negocio prospera y estoy muy agradecida por su guía espiritual.",
            },
            {
              name: "Salomé Cortanga",
              location: "Cali, Colombia",
              comment:
                "He consultado con Rubiela durante 5 años y nunca me ha defraudado. Su intuición es asombrosa y siempre tiene palabras de aliento que me dan esperanza. La recomiendo totalmente.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="w-[90%] sm:w-[300px] md:w-[340px] lg:w-[380px] h-auto rounded-xl bg-gradient-to-b from-primary to-secondary px-6 py-6 text-left"
            >
              <h3 className="text-[18px] sm:text-[22px] md:text-[24px] lg:text-[27px] font-Abhaya text-[var(--color-goldLight)] mb-2">
                {item.name}
              </h3>
              <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-inter text-tertiary mb-4">
                {item.location}
              </p>
              <p className="italic text-[14px] sm:text-[16px] md:text-[18px] lg:text-[18px] font-light text-tertiary leading-relaxed">
                "{item.comment}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SobreMi;
