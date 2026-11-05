// Curso: Inteligencia artificial desde cero
// ChatGPT, Claude y otras herramientas para escribir, aprender, vender, crear imágenes y videos.

const Q = (q, options, answer, explain) => ({ q, options, answer: options[answer], explain })
const R = (id, title, blocks, quiz) => ({ id, title, kind: 'read', blocks, quiz })

const units = [
  {
    id: 'ia1', title: 'Qué es la IA y cómo hablarle', goal: 'Entiende qué puede hacer un asistente de IA y aprende a pedirle las cosas bien.', color: 'ultra',
    lessons: [
      R('ia1-l1', 'Qué es un asistente de IA', [
        { type: 'text', title: 'Un asistente que entiende tu idioma', body: ['ChatGPT, Claude o Gemini son asistentes de inteligencia artificial: les escribes como a una persona y te responden. Sirven para redactar, resumir, explicar, organizar ideas, traducir, programar y mucho más.', 'Aprendieron leyendo enormes cantidades de texto. Por eso escriben muy bien, pero a veces se equivocan con datos, fechas o cifras.'] },
        { type: 'checklist', title: 'Para qué son buenos', items: ['Escribir y corregir textos', 'Explicar temas difíciles con palabras sencillas', 'Dar ideas y organizar planes', 'Resumir documentos largos', 'Crear imágenes (algunas herramientas)'] },
        { type: 'note', tone: 'safety', title: 'Verifica lo importante', body: 'Revisa siempre datos, precios, leyes o temas de salud en una fuente oficial. La IA ayuda mucho, pero no reemplaza a un médico, abogado o contador.' },
      ], [
        Q('¿En qué hay que tener cuidado con la IA?', ['Puede equivocarse con datos y cifras', 'Nunca se equivoca', 'Solo responde en inglés'], 0, 'Revisa lo importante en fuentes oficiales.'),
        Q('¿Para qué es buena la IA?', ['Escribir, resumir y explicar', 'Reemplazar al médico', 'Adivinar el futuro'], 0, 'Es una gran ayuda para tareas de texto e ideas.'),
      ]),
      R('ia1-l2', 'Empieza en 5 minutos', [
        { type: 'steps', title: 'Tu primera conversación', items: ['Entra a chatgpt.com o claude.ai y crea una cuenta gratis con tu correo.', 'Escribe en español, como le hablarías a una persona.', 'Si la respuesta no te gusta, pídele cambios: «más corto», «más formal», «con ejemplos».', 'Guarda las conversaciones útiles para volver a ellas.'] },
        { type: 'prompt', title: 'Prueba esto', text: 'Explícame qué es la inteligencia artificial como si tuviera 12 años, en 5 líneas.' },
        { type: 'note', tone: 'safety', title: 'Cuida tus datos', body: 'No compartas contraseñas, números de tarjeta, cédula ni información privada de tus clientes en un chat de IA.' },
      ], [
        Q('Si la respuesta no te gusta, ¿qué haces?', ['Le pido cambios: más corto, más formal, con ejemplos', 'Cierro y no la vuelvo a usar', 'Copio lo mismo otra vez'], 0, 'La IA mejora mucho cuando le das indicaciones.'),
        Q('¿Qué NO debes compartir con la IA?', ['Contraseñas y datos de tarjeta', 'Una idea de negocio', 'Un texto para corregir'], 0, 'Protege tu información y la de tus clientes.'),
      ]),
      R('ia1-l3', 'La fórmula del buen prompt', [
        { type: 'text', title: 'Pedir bien es la mitad del resultado', body: ['Un «prompt» es la instrucción que le das a la IA. Entre más claro y completo, mejor la respuesta.'] },
        { type: 'checklist', title: 'Fórmula R-T-C-F', items: ['Rol: «Actúa como un experto en ventas»', 'Tarea: «Escribe 3 mensajes para WhatsApp»', 'Contexto: «Vendo un curso de inglés para adultos que trabajan»', 'Formato y tono: «Máximo 3 líneas cada uno, tono cercano»'] },
        { type: 'prompt', title: 'Prompt débil', text: 'Escribe un mensaje para vender un curso.' },
        { type: 'prompt', title: 'Prompt fuerte', text: 'Actúa como experto en ventas por WhatsApp. Escribe 3 mensajes para vender un curso de inglés a adultos que trabajan y tienen poco tiempo. Máximo 3 líneas cada uno, tono cercano, con una pregunta al final.' },
      ], [
        Q('¿Qué hace más fuerte un prompt?', ['Rol, tarea, contexto y formato claros', 'Escribirlo en mayúsculas', 'Que sea de una palabra'], 0, 'Entre más contexto, más útil la respuesta.'),
        Q('En la fórmula, «tono cercano y máximo 3 líneas» es…', ['Formato y tono', 'El rol', 'La tarea'], 0, 'Le dices cómo quieres que se vea la respuesta.'),
      ]),
    ],
  },
  {
    id: 'ia2', title: 'IA para tu día a día', goal: 'Usa la IA para escribir, aprender y organizarte.', color: 'mint',
    lessons: [
      R('ia2-l1', 'Escribir mejor y más rápido', [
        { type: 'text', title: 'Tu corrector y redactor personal', body: ['Correos, mensajes difíciles, cartas o publicaciones: dale a la IA la idea y deja que te ayude con la redacción. Tú revisas y ajustas.'] },
        { type: 'prompt', title: 'Correo formal', text: 'Escribe un correo formal para pedir un permiso de medio día en el trabajo el viernes por una cita médica. Tono respetuoso, máximo 6 líneas.' },
        { type: 'prompt', title: 'Corregir un texto', text: 'Corrige la ortografía y redacción de este texto sin cambiar mi estilo. Después dime qué cambiaste: [pega tu texto]' },
        { type: 'prompt', title: 'Mensaje difícil', text: 'Ayúdame a escribir un mensaje amable pero firme para recordarle a un cliente que tiene un pago pendiente hace 10 días.' },
      ], [
        Q('¿Qué haces con un texto que te escribe la IA?', ['Lo reviso y lo ajusto antes de enviarlo', 'Lo envío sin leerlo', 'Lo borro'], 0, 'Tú eres responsable de lo que envías.'),
        Q('Para corregir sin perder tu estilo, ¿qué le pides?', ['Que corrija sin cambiar mi estilo y explique los cambios', 'Que lo reescriba todo', 'Que lo traduzca al inglés'], 0, 'Ser específico te da el resultado que quieres.'),
      ]),
      R('ia2-l2', 'Aprender cualquier tema', [
        { type: 'text', title: 'Un profesor disponible 24 horas', body: ['Puedes pedirle a la IA que te explique un tema, que te haga preguntas para practicar o que te arme un plan de estudio.'] },
        { type: 'prompt', title: 'Explicación sencilla', text: 'Explícame qué son los intereses de una tarjeta de crédito con un ejemplo en pesos colombianos y palabras sencillas.' },
        { type: 'prompt', title: 'Practicar', text: 'Hazme 5 preguntas de práctica sobre el verbo to be en inglés, una por una, y corrígeme después de cada respuesta.' },
        { type: 'prompt', title: 'Plan de estudio', text: 'Arma un plan de 4 semanas para aprender Excel básico, con 30 minutos diarios. Dime qué practicar cada día.' },
      ], [
        Q('¿Cómo puedes practicar con la IA?', ['Pidiéndole que te haga preguntas y te corrija', 'Solo leyendo sus respuestas', 'No se puede'], 0, 'Practicar activo hace que aprendas más rápido.'),
        Q('Para aprender un tema nuevo, ¿qué pides?', ['Explicación sencilla con un ejemplo de tu vida', 'Un texto muy técnico', 'Nada, se aprende solo'], 0, 'Los ejemplos cercanos hacen que entiendas.'),
      ]),
      R('ia2-l3', 'Organízate', [
        { type: 'text', title: 'Planes, listas y presupuestos', body: ['La IA es muy buena ordenando: semanas, compras, metas o presupuestos. Dale tus datos y pídele un plan claro.'] },
        { type: 'prompt', title: 'Semana organizada', text: 'Trabajo de 8 a. m. a 5 p. m. Quiero estudiar inglés 20 minutos al día, hacer ejercicio 3 veces por semana y dedicar 1 hora diaria a mi negocio. Organiza mi semana en una tabla.' },
        { type: 'prompt', title: 'Presupuesto', text: 'Gano $2.500.000 al mes. Ayúdame a armar un presupuesto con la regla 50/30/20 y dame 3 ideas para ahorrar en Colombia.' },
      ], [
        Q('¿Qué le das a la IA para organizar tu semana?', ['Tus horarios y metas', 'Solo tu nombre', 'Tu contraseña del banco'], 0, 'Con tus datos reales el plan te sirve de verdad.'),
        Q('¿En qué formato conviene pedir un plan semanal?', ['En una tabla', 'En un párrafo larguísimo', 'En otro idioma'], 0, 'Una tabla se lee y se sigue fácil.'),
      ]),
    ],
  },
  {
    id: 'ia3', title: 'IA para vender', goal: 'Crea textos, respuestas y un mes de contenido con ayuda de la IA.', color: 'mango',
    lessons: [
      R('ia3-l1', 'Textos para redes y anuncios', [
        { type: 'text', title: 'De la idea al texto en un minuto', body: ['Dile a la IA qué vendes, a quién y qué problema resuelves. Pídele varias versiones y elige la mejor.'] },
        { type: 'prompt', title: 'Publicación para Instagram', text: 'Escribe 3 versiones de una publicación de Instagram para vender [producto] a [cliente ideal]. Empieza con una frase que llame la atención, menciona 2 beneficios y termina invitando a escribir por WhatsApp. Máximo 80 palabras cada una.' },
        { type: 'prompt', title: 'Ganchos para videos', text: 'Dame 10 frases de inicio para videos de TikTok sobre [tema] que hagan que la gente se quede viendo los primeros 3 segundos.' },
        { type: 'note', tone: 'safety', title: 'Sin promesas falsas', body: 'Si la IA escribe cosas como «resultados garantizados» o «gana millones», bórralas. Tú respondes por lo que publicas.' },
      ], [
        Q('¿Por qué pedir varias versiones?', ['Para elegir la mejor y combinarlas', 'Para publicarlas todas el mismo día', 'No sirve de nada'], 0, 'Comparar te ayuda a encontrar el mejor mensaje.'),
        Q('Si la IA escribe «resultados garantizados», ¿qué haces?', ['Lo quito si no puedo garantizarlo', 'Lo dejo, vende más', 'Lo pongo en mayúsculas'], 0, 'Las promesas falsas son publicidad engañosa.'),
      ]),
      R('ia3-l2', 'Responder clientes', [
        { type: 'text', title: 'Respuestas listas para WhatsApp', body: ['Pídele a la IA respuestas para las preguntas que más te hacen y guárdalas como respuestas rápidas en WhatsApp Business.'] },
        { type: 'prompt', title: 'Preguntas frecuentes', text: 'Vendo [producto]. Escribe respuestas cortas y amables para estas preguntas de clientes por WhatsApp: ¿cuánto cuesta?, ¿cómo se paga?, ¿cuándo llega?, ¿tiene garantía?, ¿está caro?' },
        { type: 'prompt', title: 'Responder una queja', text: 'Un cliente está molesto porque su pedido llegó tarde. Escribe una respuesta que reconozca el problema, pida disculpas y ofrezca una solución concreta.' },
      ], [
        Q('¿Dónde guardas las respuestas que te da la IA?', ['Como respuestas rápidas en WhatsApp Business', 'En ningún lado', 'En la descripción del perfil'], 0, 'Así respondes en segundos.'),
        Q('Una buena respuesta a una queja…', ['Reconoce el problema y ofrece una solución', 'Culpa al cliente', 'Ignora el mensaje'], 0, 'El cliente quiere sentirse escuchado y ver una solución.'),
      ]),
      R('ia3-l3', 'Un mes de contenido', [
        { type: 'text', title: 'Nunca más «no sé qué publicar»', body: ['Con un solo prompt puedes tener ideas para 30 días. Después creas el contenido en bloques, por ejemplo un día a la semana.'] },
        { type: 'prompt', title: 'Calendario de 30 días', text: 'Crea un calendario de contenido de 30 días para una cuenta de Instagram que vende [producto] a [cliente ideal]. En una tabla con: día, tipo (video, carrusel, historia), tema, gancho y llamado a la acción. Mezcla contenido que eduque, entretenga y venda.' },
        { type: 'note', tone: 'tip', title: 'Graba en bloque', body: 'Elige un día a la semana para grabar 5 o 6 videos. Es más fácil que crear algo nuevo cada día.' },
      ], [
        Q('¿Qué tipos de contenido conviene mezclar?', ['Educar, entretener y vender', 'Solo vender', 'Solo memes'], 0, 'Si solo vendes, la gente deja de verte.'),
        Q('¿Qué recomienda el curso para producir contenido?', ['Grabar varios videos en un mismo día', 'Improvisar cada día', 'Publicar solo cuando haya ganas'], 0, 'Trabajar en bloque te da constancia.'),
      ]),
    ],
  },
  {
    id: 'ia4', title: 'Imágenes con IA', goal: 'Crea y edita imágenes para tu negocio y tus redes.', color: 'rose',
    lessons: [
      R('ia4-l1', 'Crea tu primera imagen', [
        { type: 'text', title: 'Describe lo que imaginas', body: ['Herramientas como ChatGPT, Gemini o Canva crean imágenes a partir de una descripción. Entre más detalles le des, más se parece a lo que quieres.'] },
        { type: 'checklist', title: 'Qué describir', items: ['Sujeto: qué aparece', 'Estilo: foto realista, ilustración, 3D, acuarela', 'Luz: natural, de estudio, atardecer', 'Encuadre: de cerca, cuerpo completo, desde arriba', 'Colores y fondo'] },
        { type: 'prompt', title: 'Ejemplo', text: 'Foto realista de una taza de café colombiano sobre una mesa de madera, luz natural de la mañana, vista de cerca, fondo desenfocado de una cocina, colores cálidos.' },
        { type: 'note', tone: 'safety', title: 'Respeta a otros', body: 'No uses la IA para imitar personas reales, marcas o personajes famosos. Crea tus propios diseños.' },
      ], [
        Q('¿Qué mejora una imagen hecha con IA?', ['Describir sujeto, estilo, luz y encuadre', 'Escribir una sola palabra', 'Escribir en mayúsculas'], 0, 'Los detalles guían el resultado.'),
        Q('¿Qué no debes hacer con IA de imágenes?', ['Imitar personas reales o marcas', 'Crear ilustraciones propias', 'Probar varios estilos'], 0, 'Usar la imagen de otros sin permiso trae problemas.'),
      ]),
      R('ia4-l2', 'Fotos de producto y artes para redes', [
        { type: 'text', title: 'Fotos que venden', body: ['Toma una foto de tu producto con el celular, sobre un fondo liso y con buena luz. Después puedes quitar o cambiar el fondo con IA en herramientas como Canva.'] },
        { type: 'steps', title: 'Foto de producto en 4 pasos', items: ['Toma la foto cerca de una ventana, sin flash.', 'Quita el fondo con la herramienta de borrar fondo.', 'Pon un fondo de color o un ambiente creado con IA.', 'Agrega el precio o la oferta con letra grande y clara.'] },
        { type: 'prompt', title: 'Fondo para producto', text: 'Crea un fondo minimalista para una foto de producto: superficie de mármol blanco, luz suave lateral, plantas desenfocadas al fondo, espacio libre al centro.' },
      ], [
        Q('¿Qué necesitas para una buena foto de producto?', ['Buena luz natural y fondo liso', 'Flash fuerte', 'Muchos objetos alrededor'], 0, 'Luz y fondo simple hacen que el producto destaque.'),
        Q('¿Qué hace la herramienta de borrar fondo?', ['Separa el producto del fondo', 'Mejora el sonido', 'Cambia el precio'], 0, 'Después puedes poner cualquier fondo.'),
      ]),
      R('ia4-l3', 'Editar imágenes con IA', [
        { type: 'text', title: 'Arregla tus fotos en segundos', body: ['Hoy muchas aplicaciones de edición tienen funciones de IA que antes requerían un diseñador.'] },
        { type: 'checklist', title: 'Lo que puedes hacer', items: ['Borrar objetos o personas que sobran', 'Ampliar la imagen para que quepa en otro formato', 'Mejorar la nitidez de una foto borrosa', 'Cambiar el fondo', 'Crear variaciones de un diseño'] },
        { type: 'note', tone: 'tip', title: 'Formatos', body: 'Historias y TikTok: vertical 9:16. Publicaciones de Instagram: 4:5. Usa la función de ampliar para adaptar una misma foto.' },
      ], [
        Q('¿Qué formato usan las historias y TikTok?', ['Vertical 9:16', 'Horizontal 16:9', 'Cuadrado 1:1'], 0, 'Es el formato de pantalla completa del celular.'),
        Q('¿Para qué sirve ampliar con IA?', ['Adaptar una foto a otro formato', 'Cambiar el texto', 'Subir la foto a internet'], 0, 'Rellena los bordes para que quepa en el nuevo tamaño.'),
      ]),
    ],
  },
  {
    id: 'ia5', title: 'Video con IA', goal: 'Escribe guiones, edita videos cortos y arma tu rutina semanal con IA.', color: 'ink',
    lessons: [
      R('ia5-l1', 'Guiones para videos cortos', [
        { type: 'text', title: 'Estructura que retiene', body: ['Un video corto que funciona tiene tres partes: gancho (3 segundos), desarrollo (el valor) y cierre (qué hacer después).'] },
        { type: 'prompt', title: 'Guion de 30 segundos', text: 'Escribe un guion de 30 segundos para TikTok sobre [tema]. Estructura: gancho de una frase, 3 puntos rápidos y cierre invitando a seguir la cuenta. Indica qué mostrar en pantalla en cada parte.' },
      ], [
        Q('¿Cuáles son las partes de un video corto?', ['Gancho, desarrollo y cierre', 'Saludo largo, historia y despedida', 'Solo música'], 0, 'El gancho decide si la gente se queda.'),
        Q('¿Cuánto debe durar el gancho?', ['Unos 3 segundos', 'Un minuto', 'No importa'], 0, 'La gente decide muy rápido si sigue viendo.'),
      ]),
      R('ia5-l2', 'Crear y editar videos', [
        { type: 'text', title: 'Edición fácil desde el celular', body: ['Aplicaciones como CapCut tienen funciones automáticas: subtítulos, quitar silencios, mejorar el audio, plantillas y voces. Graba con tu celular y deja que la aplicación haga la parte pesada.'] },
        { type: 'steps', title: 'Flujo recomendado', items: ['Graba en vertical, con buena luz y cerca del micrófono.', 'Agrega subtítulos automáticos y revisa que estén bien escritos.', 'Corta silencios y partes aburridas.', 'Agrega música suave sin tapar tu voz.', 'Exporta en buena calidad.'] },
        { type: 'note', tone: 'safety', title: 'Sé transparente', body: 'Si usas avatares o voces generadas con IA, dilo. Nunca imites la voz o la cara de una persona real sin su permiso.' },
      ], [
        Q('¿Por qué agregar subtítulos?', ['Mucha gente ve videos sin sonido', 'Para que el video pese más', 'No sirven'], 0, 'Los subtítulos hacen que entiendan tu mensaje en silencio.'),
        Q('¿Se puede imitar la voz de alguien con IA?', ['No sin su permiso', 'Sí, siempre', 'Solo de famosos'], 0, 'Es un tema de respeto y puede traer problemas legales.'),
      ]),
      R('ia5-l3', 'Tu rutina semanal con IA', [
        { type: 'text', title: 'Ponlo todo junto', body: ['La IA rinde más cuando la usas con un sistema. Esta rutina te toma unas 3 horas a la semana.'] },
        { type: 'checklist', title: 'Rutina semanal', items: ['Lunes: pídele a la IA 7 ideas de contenido para la semana', 'Martes: escribe los guiones con IA y ajústalos con tu estilo', 'Miércoles: graba todos los videos en un bloque', 'Jueves: edita con subtítulos y crea las imágenes', 'Viernes: programa las publicaciones y revisa resultados'] },
        { type: 'prompt', title: 'Revisión de resultados', text: 'Estas son las vistas y mensajes de mis 5 publicaciones de la semana: [datos]. ¿Qué tienen en común las que mejor funcionaron y qué debería repetir la próxima semana?' },
      ], [
        Q('¿Qué hace que la IA rinda más?', ['Usarla con una rutina fija', 'Usarla solo cuando hay tiempo', 'Usar muchas herramientas a la vez'], 0, 'El sistema te da constancia.'),
        Q('¿Para qué le das tus resultados a la IA?', ['Para descubrir qué repetir', 'Para que publique por ti', 'No sirve'], 0, 'Analizar resultados te dice qué funciona con tu público.'),
      ]),
    ],
  },
]

export const iaDesdeCero = { id: 'ia-desde-cero', kind: 'standard', units }
