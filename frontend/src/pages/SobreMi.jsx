import { useState } from "react";

function SobreMi() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="w-full">
      <section className="relative w-full">
        <img
          src="/assets/images/Frame-second-page.png"
          alt="Banner"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-between items-center text-tertiary">
          <div className="mt-[76px] px-[310px] text-center">
            <h1 className="text-[60px] font-Abhaya text-[var(--color-goldLight)] leading-tight">
              Sobre Mí
            </h1>
          </div>
          <div className="mb-[71px] px-[350px] text-center">
            <p className="text-[24px] font-Abhaya">
              Para poder guiarte en tu camino espiritual, debes saber quien soy.
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center px-4 pt-10">
        <h2 className="mb-6 text-center text-[30px] font-medium text-[var(--color-goldLight)] animate-pulse">
          Haz clic en la carta y descubre quién soy 🌟
        </h2>

        <div
          className="w-[470px] h-[707px] perspective cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
              flipped ? "rotate-y-180" : ""
            }`}
          >
            <div className="absolute w-full h-full backface-hidden">
              <img
                src="/assets/images/card-la-emperatriz.png"
                alt="La Emperatriz"
                className="w-full h-full object-cover rounded-xl shadow-xl"
              />
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl bg-gradient-to-b from-primary to-secondary p-8 overflow-y-auto shadow-xl">
              <div className="text-goldLight text-[18px] font-light space-y-4 text-justify">
                <h2 className="text-[32px] font-Abhaya text-goldLight text-center mb-4">
                  Rubiela Pineda Cortés
                </h2>
                <p className="text-[22px] font-light text-justify text-tertiary leading-relaxed">
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
        </div>
      </section>

      <section className="mt-20 h-[642px] relative text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-30 z-0"></div>
        <div className="relative z-10">
          <div className="pt-[56px] px-[571px]">
            <h2 className="text-[55px] font-Abhaya text-[#9E874D]">
              Mi Misión
            </h2>
          </div>
          <div className="px-[184px] mt-6">
            <p className="text-[30px] font-inter text-[#7C7C70]">
              Mi misión es ofrecer un acompañamiento espiritual auténtico y
              profundo. A través de valores sólidos, brindo confianza,
              comprensión y guía a cada persona que acude a mí.
            </p>
          </div>
          <div className="flex justify-center gap-10 mt-10 px-10">
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
            ].map((item, index) => (
              <div
                key={index}
                className="w-[350px] h-[250px] rounded-xl bg-[#526B9F] px-14 py-14 flex flex-col justify-between"
              >
                <h3 className="text-[27px] font-Abhaya text-[#9E874D] mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-[17px] font-inter text-tertiary text-center">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-20 text-center">
        <h2 className="text-[55px] font-Abhaya text-[#7C7C70] mb-12">
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
              className="w-[380px] h-[300px] rounded-xl bg-gradient-to-b from-primary to-secondary px-6 py-6 text-left"
            >
              <h3 className="text-[27px] font-Abhaya text-[var(--color-goldLight)]">
                {item.name}
              </h3>
              <p className="text-[18px] font-inter text-tertiary mb-4">
                {item.location}
              </p>
              <p className="italic text-[18px] font-light text-tertiary">
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
