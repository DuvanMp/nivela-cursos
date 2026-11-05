// Curso: Domina las ventas por WhatsApp
// Lecciones de lectura (blocks) con una mini prueba (quiz) al final.
// Bloques: text, steps, checklist, note, chat (conversación de ejemplo), prompt (plantilla para copiar).

const Q = (q, options, answer, explain) => ({ q, options, answer: options[answer], explain })
const R = (id, title, blocks, quiz) => ({ id, title, kind: 'read', blocks, quiz })

const units = [
  {
    id: 'w1', title: 'Prepara tu WhatsApp Business', goal: 'Deja tu cuenta lista para vender: perfil, catálogo, etiquetas y mensajes automáticos.', color: 'mint',
    lessons: [
      R('w1-l1', 'Un perfil que da confianza', [
        { type: 'text', title: 'WhatsApp Business no es un WhatsApp normal', body: ['Es una aplicación gratuita para negocios. Te deja tener perfil de empresa, catálogo, respuestas rápidas, etiquetas y mensajes automáticos. Si vendes por WhatsApp y no la usas, estás vendiendo con una mano amarrada.'] },
        { type: 'steps', title: 'Configura tu perfil', items: ['Descarga WhatsApp Business y regístrala con el número de tu negocio.', 'Pon tu logo o una foto tuya profesional, con buena luz.', 'Escribe una descripción de una línea: qué vendes y para quién.', 'Agrega horario de atención, ciudad y tu correo o página web.', 'Revisa cómo se ve tu perfil desde el celular de un amigo.'] },
        { type: 'prompt', title: 'Plantilla de descripción', text: 'Ayudo a [tipo de cliente] a [resultado] con [tu producto]. Envíos a toda Colombia. Atención de lunes a sábado.' },
        { type: 'note', tone: 'tip', title: 'Un número solo para el negocio', body: 'Separar tu número personal del de ventas te ayuda a responder con orden y a no mezclar clientes con familia.' },
      ], [
        Q('¿Qué debe decir la descripción de tu perfil?', ['Qué vendes y para quién', 'Tu frase motivacional favorita', 'Nada, es mejor dejarla vacía'], 0, 'En una línea el cliente debe entender si estás en el lugar correcto.'),
        Q('¿Por qué usar WhatsApp Business y no el normal?', ['Tiene catálogo, etiquetas y respuestas automáticas', 'Porque es de pago y se ve más serio', 'No hay ninguna diferencia'], 0, 'Es gratis y trae herramientas pensadas para vender.'),
      ]),
      R('w1-l2', 'Catálogo, etiquetas y respuestas rápidas', [
        { type: 'text', title: 'Ordena para vender más', body: ['Cuando tienes muchos chats, se te olvidan clientes. Con catálogo, etiquetas y respuestas rápidas respondes en segundos y nadie se queda sin seguimiento.'] },
        { type: 'steps', title: 'Crea tu catálogo', items: ['Entra a Herramientas para la empresa → Catálogo.', 'Sube cada producto con foto clara, nombre, precio y una descripción corta.', 'Comparte productos del catálogo dentro del chat en lugar de mandar diez fotos sueltas.'] },
        { type: 'checklist', title: 'Etiquetas recomendadas', items: ['Nuevo cliente', 'Interesado', 'Pendiente de pago', 'Pagado', 'Hacer seguimiento'] },
        { type: 'prompt', title: 'Respuesta rápida /precio', text: '¡Hola {nombre}! El [producto] cuesta $[precio]. Incluye [beneficio 1] y [beneficio 2]. ¿Te lo separo?' },
      ], [
        Q('¿Para qué sirven las etiquetas?', ['Para saber en qué etapa está cada cliente', 'Para decorar los chats', 'Para bloquear clientes'], 0, 'Así sabes a quién cobrarle y a quién hacerle seguimiento.'),
        Q('¿Qué es mejor para mostrar productos en el chat?', ['Compartir el producto del catálogo', 'Enviar diez fotos sueltas', 'Mandar audios largos'], 0, 'El catálogo muestra foto, precio y descripción juntos y se ve profesional.'),
      ]),
      R('w1-l3', 'Mensajes de bienvenida y ausencia', [
        { type: 'text', title: 'Responde aunque no estés', body: ['Muchas ventas se pierden porque el cliente escribe y nadie contesta. El mensaje de bienvenida y el de ausencia le dicen que lo viste y cuándo lo vas a atender.'] },
        { type: 'prompt', title: 'Mensaje de bienvenida', text: '¡Hola! Gracias por escribir a [negocio] 😊 Cuéntame qué estás buscando y te ayudo enseguida.' },
        { type: 'prompt', title: 'Mensaje de ausencia', text: '¡Hola! En este momento estamos fuera de horario. Te respondemos mañana desde las 8 a. m. Déjanos tu pregunta y te escribimos primero a ti.' },
        { type: 'chat', title: 'Así se ve', lines: [['cliente', 'Hola, ¿tienen el curso de inglés?'], ['tu', '¡Hola! Gracias por escribir 😊 Cuéntame qué estás buscando y te ayudo enseguida.']] },
      ], [
        Q('¿Qué debe decir un mensaje de ausencia?', ['Cuándo vas a responder', 'Que no moleste fuera de horario', 'Nada, mejor no responder'], 0, 'El cliente se queda tranquilo si sabe cuándo le contestas.'),
        Q('¿Para qué sirve el mensaje de bienvenida?', ['Para que el cliente sepa que lo atienden y cuente qué necesita', 'Para enviar el precio sin saludar', 'Para pedir que llame'], 0, 'Abre la conversación con amabilidad e invita al cliente a contar lo que busca.'),
      ]),
    ],
  },
  {
    id: 'w2', title: 'La conversación que vende', goal: 'Responde rápido, pregunta antes de ofrecer y presenta beneficios, no solo características.', color: 'ultra',
    lessons: [
      R('w2-l1', 'Rapidez y trato personal', [
        { type: 'text', title: 'Los primeros 5 minutos', body: ['Un cliente que pregunta precio casi siempre le está preguntando a varios negocios al tiempo. El que responde primero, con amabilidad y usando su nombre, tiene ventaja.'] },
        { type: 'chat', title: 'Así no', lines: [['cliente', 'Buenas, ¿precio?'], ['tu', '89900']] },
        { type: 'chat', title: 'Así sí', lines: [['cliente', 'Buenas, ¿precio?'], ['tu', '¡Hola, Andrés! Con gusto. ¿Es para ti o para regalar? Así te recomiendo la mejor opción 😊']] },
        { type: 'note', tone: 'tip', title: 'Escribe como hablas', body: 'Frases cortas, sin mayúsculas sostenidas y con uno o dos emojis como máximo. Evita los audios largos: muchos clientes no pueden escucharlos en ese momento.' },
      ], [
        Q('El cliente pregunta solo «¿precio?». ¿Qué haces?', ['Saludo por su nombre y hago una pregunta para entender qué necesita', 'Le mando solo el número', 'Espero a que diga más'], 0, 'Responder solo el número corta la conversación; una pregunta la mantiene viva.'),
        Q('¿Por qué importa responder rápido?', ['Porque el cliente está preguntando en varios lugares a la vez', 'No importa, el que quiere compra', 'Para que vea que no tienes trabajo'], 0, 'Muchas veces gana el que responde primero y mejor.'),
      ]),
      R('w2-l2', 'Pregunta antes de ofrecer', [
        { type: 'text', title: 'Diagnostica como un médico', body: ['Un buen vendedor no ofrece todo el catálogo. Primero entiende qué necesita la persona y después recomienda una sola opción. El cliente siente que lo están ayudando, no presionando.'] },
        { type: 'checklist', title: 'Preguntas que abren la venta', items: ['¿Para qué lo necesitas?', '¿Qué has probado antes?', '¿Qué es lo más importante para ti: precio, rapidez o calidad?', '¿Para cuándo lo necesitas?'] },
        { type: 'chat', title: 'Ejemplo', lines: [['cliente', 'Quiero aprender inglés'], ['tu', '¡Qué bien! ¿Lo necesitas para el trabajo, para viajar o para ti?'], ['cliente', 'Para el trabajo, atiendo clientes'], ['tu', 'Perfecto. Entonces te sirve el módulo 3: inglés para atención al cliente y entrevistas.']] },
      ], [
        Q('¿Qué haces antes de recomendar un producto?', ['Pregunto qué necesita el cliente', 'Envío todo el catálogo', 'Ofrezco lo más caro'], 0, 'Entender la necesidad te deja recomendar lo correcto.'),
        Q('¿Cuántas opciones conviene recomendar al final?', ['Una, la que mejor encaja', 'Todas para que elija', 'Ninguna, que él decida'], 0, 'Demasiadas opciones confunden y frenan la compra.'),
      ]),
      R('w2-l3', 'Vende beneficios, no características', [
        { type: 'text', title: 'Lo que el cliente quiere escuchar', body: ['Una característica es lo que el producto tiene. Un beneficio es lo que cambia en la vida del cliente gracias a eso. La gente compra beneficios.'] },
        { type: 'checklist', title: 'Ejemplos', items: ['Característica: 48 lecciones de 5 minutos → Beneficio: aprendes en el bus o en tu descanso', 'Característica: entrenamiento en casa → Beneficio: no pagas gimnasio ni pierdes tiempo en transporte', 'Característica: guiones de venta → Beneficio: sabes qué responder cuando te dicen «está caro»'] },
        { type: 'prompt', title: 'Fórmula', text: 'Con [producto] vas a poder [beneficio], sin [problema que evita]. Incluye [característica principal].' },
      ], [
        Q('¿Cuál es un beneficio?', ['Puedes estudiar en el bus, 5 minutos al día', 'Tiene 48 lecciones', 'Está hecho en React'], 0, 'El beneficio habla de lo que gana el cliente.'),
        Q('¿Qué compra la gente realmente?', ['El resultado que le da el producto', 'La lista de características', 'El logo de la marca'], 0, 'Las características apoyan, pero el resultado es lo que decide.'),
      ]),
    ],
  },
  {
    id: 'w3', title: 'Manejo de objeciones', goal: 'Responde con calma a «está caro», «lo voy a pensar» y «no confío».', color: 'rose',
    lessons: [
      R('w3-l1', '«Está caro»', [
        { type: 'text', title: 'Casi nunca es solo el precio', body: ['Cuando alguien dice «está caro», muchas veces quiere decir «todavía no veo por qué vale eso». Tu trabajo es mostrar el valor, no bajar el precio de inmediato.'] },
        { type: 'chat', title: 'Ejemplo', lines: [['cliente', 'Uy, está caro'], ['tu', 'Te entiendo. ¿Lo comparas con algo en particular?'], ['cliente', 'Con un curso que vi en YouTube gratis'], ['tu', 'Tiene sentido. La diferencia es que aquí llevas un orden por niveles, practicas con ejercicios y guardas tu progreso. Son menos de $3.000 al día durante un mes.']] },
        { type: 'checklist', title: 'Herramientas honestas', items: ['Divide el precio por días de uso', 'Compara con lo que cuesta no resolver el problema', 'Ofrece el paquete si sale más económico', 'Menciona la garantía si la tienes'] },
        { type: 'note', tone: 'safety', title: 'No inventes', body: 'Nunca digas que «solo quedan 2 cupos» o que el precio sube mañana si no es verdad. Además de ser engañoso, el cliente lo nota y pierdes su confianza.' },
      ], [
        Q('El cliente dice «está caro». ¿Qué haces primero?', ['Pregunto con qué lo compara', 'Le bajo el precio de una vez', 'Le digo que no es caro'], 0, 'Preguntar te muestra qué valor no está viendo.'),
        Q('¿Cuál de estas técnicas es honesta?', ['Dividir el precio por los días de uso', 'Decir que quedan 2 cupos cuando no es cierto', 'Inventar que el precio sube mañana'], 0, 'Las técnicas honestas muestran el valor real; las falsas destruyen la confianza.'),
      ]),
      R('w3-l2', '«Lo voy a pensar»', [
        { type: 'text', title: 'Una duda escondida', body: ['«Lo voy a pensar» suele esconder una duda que el cliente no dijo. Si la descubres con respeto, puedes resolverla.'] },
        { type: 'chat', title: 'Ejemplo', lines: [['cliente', 'Listo, lo voy a pensar'], ['tu', '¡Claro! Para ayudarte a decidir, ¿qué es lo que más te hace dudar: el precio, el tiempo o si te va a servir?'], ['cliente', 'Que no tengo mucho tiempo'], ['tu', 'Cada lección dura 5 minutos y la puedes hacer desde el celular cuando quieras.']] },
        { type: 'prompt', title: 'Si igual quiere pensarlo', text: '¡Perfecto, {nombre}! Te escribo el jueves para ver qué decidiste. Si te surge alguna pregunta antes, aquí estoy.' },
      ], [
        Q('¿Qué suele haber detrás de «lo voy a pensar»?', ['Una duda que no ha dicho', 'Que ya no quiere nunca', 'Que quiere un regalo'], 0, 'Preguntar con amabilidad te ayuda a encontrar la duda real.'),
        Q('Si el cliente igual quiere pensarlo, ¿qué haces?', ['Acuerdo un día para escribirle', 'Le insisto cada hora', 'Lo borro de mis chats'], 0, 'Un seguimiento acordado es respetuoso y efectivo.'),
      ]),
      R('w3-l3', '«No confío»', [
        { type: 'text', title: 'La desconfianza es normal', body: ['Comprar por internet a alguien que no conoces da miedo. La confianza se construye con pruebas reales, no con promesas.'] },
        { type: 'checklist', title: 'Lo que da confianza', items: ['Testimonios reales de clientes (con su permiso)', 'Tu cara: un video corto tuyo explicando el producto', 'Métodos de pago seguros y conocidos', 'Garantía clara y por escrito', 'Una página web con información completa'] },
        { type: 'note', tone: 'safety', title: 'Testimonios solo reales', body: 'Inventar opiniones o capturas de clientes es publicidad engañosa y en Colombia la sanciona la Superintendencia de Industria y Comercio.' },
      ], [
        Q('¿Qué da más confianza a un cliente nuevo?', ['Testimonios reales y un video tuyo', 'Muchos emojis', 'Decir «confía en mí»'], 0, 'Las pruebas reales pesan más que las promesas.'),
        Q('¿Se pueden inventar testimonios?', ['No, es publicidad engañosa', 'Sí, si se ven reales', 'Solo al principio'], 0, 'Además de ser ilegal, si lo descubren pierdes toda la credibilidad.'),
      ]),
    ],
  },
  {
    id: 'w4', title: 'El cierre', goal: 'Reconoce cuándo el cliente está listo y cierra la venta sin presionar.', color: 'mango',
    lessons: [
      R('w4-l1', 'Señales de compra', [
        { type: 'text', title: 'El cliente te avisa', body: ['Cuando alguien está listo para comprar, cambia el tipo de preguntas: deja de preguntar «qué es» y empieza a preguntar «cómo lo recibo».'] },
        { type: 'checklist', title: 'Señales claras', items: ['¿Cómo se paga?', '¿Cuándo me llega?', '¿Tienen Nequi?', '¿Puedo empezar hoy?', 'Pide detalles específicos (talla, color, horario)'] },
        { type: 'note', tone: 'tip', title: 'Cuando veas una señal, cierra', body: 'No sigas explicando. Responde la pregunta y pasa al siguiente paso: el pago.' },
      ], [
        Q('¿Cuál es una señal de compra?', ['«¿Tienen Nequi?»', '«¿Qué es eso?»', '«Bueno, gracias»'], 0, 'Preguntar cómo pagar indica que ya decidió.'),
        Q('Cuando aparece una señal de compra…', ['Respondo y paso al pago', 'Sigo explicando todo el producto', 'Espero a que vuelva a escribir'], 0, 'Seguir hablando puede generar nuevas dudas.'),
      ]),
      R('w4-l2', 'Técnicas de cierre honestas', [
        { type: 'text', title: 'Facilita la decisión', body: ['Cerrar no es presionar: es hacer que comprar sea fácil y claro.'] },
        { type: 'checklist', title: 'Tres cierres que funcionan', items: ['Alternativa: «¿Prefieres pagar por Nequi o por transferencia?»', 'Resumen: «Entonces te llevas el paquete de 3 módulos, con acceso hoy mismo. ¿Te envío el enlace de pago?»', 'Urgencia real: «La promoción va hasta el domingo», solo si es verdad'] },
        { type: 'chat', title: 'Ejemplo', lines: [['cliente', '¿Y cuándo puedo empezar?'], ['tu', '¡Hoy mismo! Apenas pagues te llega el acceso. ¿Te paso el enlace de pago o prefieres Nequi?']] },
      ], [
        Q('¿Cuál es un cierre de alternativa?', ['«¿Prefieres Nequi o transferencia?»', '«¿Lo quieres o no?»', '«Piénsalo y me dices»'], 0, 'Das dos caminos que ya llevan a la compra.'),
        Q('¿Cuándo es válido usar urgencia?', ['Solo cuando la fecha límite es real', 'Siempre, funciona', 'Nunca se puede'], 0, 'La urgencia real ayuda; la inventada es engaño.'),
      ]),
      R('w4-l3', 'Cobra fácil y confirma', [
        { type: 'text', title: 'Que pagar sea sencillo', body: ['Entre más pasos tenga el pago, más clientes se arrepienten. Ofrece dos o tres métodos que tu cliente ya use.'] },
        { type: 'checklist', title: 'Métodos comunes en Colombia', items: ['Nequi o Daviplata', 'Transferencia bancaria', 'Enlace de pago con tarjeta', 'Pago en efectivo en corresponsal'] },
        { type: 'prompt', title: 'Confirmación de pago', text: '¡Pago recibido, {nombre}! 🎉 Gracias por tu compra. Aquí está tu acceso: [enlace]. Cualquier duda, me escribes por aquí.' },
        { type: 'note', tone: 'tip', title: 'Etiqueta «Pagado»', body: 'Cuando confirmes, cambia la etiqueta del chat a «Pagado». Así llevas el control de tus ventas.' },
      ], [
        Q('¿Cuántos métodos de pago conviene ofrecer?', ['Dos o tres que el cliente ya use', 'Uno solo, el que te sirva a ti', 'Todos los que existan'], 0, 'Pocas opciones conocidas hacen el pago rápido.'),
        Q('Después de recibir el pago…', ['Confirmo, agradezco y entrego el acceso', 'No respondo más', 'Le ofrezco otro producto de inmediato'], 0, 'Una buena confirmación hace que el cliente vuelva y te recomiende.'),
      ]),
    ],
  },
  {
    id: 'w5', title: 'Después de la venta', goal: 'Haz seguimiento sin molestar, consigue recomendaciones y vende productos digitales.', color: 'ink',
    lessons: [
      R('w5-l1', 'Seguimiento sin ser intenso', [
        { type: 'text', title: 'La mayoría compra en el segundo o tercer contacto', body: ['Muchos clientes no compran en la primera conversación. Un seguimiento amable y con fecha recupera esas ventas.'] },
        { type: 'steps', title: 'Calendario de seguimiento', items: ['Día 1: «¿Te quedó alguna duda?»', 'Día 3: comparte algo útil (un consejo o un testimonio real).', 'Día 7: último mensaje y deja la puerta abierta.'] },
        { type: 'prompt', title: 'Último seguimiento', text: '¡Hola, {nombre}! No te quiero llenar de mensajes 😊 Si más adelante quieres retomarlo, aquí estoy para ayudarte.' },
      ], [
        Q('¿Cuántos seguimientos recomienda el curso?', ['Tres, en los días 1, 3 y 7', 'Uno diario hasta que compre', 'Ninguno'], 0, 'Suficientes para recordar, sin volverse molesto.'),
        Q('¿Qué conviene enviar en el segundo seguimiento?', ['Algo útil, como un consejo o un testimonio real', 'El mismo mensaje del día 1', 'Un audio de 5 minutos'], 0, 'Aportar valor mantiene la conversación sin presionar.'),
      ]),
      R('w5-l2', 'Posventa y recomendaciones', [
        { type: 'text', title: 'Tu mejor vendedor es un cliente feliz', body: ['Un cliente satisfecho te puede traer más clientes. Pregúntale cómo le fue y, si está contento, pídele una recomendación.'] },
        { type: 'prompt', title: 'Pedir un testimonio', text: '¡Hola, {nombre}! ¿Cómo te ha ido con [producto]? Si te ha servido, ¿me dejarías una opinión corta? Con tu permiso la compartiría en mis estados.' },
        { type: 'prompt', title: 'Pedir referidos', text: '¿Conoces a alguien a quien también le pueda servir? Si me lo recomiendas, te regalo [beneficio real].' },
      ], [
        Q('¿Cuándo se pide un testimonio?', ['Cuando el cliente ya usó el producto y está contento', 'Antes de que pague', 'Nunca'], 0, 'La opinión vale cuando nace de una experiencia real.'),
        Q('¿Se puede publicar la opinión de un cliente?', ['Sí, con su permiso', 'Sí, sin preguntarle', 'Solo si cambias su nombre'], 0, 'Siempre pide permiso antes de publicar.'),
      ]),
      R('w5-l3', 'Listas de difusión y estados', [
        { type: 'text', title: 'Llega a muchos sin hacer spam', body: ['Las listas de difusión envían un mensaje a varios contactos como si fuera individual, pero solo les llega a quienes tienen tu número guardado. Los estados los ven tus contactos todos los días.'] },
        { type: 'checklist', title: 'Ideas para tus estados', items: ['Antes y después o resultados reales de clientes (con permiso)', 'Un consejo útil de tu tema', 'Detrás de cámaras de tu trabajo', 'Preguntas o encuestas', 'Una oferta clara, máximo una vez al día'] },
        { type: 'note', tone: 'safety', title: 'Solo a quien te dio permiso', body: 'Escribirle a gente que no te ha dado su número o agregar personas a grupos sin preguntar puede hacer que WhatsApp bloquee tu cuenta.' },
      ], [
        Q('¿A quién le llegan las listas de difusión?', ['A quienes tienen tu número guardado', 'A cualquier número de Colombia', 'A todos los grupos'], 0, 'Por eso funcionan con clientes que ya te conocen.'),
        Q('¿Qué puede bloquear tu cuenta?', ['Enviar mensajes a quien no te dio permiso', 'Publicar estados', 'Usar etiquetas'], 0, 'WhatsApp castiga el spam.'),
      ]),
      R('w5-l4', 'Vende productos digitales', [
        { type: 'text', title: 'Todo lo aprendido aplica', body: ['Cursos, plantillas o guías se venden igual: preguntas, beneficios, objeciones y cierre. La ventaja es que se entregan al instante y no tienen envío.', 'Si quieres empezar sin crear tu propio producto, puedes recomendar los cursos de Nivela con tu enlace de afiliado y ganar una comisión por cada venta.'] },
        { type: 'steps', title: 'Cómo empezar como afiliado', items: ['Crea tu cuenta en Nivela y entra a «Afiliados».', 'Copia tu enlace personal.', 'Recomienda solo los cursos que conoces y crees que le sirven a la persona.', 'Comparte el enlace por WhatsApp cuando el cliente esté listo para comprar.'] },
        { type: 'note', tone: 'safety', title: 'Sé transparente', body: 'Di que es tu enlace de afiliado y no prometas resultados que no puedes garantizar.' },
      ], [
        Q('¿Qué ventaja tiene un producto digital?', ['Se entrega al instante y sin envío', 'No necesita clientes', 'Se vende solo'], 0, 'La entrega inmediata facilita el cierre.'),
        Q('Como afiliado, ¿qué debes hacer?', ['Recomendar con honestidad y decir que es tu enlace', 'Prometer que se harán ricos', 'Enviar el enlace a todos tus contactos sin preguntar'], 0, 'La honestidad hace que te vuelvan a comprar.'),
      ]),
    ],
  },
]

export const ventasWhatsApp = { id: 'ventas-whatsapp', kind: 'standard', units }
