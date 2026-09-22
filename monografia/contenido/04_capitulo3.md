# CAPÍTULO III: MARCO METODOLÓGICO

Este capítulo define el camino metodológico del estudio. La metodología, entendida con Hernández-Sampieri, Fernández y Baptista (2023) como el conjunto de procedimientos y técnicas aplicados sistemáticamente para obtener y analizar datos, se expone aquí en sus componentes: tipo y diseño de investigación, población y muestra, técnicas e instrumentos, y el marco de desarrollo Scrum con el que se construyó el producto.

## 3.1 Tipo de investigación

El estudio adopta un enfoque mixto con orientación tecnológica aplicada. Se trata de investigación aplicada porque el propósito no es ampliar un cuerpo teórico sino crear un producto funcional: la aplicación móvil y su servidor intermediario. Vargas-Cordero (2021) describe la investigación aplicada como aquella orientada a la generación de prototipos y sistemas que impactan la eficiencia de las organizaciones, que es exactamente lo que ocurre con el canal de noticias desarrollado.

Al mismo tiempo, el estudio tiene un componente descriptivo en su fase inicial. Antes de construir se necesitó describir y dimensionar el fenómeno: cómo acceden los estudiantes de la Sede Maicao a la información, cuánto les cuesta en datos y tiempo, qué esperan de una solución móvil. Hernández-Sampieri et al. (2023) señalan que el alcance descriptivo busca especificar las propiedades del fenómeno, y esa descripción fue el insumo del Product Backlog.

## 3.2 Diseño de la investigación

El diseño es no experimental y de campo. No se manipularon variables: los datos primarios —hábitos de acceso, restricciones de conectividad, valoraciones de usabilidad— se recolectaron en el entorno natural de la comunidad académica, sin construir situaciones artificiales. La recolección se hizo en un momento único, en la fase de diagnóstico y al cierre de la fase de pruebas, sin seguimiento longitudinal del grupo.

Esa elección tiene una consecuencia práctica: los resultados describen el comportamiento de la muestra en el período estudiado, de febrero a julio de 2026, y no pretenden generalizarse más allá de la población de la Sede Maicao. Es coherente con el objetivo del proyecto, que no es establecer relaciones causales sino demostrar la viabilidad de una solución tecnológica en un contexto concreto.

## 3.3 Población y muestra

La población está constituida por los estudiantes y docentes activos de la Sede Maicao de la Universidad de La Guajira que consultan el portal institucional desde dispositivos móviles. Se trata de una población extensa y heterogénea, repartida entre los distintos programas de la sede.

Dado que el proyecto valida mediante prueba piloto, se trabajó con una muestra intencional por conveniencia de treinta usuarios, distribuidos entre estudiantes de diferentes programas y algunos docentes. Treinta es un tamaño defendible para la escala SUS: es la muestra que Brooke asoció históricamente con la confiabilidad del instrumento, y permite además comparar tiempos de carga y consumos sin requerir una logística de campo amplia. Los participantes se seleccionaron entre quienes acceden al portal al menos una vez por semana desde el celular, porque son los que sufren el problema y los que pueden valorar la mejora.

## 3.4 Técnicas e instrumentos de recolección de datos

### 3.4.1 Encuesta cuantitativa

A la muestra de treinta usuarios se aplicó una encuesta estructurada con preguntas sobre hábitos de acceso al portal, dispositivos utilizados, calidad de la conectividad y expectativas frente a la solución. Las respuestas usaron mayoritariamente escala Likert de cinco puntos, lo que permite presentaciones numéricas sencillas y compara entre grupos de programas.

### 3.4.2 Entrevista estructurada

Se realizaron entrevistas a informantes clave, en particular al personal de sistemas de la universidad, para entender los patrones de actualización del portal, las restricciones técnicas de acceso y las políticas de uso de la infraestructura web institucional. Estas entrevistas no buscaron opinión sino datos de operación: con qué frecuencia se publica, qué secciones concentran el contenido y si existe alguna restricción técnica para el acceso automatizado.

### 3.4.3 Pruebas de rendimiento comparativo

La medición del consumo de datos y de los tiempos de carga se hizo comparando dos rutas: la consulta directa al portal desde el navegador móvil y la consulta a través de la aplicación. Se utilizó monitoreo de tráfico a nivel de red para contabilizar los kilobytes transferidos y los milisegundos de latencia en cada escenario, con una rutina de prueba repetida y condiciones de red comparables. Los valores obtenidos se presentan en el capítulo V.

### 3.4.4 Escala SUS

La usabilidad se evaluó con la System Usability Scale, un instrumento estandarizado de diez ítems validado internacionalmente para la medición de la usabilidad percibida. El cuestionario se aplicó a cada participante después de usar la aplicación en una sesión guiada con tareas típicas: leer una noticia, buscar un tema, filtrar por categoría y actualizar el contenido.

## 3.5 Metodología de desarrollo de software: Scrum

