// Contenido del curso Inglés A1.
// words:     [inglés, español]  → vocabulario de la lección
// sentences: [inglés, español]  → frases para armar y traducir
// alts (opcional): otras respuestas válidas al escribir una palabra en inglés.
export const inglesA1 = {
  id: 'ingles-a1',
  units: [
    {
      id: 'u1',
      title: 'Saludos y presentaciones',
      goal: 'Saluda, preséntate y pregunta cómo está alguien.',
      color: 'ultra',
      lessons: [
        {
          id: 'u1-l1',
          title: 'Hola y adiós',
          words: [['hello', 'hola'], ['goodbye', 'adiós'], ['good morning', 'buenos días'], ['good afternoon', 'buenas tardes'], ['good night', 'buenas noches'], ['thank you', 'gracias']],
          sentences: [['Hello, good morning', 'Hola, buenos días'], ['Thank you, goodbye', 'Gracias, adiós'], ['Good night, thank you', 'Buenas noches, gracias']],
        },
        {
          id: 'u1-l2',
          title: 'Me presento',
          words: [['name', 'nombre'], ['my', 'mi'], ['your', 'tu'], ['what', 'qué'], ['is', 'es'], ['nice to meet you', 'mucho gusto']],
          sentences: [['My name is Ana', 'Mi nombre es Ana'], ['What is your name?', '¿Cuál es tu nombre?'], ['I am Carlos, nice to meet you', 'Soy Carlos, mucho gusto']],
        },
        {
          id: 'u1-l3',
          title: '¿Cómo estás?',
          words: [['how', 'cómo'], ['fine', 'bien'], ['very', 'muy'], ['and', 'y'], ['tired', 'cansado'], ['happy', 'feliz']],
          sentences: [['How are you?', '¿Cómo estás?'], ['I am fine, thank you', 'Estoy bien, gracias'], ['I am very tired', 'Estoy muy cansado']],
        },
      ],
    },
    {
      id: 'u2',
      title: 'Personas y familia',
      goal: 'Usa el verbo to be y habla de tu familia y tu trabajo.',
      color: 'mango',
      lessons: [
        {
          id: 'u2-l1',
          title: 'El verbo to be',
          words: [['I', 'yo'], ['you', 'tú / usted'], ['he', 'él'], ['she', 'ella'], ['we', 'nosotros'], ['they', 'ellos']],
          sentences: [['She is a teacher', 'Ella es profesora'], ['We are friends', 'Somos amigos'], ['He is from Colombia', 'Él es de Colombia']],
        },
        {
          id: 'u2-l2',
          title: 'La familia',
          words: [['mother', 'mamá'], ['father', 'papá'], ['brother', 'hermano'], ['sister', 'hermana'], ['son', 'hijo'], ['daughter', 'hija']],
          sentences: [['This is my mother', 'Esta es mi mamá'], ['I have a sister', 'Tengo una hermana'], ['My father is a doctor', 'Mi papá es médico']],
        },
        {
          id: 'u2-l3',
          title: 'Profesiones',
          words: [['teacher', 'profesor'], ['doctor', 'médico'], ['student', 'estudiante'], ['engineer', 'ingeniero'], ['nurse', 'enfermero'], ['lawyer', 'abogado']],
          sentences: [['I am a student', 'Soy estudiante'], ['She is a nurse', 'Ella es enfermera'], ['Are you a lawyer?', '¿Eres abogado?']],
        },
      ],
    },
    {
      id: 'u3',
      title: 'Números y colores',
      goal: 'Cuenta hasta diez, nombra colores y di tu edad.',
      color: 'mint',
      lessons: [
        {
          id: 'u3-l1',
          title: 'Números del 1 al 10',
          words: [['one', 'uno'], ['two', 'dos'], ['three', 'tres'], ['five', 'cinco'], ['seven', 'siete'], ['ten', 'diez']],
          sentences: [['I have two brothers', 'Tengo dos hermanos'], ['Ten students', 'Diez estudiantes'], ['She has three sons', 'Ella tiene tres hijos']],
        },
        {
          id: 'u3-l2',
          title: 'Colores',
          words: [['red', 'rojo'], ['blue', 'azul'], ['green', 'verde'], ['yellow', 'amarillo'], ['black', 'negro'], ['white', 'blanco']],
          sentences: [['The car is red', 'El carro es rojo'], ['The house is white', 'La casa es blanca'], ['My favorite color is blue', 'Mi color favorito es el azul']],
        },
        {
          id: 'u3-l3',
          title: '¿Cuántos años tienes?',
          words: [['years', 'años'], ['old', 'viejo'], ['twenty', 'veinte'], ['thirty', 'treinta'], ['birthday', 'cumpleaños'], ['today', 'hoy']],
          sentences: [['How old are you?', '¿Cuántos años tienes?'], ['I am twenty years old', 'Tengo veinte años'], ['My birthday is today', 'Mi cumpleaños es hoy']],
        },
      ],
    },
    {
      id: 'u4',
      title: 'Comida y bebida',
      goal: 'Pide comida, di lo que te gusta y lo que no.',
      color: 'rose',
      lessons: [
        {
          id: 'u4-l1',
          title: 'En la mesa',
          words: [['bread', 'pan'], ['rice', 'arroz'], ['chicken', 'pollo'], ['egg', 'huevo'], ['fruit', 'fruta'], ['cheese', 'queso']],
          sentences: [['I eat rice and chicken', 'Como arroz y pollo'], ['The bread is good', 'El pan es bueno'], ['I want an egg', 'Quiero un huevo']],
        },
        {
          id: 'u4-l2',
          title: 'Bebidas',
          words: [['water', 'agua'], ['coffee', 'café'], ['milk', 'leche'], ['juice', 'jugo'], ['tea', 'té'], ['please', 'por favor']],
          sentences: [['I drink coffee', 'Tomo café'], ['A glass of water, please', 'Un vaso de agua, por favor'], ['She drinks tea', 'Ella toma té']],
        },
        {
          id: 'u4-l3',
          title: 'Me gusta',
          words: [['like', 'gustar'], ['want', 'querer'], ['delicious', 'delicioso'], ['breakfast', 'desayuno'], ['lunch', 'almuerzo'], ['dinner', 'cena']],
          sentences: [['I like coffee', 'Me gusta el café'], ["I don't like milk", 'No me gusta la leche'], ['Breakfast is delicious', 'El desayuno está delicioso']],
        },
      ],
    },
  ],
}

export const allLessons = (course) => course.units.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u })))
