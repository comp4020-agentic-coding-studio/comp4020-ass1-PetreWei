import type { Strings } from "../types.ts";
import { runtime } from "./runtime.ts";

export const fr: Strings = {
  runtime,

  nav: {
    home: "Accueil",
    circle: "Cycle",
    chords: "Accords",
    colour: "Couleur",
    siteIndex: "Index",
    primaryLabel: "Principal",
    languageLabel: "Langue",
  },

  titles: {
    home: "Cycle des quintes chromesthésique",
    circle: "Le cycle — Cycle des quintes chromesthésique",
    chords: "Accords — Cycle des quintes chromesthésique",
    colour: "Couleur — Cycle des quintes chromesthésique",
    siteIndex: "Index — Cycle des quintes chromesthésique",
  },

  terms: {
    dominant: "dominante",
    subdominant: "sous-dominante",
    triad: "triade",
    happyBirthday: "Joyeux anniversaire",
  },

  home: {
    h1: "Cycle des quintes chromesthésique",
    intro:
      "Cliquez sur une tonalité de l'anneau extérieur pour entendre son accord majeur, ou de l'anneau intérieur pour son relatif mineur. Un fin contour trace ses trois tonalités voisines sur chaque anneau, étiquetées par leur chiffrage romain — cliquez sur une ligne du tableau d'accords pour l'entendre seul.",
    playbackLabel: "Style de lecture",
    arpeggio: "Arpège",
    chord: "Accord",
    wheelLabel: "Tonalités du cycle des quintes",
    keyboardLabel: "Clavier de piano de deux octaves",
    pickAKey: "Choisissez une tonalité",
    playHappyBirthday: "Jouer Joyeux anniversaire",
    happyBirthdayCaption:
      'Joue "Joyeux anniversaire" transposé dans la tonalité que vous avez choisie.',
    enharmonicMajorLabel: "fa dièse majeur, ou sol bémol majeur",
    enharmonicMinorLabel: "ré dièse mineur, ou mi bémol mineur",
    pianoKeyLabel: (label, flatLabel, octave) =>
      flatLabel ? `${label} ou ${flatLabel} ${octave}` : `${label} ${octave}`,
  },

  circle: {
    h1: "Ce que montre le cycle des quintes",
    fifthsHeading: "La quinte, et pourquoi elle forme un cycle",
    fifths:
      "Une « quinte », ce sont simplement deux notes séparées de sept demi-tons : l'un des intervalles les plus consonants de la musique, et c'est pourquoi empiler des quintes les unes sur les autres (C, puis G une quinte au-dessus, puis D une quinte au-dessus de celle-ci, et ainsi de suite) produit une suite de tonalités qui sonnent toutes très proches de leurs voisines. Continuez d'empiler et vous traverserez les 12 tonalités possibles avant de revenir à C — d'où le cycle. L'anneau extérieur de la page d'accueil est exactement cette suite, dans le sens des aiguilles d'une montre.",
    signaturesHeading: "Armures : une altération par pas",
    signatures:
      "Chaque pas autour du cycle change exactement une note de la gamme : la gamme de G majeur est celle de C majeur avec F remplacé par F♯, D majeur y ajoute C♯, et ainsi de suite. C'est aussi pourquoi les <strong>armures</strong> (les dièses ou bémols écrits au début d'une partition) augmentent d'exactement une altération par pas dans le sens des aiguilles d'une montre, et d'un bémol par pas dans l'autre sens.",
    badges:
      "Les petites marques ♯ et ♭ imprimées autour de la roue sont ces décomptes : un ♯ à côté de G, deux à côté de D, et ainsi de suite jusqu'aux bémols de l'autre côté. C se trouve en haut sans aucune, parce que C majeur n'utilise ni dièse ni bémol.",
    minorsHeading: "L'anneau intérieur : les relatifs mineurs",
    minors:
      "Toute tonalité majeure possède aussi un <strong>relatif mineur</strong> : une tonalité mineure qui partage exactement son armure. Il occupe la même position sur le cycle — l'anneau intérieur de la page d'accueil — et sa gamme mineure naturelle utilise les mêmes sept notes que sa majeure, en commençant simplement trois demi-tons plus bas. A mineur, ce sont les sept notes de C majeur en commençant sur A au lieu de C, et c'est pourquoi les deux secteurs occupent la même portion de la roue et portent le même nombre d'altérations.",
    outlineHeading: "Le contour : trois tonalités voisines",
    outline:
      "Choisissez une tonalité sur la page d'accueil et un fin contour tracera trois portions : la tonalité choisie, plus sa voisine immédiate de chaque côté. Ces voisines sont ses <strong>tonalités voisines</strong> — un pas dans le sens des aiguilles d'une montre donne la <strong>dominante</strong> (une quinte au-dessus), un pas dans l'autre sens la <strong>sous-dominante</strong> (une quinte en dessous). Comme chaque pas ne change qu'une seule note, ces trois tonalités ne diffèrent entre elles que d'une altération, et c'est ce qui rend le passage de l'une à l'autre fluide plutôt qu'abrupt.",
    outlineLink:
      "Ces mêmes trois portions sont là où vivent tous les accords de la tonalité choisie. C'est le sujet de la page {link}.",
  },

  chords: {
    h1: "Accords, chiffrages et fonctions",
    triadHeading: "Construire une triade",
    triadIntro:
      "Une <strong>triade</strong> est un accord de trois notes : choisissez une note de la gamme, puis ajoutez celle qui se trouve deux degrés au-dessus et celle qui se trouve quatre degrés au-dessus — une note sur deux. Que le résultat sonne majeur, mineur ou diminué ne dépend que du nombre de demi-tons auquel tombent ces deux notes ajoutées :",
    majorRecipe:
      "<strong>Majeur</strong> — 4 demi-tons jusqu'à la note du milieu, 7 jusqu'à celle du haut.",
    minorRecipe:
      "<strong>Mineur</strong> — 3 demi-tons jusqu'à la note du milieu, 7 jusqu'à celle du haut.",
    diminishedRecipe:
      "<strong>Diminué</strong> — 3 demi-tons jusqu'à la note du milieu, 6 jusqu'à celle du haut.",
    triadOutro:
      "Ce seul demi-ton de différence sur la note du milieu, c'est toute la différence entre un accord qui sonne lumineux et un accord qui sonne triste.",
    sevenHeading: "Les sept accords d'une tonalité",
    sevenIntro:
      "Construisez une triade sur chacune des sept notes d'une gamme, en n'utilisant que des notes de cette gamme, et vous obtenez les sept accords qui appartiennent à la tonalité : ses accords <em>diatoniques</em>. Leur suite de qualités est la même dans toutes les tonalités majeures, et c'est pourquoi la roue peut les étiqueter. Chaque degré porte aussi un nom traditionnel selon la fonction qu'il remplit, et un <strong>chiffrage romain</strong> qui encode sa qualité : majuscule pour majeur, minuscule pour mineur, et un petit ° pour diminué.",
    tableCaption: "Les sept accords diatoniques de C majeur",
    qualityHeader: "Qualité",
    sevenOutro:
      "Les deux qui font l'essentiel du travail sont la <strong>dominante</strong> (V) et la <strong>sous-dominante</strong> (IV) : V tend à ramener vers la tonique, et c'est pourquoi tant de musique se termine par V → I. Dans une tonalité mineure, la même construction donne une suite différente — i, ii°, III, iv, v, VI, VII — parce que les notes de la gamme mineure naturelle sont autres, et que son septième degré se situe un ton sous la tonique au lieu d'un demi-ton : on l'appelle donc <em>sous-tonique</em> et non sensible.",
    slicesHeading: "Pourquoi seules trois portions s'allument",
    slices:
      "Choisissez une tonalité sur la page d'accueil et des chiffrages romains apparaissent sur six secteurs, répartis sur trois portions seulement de la roue : la tonalité elle-même, sa dominante et sa sous-dominante. Ce n'est pas une simplification ; c'est la raison pour laquelle le cycle des quintes est utile. Six des sept accords d'une tonalité sont précisément les accords majeurs et mineurs de ces trois positions voisines : pour C majeur, I et vi sont dans la portion de C, V et iii dans celle de G, et IV et ii dans celle de F.",
    slicesSeventh:
      "Le septième, vii°, est diminué. Il n'a pas de tonalité propre sur la roue, il n'obtient donc pas de secteur — mais il figure toujours dans le tableau d'accords, qui en liste les sept.",
    hearingHeading: "L'écouter",
    octaveNumbers:
      "Les touches blanches du clavier portent un numéro d'octave : <code>C5</code>, <code>D5</code>, etc. C'est la <strong>notation de hauteur scientifique</strong> : la lettre nomme la note, le numéro indique à quelle octave elle appartient, et ce numéro change à chaque C et non à chaque A. C'est ainsi que l'on distingue deux touches qui sont toutes deux des « C ».",
    tuning:
      "La hauteur que joue réellement chaque touche vient du <strong>tempérament égal à douze sons</strong> accordé sur A440 : l'octave est divisée en douze pas égaux, de sorte que chaque demi-ton multiplie la fréquence par la racine douzième de deux (environ 1,0595), en comptant vers le haut ou vers le bas depuis le A4 à 440 Hz. Chaque note que vous entendez ici est calculée avec cette seule formule.",
    playback:
      "Le sélecteur <strong>Arpège / Accord</strong> ne change que la façon dont un accord est livré, non son contenu : l'arpège joue les trois notes l'une après l'autre, l'accord les fait sonner ensemble. Et comme chaque accord est décrit comme un degré de la gamme plutôt que comme des notes fixes, la même mélodie peut être reconstruite dans n'importe quelle tonalité — la <strong>transposition</strong>. C'est ce que fait le bouton Joyeux anniversaire : il joue la forme de la mélodie en partant de la tonalité que vous avez choisie.",
    colourLink:
      "De quelle couleur chacune de ces tonalités est dessinée est une autre histoire — voyez la page {link}.",
  },

  colour: {
    h1: "D'où viennent les couleurs",
    chromesthesiaHeading: "Chromesthésie : le son qui vient avec la couleur",
    chromesthesia:
      "La chromesthésie est une forme réelle et bien documentée de synesthésie dans laquelle le son déclenche involontairement une expérience de couleur. Elle a une composante génétique, et la couleur qu'une personne « voit » pour une note ou une voix donnée lui est très personnelle et reste constante au fil du temps : le C d'un synesthète peut toujours paraître rouge, tandis que celui de quelqu'un d'autre est violet. Il n'existe pas de correspondance son-couleur unique partagée par toutes les personnes concernées, même si les chercheurs ont observé une tendance générale, y compris chez les non-synesthètes, à associer les hauteurs aiguës à des couleurs plus claires et les graves à des couleurs plus sombres.",
    designedHeading: "Les couleurs de ce site sont conçues, non mesurées",
    designed:
      "La couleur précise affichée pour chaque tonalité sur ce site <strong>n'est pas</strong> une donnée de chromesthésie mesurée : une telle correspondance unique n'existe pas, puisque les synesthètes réels ne s'accordent pas entre eux. Elle est empruntée à la {link}, délibérément conçue par l'artiste « Mr Mars » à partir de ses propres décennies d'expérience de composition et non d'une mesure clinique. Ses règles déclarées : les tonalités à dièses, qu'il associe à des instruments au son plus brillant comme le violon, reçoivent des teintes lumineuses ; les tonalités à bémols, associées à des timbres de cuivres plus sombres, reçoivent des teintes sombres ; E majeur est fixée comme la tonalité « la plus brillante » et ancre la roue en jaune ; et chaque tonalité mineure reçoit une nuance plus sombre de la teinte de son relatif majeur, au motif que « la tristesse est plus sombre que la joie ». Mr Mars précise explicitement qu'il n'éprouve pas personnellement de chromesthésie et que sa roue est un système conçu, non scientifique.",
    approximation:
      "Sa page nomme une teinte pour chaque tonalité mais ne publie pas de codes de couleur exacts ; la nuance précise rendue ici est donc une approximation propre à ce site : la teinte nommée de chaque tonalité majeure est répartie uniformément autour d'une roue chromatique de 360° dans l'ordre où il les énumère, et chaque relatif mineur réutilise cette même teinte avec moins de saturation et de luminosité — une lecture littérale de sa règle de la « nuance plus sombre ».",
    swatchesHeading: "Les 24 tonalités et leurs couleurs",
    majorsIntro:
      "Les douze tonalités majeures de l'anneau extérieur, chacune avec le nom de couleur que lui donne Mr Mars :",
    minorsIntro:
      "Et les douze relatifs mineurs de l'anneau intérieur, chacun une nuance plus sombre que sa majeure :",
  },

  siteIndex: {
    h1: "Index",
    intro:
      "Quatre pages : la roue avec laquelle vous pouvez jouer, et trois qui expliquent ce qu'elle vous montre. Tout reste ici au niveau des fondamentaux.",
    referencesHeading: "Références",
    entries: [
      {
        page: "home",
        summary:
          "La roue interactive elle-même : cliquez sur une tonalité pour entendre son accord, lisez ses chiffrages romains, jouez ses accords sur le clavier et écoutez Joyeux anniversaire dans cette tonalité.",
        topics: ["la roue", "tableau d'accords", "clavier", "Joyeux anniversaire"],
      },
      {
        page: "circle",
        summary:
          "Pourquoi douze tonalités forment un anneau, et ce que signifient les marques ♯/♭, l'anneau intérieur et le fin contour de la roue.",
        topics: [
          "ce qu'est une quinte",
          "les armures",
          "les relatifs mineurs",
          "les tonalités voisines",
        ],
      },
      {
        page: "chords",
        summary:
          "Comment se construisent les sept accords d'une tonalité, pourquoi ils portent des chiffrages romains, et comment les notes sont accordées et jouées.",
        topics: [
          "triades",
          "accords diatoniques",
          "fonctions des degrés",
          "chiffrages romains",
          "numéros d'octave",
          "tempérament égal et A440",
          "transposition",
        ],
      },
      {
        page: "colour",
        summary:
          "Ce qu'est réellement la chromesthésie, pourquoi ces couleurs précises sont un système conçu plutôt que des données mesurées, et la liste complète des 24.",
        topics: ["chromesthésie", "la roue de couleurs de Mr Mars", "les 24 couleurs"],
      },
    ],
    references: {
      mrMars:
        "— le schéma de 24 couleurs que ce site emprunte pour ses surbrillances.",
      chromesthesia: "— contexte sur le phénomène réel du son vers la couleur.",
      circleOfFifths: "— contexte sur la théorie musicale dont ce diagramme est issu.",
      romanNumerals:
        "— les triades, les chiffrages romains, les noms des degrés et les qualités d'accords affichés sur la roue et dans le tableau.",
      equalTemperament:
        "— l'accord A440 dont les fréquences jouées sont dérivées, et la numérotation des octaves imprimée sur les touches blanches.",
      musicca:
        "— référence pour l'affichage des armures sur la roue et la liste des accords diatoniques de chaque tonalité avec chiffrages romains.",
      chromatone:
        "— référence pour garder visible en permanence la couleur de chaque tonalité et afficher le détail de celle choisie au centre de la roue.",
    },
  },
};
