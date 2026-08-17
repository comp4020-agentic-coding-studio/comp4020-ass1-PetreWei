import type { Strings } from "../types.ts";
import { runtime } from "./runtime.ts";

export const es: Strings = {
  runtime,

  nav: {
    home: "Inicio",
    circle: "Círculo",
    chords: "Acordes",
    colour: "Color",
    siteIndex: "Índice",
    primaryLabel: "Principal",
    languageLabel: "Idioma",
  },

  titles: {
    home: "Círculo de quintas cromestésico",
    circle: "El círculo — Círculo de quintas cromestésico",
    chords: "Acordes — Círculo de quintas cromestésico",
    colour: "Color — Círculo de quintas cromestésico",
    siteIndex: "Índice — Círculo de quintas cromestésico",
  },

  terms: {
    dominant: "dominante",
    subdominant: "subdominante",
    triad: "tríada",
    happyBirthday: "Cumpleaños feliz",
  },

  home: {
    h1: "Círculo de quintas cromestésico",
    intro:
      "Pulsa una tonalidad del anillo exterior para oír su acorde mayor, o del anillo interior para su relativo menor. Un contorno fino traza sus tres tonalidades emparentadas en cada anillo, etiquetadas con su cifrado romano — pulsa una fila de la tabla de acordes para oírlo por separado.",
    playbackLabel: "Estilo de reproducción",
    arpeggio: "Arpegio",
    chord: "Acorde",
    wheelLabel: "Tonalidades del círculo de quintas",
    keyboardLabel: "Teclado de piano de dos octavas",
    pickAKey: "Elige una tonalidad",
    playHappyBirthday: "Tocar Cumpleaños feliz",
    happyBirthdayCaption:
      'Toca "Cumpleaños feliz" transpuesto a la tonalidad que hayas elegido.',
    enharmonicMajorLabel: "fa sostenido mayor, o sol bemol mayor",
    enharmonicMinorLabel: "re sostenido menor, o mi bemol menor",
    pianoKeyLabel: (label, flatLabel, octave) =>
      flatLabel ? `${label} o ${flatLabel} ${octave}` : `${label} ${octave}`,
  },

  circle: {
    h1: "Qué muestra el círculo de quintas",
    fifthsHeading: "La quinta, y por qué forma un círculo",
    fifths:
      'Una "quinta" son simplemente dos notas separadas por siete semitonos: uno de los intervalos más consonantes de la música, y por eso apilar quintas unas sobre otras (C, luego G una quinta por encima, luego D una quinta por encima de esa, y así sucesivamente) produce una sucesión de tonalidades que suenan muy próximas a sus vecinas. Sigue apilando y pasarás por las 12 tonalidades posibles antes de volver a C — de ahí el círculo. El anillo exterior de la página de inicio es exactamente esa sucesión, en el sentido de las agujas del reloj.',
    signaturesHeading: "Armaduras: una alteración por paso",
    signatures:
      "Cada paso alrededor del círculo cambia exactamente una nota de la escala: la escala de C mayor se convierte en la de G mayor cambiando F por F♯, D mayor añade además C♯, y así sucesivamente. Por eso las <strong>armaduras</strong> (los sostenidos o bemoles escritos al principio de una partitura) crecen en exactamente una alteración por paso en el sentido de las agujas del reloj, y en un bemol por paso en el sentido contrario.",
    badges:
      "Las pequeñas marcas ♯ y ♭ impresas alrededor de la rueda son esas cuentas: un ♯ junto a G, dos junto a D, y así hasta los bemoles del otro lado. C está arriba sin ninguna, porque C mayor no usa ningún sostenido ni bemol.",
    minorsHeading: "El anillo interior: los relativos menores",
    minors:
      "Toda tonalidad mayor tiene además un <strong>relativo menor</strong>: una tonalidad menor que comparte exactamente su armadura. Ocupa la misma posición en el círculo — el anillo interior de la página de inicio — y su escala menor natural usa las mismas siete notas que su mayor, solo empezando tres semitonos más abajo. A menor son las siete notas de C mayor empezando en A en lugar de en C, y por eso ambas cuñas ocupan la misma porción de la rueda y llevan la misma cuenta de alteraciones.",
    outlineHeading: "El contorno: tres tonalidades emparentadas",
    outline:
      "Elige una tonalidad en la página de inicio y un contorno fino trazará tres porciones: la tonalidad que has elegido, más su vecina inmediata a cada lado. Esas vecinas son sus <strong>tonalidades emparentadas</strong> — un paso en el sentido de las agujas del reloj es la <strong>dominante</strong> (una quinta arriba), y un paso en el sentido contrario es la <strong>subdominante</strong> (una quinta abajo). Como cada paso cambia solo una nota, esas tres tonalidades se diferencian entre sí por una única alteración, y eso es lo que hace que moverse entre ellas suene suave y no abrupto.",
    outlineLink:
      "Esas mismas tres porciones son donde viven todos los acordes de la tonalidad elegida. De eso trata la página {link}.",
  },

  chords: {
    h1: "Acordes, cifrados y funciones",
    triadHeading: "Construir una tríada",
    triadIntro:
      "Una <strong>tríada</strong> es un acorde de tres notas: elige una nota de la escala y añade la que está dos grados por encima y la que está cuatro grados por encima — es decir, saltando una nota cada vez. Que el resultado suene mayor, menor o disminuido depende únicamente de a cuántos semitonos caen esas dos notas añadidas:",
    majorRecipe:
      "<strong>Mayor</strong> — 4 semitonos hasta la nota central, 7 hasta la superior.",
    minorRecipe:
      "<strong>Menor</strong> — 3 semitonos hasta la nota central, 7 hasta la superior.",
    diminishedRecipe:
      "<strong>Disminuido</strong> — 3 semitonos hasta la nota central, 6 hasta la superior.",
    triadOutro:
      "Ese único semitono de diferencia en la nota central es toda la diferencia entre un acorde que suena luminoso y uno que suena triste.",
    sevenHeading: "Los siete acordes de una tonalidad",
    sevenIntro:
      "Construye una tríada sobre cada una de las siete notas de una escala, usando solo notas de esa escala, y obtendrás los siete acordes que pertenecen a la tonalidad: sus acordes <em>diatónicos</em>. Su patrón de cualidades es el mismo en todas las tonalidades mayores, y por eso la rueda puede etiquetarlos. Cada grado tiene además un nombre tradicional según la función que cumple, y un <strong>cifrado romano</strong> que codifica su cualidad: mayúscula para mayor, minúscula para menor y un pequeño ° para disminuido.",
    tableCaption: "Los siete acordes diatónicos de C mayor",
    qualityHeader: "Cualidad",
    sevenOutro:
      "Los dos que hacen la mayor parte del trabajo son la <strong>dominante</strong> (V) y la <strong>subdominante</strong> (IV): V tiende a resolver de vuelta a la tónica, y por eso tantísima música termina V → I. En una tonalidad menor la misma construcción da un patrón distinto — i, ii°, III, iv, v, VI, VII — porque las notas de la escala menor natural son otras, y su séptimo grado está un tono por debajo de la tónica en lugar de un semitono, así que se llama <em>subtónica</em> y no sensible.",
    slicesHeading: "Por qué solo se iluminan tres porciones",
    slices:
      "Elige una tonalidad en la página de inicio y aparecerán cifrados romanos en seis cuñas, repartidas en solo tres porciones de la rueda: la tonalidad misma, su dominante y su subdominante. No es una simplificación; es la razón por la que el círculo de quintas resulta útil. Seis de los siete acordes de una tonalidad son precisamente los acordes mayores y menores de esas tres posiciones vecinas: para C mayor, I y vi están en la porción de C, V y iii en la de G, y IV y ii en la de F.",
    slicesSeventh:
      "El séptimo, vii°, es disminuido. No tiene tonalidad propia en la rueda, así que no recibe cuña — pero sigue apareciendo en la tabla de acordes, que enumera los siete.",
    hearingHeading: "Cómo suena",
    octaveNumbers:
      'Las teclas blancas del teclado están etiquetadas con un número de octava: <code>C5</code>, <code>D5</code>, etc. Es la <strong>notación científica de altura</strong>: la letra nombra la nota, el número dice a qué octava pertenece, y ese número cambia en cada C y no en cada A. Así se distinguen dos teclas que son ambas "C".',
    tuning:
      "La altura que toca cada tecla proviene del <strong>temperamento igual de doce notas</strong> afinado a A440: la octava se divide en doce pasos iguales, de modo que cada semitono multiplica la frecuencia por la raíz duodécima de dos (alrededor de 1,0595), contando hacia arriba o hacia abajo desde el A4 de 440 Hz. Cada nota que oyes aquí se calcula con esa única fórmula.",
    playback:
      "El conmutador <strong>Arpegio / Acorde</strong> solo cambia cómo se presenta un acorde, no lo que contiene: el arpegio toca las tres notas una tras otra y el acorde las hace sonar juntas. Y como cada acorde se describe como un grado de la escala y no como notas fijas, la misma melodía puede reconstruirse en cualquier tonalidad — la <strong>transposición</strong>. Es lo que hace el botón de Cumpleaños feliz: toca la forma de la melodía partiendo de la tonalidad que hayas elegido.",
    colourLink:
      "De qué color se dibuja cada una de esas tonalidades es otra historia — véase la página {link}.",
  },

  colour: {
    h1: "De dónde vienen los colores",
    chromesthesiaHeading: "Cromestesia: sonido que llega con color",
    chromesthesia:
      'La cromestesia es una forma real y bien documentada de sinestesia en la que el sonido desencadena involuntariamente una experiencia de color. Tiene un componente genético, y el color que una persona "ve" para una nota o una voz dada es muy personal y constante para ella a lo largo del tiempo: el C de un sinesteta puede parecer siempre rojo, mientras que el de otra persona es morado. No existe una única correspondencia sonido-color compartida por todas las personas con esta condición, aunque los investigadores han encontrado una tendencia general, incluso entre no sinestetas, a asociar las alturas agudas con colores más claros y las graves con colores más oscuros.',
    designedHeading: "Los colores de este sitio están diseñados, no medidos",
    designed:
      'El color concreto que se muestra para cada tonalidad en este sitio <strong>no</strong> son datos medidos de cromestesia: no existe tal correspondencia única, ya que los sinestetas reales no coinciden entre sí. Está tomado de la {link}, deliberadamente diseñada por el artista "Mr Mars" a partir de sus propias décadas de experiencia componiendo y no de medición clínica. Sus reglas declaradas: las tonalidades con sostenidos, que él asocia a instrumentos de sonido más brillante como el violín, reciben matices luminosos; las tonalidades con bemoles, asociadas a timbres de metal más oscuros, reciben matices oscuros; E mayor queda fijada como la tonalidad "más brillante" y ancla la rueda en amarillo; y cada tonalidad menor recibe un tono más oscuro del matiz de su relativo mayor, con el razonamiento de que "la tristeza es más oscura que la alegría". Mr Mars afirma explícitamente que él no experimenta cromestesia y que su rueda es un sistema diseñado, no científico.',
    approximation:
      'Su página nombra un matiz para cada tonalidad pero no publica códigos de color exactos, así que el tono concreto que se representa aquí es una aproximación propia de este sitio: el matiz nombrado de cada tonalidad mayor se coloca de forma uniforme alrededor de una rueda de color de 360° en el orden en que él las enumera, y cada relativo menor reutiliza ese mismo matiz con menos saturación y luminosidad — una lectura literal de su regla del "tono más oscuro".',
    swatchesHeading: "Las 24 tonalidades y sus colores",
    majorsIntro:
      "Las doce tonalidades mayores del anillo exterior, cada una con el nombre de color que le da Mr Mars:",
    minorsIntro:
      "Y los doce relativos menores del anillo interior, cada uno un tono más oscuro que su mayor:",
  },

  siteIndex: {
    h1: "Índice",
    intro:
      "Cuatro páginas: la rueda con la que puedes jugar y tres que explican lo que te está mostrando. Todo se mantiene aquí al nivel de los fundamentos.",
    referencesHeading: "Referencias",
    entries: [
      {
        page: "home",
        summary:
          "La rueda interactiva en sí: pulsa una tonalidad para oír su acorde, lee sus cifrados romanos, toca sus acordes en el teclado y escucha Cumpleaños feliz en esa tonalidad.",
        topics: ["la rueda", "tabla de acordes", "teclado", "Cumpleaños feliz"],
      },
      {
        page: "circle",
        summary:
          "Por qué doce tonalidades forman un anillo, y qué significan las marcas ♯/♭, el anillo interior y el contorno fino de la rueda.",
        topics: [
          "qué es una quinta",
          "armaduras",
          "relativos menores",
          "tonalidades emparentadas",
        ],
      },
      {
        page: "chords",
        summary:
          "Cómo se construyen los siete acordes de una tonalidad, por qué llevan cifrados romanos, y cómo se afinan y se reproducen las notas.",
        topics: [
          "tríadas",
          "acordes diatónicos",
          "funciones de los grados",
          "cifrados romanos",
          "números de octava",
          "temperamento igual y A440",
          "transposición",
        ],
      },
      {
        page: "colour",
        summary:
          "Qué es realmente la cromestesia, por qué estos colores concretos son un sistema diseñado y no datos medidos, y la lista completa de 24.",
        topics: ["cromestesia", "la rueda de color de Mr Mars", "los 24 colores"],
      },
    ],
    references: {
      mrMars:
        "— el esquema de 24 colores que este sitio toma prestado para sus resaltes.",
      chromesthesia: "— contexto sobre el fenómeno real de sonido a color.",
      circleOfFifths: "— contexto sobre la teoría musical en la que se basa este diagrama.",
      romanNumerals:
        "— las tríadas, los cifrados romanos, los nombres de los grados y las cualidades de los acordes que se muestran en la rueda y en la tabla.",
      equalTemperament:
        "— la afinación A440 de la que se derivan las frecuencias tocadas, y la numeración de octavas impresa en las teclas blancas.",
      musicca:
        "— referencia para mostrar las armaduras en la rueda y enumerar los acordes diatónicos de cada tonalidad con cifrados romanos.",
      chromatone:
        "— referencia para mantener visible de forma permanente el color de cada tonalidad y mostrar el detalle de la elegida en el centro de la rueda.",
    },
  },
};
