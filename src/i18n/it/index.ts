import type { Strings } from "../types.ts";
import { runtime } from "./runtime.ts";

export const it: Strings = {
  runtime,

  nav: {
    home: "Home",
    circle: "Circolo",
    chords: "Accordi",
    colour: "Colore",
    siteIndex: "Indice",
    primaryLabel: "Principale",
    languageLabel: "Lingua",
    darkMode: "Modo scuro",
  },

  titles: {
    home: "Circolo delle quinte cromestesico",
    circle: "Il circolo — Circolo delle quinte cromestesico",
    chords: "Accordi — Circolo delle quinte cromestesico",
    colour: "Colore — Circolo delle quinte cromestesico",
    siteIndex: "Indice — Circolo delle quinte cromestesico",
  },

  terms: {
    dominant: "dominante",
    subdominant: "sottodominante",
    triad: "triade",
    happyBirthday: "Tanti auguri a te",
  },

  home: {
    h1: "Circolo delle quinte cromestesico",
    intro:
      "Clicca una tonalità dell'anello esterno per sentire il suo accordo maggiore, o dell'anello interno per il suo relativo minore. Un contorno sottile traccia le sue tre tonalità affini su ciascun anello, etichettate con il loro numero romano — clicca una riga della tabella degli accordi per sentirlo da solo.",
    playbackLabel: "Stile di riproduzione",
    arpeggio: "Arpeggio",
    chord: "Accordo",
    wheelLabel: "Tonalità del circolo delle quinte",
    keyboardLabel: "Tastiera di pianoforte di due ottave",
    pickAKey: "Scegli una tonalità",
    playHappyBirthday: "Suona Tanti auguri a te",
    happyBirthdayCaption:
      'Suona "Tanti auguri a te" trasposto nella tonalità che hai scelto.',
    enharmonicMajorLabel: "fa diesis maggiore, o sol bemolle maggiore",
    enharmonicMinorLabel: "re diesis minore, o mi bemolle minore",
    pianoKeyLabel: (label, flatLabel, octave) =>
      flatLabel ? `${label} o ${flatLabel} ${octave}` : `${label} ${octave}`,
  },

  circle: {
    h1: "Cosa mostra il circolo delle quinte",
    fifthsHeading: "La quinta, e perché forma un circolo",
    fifths:
      'Una "quinta" sono semplicemente due note distanti sette semitoni: uno degli intervalli più consonanti della musica, ed è per questo che sovrapporre quinte una sull\'altra (C, poi G una quinta sopra, poi D una quinta sopra quella, e così via) produce una successione di tonalità che suonano tutte molto affini alle loro vicine. Continua a sovrapporle e passerai per tutte le 12 tonalità possibili prima di tornare a C — da qui il circolo. L\'anello esterno della pagina iniziale è esattamente quella successione, in senso orario.',
    signaturesHeading: "Armature: un'alterazione per passo",
    signatures:
      "Ogni passo lungo il circolo cambia esattamente una nota della scala: la scala di G maggiore è quella di C maggiore con F sostituito da F♯, D maggiore aggiunge anche C♯, e così via. È anche per questo che le <strong>armature di chiave</strong> (i diesis o i bemolli scritti all'inizio di una partitura) crescono di esattamente un'alterazione per passo in senso orario, e di un bemolle per passo in senso antiorario.",
    badges:
      "I piccoli segni ♯ e ♭ stampati attorno alla ruota sono quei conteggi: un ♯ accanto a G, due accanto a D, e così via fino ai bemolli dall'altro lato. C sta in alto senza nessuno dei due, perché C maggiore non usa né diesis né bemolli.",
    minorsHeading: "L'anello interno: i relativi minori",
    minors:
      "Ogni tonalità maggiore ha anche un <strong>relativo minore</strong>: una tonalità minore che condivide esattamente la sua armatura. Occupa la stessa posizione sul circolo — l'anello interno della pagina iniziale — e la sua scala minore naturale usa le stesse sette note della sua maggiore, cominciando semplicemente tre semitoni più in basso. A minore sono le sette note di C maggiore cominciando da A invece che da C, ed è per questo che i due settori occupano la stessa porzione della ruota e portano lo stesso numero di alterazioni.",
    outlineHeading: "Il contorno: tre tonalità affini",
    outline:
      "Scegli una tonalità nella pagina iniziale e un contorno sottile traccerà tre porzioni: la tonalità scelta, più la vicina immediata su ciascun lato. Quelle vicine sono le sue <strong>tonalità affini</strong> — un passo in senso orario è la <strong>dominante</strong> (una quinta sopra), un passo in senso antiorario la <strong>sottodominante</strong> (una quinta sotto). Poiché ogni passo cambia una sola nota, quelle tre tonalità differiscono fra loro per una singola alterazione, ed è questo che rende il passaggio da una all'altra morbido e non brusco.",
    outlineLink:
      "Quelle stesse tre porzioni sono dove vivono tutti gli accordi della tonalità scelta. È l'argomento della pagina {link}.",
  },

  chords: {
    h1: "Accordi, numeri romani e funzioni",
    triadHeading: "Costruire una triade",
    triadIntro:
      "Una <strong>triade</strong> è un accordo di tre note: scegli una nota della scala, poi aggiungi quella due gradi sopra e quella quattro gradi sopra — una nota ogni due. Che il risultato suoni maggiore, minore o diminuito dipende soltanto da quanti semitoni cadono quelle due note aggiunte:",
    majorRecipe:
      "<strong>Maggiore</strong> — 4 semitoni fino alla nota centrale, 7 fino a quella superiore.",
    minorRecipe:
      "<strong>Minore</strong> — 3 semitoni fino alla nota centrale, 7 fino a quella superiore.",
    diminishedRecipe:
      "<strong>Diminuito</strong> — 3 semitoni fino alla nota centrale, 6 fino a quella superiore.",
    triadOutro:
      "Quell'unico semitono di differenza sulla nota centrale è tutta la differenza fra un accordo che suona luminoso e uno che suona triste.",
    sevenHeading: "I sette accordi di una tonalità",
    sevenIntro:
      "Costruisci una triade su ciascuna delle sette note di una scala, usando solo note di quella scala, e ottieni i sette accordi che appartengono alla tonalità: i suoi accordi <em>diatonici</em>. Il loro schema di qualità è lo stesso in tutte le tonalità maggiori, ed è per questo che la ruota può etichettarli. Ogni grado ha anche un nome tradizionale legato alla funzione che svolge, e un <strong>numero romano</strong> che ne codifica la qualità: maiuscolo per maggiore, minuscolo per minore, e un piccolo ° per diminuito.",
    tableCaption: "I sette accordi diatonici di C maggiore",
    qualityHeader: "Qualità",
    sevenOutro:
      "I due che fanno la maggior parte del lavoro sono la <strong>dominante</strong> (V) e la <strong>sottodominante</strong> (IV): V tende a riportare alla tonica, ed è per questo che tantissima musica finisce con V → I. In una tonalità minore la stessa costruzione dà uno schema diverso — i, ii°, III, iv, v, VI, VII — perché le note della scala minore naturale sono altre, e il suo settimo grado sta un tono sotto la tonica invece di un semitono: si chiama quindi <em>sottotonica</em> e non sensibile.",
    slicesHeading: "Perché si illuminano solo tre porzioni",
    slices:
      "Scegli una tonalità nella pagina iniziale e i numeri romani compaiono su sei settori, distribuiti su sole tre porzioni della ruota: la tonalità stessa, la sua dominante e la sua sottodominante. Non è una semplificazione; è la ragione per cui il circolo delle quinte è utile. Sei dei sette accordi di una tonalità sono proprio gli accordi maggiori e minori di quelle tre posizioni vicine: per C maggiore, I e vi stanno nella porzione di C, V e iii in quella di G, e IV e ii in quella di F.",
    slicesSeventh:
      "Il settimo, vii°, è diminuito. Non ha una tonalità propria sulla ruota, quindi non riceve un settore — ma compare comunque nella tabella degli accordi, che li elenca tutti e sette.",
    hearingHeading: "Ascoltarlo",
    octaveNumbers:
      'I tasti bianchi della tastiera portano un numero di ottava: <code>C5</code>, <code>D5</code> e così via. È la <strong>notazione scientifica delle altezze</strong>: la lettera nomina la nota, il numero dice a quale ottava appartiene, e quel numero cambia a ogni C e non a ogni A. È così che si distinguono due tasti che sono entrambi "C".',
    tuning:
      "L'altezza che ogni tasto suona davvero deriva dal <strong>temperamento equabile a dodici note</strong> accordato su A440: l'ottava è divisa in dodici passi uguali, così ogni semitono moltiplica la frequenza per la radice dodicesima di due (circa 1,0595), contando verso l'alto o verso il basso dal A4 di 440 Hz. Ogni nota che senti qui è calcolata con quell'unica formula.",
    playback:
      "L'interruttore <strong>Arpeggio / Accordo</strong> cambia soltanto il modo in cui un accordo viene presentato, non il suo contenuto: l'arpeggio suona le tre note una dopo l'altra, l'accordo le fa suonare insieme. E poiché ogni accordo è descritto come un grado della scala e non come note fisse, la stessa melodia può essere ricostruita in qualsiasi tonalità — la <strong>trasposizione</strong>. È ciò che fa il pulsante Tanti auguri a te: suona la forma della melodia partendo dalla tonalità che hai scelto.",
    colourLink:
      "Di quale colore venga disegnata ciascuna di quelle tonalità è un'altra storia — vedi la pagina {link}.",
  },

  colour: {
    h1: "Da dove vengono i colori",
    chromesthesiaHeading: "Cromestesia: suono che arriva col colore",
    chromesthesia:
      'La cromestesia è una forma reale e ben documentata di sinestesia in cui il suono innesca involontariamente un\'esperienza di colore. Ha una componente genetica, e il colore che una persona "vede" per una data nota o voce è molto personale e costante per lei nel tempo: il C di un sinesteta può sembrare sempre rosso, mentre quello di un\'altra persona è viola. Non esiste una singola corrispondenza suono-colore condivisa da tutte le persone con questa condizione, anche se i ricercatori hanno riscontrato una tendenza generale, persino fra i non sinesteti, ad associare le altezze acute a colori più chiari e quelle gravi a colori più scuri.',
    designedHeading: "I colori di questo sito sono progettati, non misurati",
    designed:
      'Il colore preciso mostrato per ciascuna tonalità su questo sito <strong>non</strong> è un dato di cromestesia misurato: una simile corrispondenza unica non esiste, dato che i sinesteti reali non concordano fra loro. È preso in prestito dalla {link}, deliberatamente progettata dall\'artista "Mr Mars" a partire dai suoi decenni di esperienza compositiva e non da misurazioni cliniche. Le sue regole dichiarate: le tonalità con diesis, che egli associa a strumenti dal suono più brillante come il violino, ricevono tinte luminose; le tonalità con bemolli, associate a timbri di ottoni più scuri, ricevono tinte scure; E maggiore è fissata come la tonalità "più brillante" e ancora la ruota al giallo; e ogni tonalità minore riceve una sfumatura più scura della tinta del suo relativo maggiore, con il ragionamento che "la tristezza è più scura della felicità". Mr Mars afferma esplicitamente di non provare personalmente cromestesia e che la sua ruota è un sistema progettato, non scientifico.',
    approximation:
      'La sua pagina nomina una tinta per ogni tonalità ma non pubblica codici colore esatti, quindi la sfumatura precisa resa qui è un\'approssimazione propria di questo sito: la tinta nominata di ciascuna tonalità maggiore è distribuita uniformemente attorno a una ruota dei colori di 360° nell\'ordine in cui egli le elenca, e ogni relativo minore riusa quella stessa tinta con saturazione e luminosità minori — una lettura letterale della sua regola della "sfumatura più scura".',
    swatchesHeading: "Le 24 tonalità e i loro colori",
    majorsIntro:
      "Le dodici tonalità maggiori dell'anello esterno, ciascuna con il nome di colore che le dà Mr Mars:",
    minorsIntro:
      "E i dodici relativi minori dell'anello interno, ciascuno una sfumatura più scura della sua maggiore:",
  },

  siteIndex: {
    h1: "Indice",
    intro:
      "Quattro pagine: la ruota con cui puoi giocare, e tre che spiegano cosa ti sta mostrando. Qui tutto resta al livello dei fondamenti.",
    referencesHeading: "Riferimenti",
    entries: [
      {
        page: "home",
        summary:
          "La ruota interattiva stessa: clicca una tonalità per sentire il suo accordo, leggi i suoi numeri romani, suona i suoi accordi sulla tastiera e ascolta Tanti auguri a te in quella tonalità.",
        topics: ["la ruota", "tabella degli accordi", "tastiera", "Tanti auguri a te"],
      },
      {
        page: "circle",
        summary:
          "Perché dodici tonalità formano un anello, e cosa significano i segni ♯/♭, l'anello interno e il contorno sottile sulla ruota.",
        topics: [
          "che cos'è una quinta",
          "armature di chiave",
          "relativi minori",
          "tonalità affini",
        ],
      },
      {
        page: "chords",
        summary:
          "Come si costruiscono i sette accordi di una tonalità, perché portano numeri romani, e come le note vengono accordate e riprodotte.",
        topics: [
          "triadi",
          "accordi diatonici",
          "funzioni dei gradi",
          "numeri romani",
          "numeri di ottava",
          "temperamento equabile e A440",
          "trasposizione",
        ],
      },
      {
        page: "colour",
        summary:
          "Che cos'è davvero la cromestesia, perché questi colori precisi sono un sistema progettato e non dati misurati, e l'elenco completo dei 24.",
        topics: ["cromestesia", "la ruota dei colori di Mr Mars", "i 24 colori"],
      },
    ],
    references: {
      mrMars:
        "— lo schema di 24 colori che questo sito prende in prestito per le sue evidenziazioni.",
      chromesthesia: "— contesto sul fenomeno reale dal suono al colore.",
      circleOfFifths: "— contesto sulla teoria musicale da cui nasce questo diagramma.",
      romanNumerals:
        "— le triadi, i numeri romani, i nomi dei gradi e le qualità degli accordi mostrati sulla ruota e nella tabella.",
      equalTemperament:
        "— l'accordatura A440 da cui derivano le frequenze suonate, e la numerazione delle ottave stampata sui tasti bianchi.",
      musicca:
        "— riferimento per mostrare le armature sulla ruota ed elencare gli accordi diatonici di ogni tonalità con i numeri romani.",
      chromatone:
        "— riferimento per mantenere sempre visibile il colore di ogni tonalità e mostrare al centro della ruota il dettaglio di quella scelta.",
    },
  },
};
