# CAPÍTULO II: MARCO REFERENCIAL

## 2.1 Antecedentes de la investigación

### 2.1.1 Antecedentes internacionales

En el plano internacional, el desarrollo de aplicaciones institucionales de noticias y de portales livianos para comunidades vulnerables tiene una línea de trabajo consolidada. La literatura más útil para este proyecto no proviene de las universidades de élite, sino de experiencias donde el ancho de banda fue el condicionante principal del diseño. Los resultados son consistentes en un punto: la diferencia entre una buena y una mala experiencia no la define la cantidad de funciones, sino la capacidad del sistema para entregar la información esencial con el menor peso posible (Tanenbaum y Wetherall, 2022).

Varios proyectos académicos en la región latinoamericana han seguido esa lógica para canales universitarios. Se trata, en general, de arquitecturas de dos o tres capas en las que un servidor intermedio se encarga del acceso al contenido y una aplicación móvil o web ligera lo presenta. La validación de estos trabajos suele apoyarse en métricas de rendimiento de red y en escalas de usabilidad, y sus conclusiones apuntan en la misma dirección: cuando el canal es liviano y está pensado para el móvil, los usuarios lo adoptan y lo consultan con más frecuencia.

### 2.1.2 Antecedentes nacionales

En Colombia, Díaz y Arenas (2023), de la Universidad del Norte, diseñaron e implementaron una aplicación móvil en React Native como canal de comunicación para comunidades académicas universitarias. El estudio concluyó que las aplicaciones móviles reducen la fricción de acceso a la información institucional y mejoran la adherencia de los estudiantes a los canales oficiales. Para este proyecto, el hallazgo sirve de respaldo al supuesto central: un canal móvil propio es usado por los estudiantes cuando existe y les resulta cómodo.

También a nivel nacional, Gómez-Rodríguez y Castro (2022) estudiaron la optimización del consumo de datos móviles mediante servidores proxy intermediarios. Su medición, realizada sobre portales de alta densidad visual, arrojó reducciones de entre el 40% y el 65% del ancho de banda consumido. Ese rango es la referencia cuantitativa que orientó la meta de este trabajo: llegar al menos a una reducción del 50% sin sacrificar la calidad de la información entregada.

### 2.1.3 Antecedentes regionales

En el Caribe colombiano, Mena Mena y Torres Orozco (2022), de la Universidad de Córdoba, desarrollaron una plataforma web de noticias locales con arquitectura de bajo consumo para zonas de baja conectividad. El trabajo es el referente geográfico más cercano a este proyecto: comparte el problema (comunidades con señal deficiente) y la solución de fondo (un proxy con caché que acerque el contenido a los usuarios). Su experiencia muestra que la solución técnica funciona en el contexto caribeño y que el principal reto no es tecnológico, sino de adopción por parte de la comunidad.

## 2.2 Bases teóricas

### 2.2.1 Ingeniería de software y metodología ágil Scrum

La ingeniería de software contemporánea abandonó los modelos rígidos en cascada en favor de procesos evolutivos e incrementales. Pressman y Maxim (2021) describen el desarrollo como un proceso que se ajusta conforme se aprende del producto y del usuario, no como una secuencia lineal de etapas cerradas. En esa línea, este proyecto adoptó el marco Scrum definido por Schwaber y Sutherland (2020). Scrum divide el trabajo en ciclos cortos llamados Sprints, cada uno con una meta y un incremento entregable.

La elección de Scrum obedece al contexto. El proyecto se desarrolla con recursos limitados y un equipo de dos personas, y el riesgo más alto no es técnico sino de desajuste entre lo construido y lo que los usuarios necesitan. Los Sprints permiten entregar versiones parciales de la aplicación desde las primeras semanas, mostrarlas al director y a los usuarios piloto, y corregir rumbo antes de gastar semanas en una funcionalidad equivocada. Retroalimentación temprana, pruebas continuas e incrementos pequeños son, en síntesis, las tres razones por las que Scrum encaja con las condiciones de este trabajo.

### 2.2.2 Arquitectura de software — Modelo-Vista-Controlador

