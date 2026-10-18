# Custom API, Front-End Challenge - Mid-Level 🚀
Debido a limitaciones del filtrado y para evitar cargar al front-end con solicitudes demasiado complejas, decidí crear una API desde cero utilizando **Node.js** y **Express.js**. Esta API está diseñada para manejar peticiones más complejas y proporcionar una mejor experiencia de usuario.

## Prerrequisitos

Tener instalados Node y NPM:

- [Node.js](https://nodejs.org/es/download/)
- [npm](https://www.npmjs.com/get-npm) (Node Package Manager)

## Tecnologías Utilizadas

Este proyecto fue desarrollado utilizando las siguientes tecnologías:

- **Express**: Como framework.
- **MongoDB**: Como base de datos.
- **Mongoose**: Para modelar los datos de MongoDB y realizar consultas.
- **dotenv**: Para manejar variables de entorno de manera segura.
- **cors**: Para permitir solicitudes desde diferentes orígenes.

## Base URL
```
https://fake-api-listings.vercel.app/api-docs/
```

## Endpoints de la API
- `GET` /properties → Lista de propiedades.
    - Query parameters:
      - `sort`: Ordena las propiedades por `date`(predeterminado), `price_desc` o `price_asc`.
      - `page`: Número de página para la paginación (predeterminado: 1).
      - `limit`: Número de propiedades por página (predeterminado: 10).
- `GET` /properties/:id → Detalles de una propiedad.
- `GET` /properties/search → Detalles de una propiedad.
  - Query parameters:
    - `query`: Parámetro de búsqueda.
    - `page`: Número de página para la paginación (predeterminado: 1).
    - `limit`: Número de propiedades por página (predeterminado: 10).
- `POST` /properties → Crear una propiedad.
- `PUT` /properties/:id → Editar una propiedad.
- `DELETE` /properties/:id → Eliminar una propiedad.

## Instrucciones para instalar y ejecutar

Seguir los siguientes pasos para la correcta ejecución (local) del proyecto:

### 1. Clonar el repositorio

```bash
git clone https://github.com/hbaravalle/api-red-atlas
cd api-red-atlas
```

### 2. Instalar dependencias

Navegar al directorio del proyecto y ejecutar:

```bash
npm install
```

### 3. Crear variables de entorno

Crea un archivo `.env` en la raíz del proyecto y agrega tus variables de entorno:

```plaintext
APP_PORT=
DB_CONNECTION=
```


### 4. Ejecutar seeders

Para crear ejecutar datos de prueba en la base de datos, usar el siguiente comando:

```bash
npm seeders/propertySeeder.js
```

### 6. Ejecutar el servidor

Inicia el servidor de desarrollo:

```bash
npm start
```

---

¡Gracias por la oportunidad!
