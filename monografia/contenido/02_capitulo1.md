# CAPÍTULO I: EL PROBLEMA

## 1.1 Planteamiento del problema

Las instituciones de educación superior usan sus canales digitales para difundir lo que les ocurre y comunica: resultados de procesos de admisión, calendarios académicos, circulares administrativas, actividades culturales. En la teoría, el portal web es un medio suficiente; en la práctica, depende de las condiciones del usuario que lo consulta. Pressman y Maxim (2021) insisten en que los sistemas de información deben adaptarse al contexto tecnológico de quien los usa, y ese contexto, en el extremo sur del departamento de La Guajira, dista bastante del que asumen los diseñadores de portales corporativos.

La situación se puede leer en tres escalas. En el plano mundial, la adopción de aplicaciones móviles como canal primario de comunicación institucional en universidades viene creciendo desde hace una década. El móvil no es ya el dispositivo secundario del estudiante: es el único. En el plano nacional, Colombia avanza hacia la digitalización de las instituciones educativas, aunque lo hace a un ritmo desigual. El índice de madurez digital de las organizaciones colombianas se ubicó en 51,5%, según el Centro de Investigación y Desarrollo en Tecnologías de la Información y las Comunicaciones — CINTEL (2023), un valor que deja claro que la mayoría de las instituciones, incluidas las de educación superior, todavía no consolida canales informativos nativos optimizados para el móvil.

En el plano regional, La Guajira agrega restricciones propias. Los informes de la Cámara de Comercio de La Guajira (2023) describen una infraestructura de telecomunicaciones deficiente y una dinámica comercial fronteriza como la de Maicao, donde el costo del dato móvil pesa en el presupuesto de los hogares. Cuando un estudiante abre el portal institucional desde su celular, el navegador descarga hojas de estilo completas, guiones de seguimiento y galerías de imágenes que nada tienen que ver con la noticia que le interesa. Esa transferencia no es gratis: se descuenta del plan, y se repite cada vez que el estudiante vuelve a consultar.

En la Sede Maicao de la Universidad de La Guajira, el diagnóstico previo a este trabajo dejó ver tres limitaciones concretas. La primera es la experiencia de usuario móvil. La navegación por el portal introduce ruido visual: cabeceras densas, menús extensos y elementos decorativos que restan espacio a la información. La segunda es la ineficiencia de red. El consumo de datos que origina cada consulta es excesivo para el tipo de contenido que se ofrece y se agrava en una zona donde la señal de datos es intermitente. La tercera es la ausencia de un canal centralizado y organizado: la información de interés académico, investigativo o administrativo aparece dispersa en secciones que no siempre son fáciles de encontrar desde un teléfono.

Estas tres limitaciones justifican el desarrollo de una solución a la medida. No se trata de rediseñar el portal de la universidad, que cumple su papel informativo en escritorio, sino de crear un canal alterno pensado para el móvil y para la realidad de la región: liviano, organizado por categorías y capaz de funcionar con una conexión inestable.

## 1.2 Formulación del problema

¿Cómo centralizar y difundir las noticias institucionales de la Universidad de La Guajira para la comunidad académica de la Sede Maicao, mediante una aplicación móvil multiplataforma que mejore la experiencia de usuario y reduzca el consumo de datos móviles?

## 1.3 Sistematización del problema

¿Cuáles son los requerimientos funcionales y técnicos de una aplicación móvil para la centralización y difusión del contenido noticioso de la Universidad de La Guajira, en términos de usabilidad, eficiencia de red y escalabilidad?

¿Qué arquitectura de software, basada en el patrón Modelo-Vista-Controlador, permite centralizar, organizar y servir el contenido noticioso institucional mediante un módulo de extracción automatizada y una base de datos de caché en MariaDB?

¿Cómo se implementan los módulos de la aplicación móvil en React con Capacitor y el servidor intermedio en Node.js y Express, cumpliendo estándares básicos de calidad y de manejo seguro de la información de los usuarios?

