# Luz de Rubí

Aplicación web desarrollada en **React** y **TailwindCSS** para la guía espiritual de Rubiela Pineda. Permite a los usuarios registrarse, iniciar sesión, consultar servicios espirituales, ver su horóscopo y agendar citas personalizadas.

## Características

- **Registro e inicio de sesión** con autenticación JWT.
- **Validaciones de formularios** usando `react-hook-form` y `Yup`.
- **Consulta de horóscopos** diarios a través de una API externa.
- **Agenda de citas** para reservar servicios espirituales.
- **Interfaz moderna** y responsiva con TailwindCSS.
- **Protección de rutas** para usuarios autenticados.

## Tecnologías

- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [react-hook-form](https://react-hook-form.com/)
- [Yup](https://github.com/jquense/yup)
- [Vite](https://vitejs.dev/)

## Instalación

1. Clona el repositorio:

   ```sh
   git clone https://github.com/tuusuario/rubiela-tarot.git
   cd rubiela-tarot/frontend

   ```

## 2. Instala las dependencias:

- npm install

## 3. Crea un archivo .env en la carpeta frontend y agrega tu clave de API:

- VITE_API_NINJAS_KEY=TU_CLAVE_API

## 4. nicia la aplicación:

- npm run dev

## Scripts útiles

- npm run dev — Inicia el servidor de desarrollo.
- npm run build — Genera la versión de producción.
- npm run lint — Ejecuta ESLint para revisar el código.

## Estructura principal

- src/pages — Páginas principales (Home, Consultas, Agenda, Contacto, etc.)
- src/components — Componentes reutilizables (Navbar, Footer, SidebarHoroscopo, etc.)
- src/schemas — Esquemas de validación Yup.
- src/utils — Utilidades (API, manejo de tokens, etc.)
- src/contexts — Contexto global de autenticación.

## API

- Horóscopos: Se obtiene el horóscopo diario usando la API de api-ninjas.com.
- Usuarios: El registro y autenticación se realiza mediante una API propia (pendiente de implementación en backend).
- Licencia
  Proyecto educativo y de uso personal.

Desarrollado con ❤️ para Rubiela Pineda Espiritual.
