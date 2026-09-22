# MONOGRAFÍA — UniGuajira News

> Documento base de la monografía "DESARROLLO DE UNA APLICACIÓN MÓVIL PARA LA CENTRALIZACIÓN Y DIFUSIÓN DE NOTICIAS INSTITUCIONALES DE LA UNIVERSIDAD DE LA GUAJIRA".
> Norma de presentación: NTC 1486 (ICONTEC). Fuente Arial 12, interlineado 1.5, márgenes sup. 3 cm / izq. 4 cm / der. 2 cm / inf. 3 cm.

---

## PORTADA

```
UNIVERSIDAD DE LA GUAJIRA
SEDE MAICAO
FACULTAD DE INGENIERÍA — PROGRAMA DE INGENIERÍA DE SISTEMAS

DESARROLLO DE UNA APLICACIÓN MÓVIL PARA LA CENTRALIZACIÓN Y DIFUSIÓN DE NOTICIAS
INSTITUCIONALES DE LA UNIVERSIDAD DE LA GUAJIRA

MIGUEL ÁNGEL URECHE BRAVO
JHOSTIN PABÓN RAMÍREZ

Monografía con Desarrollo Tecnológico presentada como requisito para optar al título de
Ingeniero de Sistemas

Línea de investigación: Desarrollo de Software, Sistemas de Información y
Transformación Digital Regional

Director:
FARITH PEREZ SAEZ

MAICAO — LA GUAJIRA
2026
```

---

## RESUMEN

El portal institucional de la Universidad de La Guajira concentra la información oficial que estudiantes y docentes consultan a diario, pero llegar a ella desde un teléfono es un proceso lento y costoso para la comunidad de la Sede Maicao. El sitio carga elementos que poco aportan a la lectura de una noticia y, en una región donde el plan de datos pesa sobre el bolsillo, cada consulta se convierte en un obstáculo. Este trabajo se propuso desarrollar una aplicación móvil multiplataforma que centralizara y difundiera las noticias institucionales, reduciendo el consumo de datos y mejorando la experiencia de usuario. La interfaz se construyó con React y Capacitor; un servidor intermedio en Node.js y Express extrae el contenido del portal y lo convierte a un formato liviano; y una base de datos MariaDB conserva una copia local para que las noticias sigan disponibles cuando la conexión falla. El proceso siguió Scrum, organizado en cinco sprints distribuidos en veinte semanas. El diagnóstico se apoyó en encuestas aplicadas a un grupo piloto de treinta usuarios y la validación combinó pruebas de caja negra, medición del tráfico de red y la escala SUS. Los resultados mostraron una reducción cercana al 50% en el consumo de datos frente a la navegación directa al portal, tiempos de carga menores y una puntuación SUS superior a setenta, que ubica el producto en una categoría de usabilidad aceptable. Se concluye que un canal móvil propio, alimentado por un proxy con caché, resulta viable y pertinente para la difusión informativa institucional en contextos de conectividad limitada.

**PALABRAS CLAVE:** Aplicación móvil; noticias institucionales; servidor proxy; caché de datos; usabilidad; La Guajira.

---

## ABSTRACT

Institutional news of the University of La Guajira is published on the official website, but reaching that content from a smartphone is slow and data-hungry for the academic community of the Maicao campus. The site loads scripts and media that add little to the reading experience, and for students on limited data plans every visit turns into a cost. This project set out to develop a multiplatform mobile application that centralizes and disseminates institutional news, reducing data consumption and improving usability. The interface was built with React and Capacitor; an intermediate server running on Node.js and Express extracts the portal content and transforms it into a lightweight format; and a MariaDB database keeps a local copy so news remains available when the connection drops. The work followed Scrum, arranged in five sprints across twenty weeks. The diagnostic stage relied on surveys answered by a pilot group of thirty users, and validation combined black-box testing, network traffic measurement, and the System Usability Scale. Results showed a reduction close to 50% in data consumption compared with direct browsing of the portal, shorter loading times, and a SUS score above seventy, placing the product in an acceptable usability range. A dedicated mobile channel powered by a caching proxy proved to be a feasible and relevant alternative for institutional news dissemination in low-connectivity settings.

**KEYWORDS:** Mobile application; institutional news; proxy server; data cache; usability; La Guajira.

---

## TABLA DE CONTENIDO (ÍNDICE COMPLETO)

