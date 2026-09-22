# CAPÍTULO V: ANÁLISIS Y RESULTADOS

Este capítulo presenta lo que se entregó en cada Sprint, los resultados de las pruebas funcionales, la medición comparativa del consumo de datos y la evaluación de usabilidad con la escala SUS. Los datos que se reportan provienen de la prueba piloto realizada con treinta usuarios de la Sede Maicao.

## 5.1 Implementación de los Sprints

La construcción se organizó en cinco Sprints de cuatro semanas. El primero cerró con el diagnóstico y el Product Backlog; de ahí salieron las cinco historias de usuario que se muestran en la Tabla 3 y que delimitaron el alcance del sistema.

El segundo y el tercer Sprint cubrieron el diseño y la construcción del núcleo. En el Sprint 2 se fijó la arquitectura MVC, se definió el modelo de datos y se produjeron los primeros mockups de la interfaz. En el Sprint 3 se construyó el backend; el servidor Express quedó operativo junto con el módulo de extracción y la conexión a MariaDB. Al cierre de este Sprint la API devolvía noticias reales del portal y el frontend las presentaba en una lista.

El Sprint 4 se dedicó a completar la experiencia de usuario. Se terminaron las historias PB-02 (sidebar por categorías), PB-03 (buscador en tiempo real) y PB-04 (los cuatro temas visuales), y se integró el módulo de usuarios con Bcrypt para el registro y el ingreso. El Sprint 5 fue de endurecimiento: pruebas de caja negra sobre cada endpoint, corrección de errores, ajuste de la política de peticiones al portal y empaquetado del binario Android con Capacitor.

El seguimiento del estado quedó registrado en Trello, con cada historia movida de pendiente a hecha conforme se completaba, y el código se mantuvo en GitHub con un historial que refleja los incrementos por Sprint.

## 5.2 Pruebas funcionales y de integración

Las pruebas de caja negra verificaron cada endpoint de la API y cada pantalla del frontend. Para cada caso se definieron entradas válidas e inválidas y se comparó la respuesta contra lo esperado. Los casos principales y su resultado se resumen en la siguiente relación, sin entrar en el detalle de centenares de registros:

| Caso | Entrada | Resultado esperado | Resultado |
|---|---|---|---|
| Listar noticias | GET /api/news | Devolver noticias en orden de fecha | Correcto |
| Filtrar por categoría | GET /api/news?categoria=Academia | Devolver solo noticias de la categoría | Correcto |
| Fuente vacía | Caché sin noticias | Responder sin error e iniciar extracción en segundo plano | Correcto |
| Extracción forzada | POST /api/news/refresh | Actualizar caché y devolver novedades | Correcto |
| Registro duplicado | POST /api/auth/register (email repetido) | Rechazar con conflicto | Correcto |
| Credenciales inválidas | POST /api/auth/login (contraseña errónea) | Rechazar sin revelar el motivo | Correcto |

Las pruebas de estrés, más modestas, consistieron en lanzar consultas concurrentes contra el proxy para observar su comportamiento bajo carga. El servidor mantuvo respuestas correctas y tiempos estables dentro del rango de usuarios esperado.

Los defectos encontrados se corrigieron en el Sprint 5. El más relevante fue un caso de caché vacía que inicialmente devolvía un error en lugar de iniciar la extracción automática; se ajustó el controlador para que, ante caché vacía, responda con un mensaje informativo y dispare la actualización en segundo plano.

## 5.3 Medición comparativa del consumo de datos

La medición se realizó sobre una muestra de veinte noticias del feed, comparando el tráfico generado al consultar cada noticia por dos rutas: el portal directo desde un navegador móvil y la aplicación sobre el caché del proxy. Se contabilizaron los kilobytes transferidos en la carga inicial de la lista de noticias y en la apertura de una noticia individual.

Tabla 6. Comparación del consumo de datos: portal directo vs aplicación

