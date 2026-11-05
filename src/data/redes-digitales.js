// Curso: Vende productos digitales en redes sociales
// Desde montar tu negocio digital y crear la cuenta hasta la pauta, más el programa de afiliados de Nivela.

const Q = (q, options, answer, explain) => ({ q, options, answer: options[answer], explain })
const R = (id, title, blocks, quiz) => ({ id, title, kind: 'read', blocks, quiz })

const units = [
  {
    id: 'r1', title: 'Tu negocio digital desde casa', goal: 'Entiende cómo se gana dinero con productos digitales, elige tu nicho y arranca en orden.', color: 'mint',
    lessons: [
      R('r1-l1', 'Qué es un producto digital', [
        { type: 'text', title: 'Se crea una vez, se vende muchas', body: ['Un producto digital es algo que se entrega por internet: un curso, una plantilla, una guía, un reto de entrenamiento o una asesoría en línea. No tiene inventario ni envío.', 'Hay dos formas de empezar: crear tu propio producto o vender productos de otros como afiliado y ganar una comisión por cada venta.'] },
        { type: 'note', tone: 'safety', title: 'Expectativas reales', body: 'Vender productos digitales es un negocio de verdad: toma constancia, aprender y tiempo. Desconfía de quien te prometa ingresos garantizados o rápidos, incluido este curso.' },
        { type: 'checklist', title: 'Lo mínimo para empezar', items: ['Un celular con buena cámara', 'Una cuenta en una red social', 'WhatsApp Business', 'Un producto propio o un programa de afiliados', 'Una o dos horas al día'] },
      ], [
        Q('¿Qué es un producto digital?', ['Algo que se entrega por internet, como un curso', 'Un celular nuevo', 'Un producto que se envía por mensajería'], 0, 'No tiene inventario ni envío.'),
        Q('Si alguien te promete ingresos garantizados…', ['Desconfías', 'Le crees de una', 'Le das tus datos bancarios'], 0, 'Ningún negocio real garantiza ingresos.'),
      ]),
      R('r1-l2', 'Elige tu nicho y tu cliente ideal', [
        { type: 'text', title: 'Hablarle a todos es no hablarle a nadie', body: ['Un nicho es un grupo de personas con un problema parecido. Entre más claro tengas a quién le hablas, más fácil es crear contenido y vender.'] },
        { type: 'steps', title: 'Encuentra tu nicho', items: ['Escribe 3 temas que conozcas o te apasionen.', 'Para cada uno, ¿quién tiene un problema que eso resuelve?', '¿Esas personas ya pagan por soluciones? (cursos, asesorías, libros)', 'Elige el que cumpla las tres: lo conoces, hay un problema, y la gente paga.'] },
        { type: 'prompt', title: 'Ficha de tu cliente ideal', text: 'Mi cliente ideal es [edad, ocupación], vive en [lugar], su mayor problema es [problema], ya intentó [lo que probó] y quiere [resultado].' },
      ], [
        Q('¿Qué es un nicho?', ['Un grupo de personas con un problema parecido', 'Toda la población de Colombia', 'Una red social'], 0, 'Te deja hablarle claro a alguien concreto.'),
        Q('¿Qué señal dice que un nicho puede funcionar?', ['La gente ya paga por soluciones a ese problema', 'Nadie habla del tema', 'Es lo que está de moda esta semana'], 0, 'Si ya pagan, hay mercado.'),
      ]),
      R('r1-l3', 'Lo básico legal y los cobros', [
        { type: 'text', title: 'Empieza en orden', body: ['Si vendes de forma constante, en Colombia necesitas el RUT (se saca gratis en la DIAN) y, según tus ingresos, puede que debas facturar electrónicamente. Las reglas cambian, así que consulta a un contador.', 'Para cobrar, lo más sencillo al principio es Nequi, Daviplata o transferencia. Cuando crezcas, una pasarela de pagos te permite cobrar con tarjeta y en cuotas.'] },
        { type: 'checklist', title: 'Publicidad honesta', items: ['Muestra precios reales y claros', 'Solo usa descuentos que sean reales', 'Testimonios únicamente con permiso del cliente', 'No prometas resultados que no puedes garantizar'] },
        { type: 'note', tone: 'safety', title: 'No soy contador ni abogado', body: 'Esta lección es una orientación general. Para tu caso, habla con un contador.' },
      ], [
        Q('¿Qué documento se saca gratis en la DIAN?', ['El RUT', 'El pasaporte', 'La licencia de conducción'], 0, 'Es el registro tributario para quien tiene actividad económica.'),
        Q('¿Cuál es una práctica de publicidad honesta?', ['Usar solo descuentos reales', 'Inventar testimonios', 'Prometer resultados garantizados'], 0, 'La publicidad engañosa la sanciona la Superintendencia de Industria y Comercio.'),
      ]),
    ],
  },
  {
    id: 'r2', title: 'Crea tu cuenta que vende', goal: 'Optimiza tu perfil y aprende a crear contenido que la gente quiere ver.', color: 'ultra',
    lessons: [
      R('r2-l1', 'Un perfil que convierte', [
        { type: 'text', title: 'Tienes 3 segundos', body: ['Cuando alguien entra a tu perfil decide en segundos si te sigue. Tu foto, nombre, biografía y enlace tienen que decir qué haces y por qué seguirte.'] },
        { type: 'steps', title: 'Optimiza tu perfil', items: ['Foto: tu cara, de frente, con buena luz (o tu logo si es una marca).', 'Nombre: incluye la palabra clave de lo que haces, por ejemplo «Ana · Inglés fácil».', 'Biografía: a quién ayudas, a qué y una prueba (años de experiencia, resultados reales).', 'Enlace: a tu WhatsApp o a tu página de venta.', 'Historias destacadas: Precios, Testimonios, Preguntas.'] },
        { type: 'prompt', title: 'Fórmula de biografía', text: 'Ayudo a [cliente ideal] a [resultado] 🎯 | [prueba o experiencia] | 👇 Escríbeme por WhatsApp' },
      ], [
        Q('¿Qué debe decir tu biografía?', ['A quién ayudas y a qué', 'Una frase de una canción', 'Tu número de cédula'], 0, 'El visitante debe entender en segundos si eres para él.'),
        Q('¿Para qué sirve incluir una palabra clave en el nombre?', ['Para que te encuentren en el buscador de la red', 'Para que se vea más largo', 'No sirve'], 0, 'El nombre aparece en las búsquedas.'),
      ]),
      R('r2-l2', 'Pilares de contenido', [
        { type: 'text', title: 'No todo es vender', body: ['Si solo publicas ofertas, la gente deja de verte. Una buena cuenta educa, entretiene, inspira y, a veces, vende.'] },
        { type: 'checklist', title: 'Los 4 pilares', items: ['Educar: consejos útiles de tu tema', 'Entretener: tendencias, humor, situaciones con las que tu público se identifica', 'Inspirar: tu historia, resultados reales de clientes', 'Vender: tu oferta, cómo funciona, preguntas frecuentes'] },
        { type: 'note', tone: 'tip', title: 'Regla 80/20', body: 'Más o menos 8 de cada 10 publicaciones deben aportar valor y 2 pueden vender directamente.' },
      ], [
        Q('¿Cuál NO es un pilar de contenido?', ['Copiar contenido de otros', 'Educar', 'Inspirar'], 0, 'Copiar puede hacer que te bloqueen y no te diferencia.'),
        Q('Según la regla 80/20…', ['La mayoría del contenido aporta valor y una parte vende', 'Todo es venta', 'Nunca se vende'], 0, 'El valor construye la confianza que después vende.'),
      ]),
      R('r2-l3', 'Videos cortos que retienen', [
        { type: 'text', title: 'Los primeros 3 segundos lo deciden todo', body: ['TikTok, Reels y Shorts muestran tu video a más personas si la gente lo ve completo. Por eso el inicio debe atrapar.'] },
        { type: 'checklist', title: 'Ganchos que funcionan', items: ['«Si te pasa esto, mira hasta el final…»', '«El error que comete casi todo el que…»', '«3 cosas que me hubiera gustado saber antes de…»', '«Así pasé de… a…» (solo si es real)'] },
        { type: 'steps', title: 'Estructura de 30 segundos', items: ['Gancho: una frase que genere curiosidad.', 'Valor: 3 puntos rápidos con texto en pantalla.', 'Cierre: invita a seguirte o a escribir una palabra en los comentarios.'] },
      ], [
        Q('¿Qué hace que la red muestre más tu video?', ['Que la gente lo vea completo', 'Que dure mucho', 'Usar muchos hashtags'], 0, 'El tiempo de visualización es clave.'),
        Q('¿Cómo empieza un buen video corto?', ['Con un gancho que genere curiosidad', 'Con un saludo largo', 'Con el logo durante 10 segundos'], 0, 'Si no atrapa al inicio, la gente pasa al siguiente.'),
      ]),
    ],
  },
  {
    id: 'r3', title: 'Contenido que convierte', goal: 'Planea tu mes, usa historias para vender y construye prueba social real.', color: 'rose',
    lessons: [
      R('r3-l1', 'Tu calendario de 30 días', [
        { type: 'text', title: 'Constancia sin agotarte', body: ['Publicar todos los días al principio ayuda a crecer, pero solo si lo puedes sostener. Mejor 4 publicaciones a la semana durante meses que 20 en una semana y luego nada.'] },
        { type: 'prompt', title: 'Pídeselo a la IA', text: 'Crea un calendario de 30 días para una cuenta que vende [producto] a [cliente ideal]. Tabla con día, formato, tema, gancho y llamado a la acción. 80 % valor y 20 % venta.' },
        { type: 'checklist', title: 'Semana tipo', items: ['Lunes: consejo útil', 'Martes: historia personal', 'Miércoles: tendencia adaptada a tu tema', 'Jueves: preguntas frecuentes', 'Viernes: oferta o testimonio real', 'Fin de semana: historias de tu día'] },
      ], [
        Q('¿Qué es mejor para crecer?', ['Publicar constante durante meses', 'Publicar mucho una semana y desaparecer', 'Publicar solo cuando hay oferta'], 0, 'La constancia es lo que hace crecer una cuenta.'),
        Q('¿Qué proporción de valor y venta recomienda el curso?', ['80 % valor y 20 % venta', '100 % venta', '50 % memes'], 0, 'El valor genera confianza.'),
      ]),
      R('r3-l2', 'Historias que venden', [
        { type: 'text', title: 'Las historias son tu vitrina diaria', body: ['Quienes ven tus historias ya te siguen y te conocen. Una secuencia bien hecha lleva de la curiosidad al mensaje por WhatsApp.'] },
        { type: 'steps', title: 'Secuencia de 5 historias', items: ['Problema: «¿Te ha pasado que…?» con una encuesta.', 'Historia: cómo lo viviste tú o un cliente (real).', 'Solución: qué hiciste para resolverlo.', 'Prueba: un resultado o testimonio real.', 'Llamado: «Escríbeme INFO y te cuento».'] },
      ], [
        Q('¿Cómo termina una secuencia de historias que vende?', ['Con un llamado claro a escribir', 'Sin decir nada', 'Con 10 hashtags'], 0, 'Dile a la gente qué hacer después.'),
        Q('¿Para qué sirve la encuesta al inicio?', ['Para que la gente participe y se identifique', 'Para llenar espacio', 'No sirve'], 0, 'La interacción hace que la red muestre más tus historias.'),
      ]),
      R('r3-l3', 'Prueba social real', [
        { type: 'text', title: 'Lo que otros dicen de ti vende más que lo que tú dices', body: ['Testimonios, capturas de mensajes de clientes contentos y resultados reales generan confianza. Pide permiso y muéstralos.'] },
        { type: 'checklist', title: 'Cómo conseguir testimonios', items: ['Pregunta a cada cliente cómo le fue a los 7 días', 'Pide permiso para compartir su opinión', 'Mejor si es un video corto o un audio', 'Guárdalos en una historia destacada'] },
        { type: 'note', tone: 'safety', title: 'Nunca inventes', body: 'Comprar seguidores, inventar comentarios o crear capturas falsas engaña a tus clientes, va contra las reglas de las redes y puede hacer que te cierren la cuenta.' },
      ], [
        Q('¿Qué hace la prueba social?', ['Genera confianza con experiencias reales', 'Reemplaza el producto', 'Nada'], 0, 'La gente confía en otros clientes.'),
        Q('¿Qué pasa si compras seguidores o inventas comentarios?', ['Engañas a tus clientes y arriesgas tu cuenta', 'Vendes más para siempre', 'No pasa nada'], 0, 'Las redes eliminan cuentas falsas y la confianza se pierde.'),
      ]),
    ],
  },
  {
    id: 'r4', title: 'Pauta publicitaria', goal: 'Lanza tu primera campaña con poco presupuesto y aprende a medirla.', color: 'mango',
    lessons: [
      R('r4-l1', 'Conceptos básicos', [
        { type: 'text', title: 'Pagar para llegar a más personas', body: ['La pauta es pagarle a Meta (Facebook e Instagram) o a TikTok para que muestren tu contenido a personas que todavía no te siguen.'] },
        { type: 'checklist', title: 'Palabras que vas a ver', items: ['Objetivo: lo que quieres lograr (mensajes, ventas, seguidores)', 'Público: a quién le muestras el anuncio (edad, ciudad, intereses)', 'Presupuesto: cuánto pagas por día', 'Costo por resultado: cuánto te costó cada mensaje o venta', 'Creativo: el video o la imagen del anuncio'] },
        { type: 'note', tone: 'tip', title: 'Primero orgánico', body: 'Pauta el contenido que ya funcionó gratis. Si un video tuvo buenas vistas y mensajes sin pagar, es el mejor candidato.' },
      ], [
        Q('¿Qué es el costo por resultado?', ['Cuánto te costó cada mensaje o venta', 'El precio de tu producto', 'Lo que cobra el celular'], 0, 'Es la métrica clave para saber si la pauta sirve.'),
        Q('¿Qué contenido conviene pautar?', ['El que ya funcionó sin pagar', 'Uno nuevo sin probar', 'El que menos gustó'], 0, 'Así aumentas las probabilidades de éxito.'),
      ]),
      R('r4-l2', 'Tu primera campaña paso a paso', [
        { type: 'steps', title: 'Campaña de mensajes a WhatsApp', items: ['Conecta tu cuenta de Instagram y tu WhatsApp Business a Meta Business Suite.', 'Crea un anuncio con el objetivo de mensajes a WhatsApp.', 'Público: tu ciudad o país, edad de tu cliente ideal y 3 a 5 intereses relacionados.', 'Presupuesto: empieza con poco, por ejemplo $10.000 a $20.000 al día durante 5 días.', 'Creativo: tu mejor video vertical con un llamado claro: «Escríbeme INFO».', 'Revisa resultados después de 3 días, no antes.'] },
        { type: 'note', tone: 'safety', title: 'Cuida tu presupuesto', body: 'Pon siempre un límite diario y una fecha de fin. Así nunca gastas más de lo que planeaste.' },
      ], [
        Q('¿Qué objetivo usar para vender por WhatsApp?', ['Mensajes a WhatsApp', 'Reproducciones de video', 'Me gusta en la página'], 0, 'El objetivo le dice a Meta qué resultado buscar.'),
        Q('¿Cuándo revisar los resultados?', ['Después de unos 3 días', 'A los 10 minutos', 'Nunca'], 0, 'Meta necesita unos días para aprender a quién mostrar el anuncio.'),
      ]),
      R('r4-l3', 'Medir y mejorar', [
        { type: 'text', title: 'Los números te dicen qué hacer', body: ['No necesitas ser experto: con dos números sabes si una campaña sirve.'] },
        { type: 'checklist', title: 'Las dos métricas clave', items: ['Costo por mensaje: cuánto pagaste por cada persona que te escribió', 'Tasa de cierre: de cada 10 mensajes, cuántos compraron'] },
        { type: 'text', title: 'Ejemplo', body: ['Gastaste $50.000 y te escribieron 25 personas: cada mensaje costó $2.000. Si cerraste 3 ventas de $60.000, vendiste $180.000. Esa campaña vale la pena repetirla.', 'Si el costo por mensaje sube mucho, cambia el video. Si te escriben mucho pero no compran, revisa tu forma de responder en WhatsApp.'] },
      ], [
        Q('Gastaste $50.000 y recibiste 25 mensajes. ¿Cuánto costó cada uno?', ['$2.000', '$25.000', '$500'], 0, '50.000 ÷ 25 = 2.000.'),
        Q('Te escriben mucho pero nadie compra. ¿Qué revisas?', ['Cómo respondes en WhatsApp', 'Subes el presupuesto', 'Borras la cuenta'], 0, 'El anuncio funciona; el problema está en la conversación.'),
      ]),
    ],
  },
  {
    id: 'r5', title: 'Vende como afiliado de Nivela', goal: 'Usa tu enlace de afiliado para recomendar cursos y ganar comisiones con honestidad.', color: 'ink',
    lessons: [
      R('r5-l1', 'Cómo funciona el programa', [
        { type: 'text', title: 'Recomiendas y ganas por cada venta', body: ['En Nivela cada usuario tiene un enlace personal. Si alguien entra por tu enlace y compra un curso, ganas una comisión sobre esa venta. El porcentaje y tus ventas aparecen en tu panel de afiliado.', 'Solo se gana por ventas a clientes reales. No hay comisiones por «inscribir» a otros afiliados ni niveles: eso protege a todos y mantiene el programa legal.'] },
        { type: 'steps', title: 'Empieza hoy', items: ['Entra a tu cuenta y abre «Afiliados».', 'Copia tu enlace personal.', 'Úsalo en tu biografía, tus historias y tus respuestas de WhatsApp.', 'Revisa tus ventas y comisiones en el panel.'] },
      ], [
        Q('¿Por qué se gana una comisión?', ['Por cada venta a un cliente real', 'Por inscribir a otros afiliados', 'Por tener muchos seguidores'], 0, 'La comisión viene de ventas reales de los cursos.'),
        Q('¿Dónde ves tus ventas como afiliado?', ['En tu panel de afiliado', 'En tu WhatsApp', 'En ningún lado'], 0, 'El panel muestra tus ventas y comisiones.'),
      ]),
      R('r5-l2', 'Recomienda con honestidad', [
        { type: 'text', title: 'Tu reputación vale más que una comisión', body: ['Recomienda solo cursos que conozcas y que de verdad le sirvan a la persona. Si alguien compra por ti y queda contento, te volverá a comprar y te recomendará.'] },
        { type: 'checklist', title: 'Reglas de oro', items: ['Di que es tu enlace de afiliado', 'No prometas resultados garantizados', 'No envíes el enlace a quien no te lo pidió', 'Haz tú el curso primero para hablar con conocimiento'] },
        { type: 'prompt', title: 'Mensaje honesto', text: 'Yo hice el curso de [curso] y me sirvió para [resultado real]. Si te interesa, este es mi enlace de afiliado (gano una comisión si compras por ahí): [enlace]' },
      ], [
        Q('¿Qué debes decir al compartir tu enlace?', ['Que es un enlace de afiliado', 'Nada, es mejor ocultarlo', 'Que el curso es gratis'], 0, 'La transparencia genera confianza.'),
        Q('¿Qué cursos conviene recomendar?', ['Los que conoces y le sirven a la persona', 'Todos, para ganar más', 'Los más caros'], 0, 'Una buena recomendación trae clientes que vuelven.'),
      ]),
      R('r5-l3', 'Tu plan de 30 días', [
        { type: 'text', title: 'Pon todo en práctica', body: ['Este plan junta todo el curso. No esperes resultados de un día para otro: el primer mes es para crear el hábito y aprender qué funciona con tu público.'] },
        { type: 'checklist', title: 'Plan de 30 días', items: ['Semana 1: perfil optimizado, nicho definido y 3 publicaciones', 'Semana 2: 4 videos cortos con ganchos y una secuencia de historias', 'Semana 3: pide 3 testimonios reales y responde todos los mensajes en menos de 5 minutos', 'Semana 4: pauta tu mejor video con un presupuesto pequeño y mide el costo por mensaje', 'Todos los días: 20 minutos respondiendo comentarios y mensajes'] },
        { type: 'note', tone: 'tip', title: 'Mide y ajusta', body: 'Al final del mes revisa qué publicaciones trajeron más mensajes y repite ese tipo de contenido.' },
      ], [
        Q('¿Qué se espera del primer mes?', ['Crear el hábito y aprender qué funciona', 'Hacerse millonario', 'Nada'], 0, 'Los resultados llegan con constancia.'),
        Q('¿Qué haces al final del mes?', ['Reviso qué funcionó y lo repito', 'Borro todo y empiezo de nuevo', 'Dejo de publicar'], 0, 'Los datos te dicen qué hacer el mes siguiente.'),
      ]),
    ],
  },
]

export const redesDigitales = { id: 'redes-digitales', kind: 'standard', units }
