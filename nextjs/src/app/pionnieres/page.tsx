import { Hero } from "@/components/Hero";
import {
  type PionniereItem,
  PionnieresCarousel,
} from "@/components/PionnieresCarousel";
import { PageTitle } from "@/components/titles";

function shuffleItems(items: PionniereItem[]) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = shuffledItems[index];

    shuffledItems[index] = shuffledItems[randomIndex];
    shuffledItems[randomIndex] = currentItem;
  }

  return shuffledItems;
}

const pionnieres = [
  {
    id: "ellen-johnson-sirleaf",
    name: "Ellen Johnson Sirleaf",
    role: "première présidente africaine",
    description: [
      "Ellen Johnson Sirleaf est née le 29 octobre 1938 à Monrovia, au Libéria.",
      "Sa carrière débute rapidement au Libéria où elle occupe des postes de ministre adjointe des Finances (1972-1973) sous le président William Tolbert, puis ministre des Finances (1980-1985) sous Samuel Doe. Après avoir été condamnée à dix ans de prison pour avoir critiqué la dictature, elle s'exile au Kenya puis aux États-Unis pendant 12 ans. Durant son exil, elle devient une économiste influente.",
      "De 1992 à 1997, elle dirige le Bureau régional pour l'Afrique du Programme des Nations Unies pour le développement (PNUD). Après la guerre civile qui ravage le Libéria, Ellen Johnson Sirleaf revient en 2003, après le départ de Charles Taylor, pour présider la Commission sur la bonne gouvernance. En 2005, elle se présente à nouveau à l'élection présidentielle et, après avoir remporté le second tour face à George Weah, devient la première femme élue présidente du Libéria. En 2011, elle est lauréate du prix Nobel de la paix, aux côtés de Leymah Gbowee et Tawakkul Karman, pour ses efforts en faveur de la paix, des droits des femmes et de la démocratie.",
      "Dans une interview pour Forbes France, elle expliquait que le prix Nobel qu'elle avait reçu en 2011 ne lui avait pas seulement conféré un titre honorifique, mais une responsabilité : « J'ai le devoir de représenter les aspirations et les attentes des femmes ; la responsabilité de défendre leurs causes et d'incarner ce que signifie être une femme au pouvoir. » Elle soulignait aussi l'importance de briser les stéréotypes de genre et de valoriser les contributions des femmes à tous les niveaux de la société.",
    ],
  },
  {
    id: "hubertine-auclert",
    name: "Hubertine Auclert",
    role: "militante emblématique du droit de vote des femmes en France",
    description: [
      "Le vote des femmes est l'un des événements les plus mémorables de la première vague féministe.",
      "À sa proue, Hubertine Auclert se distingue par son engagement jugé tant révolutionnaire que radical pour l'époque.",
      "Journaliste, écrivaine et militante,elle reste dans les annales comme la première à se déclarer féministe. Un discours à contre-courant du sens péjoratif employé initialement par Alexandre Dumas pour décrire les hommes soutenant la cause.",
      "Âgée de 25 ans, elle arrive à Paris et rejoint une association qui deviendra plus tard le principal mouvement suffragiste à l'échelle nationale : la Ligue française pour le droit des femmes (LFDF) dont Victor Hugo fût le Président d'honneur. Très tôt, la « première suffragette de France » défend le projet d'une émancipation d'abord politique. C'est-à-dire que les femmes ne pourront améliorer leur statut et leurs conditions de vie que si elles sont décisionnaires dans l'élaboration et le vote des lois.",
      "Pour suivre ses idées, Hubertine Auclert quitte la LFDF set fonde la société Le Droit des femmes en 1876 devenue Le Suffrage des femmes squelques années plus tard. S'en suit un parcours des plus remarquables entre journalisme saudacieux et militantisme ambitieux : grève des impôts en 1880, lancement sdu journal La Citoyenne en 1881, cocréation du Conseil national des femmes françaises sen 1900, renversement d'une urne aux municipales en 1908, candidature ssauvage aux législatives en 1910, nombreuses parutions d'articles dans L'Avenir des femmes, Le Petit Parisien, La Lanterne, La Libre Parole...",
      "Plus que le suffrage et l'éligibilité des femmes, elle revendique aussi la séparation des biens entre époux ainsi que la féminisation de la langue française et dénonce les méfaits du colonialisme sur les femmes algériennes.",
      "Hubertine Auclert décède en 1914, trois décennies avant, l'accomplissement du droit de vote des femmes en France.",
    ],
  },
  {
    id: "marie-cau",
    name: "Marie Cau",
    role: "première femme transgenre élue maire en France",
    description: [
      "Marie Cau est une ingénieure agronome, entrepreneuse et militante engagée pour l'écologie et les droits humains. En mars 2020, elle devient la première femme transgenre élue maire en France, dans la commune de Tilloylez-Marchiennes, dans le Nord. ",
      "Son élection marque une avancée historique en matière de visibilité et de reconnaissance des personnes trans dans la sphère politique. Elle promeut un modèle de gouvernance locale fondé sur la démocratie participative, la transition écologique et l'inclusion sociale. Marie Cau milite activement pour une société plus égalitaire, où le genre et l'identité ne soient plus des freins à l'engagement citoyen. Elle est également une voix importante dans les débats sur la représentation des femmes et des minorités dans les institutions publiques. À travers son engagement, elle contribue à la féminisation du pouvoir et à une transformation durable des pratiques politiques. ",
      "En février 2024, Marie Cau démissionne de ses fonctions de maire, invoquant des désaccords avec l'équipe municipale. Elle affirme néanmoins rester engagée dans la vie publique et continue de porter ses combats à l'échelle nationale.",
    ],
  },
  {
    id: "edith-cresson",
    name: "Edith Cresson",
    role: "première femme Première Ministre de France",
    description: [
      "Le 15 mai 1991, pour la première fois dans l'histoire de la République, le gouvernement est dirigé par une femme. Edith Cresson devient un symbole au sommet du gouvernement et marque un tournant historique pour la représentation des femmes au pouvoir.",
      "Après un passage au Parlement européen entre 1979 et 1981, Edith Cresson devient la première femme ministre de l'Agriculture dans un climat d'hostilité, notamment de la FNSEA dont les pancartes « Edith, on t'espère meilleure au lit qu'au ministère » sont un exemple notable. Le sexisme et la misogynie deviennent son quotidien, tant dans les médias, que sur les bancs des député•es à l'Assemblée nationale, qu'aux postes ministériels qu'elle occupera. C'est le rôle de n'°2 de l'État qui lui sera finalement confié par un François Mitterrand au milieu de son second septennat.",
      "Dix ans après Margaret Thatcher au Royaume-Uni, Edith Cresson succède ainsi à Michel Rocard en 1991. Son gouvernement comprend 6 femmes dont Martine Aubry. Reste aussi en mémoire des caricatures qui témoignent du machisme virulent à son encontre : « Madame de Pompadour », en référence à la maîtresse de Louis XV, ou encore « Amabotte », la marionnette de la panthère dans le « Bébête Show » sur TF1.",
      "Après dix mois au pouvoir, elle démissionne, signant un record de brièveté à Matignon, un record qu'elle détiendra pendant 25 ans, jusqu'aux démissions de Bernard Cazeneuve en 2017 et de Michel Barnier en 2024. Raison pour laquelle elle signe en 1993, aux côtés de Simone Veil, la charte d'Athènes : « parce que les femmes représentent plus de la moitié de la population, la démocratie impose la parité dans la représentation et l'administration des nations ».",
      "Après quatre années en tant que Commissaire européenne à la Recherche, aux Sciences et Technologies, Edith Cresson se retire progressivement de la scène politique en 1999. Depuis, elle poursuit ses engagements en faveur de l'éducation via une Fondation à son nom pour créer des « écoles de la deuxième chance ». Il faudra attendre 2024 pour revoir une femme Première ministre, en la personne d'Elisabeth Borne, qui n'a à ce jour pas de troisième successeure.",
    ],
  },
  {
    id: "vigdis-finnbogadottir",
    name: "Vigdis Finnbogadottir",
    role: "première femme présidente de l'histoire",
    description: [
      "Vigdís Finnbogadóttir est née le 15 avril 1930 à Reykjavik. Élue présidente de la République d'Islande en 1980, elle occupe cette fonction pendant 16 ans, jusqu'en 1996.",
      "Son élection est un moment charnière dans l'histoire politique mondiale et représente une avancée notable pour la parité hommes-femmes dans les sphères politiques.",
    ],
  },
  {
    id: "marcelle-campana",
    name: "Marcelle Campana",
    role: "première femme ambassadrice de France",
    description: [
      "Née le 10 avril 1913 à Paris, Marcelle Andrée Campana est issue d'une famille aux racines corses. Fille de César-Rizio Campana, diplomate français ayant servi comme consul général à Sydney et à Londres dans les années 1920, elle est imprégnée dès son jeune âge du monde diplomatique. ",
      "Après des études à Sciences Po, elle intègre en 1935 le ministère des Affaires étrangères en tant que secrétaire. Durant la Seconde Guerre mondiale, Marcelle Campana participe activement à la Résistance, s'engageant au sein des Forces françaises combattantes.",
      "Après la Libération, sa carrière prend un essor notable : elle est affectée à l'ambassade de France à Oslo, puis nommée consule générale à Toronto en juillet 1967, devenant ainsi la première femme à occuper ce poste au Canada. En 1972, Marcelle Campana est nommée ambassadrice de France au Panama, marquant une étape historique en tant que première femme à accéder à ce rang dans la diplomatie française. Cette nomination est perçue comme une avancée majeure dans un milieu traditionnellement dominé par les hommes. ",
      "Après son mandat au Panama, Marcelle Campana est nommée consule générale à Monaco en 1975, où elle sert pendant trois ans. Bien que son parcours ait marqué une étape importante, la vie de Marcelle Campana reste peu documentée, ce qui témoigne de la difficulté à inscrire les figures féminines dans l'histoire diplomatique. Comme le souligne l'historien Yves Denéchère, il existe un manque d'archives sur les conditions de sa nomination et les réactions qu'elle a suscitées : « on ne sait rien sur son parcours et ses engagements personnels, sur les conditions de sa nomination, sur les réactions du monde politique et diplomatique et sur celles de l'opinion publique ».",
      "Enfin, si Campana a ouvert la voie, la diplomatie française est longtemps restée très masculine.  En 1982, seules trois femmes occupent un poste d'ambassadrice. Il faut attendre les années 2000 pour voir une féminisation plus notable des hautes fonctions diplomatiques, bien que les inégalités persistent dans les postes stratégiques (ONU, grandes ambassades).",
    ],
  },
];

export default function Page() {
  const carouselItems = shuffleItems(
    pionnieres.map((item) => ({
      ...item,
      imageAlt: item.name,
      imageSrc: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/pionnieres/${item.id}.png`,
    })),
  );

  return (
    <div className="mt-16 flex flex-col gap-16 pb-20">
      <PageTitle
        id="les-pionnieres"
        title="Les Pionnières"
        subtitle="L'Histoire elle aussi a longtemps été racontée par et pour les hommes en
        invisibilisant le rôle des femmes dans notre Histoire collective.
        L'Histoire des femmes et des grandes avancées pour leurs droits est elle
        aussi méconnue."
        classes={{
          subtitle: "body1-regular",
        }}
      />
      <Hero className="h-80 p-2">
        <p className="text-foundations-blanc max-w-sm lg:max-w-2xl text-center body1-medium p-4 lg:mb-32">
          Rendons-leur ce qui leur appartient, et faisons connaitre l'histoire
          de ces femmes pionnières qui se sont battues pour que le pouvoir ne
          soit pas qu'un nom masculin.
        </p>
      </Hero>
      <div className="relative z-10 -mt-28 lg:-mt-80">
        <PionnieresCarousel items={carouselItems} />
      </div>
    </div>
  );
}
