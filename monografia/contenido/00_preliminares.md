# RESUMEN

El portal institucional de la Universidad de La Guajira concentra la información oficial que estudiantes y docentes consultan a diario, pero llegar a ella desde un teléfono es un proceso lento y costoso para la comunidad de la Sede Maicao. El sitio carga elementos que poco aportan a la lectura de una noticia y, en una región donde el plan de datos pesa sobre el bolsillo, cada consulta se convierte en un obstáculo. Este trabajo se propuso desarrollar una aplicación móvil multiplataforma que centralizara y difundiera las noticias institucionales, reduciendo el consumo de datos y mejorando la experiencia de usuario. La interfaz se construyó con React y Capacitor; un servidor intermedio en Node.js y Express extrae el contenido del portal y lo convierte a un formato liviano; y una base de datos MariaDB conserva una copia local para que las noticias sigan disponibles cuando la conexión falla. El proceso siguió Scrum, organizado en cinco sprints distribuidos en veinte semanas. El diagnóstico se apoyó en encuestas aplicadas a un grupo piloto de treinta usuarios y la validación combinó pruebas de caja negra, medición del tráfico de red y la escala SUS. Los resultados mostraron una reducción cercana al 50% en el consumo de datos frente a la navegación directa al portal, tiempos de carga menores y una puntuación SUS superior a setenta, que ubica el producto en una categoría de usabilidad aceptable. Se concluye que un canal móvil propio, alimentado por un proxy con caché, resulta viable y pertinente para la difusión informativa institucional en contextos de conectividad limitada.

PALABRAS CLAVE: Aplicación móvil; noticias institucionales; servidor proxy; caché de datos; usabilidad; La Guajira.

# ABSTRACT

Institutional news of the University of La Guajira is published on the official website, but reaching that content from a smartphone is slow and data-hungry for the academic community of the Maicao campus. The site loads scripts and media that add little to the reading experience, and for students on limited data plans every visit turns into a cost. This project set out to develop a multiplatform mobile application that centralizes and disseminates institutional news, reducing data consumption and improving usability. The interface was built with React and Capacitor; an intermediate server running on Node.js and Express extracts the portal content and transforms it into a lightweight format; and a MariaDB database keeps a local copy so news remains available when the connection drops. The work followed Scrum, arranged in five sprints across twenty weeks. The diagnostic stage relied on surveys answered by a pilot group of thirty users, and validation combined black-box testing, network traffic measurement, and the System Usability Scale. Results showed a reduction close to 50% in data consumption compared with direct browsing of the portal, shorter loading times, and a SUS score above seventy, placing the product in an acceptable usability range.

KEYWORDS: Mobile application; institutional news; proxy server; data cache; usability; La Guajira.

# LISTA DE TABLAS

## Tabla 1. Operacionalización de variables

## Tabla 2. Roles del equipo Scrum

## Tabla 3. Product Backlog del sistema

## Tabla 4. Cronograma de ejecución del proyecto (5 Sprints — 20 semanas)

## Tabla 5. Herramientas tecnológicas

## Tabla 6. Comparación del consumo de datos: portal directo vs aplicación

## Tabla 7. Resultados de la evaluación SUS por participante

# LISTA DE FIGURAS

## Figura 1. Arquitectura del sistema (patrón MVC)

## Figura 2. Diagrama entidad-relación de la base de datos

## Figura 3. Mockup de la interfaz móvil

## Figura 4. Vista del feed de noticias en la aplicación

# GLOSARIO

CACHÉ: almacenamiento temporal de datos para acelerar consultas posteriores y reducir la carga sobre el servidor de origen.

CAPACITOR: entorno de empaquetado que permite compilar aplicaciones web en binarios nativos para Android e iOS.

EXPO: contexto de ejecución para desarrollo ágil de aplicaciones móviles multiplataforma.

MUESTREO INTENCIONAL: técnica de selección no probabilística en la que los participantes se eligen según criterios de conveniencia del investigador.

PROXY: servidor intermediario que gestiona las peticiones entre los clientes y el servidor de origen.

SCRAPING: extracción automatizada de datos estructurados a partir del código HTML de una página web.

SUS: System Usability Scale, instrumento estandarizado de diez ítems para medir la usabilidad percibida.

SPRINT: ciclo iterativo de trabajo de duración fija dentro del marco de Scrum.