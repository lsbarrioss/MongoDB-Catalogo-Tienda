# Falabello: catálogo de una tienda con MongoDB

Ejemplo de implementación del **Grupo 1 – MongoDB** para el laboratorio de bases de datos no relacionales.

Falabello es una tienda en línea sencilla cuyo catálogo se guarda en **MongoDB**, una base de datos **documental**. El ejemplo muestra por qué este modelo es útil para un catálogo: cada producto se guarda como un documento JSON y puede tener **campos diferentes** según su tipo, sin que haya que modificar un esquema. Un celular guarda su memoria RAM, una camiseta sus tallas y un libro su autor, y todos conviven en la misma colección.

## Integrantes

- Laura Sofía Barrios Sosa
- Gabriela Morales Herrera
- Claudia Lorena Cerquera Gonzalez
- Rosa Catalina Acuña Ramirez

## Qué demuestra el ejemplo

| Funcionalidad de la página | Operación en MongoDB | Concepto |
|---|---|---|
| Ver el catálogo | `find()` | Documentos con estructuras distintas en una misma colección |
| Filtrar por categoría | `find({ category })` | Consultas con filtros |
| Agregar un producto con atributos propios | `insertOne()` | Esquema flexible |
| Vender una unidad | `findOneAndUpdate()` con `$inc` | Actualización de un campo |
| Eliminar un producto | `deleteOne()` | Eliminación de documentos |
| Resumen por categoría | `aggregate()` con `$group` | Pipeline de agregación |

## Tecnologías

- **MongoDB Community Server** (versión gratuita) como base de datos.
- **Node.js** con **Express** para el servidor y la API REST.
- **Driver oficial de MongoDB para Node.js** para ejecutar las operaciones.
- **HTML, CSS y JavaScript** para la página web.

## Estructura del proyecto

```
falabello/
├── server.js                         Arranca el servidor
├── env/
│   └── mongoConfig.js                Lee la configuración del archivo .env
├── services/
│   └── mongo.service.js              Conexión con MongoDB
├── dao/
│   └── product.dao.js                Operaciones sobre la colección products
├── controllers/
│   ├── product.controller.js         Reciben las peticiones y responden
│   └── category.controller.js
├── routes/
│   ├── product.routes.js             Rutas de la API
│   └── category.routes.js
├── validators/
│   └── product.validator.js          Validación de los datos de entrada
├── errors/
│   └── http.error.js                 Error personalizado con código HTTP
├── scripts/
│   ├── seed-products.js              Carga los productos iniciales
│   └── data/products.json            Productos iniciales
├── public/                           Página web que ve el usuario
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── main.js                   Coordina la página y sus eventos
│       ├── api.js                    Peticiones al servidor
│       ├── productCards.js           Tarjetas de productos
│       ├── categoryViews.js          Tabla de resumen y lista de categorías
│       ├── productForm.js            Lectura del formulario
│       └── formatters.js             Formato de precios y atributos
├── .env.example
├── .gitignore
└── package.json
```

## Requisitos

1. [Node.js](https://nodejs.org) versión 20.6 o superior.
2. [MongoDB Community Server](https://www.mongodb.com/try/download/community) instalado y en ejecución.
3. [MongoDB Compass](https://www.mongodb.com/try/download/compass) (opcional, para ver los datos guardados).

## Cómo ejecutarlo

1. Clonar el repositorio y entrar a la carpeta:

   ```
   git clone <enlace-del-repositorio>
   cd <nombre-de-la-carpeta>
   ```

2. Instalar las dependencias:

   ```
   npm install
   ```

3. Crear el archivo `.env` a partir de `.env.example`:

   - En Windows (CMD): `copy .env.example .env`
   - En macOS o Linux: `cp .env.example .env`

   Valores por defecto:

   | Variable | Valor | Significado |
   |---|---|---|
   | `PORT` | `3000` | Puerto donde funciona la página |
   | `MONGODB_URI` | `mongodb://localhost:27017` | Dirección del servidor de MongoDB |
   | `DATABASE_NAME` | `storeCatalog` | Nombre de la base de datos |

4. Cargar los productos iniciales. Este comando borra los productos existentes y deja los cinco del ejemplo:

   ```
   npm run seed
   ```

   Resultado esperado: `Carga inicial completada: 5 productos insertados`

5. Iniciar el servidor:

   ```
   npm start
   ```

   Resultado esperado:

   ```
   Conectado a MongoDB, base de datos "storeCatalog"
   Falabello disponible en http://localhost:3000
   ```

6. Abrir `http://localhost:3000` en el navegador.

Para detener el servidor se presiona `Ctrl + C` en la terminal.

## Cómo comprobar que la página usa MongoDB

1. Agregar un producto desde el formulario de la página.
2. Abrir MongoDB Compass, conectarse a `mongodb://localhost:27017`, entrar a `storeCatalog` y luego a `products`, y presionar **Refresh**. El producto nuevo aparece como un documento.
3. Editar el precio de un producto directamente en Compass y recargar la página. El precio nuevo aparece en la tarjeta.

## API REST

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/products` | Lista los productos. Acepta el filtro `?category=Ropa` |
| `POST` | `/api/products` | Crea un producto |
| `POST` | `/api/products/:id/sales` | Registra una venta y descuenta el stock |
| `DELETE` | `/api/products/:id` | Elimina un producto |
| `GET` | `/api/categories/summary` | Resumen de productos, unidades y precio promedio por categoría |

Ejemplo del cuerpo para crear un producto:

```json
{
  "name": "Bolso de Mano",
  "category": "Accesorios",
  "price": 120000,
  "stock": 3,
  "attributes": {
    "colors": ["Rosado", "Blanco"],
    "material": "Cuero"
  }
}
```

Ejemplo del cuerpo para registrar una venta:

```json
{
  "quantity": 1
}
```

## Ejemplo de documento guardado en MongoDB

```json
{
  "_id": "ObjectId generado por MongoDB",
  "name": "Camiseta Deportiva",
  "category": "Ropa",
  "price": 59900,
  "stock": 50,
  "brand": "Adidas",
  "gender": "Mujer",
  "sizes": ["S", "M", "L"],
  "colors": ["Negro", "Blanco", "Azul", "Rosado"],
  "material": "Poliéster"
}
```