¿De qué manera las pruebas piloto permiten validar la efectividad del sistema en la reducción del consumo de datos y en la mejora de la experiencia de usuario, medida con la escala SUS?

## 1.4 Objetivos de la investigación

### 1.4.1 Objetivo general

Desarrollar una aplicación móvil multiplataforma para la centralización y difusión de las noticias institucionales de la Universidad de La Guajira, que permita a la comunidad académica de la Sede Maicao acceder a la información oficial de forma rápida, organizada y con un consumo de datos reducido.

### 1.4.2 Objetivos específicos

Determinar los requerimientos funcionales y técnicos de la aplicación móvil y las restricciones de conectividad de los usuarios de la Sede Maicao, para estructurar el Product Backlog inicial del sistema.

Diseñar la arquitectura del sistema basada en el patrón Modelo-Vista-Controlador (MVC), con un módulo de extracción de noticias en el backend y el modelado conceptual y lógico de la base de datos relacional en MariaDB.

Desarrollar los módulos del frontend móvil en React con Capacitor y del servidor intermedio en Node.js y Express, ejecutando los Sprints definidos en la metodología ágil Scrum.

Validar la efectividad del sistema mediante pruebas piloto, midiendo la usabilidad con la escala SUS y el porcentaje de reducción del consumo de datos móviles frente al acceso directo al portal institucional.

## 1.5 Justificación de la investigación

La justificación de este trabajo es práctica ante todo, aunque también hay razones teóricas y sociales detrás. En el plano práctico, la comunidad académica de la Sede Maicao gana un canal de consulta más ágil y barato. La aplicación centraliza las noticias en una sola pantalla, las clasifica por categorías y las entrega en un formato liviano; el efecto esperado es una reducción cercana a la mitad en el consumo de datos, lo que para estudiantes con planes limitados representa un alivio real mensual, no solo una mejora cosmética de interfaz.

En el plano teórico, el proyecto aplica los planteamientos actualizados de la ingeniería de software. El desarrollo se sustenta en las prácticas descritas por Pressman y Maxim (2021) en la novena edición de Ingeniería de software: un enfoque práctico, y en el marco ágil de la Guía de Scrum de Schwaber y Sutherland (2020). Más allá de seguir un manual, el trabajo pone a prueba esas prácticas en un escenario concreto, el de una sede de una universidad de región, que suele quedar fuera de los estudios de caso.

Desde el punto de vista social, la aplicación reduce la brecha digital entre la universidad y sus estudiantes. Joyanes Aguilar (2020) muestra que las arquitecturas en la nube y las aplicaciones móviles democratizan el acceso a tecnología de punta para comunidades con limitaciones de infraestructura; ese argumento, en el contexto de Maicao, se materializa en un producto concreto. La herramienta no resuelve la falta de señal, pero sí cambia lo que el estudiante necesita para mantenerse informado cuando la señal existe.

## 1.6 Delimitación de la investigación

### 1.6.1 Delimitación teórica

El proyecto se enmarca en la línea de investigación de Desarrollo de Software, Sistemas de Información y Transformación Digital Regional. Se apoya en la teoría de la ingeniería de software, las arquitecturas de servidores proxy y de caché de datos, las bases de datos relacionales y los marcos de desarrollo móvil multiplataforma. No se ocupa de la administración de redes ni del diseño de contenidos del portal institucional, que permanece bajo la responsabilidad de la universidad.

### 1.6.2 Delimitación espacial

La investigación se desarrolla en el municipio de Maicao, La Guajira. La población de referencia es la comunidad académica de la Sede Maicao de la Universidad de La Guajira, es decir, estudiantes y docentes que consultan el portal institucional desde dispositivos móviles.

### 1.6.3 Delimitación temporal

El proyecto se ejecuta en un período de veinte semanas distribuidas en cinco Sprints de cuatro semanas. El alcance se limita a lo que puede diseñarse, construirse, validarse y documentarse en ese lapso: el canal de noticias, la extracción y el caché; no se incluye, por ejemplo, la administración de contenidos por parte de la universidad ni una versión productiva con múltiples sedes.