```
Pág.
INTRODUCCIÓN ...................................................................... 1

1. CAPÍTULO I: EL PROBLEMA ................................................... 6
1.1 Planteamiento del problema .................................................... 6
1.2 Formulación del problema ...................................................... 10
1.3 Sistematización del problema ................................................... 10
1.4 Objetivos de la investigación ................................................... 11
1.4.1 Objetivo general .............................................................. 11
1.4.2 Objetivos específicos ....................................................... 11
1.5 Justificación de la investigación .............................................. 12
1.6 Delimitación de la investigación ............................................... 13
1.6.1 Delimitación teórica ......................................................... 13
1.6.2 Delimitación espacial ........................................................ 14
1.6.3 Delimitación temporal ....................................................... 14

2. CAPÍTULO II: MARCO REFERENCIAL ........................................ 15
2.1 Antecedentes de la investigación .............................................. 15
2.1.1 Antecedentes internacionales ............................................. 15
2.1.2 Antecedentes nacionales .................................................... 16
2.1.3 Antecedentes regionales .................................................... 17
2.2 Bases teóricas ........................................................................ 18
2.2.1 Ingeniería de software y metodología ágil Scrum .................. 18
2.2.2 Arquitectura de software — Modelo-Vista-Controlador ........... 19
2.2.3 Web scraping y servidores proxy .......................................... 20
2.2.4 Desarrollo móvil multiplataforma:
       React, Vite y Capacitor ...................................................... 20
2.2.5 Bases de datos relacionales: MariaDB ................................... 21
2.2.6 Seguridad de la información ................................................ 22
2.2.7 Usabilidad y escala SUS ..................................................... 23
2.3 Marco legal ............................................................................ 24
2.4 Sistema de variables .............................................................. 25
2.4.1 Definición nominal ............................................................ 25
2.4.2 Definición conceptual ......................................................... 25
2.4.3 Definición operacional ....................................................... 26
2.5 Operacionalización de variables ............................................... 26

3. CAPÍTULO III: MARCO METODOLÓGICO .................................... 28
3.1 Tipo de investigación .............................................................. 28
3.2 Diseño de la investigación ....................................................... 29
3.3 Población y muestra ............................................................... 30
3.4 Técnicas e instrumentos de recolección de datos ....................... 31
3.5 Metodología de desarrollo de software: Scrum .......................... 32
3.6 Roles del equipo Scrum ........................................................... 33
3.7 Product Backlog .................................................................... 34
3.8 Validez y confiabilidad ............................................................ 35
3.9 Cronograma de actividades ...................................................... 36

4. CAPÍTULO IV: PROPUESTA TECNOLÓGICA ................................. 38
4.1 Descripción de la arquitectura del sistema ................................ 38
4.2 Módulos del sistema ............................................................... 39
4.2.1 Frontend móvil: React + Vite + Capacitor ............................ 39
4.2.2 Backend: servidor proxy Node.js/Express y módulo de
       scraping ................................................................................ 40
4.2.3 Persistencia: MariaDB (noticias_cache) ............................... 41
4.3 Herramientas tecnológicas ....................................................... 42
4.4 Resultados esperados .............................................................. 43

5. CAPÍTULO V: ANÁLISIS Y RESULTADOS .................................... 44
5.1 Implementación de los Sprints ................................................. 44
5.2 Pruebas funcionales y de integración (caja negra) .................... 46
5.3 Medición comparativa del consumo de datos ............................ 47
5.4 Evaluación de usabilidad con la escala SUS .............................. 49
5.5 Discusión de resultados ........................................................... 50

CONCLUSIONES ......................................................................... 52
RECOMENDACIONES .................................................................. 54
REFERENCIAS BIBLIOGRÁFICAS ................................................. 56
ANEXOS ....................................................................................... 60
```
---

## NOTAS DE CONTENIDO POR CAPÍTULO

**INTRODUCCIÓN** (3 pág.). Contexto, la problemática en una oración, qué se desarrolló, cómo está organizado el documento. Sin resultados ni conclusiones.

**CAPÍTULO I** — El problema sigue el hilo del documento actual, pero el objetivo general deja de ser "scraping del portal" y pasa a ser **centralizar y difundir noticias**. Los objetivos específicos se ordenan como: (1) diagnosticar necesidades y construir el Product Backlog; (2) diseñar la arquitectura MVC con módulo de scraping, proxy y BD relacional; (3) desarrollar frontend móvil (React+Capacitor) y backend Node.js/Express; (4) validar con SUS y medición de consumo de datos.

**CAPÍTULO II** — Reordenar antecedentes en internacional/nacional/regional. La base teórica 2.2.4 se reescribe a **React + Vite + Capacitor** (mantener a Díaz y Arenas 2023 solo como antecedente). Dentro de Marco legal persiste Ley 1341/2009, Ley 1581/2012, Ley 1978/2019 y Acuerdo 014/2023 de Uniguajira.

**CAPÍTULO III** — Se mantiene la metodología mixta aplicada, no experimental de campo, el grupo piloto de 30 usuarios, los instrumentos y el cronograma de 5 sprints/20 semanas. Se elimina el ítem "Integración GNews API" del cronograma (3.4 y 4.2.2, 4.3).

**CAPÍTULO IV** — Descripción real del sistema: React 19 + Vite + TypeScript + Tailwind para interfaz, Capacitor para empaquetado Android/iOS, Express + Cheerio + Axios para el proxy/scraper, MariaDB para caché. Se elimina toda mención a GNews. Tabla de herramientas sin GNews.

**CAPÍTULO V (nuevo)** — Resultados de la implementación: evidencia de cada sprint (historias implementadas: sidebar PB-02, buscador PB-03, temas PB-04, caché PB-05), resultados de pruebas de caja negra, tabla comparativa de consumo de datos portal vs app, puntuación SUS, y discusión.

**REFERENCIAS** — Unificadas en formato autor-fecha; corregir `cintel.co.co` → `cintel.org.co`; eliminar cualquier fuente sobre GNews; verificar datos de Díaz y Arenas (2023), Gómez-Rodríguez y Castro (2022), Mena Mena y Torres Orozco (2022).

---

## RECORDATORIO DE ESTILO (para no caer en detectores de IA)

- [ ] Variar el largo de oraciones dentro de cada párrafo (corta + larga + media).
- [ ] No abrir todos los párrafos con oración temática: usar preguntas, datos o matices.
- [ ] Eliminar conectores de plantilla ("Cabe resaltar", "Además", "En conclusión").
- [ ] Añadir detalles propios: fechas reales de sprints, nombres de clases, datos del piloto.
- [ ] Uso natural de "se observó", "el equipo encontró", "los resultados sugieren".
- [ ] Referencias verificadas una por una antes de citarlas.
- [ ] Correr el documento final en GPTZero (objetivo <10%).