| Escenario | Portal directo (KB) | Aplicación (KB) | Reducción |
|---|---|---|---|
| Carga de la lista de noticias | 2.840 | 148 | 94,8% |
| Apertura de una noticia | 846 | 52 | 93,9% |
| Imagen de una noticia | 214 | 18 | 91,6% |

Los valores son llamativos y conviene leerlos con cuidado. La diferencia no sorprende: el portal transfiere hojas de estilo completas, guiones de seguimiento y componentes de imagen redundantes en cada carga, mientras que la aplicación envía solo los objetos JSON con los datos y las imágenes en su tamaño optimizado. La reducción del peso transferido no significa que la información sea menos completa; significa que se deja de descargar todo lo que rodea a la noticia sin aportar a su lectura.

La medición del tiempo de carga acompañó a la del tráfico. En la red celular disponible en la sede, la apertura de la lista de noticias pasó de varios segundos en el navegador a una respuesta prácticamente inmediata en la aplicación, gracias a que los datos ya están almacenados en el caché local y no dependen de la velocidad de la conexión en el momento de la consulta.

## 5.4 Evaluación de usabilidad con la escala SUS

Al terminar las pruebas funcionales, los treinta participantes usaron la aplicación en una sesión guiada con cuatro tareas y respondieron el cuestionario SUS de diez ítems. Cada respuestas se calificó en escala Likert de cinco puntos y la puntuación total se transformó al intervalo de cero a ciento según el procedimiento estándar del instrumento.

Tabla 7. Resultados de la evaluación SUS por participante

| Participante | Puntaje SUS |
|---|---|
| P1 a P30 | Ver anexo B (hoja de cálculo con puntuaciones individuales) |

La puntuación media del grupo se ubicó por encima del umbral de setenta, lo que, siguiendo la interpretación usual de la escala, ubica a la aplicación en el rango aceptable de usabilidad. La dispersión entre participantes fue moderada; los ítems mejor valorados correspondieron a la facilidad de uso y a la confianza percibida, mientras que los relacionados con la complejidad de algunas opciones, como la alternancia de temas, obtuvieron valoraciones levemente menores.

Los comentarios en lenguaje natural de los participantes refuerzan la lectura cuantitativa. Varios estudiantes señalaron que "por fin se puede ver lo que publica la universidad sin gastar tanta data", y el uso del buscador fue la función que generó más comentarios positivos espontáneos. Las observaciones críticas se concentraron en detalles de presentación, como el tamaño de las imágenes y el contraste de algunos temas, que quedaron registrados como mejoras para versiones posteriores.

## 5.5 Discusión de resultados

Los resultados de la validación responden a los dos ejes que justifican el proyecto: la eficiencia de red y la usabilidad. En el primer eje, la reducción del tráfico coincide con el rango del 40% al 65% que Gómez-Rodríguez y Castro (2022) reportaron para proxies con caché, y en el escenario de este proyecto incluso lo supera, porque la comparación se hace frente a un portal de alta densidad visual. La magnitud exacta depende de las condiciones concretas de la medición, pero la dirección del resultado es robusta: un canal que sirve contenido desde el caché transfiere siempre una fracción mínima del peso del sitio original.

En el segundo eje, la puntuación SUS obtenida respalda lo que ya se intuía en las entrevistas del diagnóstico: los usuarios no carecen de interés por la información institucional, carecen de un canal cómodo para acceder a ella. Que la facilidad de uso y la confianza hayan recibido las mejores valoraciones es coherente con la historia PB-01, que pedía acceso rápido y de bajo costo.

Conviene anotar las limitaciones de esta validación. La muestra de treinta usuarios es reducida y no probabilística, la medición de tráfico se realizó en un período específico con las versiones del portal y la aplicación vigentes en ese momento, y los participantes usaron la aplicación en sesiones guiadas, no en uso libre prolongado. Las conclusiones, por lo tanto, describen la viabilidad de la solución en la Sede Maicao, no un comportamiento generalizable a toda la universidad.