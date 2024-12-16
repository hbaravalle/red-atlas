# Front-End Challenge - Mid-Level 🚀

## Prerrequisitos

Tener instalados Node y NPM:

- [Node.js](https://nodejs.org/es/download/)
- [npm](https://www.npmjs.com/get-npm) (Node Package Manager)

## Tecnologías Utilizadas

Este proyecto fue desarrollado utilizando las siguientes tecnologías:

- **Redux Toolkit**: Para la gestión del estado global de la aplicación.
- **React-Redux**: Para integrar Redux con React.
- **Mapbox**: Servicio para crear mapas interactivos.
- **React Router**: Para la navegación entre diferentes vistas de la aplicación.
- **React Hook Form**: Para la creación de formularios con validaciones.
- **Date-fns**: Biblioteca para el manejo de fechas.
- **Feather Icons**: Librería para usar íconos vectoriales.

## Funcionalidades de la Aplicación

- [x] Mostrar una lista de propiedades
- [x] Vista de detalle de las propiedades
- [x] Mapa interactivo
- [x] Formulario de creación de propiedades con validaciones
- [x] Paginación de propiedades

## API custom
Debido a limitaciones del filtrado y para evitar cargar al front-end con solicitudes demasiado complejas, decidí crear una API desde cero utilizando **Node.js** y **Express.js**. Esta API está diseñada para manejar peticiones más complejas y proporcionar una mejor experiencia de usuario. La base de datos utilizada es no relacional, gestionada con **MongoDB** y **Mongoose**, y está desplegada en **Mongo Atlas**.

- Base URL: https://fake-api-listings.vercel.app/api-docs/
- Endpoints:
  - GET /properties: Lista de propiedades.
    - Query parameters:
      - `sort`: Ordena las propiedades por `date`(predeterminado), `price_desc` o `price_asc`.
      - `page`: Número de página para la paginación (predeterminado: 1).
      - `limit`: Número de propiedades por página (predeterminado: 10).
  - GET /properties/:id: Detalles de una propiedad.
  - GET /properties/search Detalles de una propiedad.
    - Query parameters:
      - `query`: Parámetro de búsqueda.
      - `page`: Número de página para la paginación (predeterminado: 1).
      - `limit`: Número de propiedades por página (predeterminado: 10).
  - POST /properties: Crear una propiedad.
  - PUT /properties/:id: Editar una propiedad.
  - DELETE /properties/:id: Eliminar una propiedad.

Para más detalles de la API, consulta el repositorio de la API aquí: [API Red Atlas](https://github.com/hbaravalle/api-red-atlas).

## Instrucciones para instalar y ejecutar la aplicación

### 1. Clonar el repositorio

```bash
git clone --branch hernan-baravalle https://github.com/hbaravalle/mid-frontend-challenge
cd frontend-haciendola-challenge
```

### 2. Instalar dependencias

Habiendo navegado hacia el directorio del proyecto, ejecutar:

```bash
npm install
```

### 3. Variables de entorno

A partir del archivo `.env.example`, crear un nuevo archivo que contenga la siguiente variable de entorno y su valor correspondiente:
```bash
VITE_MAPBOX_TOKEN=
```

### 4. Iniciar la aplicación

Ejecuta el siguiente comando para iniciar la aplicación en modo de desarrollo:

```bash
npm run dev
```

## Mejoras pendientes

- [ ] Formulario de edición
- [ ] Filtro de propiedades avanzado
- [ ] Mejor organización de tipos
- [ ] customHooks para evitar repetir bloques de código

---

¡Gracias por la oportunidad!
