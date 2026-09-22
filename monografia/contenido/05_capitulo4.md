# CAPÍTULO IV: PROPUESTA TECNOLÓGICA

Este capítulo describe la solución construida: la arquitectura del sistema, cada uno de los módulos que la componen y las herramientas con las que se implementaron.

## 4.1 Descripción de la arquitectura del sistema

El sistema se organiza en tres capas desacopladas bajo el patrón MVC. La intención fue desde el inicio que cada componente pudiera mantenerse y probarse por separado, sin que el comportamiento de uno comprometa a los otros. La Figura 1 resume el flujo general.

Figura 1. Arquitectura del sistema (patrón MVC)

```
[Portal UniGuajira - https://uniguajira.edu.co]
        │  consulta controlada
        ▼
[Servidor proxy - Node.js/Express]  ←→  [MariaDB - noticias_cache]
        │  JSON optimizado y comprimido
        ▼
[Frontend móvil - React + Vite + Capacitor]
```

El flujo funciona así. En un extremo está el portal de la universidad, la fuente de origen del contenido. El servidor proxy consulta el portal con una frecuencia controlada, extrae las noticias y las guarda en MariaDB. Cuando el usuario abre la aplicación, las noticias ya no se descargan del portal sino de esa copia local, lo que reduce el tráfico y acelera la carga. El frontend solo se comunica con el proxy, nunca directamente con el sitio institucional.

## 4.2 Módulos del sistema

### 4.2.1 Frontend móvil: React + Vite + Capacitor

La capa de presentación se desarrolló en React 19 con TypeScript, compilada con Vite y estilizada con Tailwind CSS. El empaquetado móvil se resolvió con Capacitor, que toma el producto web compilado y genera los binarios para Android e iOS desde una sola base de código.

Los componentes principales del frontend son los siguientes. El feed de noticias (NewsFeed) presenta los títulos, resúmenes e imágenes de las noticias ordenadas por fecha, en una cuadrícula que se adapta al tamaño de la pantalla. Cada noticia se muestra en una tarjeta (NewsCard) con su categoría, fecha y enlace a la fuente original. El buscador, integrado en la barra superior, filtra el contenido en tiempo real a medida que el usuario escribe. El menú lateral (Sidebar) es colapsable y permite filtrar por las categorías institucionales que el servidor ofrece. El sistema de personalización visual implementa cuatro temas cíclicos: Oscuro, Atardecer, Amanecer y Claro, gestionados por un contexto de tema que ajusta los colores de toda la interfaz.

La interfaz fue pensada para pantalla táctil y para dispositivos de gama media y baja, que son los que predominan entre la población estudiantil de la sede. Por eso, las imágenes se cargan con carga diferida, el texto se limita a unos pocos renglones por tarjeta y la navegación se reduce a gestos simples.

### 4.2.2 Backend: servidor proxy Node.js/Express y módulo de extracción

El servidor se desarrolló en Node.js con Express. Sus responsabilidades son tres: exponer la API REST que consume el frontend, operar el módulo de extracción del portal y administrar el caché en la base de datos.

El módulo de extracción usa Axios para la descarga del HTML y Cheerio para su análisis. Conecta al portal con un agente de usuario rotatorio, localiza los elementos de noticia mediante una lista de selectores, normaliza los textos y las URLs, infiere la categoría a partir del contenido (Admisiones, Academia, Bienestar, Investigación, Extensión, Comunicados o General) y compone los objetos JSON que se almacenan. La extracción es defensiva: si el portal cambia su estructura o responde mal, el servicio no cae; devuelve los datos de la caché y registra el incidente.

La API expone los siguientes recursos:

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/health | Estado del servidor |
| GET | /api/news?categoria=X&limite=N | Noticias cacheadas, filtrables por categoría |
| POST | /api/news/refresh | Fuerza la extracción y actualiza el caché |
| GET | /api/news/categories | Lista las categorías disponibles |
| POST | /api/auth/register | Registro de usuarios |
| POST | /api/auth/login | Autenticación de usuarios |

La seguridad del backend cubre tres frentes. Las contraseñas se almacenan con hash Bcrypt, nunca en texto plano. El control de acceso por roles (RBAC) diferencia lectores de administradores. Y la política de peticiones limita la frecuencia con la que el proxy consulta el portal institucional, para no someter el sitio de la universidad a una carga innecesaria.

### 4.2.3 Persistencia: MariaDB (noticias_cache)

La capa de datos usa MariaDB para almacenar las noticias procesadas y el control operativo del sistema. El esquema, representado en la Figura 2, incluye tres tablas.

Figura 2. Diagrama entidad-relación de la base de datos

```
noticias_cache          usuarios              cache_control
(id, title,             (id, nombre,          (id, last_scrape,
 description, content,   email, password_hash,  requests_today,
 source_url, image_url,  rol, created_at)        last_request_date,
 category, published_at,                        max_daily_requests)
 created_at, updated_at)
```

La tabla noticias_cache contiene el contenido de las noticias con su fuente, imagen, categoría y fecha de publicación. El campo source_url es único, de modo que una misma noticia no se duplica entre extracciones. La tabla usuarios guarda los perfiles con sus contraseñas cifradas y su rol. La tabla cache_control registra la última extracción, la fecha y la cantidad de peticiones realizadas, y limita la frecuencia de consulta al portal.

## 4.3 Herramientas tecnológicas

Tabla 5. Herramientas tecnológicas

| Componente | Tecnología | Propósito |
|---|---|---|
| Frontend móvil | React 19 + TypeScript + Vite + Tailwind | Interfaz multiplataforma Android/iOS |
| Empaquetado móvil | Capacitor | Generación de binarios nativos |
| Servidor intermedio | Node.js / Express | API, extracción de contenido y caché |
| Extracción de contenido | Axios + Cheerio | Análisis del HTML del portal |
| Base de datos | MariaDB (noticias_cache) | Persistencia y caché de noticias |
| Seguridad | Bcrypt + RBAC | Hashing de contraseñas y control de acceso |
| Control de versiones | GitHub | Gestión del código fuente |
| Gestión del proyecto | Trello | Seguimiento de Sprints y tareas |
| Comunicación del equipo | Google Meet + WhatsApp | Reuniones diarias y coordinación |

Fuente: elaboración propia (2026).

## 4.4 Resultados esperados

La monografía entrega un compendio teórico-práctico con tres componentes. El documento científico recoge la justificación metodológica, el análisis del diagnóstico y el análisis de los resultados de la validación. El producto tecnológico incluye el código fuente documentado en GitHub de la aplicación móvil y del servidor proxy, con el binario Android listo para distribución. Las métricas de optimización cuantifican la reducción del consumo de datos y los tiempos de carga frente al acceso directo al portal, junto con la puntuación SUS obtenida en el grupo piloto. Estos resultados se presentan y discuten en el capítulo siguiente.