La arquitectura del sistema sigue el patrón Modelo-Vista-Controlador (MVC). El Modelo gestiona la lógica de los datos: la estructura de la tabla noticias_cache en MariaDB y los objetos JSON que produce el módulo de extracción. La Vista presenta la información al usuario final mediante la interfaz React. El Controlador intermedia entre ambos a través de las rutas del servidor Express. Kendall y Kendall (2021) explican que esta separación de responsabilidades es esencial en los sistemas empresariales, porque permite actualizar la interfaz sin tocar la lógica de negocio y viceversa.

En la práctica, esa separación se refleja en las carpetas del proyecto: el frontend, el servidor, la extracción y el acceso a datos conviven en un mismo repositorio pero permanecen como módulos independientes. El beneficio concreto en un proyecto de grado es la posibilidad de probar cada capa por separado y de explicar el sistema pieza por pieza.

### 2.2.3 Web scraping y servidores proxy

El web scraping es la técnica de extracción automatizada de datos estructurados a partir del HTML de una página. El módulo de extracción de este proyecto procesa el portal https://uniguajira.edu.co/, localiza los elementos informativos (títulos, descripciones, imágenes, enlaces) y los transforma en objetos JSON optimizados para móviles. No se indexa el sitio completo: interesan las noticias y comunicados, y el resto del contenido se descarta.

Un servidor proxy es un intermediario entre los clientes y el servidor de origen. Tanenbaum y Wetherall (2022) describen la función de la caché como el mecanismo clásico para reducir la latencia y el ancho de banda: las respuestas se almacenan en un punto cercano al cliente y las peticiones repetidas se atienden desde ahí. Este proyecto aplica ese principio: la primera consulta al portal es costosa, pero se hace una vez y queda guardada; las siguientes se atienden desde MariaDB con una fracción de los datos.

### 2.2.4 Desarrollo móvil multiplataforma: React, Vite y Capacitor

Las plataformas de desarrollo móvil multiplataforma permiten construir una sola vez e implementar en varios sistemas operativos. Joyanes Aguilar (2020) señala que esa característica democratiza el acceso a tecnología móvil para proyectos con recursos limitados. En este proyecto, el frontend se construyó con React en su versión 19, apoyado en Vite para la compilación y en Tailwind CSS para el diseño de la interfaz.

El empaquetado móvil se resolvió con Capacitor, el entorno de la familia Ionic que toma la aplicación web ya compilada y produce los binarios nativos para Android e iOS. Esta combinación —una interfaz moderna en React, un flujo de compilación rápido con Vite y el empaquetado nativo de Capacitor— resuelve el problema de fondo: una sola base de código, una interfaz pensada para pantalla táctil y una distribución real en las tiendas de aplicaciones.

### 2.2.5 Bases de datos relacionales: MariaDB

Para la capa de persistencia se utilizó MariaDB, un sistema gestor de bases de datos relacional de código abierto. Silberschatz, Korth y Sudarshan (2020) subrayan que los datos transaccionales exigen las propiedades ACID: atomicidad, consistencia, aislamiento y durabilidad. En este caso, la tabla principal, noticias_cache, guarda las noticias procesadas por el módulo de extracción con su contenido, fuente, categoría y fecha de publicación. Su función es doble: mitigar la latencia de las consultas y garantizar la disponibilidad de la información cuando la conexión del usuario falla, porque la noticia ya está guardada en local.

### 2.2.6 Seguridad de la información

El manejo de los datos de usuario se apoya en la tríada CIA de confidencialidad, integridad y disponibilidad descrita por Stallings y Brown (2019). El módulo de usuarios encripta las contraseñas con el algoritmo de hashing Bcrypt antes de almacenarlas y aplica control de acceso por roles (RBAC) para distinguir lectores de administradores. El tratamiento de los datos personales de los usuarios se alinea con la Ley 1581 de 2012 (Habeas Data), que regula la recolección y el uso de información personal en Colombia.

### 2.2.7 Usabilidad y escala SUS