La construcción del sistema siguió Scrum, el marco documentado por Schwaber y Sutherland (2020). La elección responde a tres ventajas concretas para el contexto del proyecto. La primera es la adaptabilidad: los Sprints permiten incorporar la retroalimentación de los usuarios piloto entre iteraciones. La segunda es la entrega temprana de valor: desde el segundo Sprint se contó con versiones parciales funcionales de la aplicación. La tercera es la transparencia: las ceremonias y los artefactos hacen visible el estado real del proyecto para el director y para los propios integrantes del equipo.

El proyecto se organizó en cinco Sprints de cuatro semanas cada uno, para un total de veinte semanas. Cada Sprint cerró con un incremento revisado y una retrospectiva de la que salieron los ajustes del siguiente ciclo.

## 3.6 Roles del equipo Scrum

Tabla 2. Roles del equipo Scrum

| Rol | Nombre | Responsabilidades |
|---|---|---|
| Product Owner | Jhostin Pabón Ramírez | Define la visión del producto, prioriza el backlog, gestiona los requerimientos de experiencia de usuario y valida los incrementos con el director. |
| Scrum Master | Miguel Ángel Ureche Bravo | Facilita las ceremonias, elimina impedimentos técnicos, asegura el cumplimiento de la metodología y lidera el desarrollo del backend. |
| Developers | M. Ureche Bravo y J. Pabón Ramírez | Diseñan la base de datos, desarrollan las API del servidor, construyen el frontend móvil y ejecutan las pruebas de integración. |

Fuente: elaboración propia (2026).

## 3.7 Product Backlog

Tabla 3. Product Backlog del sistema

| ID | Historia de usuario | Prioridad |
|---|---|---|
| PB-01 | Como estudiante de la Sede Maicao, quiero acceder a las noticias y comunicados del portal de la universidad desde mi celular de forma rápida y sin consumir muchos datos. | Alta |
| PB-02 | Como usuario, quiero una interfaz limpia con menú lateral colapsable (Sidebar) que clasifique las noticias por categorías institucionales (Academia, Bienestar, Admisiones). | Alta |
| PB-03 | Como lector, quiero un buscador de noticias en tiempo real integrado en la barra superior para localizar contenido institucional de inmediato. | Alta |
| PB-04 | Como usuario, quiero alternar entre cuatro modos visuales cíclicos (Oscuro, Atardecer, Amanecer y Claro) para ajustar la lectura a las condiciones de luz. | Media |
| PB-05 | Como administrador, quiero que el proxy automatice la actualización de la caché en MariaDB y controle la frecuencia de peticiones al portal institucional. | Media |

Fuente: elaboración propia (2026).

## 3.8 Validez y confiabilidad

La validez de contenido del sistema se garantizó mediante juicio de expertos: el diseño de la arquitectura fue revisado por un ingeniero de software con experiencia en desarrollo móvil, quien evaluó la pertinencia de la solución frente a los objetivos. La confiabilidad se estableció mediante pruebas integrales. Siguiendo la clasificación de Pressman y Maxim (2021), se aplicaron pruebas de caja negra para verificar funcionalmente cada módulo, pruebas de estrés para validar el comportamiento del proxy bajo carga y pruebas de usabilidad con la escala SUS para confirmar que la aplicación resulta intuitiva para la comunidad académica.

## 3.9 Cronograma de actividades

Tabla 4. Cronograma de ejecución del proyecto (5 Sprints — 20 semanas)

| Actividad / Fase | S1 | S2 | S3 | S4 | S5 |
|---|---|---|---|---|---|
| I. Análisis y diagnóstico (Sprint 0) | | | | | |
| 1.1 Levantamiento de requerimientos de acceso web móvil | X | | | | |
| 1.2 Análisis de la infraestructura web de UniGuajira | X | | | | |
| 1.3 Definición del Product Backlog inicial | X | | | | |
| II. Diseño de arquitectura | | | | | |
| 2.1 Diseño del modelo MVC y base de datos MariaDB (MER) | | X | | | |
| 2.2 Prototipo de interfaz móvil (mockups y wireframes) | | X | X | | |
| 2.3 Definición de historias de usuario por Sprint | | X | | | |
| III. Construcción | | | | | |
| 3.1 Frontend: interfaz inmersiva en React, temas visuales | | X | X | | |
| 3.2 Backend: servidor proxy Node.js/Express y módulo de extracción | | | X | X | |
| 3.3 Módulo de perfil, seguridad y hashing (Bcrypt) | | | X | | |
| IV. Validación y pruebas | | | | | |
| 4.1 Pruebas funcionales e integración (caja negra) | | | | X | X |
| 4.2 Pruebas de usabilidad (SUS) y consumo de datos | | | | | X |
| 4.3 Ajustes y corrección de errores | | | | | X |
| V. Despliegue y documentación final | | | | | |
| 5.1 Empaquetado de la aplicación (.apk) | | | | | X |
| 5.2 Entrega de la monografía y documentación final | | | | | X |

Fuente: elaboración propia (2026). S = Sprint de cuatro semanas. X = período de ejecución de la actividad.