La usabilidad se conceptualiza como la facilidad con la que un usuario aprende y utiliza un sistema para alcanzar sus objetivos. Para medirla de forma estandarizada se empleó la System Usability Scale (SUS), desarrollada por Brooke y ampliamente validada en la literatura. El instrumento consta de diez ítems con respuesta en escala Likert de cinco puntos; sus puntuaciones van de cero a cien, y valores superiores a setenta se consideran aceptables. En este proyecto, la SUS se aplicó al grupo piloto tras la fase de pruebas, y sus resultados se presentan en el capítulo V.

## 2.3 Marco legal

Ley 1341 de 2009 — Ley de TIC. Define los principios y conceptos de la sociedad de la información y la organización de las Tecnologías de la Información y las Comunicaciones en Colombia, y establece el marco de fomento a la adopción de tecnologías digitales, incluida la educación superior.

Ley 1581 de 2012 — Habeas Data. Regula el tratamiento de datos personales en Colombia. La aplicación debe garantizar la protección de la información de los usuarios registrados, cumpliendo los principios de finalidad, necesidad y veracidad.

Ley 1978 de 2019 — Modernización del Sector TIC. Establece el marco para el despliegue y la masificación del acceso a internet en el territorio nacional y se convierte en fundamento normativo para proyectos de optimización del consumo de datos en regiones con conectividad limitada como La Guajira.

Acuerdo 014 de 2023 de la Universidad de La Guajira. Reglamento que define los lineamientos y requisitos de las modalidades de trabajo de grado, incluida la Monografía con Desarrollo Tecnológico, bajo cuyas disposiciones se enmarca este proyecto.

## 2.4 Sistema de variables

### 2.4.1 Definición nominal

Aplicación móvil para la centralización y difusión de las noticias institucionales de la Universidad de La Guajira, Sede Maicao.

### 2.4.2 Definición conceptual

Una aplicación móvil es un software diseñado para ejecutarse en dispositivos inteligentes y optimizar la experiencia de acceso a servicios e información. Joyanes Aguilar (2020) sostiene que las aplicaciones móviles se convirtieron en el canal de consumo digital predominante y resultan esenciales para garantizar el acceso equitativo a la información en entornos con limitaciones de infraestructura.

### 2.4.3 Definición operacional

La variable se mide a través del cumplimiento de los requisitos funcionales implementados en los módulos del sistema (extracción, caché y frontend), evaluados mediante pruebas de caja negra, y a través de dos métricas cuantitativas: la reducción porcentual del consumo de datos frente al acceso directo al portal y la puntuación obtenida en la escala SUS.

## 2.5 Operacionalización de variables

Tabla 1. Operacionalización de variables

| Objetivo específico | Variable | Dimensiones | Indicadores | Autores |
|---|---|---|---|---|
| Determinar los requerimientos funcionales y técnicos de la aplicación. | Aplicación móvil de noticias institucionales | Diagnóstico de necesidades | Tiempo de carga del portal; consumo de datos móviles; nivel de satisfacción de usuarios; herramientas actuales de acceso | Pressman y Maxim (2021); Hernández-Sampieri et al. (2023) |
| Diseñar la arquitectura MVC con módulo de extracción, proxy y base de datos relacional. | Aplicación móvil de noticias institucionales | Arquitectura y modelado | Diagramas UML y MER; historias de usuario; estructura de la base de datos relacional; patrón MVC definido | Kendall y Kendall (2021); Silberschatz et al. (2020) |
| Desarrollar los módulos del frontend móvil y del servidor intermedio. | Aplicación móvil de noticias institucionales | Construcción tecnológica | Módulos funcionales implementados; integración proxy-frontend; calidad del código en GitHub; Sprints completados | Schwaber y Sutherland (2020); Joyanes Aguilar (2020) |
| Validar la efectividad mediante pruebas piloto: reducción de datos y usabilidad. | Aplicación móvil de noticias institucionales | Validación y pruebas | Porcentaje de reducción del consumo de datos; puntuación escala SUS; tiempo de carga comparativo; tasa de error en peticiones | Pressman y Maxim (2021); Schwaber y Sutherland (2020) |

Fuente: elaboración propia a partir de los objetivos específicos del proyecto (2026).