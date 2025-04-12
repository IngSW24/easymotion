import { PaymentRecurrence, Prisma } from "@prisma/client";
import getUsers from "./users";
import { getCategories } from "./categories";

const getCourses = async (): Promise<Prisma.CourseCreateInput[]> => {
  const users = await getUsers();
  const physiotherapist = users.find((x) => x.role === "PHYSIOTHERAPIST");
  const categories = getCategories();

  return [
    {
      id: "2bf58c59-d303-4040-9471-62c5f80ee4e0",
      name: "Acquagym per tutti",
      description:
        "Un corso divertente e rilassante, perfetto per chi vuole mantenersi in forma senza troppa fatica. Gli esercizi sono progettati per migliorare la resistenza fisica, la coordinazione e la flessibilità, utilizzando il naturale supporto e la resistenza dell'acqua. È adatto a tutte le età e non richiede abilità particolari nel nuoto. Ogni lezione si svolge in un ambiente controllato e sicuro, garantendo il massimo comfort per tutti i partecipanti.",
      short_description:
        "Migliora resistenza e flessibilità in acqua, ideale per tutti.",
      location: "Piscina Comunale, Via Pradamano 5, Udine",
      instructors: ["Anna Bianchi"],
      level: "BASIC",
      price: 15.99,
      payment_recurrence: PaymentRecurrence.SINGLE,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 20,
      tags: ["Fitness", "Acquatico", "Base", "Rilassante"],
      category: {
        connect: { id: categories[0].id },
      },
      owner: {
        connect: { applicationUserId: physiotherapist.id },
      },
      subscription_start_date: new Date("2025-04-08T20:30:00Z"),
      subscription_end_date: new Date("2025-08-08T20:30:00Z"),
      sessions: {
        create: [
          {
            id: "s1a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-09T20:30:00Z"),
            end_time: new Date("2025-04-09T21:30:00Z"),
          },
          {
            id: "s2a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-11T19:00:00Z"),
            end_time: new Date("2025-04-11T20:00:00Z"),
          },
        ],
      },
    },
    {
      id: "2f60f825-fc2e-45bd-ab1b-5f26d8eef27f",
      name: "CrossFit: Potenza e Resistenza",
      description:
        "Un programma intenso progettato per migliorare forza, resistenza e agilità. e box jump.",
      short_description:
        "Allenamento ad alta intensità per forza e resistenza.",
      location: "Palestra EnergyFit, Via dello Sport 12, Udine",
      instructors: ["Marco Conti"],
      level: "ADVANCED",
      price: 25.0,
      payment_recurrence: PaymentRecurrence.SINGLE,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 15,
      tags: ["Intenso", "Potenza", "Avanzato", "Serale"],
      category: {
        connect: { id: categories[1].id },
      },
      owner: {
        connect: { applicationUserId: physiotherapist.id },
      },
      subscription_start_date: new Date("2025-04-08T20:30:00Z"),
      subscription_end_date: new Date("2025-08-08T20:30:00Z"),
      sessions: {
        create: [
          {
            id: "s3a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-08T18:00:00Z"),
            end_time: new Date("2025-04-08T19:30:00Z"),
          },
          {
            id: "s4a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-10T18:00:00Z"),
            end_time: new Date("2025-04-10T19:30:00Z"),
          },
          {
            id: "s5a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-12T18:00:00Z"),
            end_time: new Date("2025-04-12T19:30:00Z"),
          },
        ],
      },
    },
    {
      id: "3e3af945-973d-4851-8a69-d7e3f11acfc2",
      name: "Pilates: Corpo e Mente",
      description:
        "Un corso studiato per migliorare la postura, il controllo muscolare e l'equilibrio tra corpo e mente. Attraverso esercizi mirati, sviluppati sul metodo originale di Joseph Pilates, potrai tonificare i muscoli profondi, ridurre lo stress e migliorare la tua flessibilità. Adatto sia ai principianti che a chi ha già esperienza, il corso si svolge in un'atmosfera tranquilla e rilassata.",
      short_description:
        "Migliora postura e flessibilità con il metodo Pilates.",
      location: "Studio Pilates, Via della Pace 7, Udine",
      instructors: ["Giulia Galli"],
      level: "MEDIUM",
      price: 20.0,
      payment_recurrence: PaymentRecurrence.SINGLE,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 12,
      tags: ["Postura", "Relax", "Medio"],
      category: {
        connect: { id: categories[2].id },
      },
      owner: {
        connect: { applicationUserId: physiotherapist.id },
      },
      subscription_start_date: new Date("2025-04-08T20:30:00Z"),
      subscription_end_date: new Date("2025-08-08T20:30:00Z"),
      sessions: {
        create: [
          {
            id: "s6a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-09T10:00:00Z"),
            end_time: new Date("2025-04-09T12:00:00Z"),
          },
          {
            id: "s7a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-11T10:00:00Z"),
            end_time: new Date("2025-04-11T12:00:00Z"),
          },
        ],
      },
    },
    {
      id: "8566fabc-8609-477d-8e02-a806a5862807",
      name: "Zumba Fitness: Divertiti Ballando",
      description:
        "Un corso esplosivo che combina danza e fitness per un allenamento completo e divertente. Ritmi coinvolgenti e coreografie facili da seguire ti aiuteranno a bruciare calorie e migliorare il tuo umore. Adatto a tutte le età, è perfetto per chi vuole unire l'allenamento al divertimento.",
      short_description: "Allenati ballando con ritmi coinvolgenti.",
      location: "Dance Studio, Piazza Gioia 2, Udine",
      instructors: ["Elisa Ferri"],
      level: "BASIC",
      price: 15.0,
      payment_recurrence: PaymentRecurrence.SINGLE,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 25,
      tags: ["Ballare", "Divertimento", "Base", "Serale"],
      category: {
        connect: { id: categories[3].id },
      },
      owner: {
        connect: { applicationUserId: physiotherapist.id },
      },
      subscription_start_date: new Date("2025-04-08T20:30:00Z"),
      subscription_end_date: new Date("2025-08-08T20:30:00Z"),
      sessions: {
        create: [
          {
            id: "s8a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-08T20:30:00Z"),
            end_time: new Date("2025-04-08T22:00:00Z"),
          },
          {
            id: "s9a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-10T20:30:00Z"),
            end_time: new Date("2025-04-10T22:00:00Z"),
          },
        ],
      },
    },
    {
      id: "8592b446-4d83-4524-adc1-4f85abee7a14",
      name: "Allenamento Posturale",
      description:
        "Un programma specifico per migliorare la postura e alleviare i dolori muscolari. Con esercizi mirati e personalizzati, imparerai a correggere gli squilibri posturali, rafforzare i muscoli della schiena e prevenire infortuni. Adatto a chi trascorre molte ore seduto o desidera migliorare la propria salute generale.",
      short_description: "Correggi la postura e allevia i dolori muscolari.",
      location: "Centro Benessere Postura, Via Poscolle 14, Udine",
      instructors: ["Mario Rossi"],
      level: "BASIC",
      price: 18.0,
      payment_recurrence: PaymentRecurrence.SINGLE,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 10,
      tags: ["Postura", "Salute", "Base"],
      category: {
        connect: { id: categories[5].id },
      },
      owner: {
        connect: { applicationUserId: physiotherapist.id },
      },
      subscription_start_date: new Date("2025-04-08T20:30:00Z"),
      subscription_end_date: new Date("2025-08-08T20:30:00Z"),
      sessions: {
        create: [
          {
            id: "s10a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-09T09:00:00Z"),
            end_time: new Date("2025-04-09T10:00:00Z"),
          },
          {
            id: "s11a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-11T11:00:00Z"),
            end_time: new Date("2025-04-11T12:00:00Z"),
          },
        ],
      },
    },
    {
      id: "55e2604c-2d43-4130-998d-544b69402071",
      name: "Workout a Corpo Libero",
      description:
        "Un corso che sfrutta il peso del corpo per migliorare forza, equilibrio e flessibilità. Attraverso una serie di esercizi progressivi e intensi, lavorerai su ogni gruppo muscolare, senza bisogno di attrezzi. Perfetto per chi desidera allenarsi in modo naturale e funzionale.",
      short_description: "Allenamento funzionale senza attrezzi.",
      location: "Palestra All-in-One, Via Mercatovecchio 8, Udine",
      instructors: ["Luca Verdi"],
      level: "MEDIUM",
      price: 12.0,
      payment_recurrence: PaymentRecurrence.SINGLE,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 20,
      tags: ["Funzionale", "Medio", "Naturale"],
      category: {
        connect: { id: categories[4].id },
      },
      owner: {
        connect: { applicationUserId: physiotherapist.id },
      },
      subscription_start_date: new Date("2025-04-08T20:30:00Z"),
      subscription_end_date: new Date("2025-08-08T20:30:00Z"),
      sessions: {
        create: [
          {
            id: "s12a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-08T18:00:00Z"),
            end_time: new Date("2025-04-08T20:00:00Z"),
          },
          {
            id: "s13a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-10T18:00:00Z"),
            end_time: new Date("2025-04-10T20:00:00Z"),
          },
        ],
      },
    },
    {
      id: "1334ea30-beeb-4545-93eb-bfc9b99dedd2",
      name: "Yoga all'Aperto",
      description: "Un'esperienza unica di yoga immersi nella natura.",
      short_description:
        "Yoga immersi nella natura per rilassare mente e corpo.",
      location: "Parco del Cormor, Via Cormor Alto, Udine",
      instructors: ["Chiara De Luca"],
      level: "BASIC",
      price: 10.0,
      payment_recurrence: PaymentRecurrence.SINGLE,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 20,
      tags: ["Yoga", "Rilassante", "Base", "All'aperto"],
      category: {
        connect: { id: categories[3].id },
      },
      owner: {
        connect: { applicationUserId: physiotherapist.id },
      },
      subscription_start_date: new Date("2025-04-08T20:30:00Z"),
      subscription_end_date: new Date("2025-08-08T20:30:00Z"),
      sessions: {
        create: [
          {
            id: "s14a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-13T09:30:00Z"),
            end_time: new Date("2025-04-13T10:15:00Z"),
          },
          {
            id: "s15a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-14T09:30:00Z"),
            end_time: new Date("2025-04-14T10:15:00Z"),
          },
        ],
      },
    },
    {
      id: "5b8faeeb-00c5-4bc3-851a-60ceb8420e6a",
      name: "HIIT: Allenamento Brucia-Grassi",
      description:
        "Un corso ad alta intensità progettato per massimizzare la perdita di grasso in tempi brevi. HIIT (High-Intensity Interval Training) combina brevi periodi di esercizi esplosivi con pause attive per stimolare il metabolismo. Perfetto per chi vuole un allenamento rapido ma efficace, supervisionato da istruttori esperti per garantire la sicurezza.",
      short_description: "Brucia grassi con allenamenti brevi e intensi.",
      location: "Palestra MoveIt, Via Grazzano 20, Udine",
      instructors: ["Simone Neri"],
      level: "ADVANCED",
      price: 15.0,
      payment_recurrence: PaymentRecurrence.SINGLE,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 15,
      tags: ["HIIT", "Intenso", "Avanzato", "Brucia-Grassi"],
      category: {
        connect: { id: categories[4].id },
      },
      owner: {
        connect: { applicationUserId: physiotherapist.id },
      },
      subscription_start_date: new Date("2025-04-08T20:30:00Z"),
      subscription_end_date: new Date("2025-08-08T20:30:00Z"),
      sessions: {
        create: [
          {
            id: "s16a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-09T19:00:00Z"),
            end_time: new Date("2025-04-09T20:30:00Z"),
          },
          {
            id: "s17a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-11T19:00:00Z"),
            end_time: new Date("2025-04-11T20:30:00Z"),
          },
        ],
      },
    },
    {
      id: "2025f71d-14cc-4ab1-b11e-1f9dd56dc034",
      name: "Dance Workout: Energia e Movimento",
      description:
        "Un corso di fitness coreografico per allenarsi divertendosi. Con musica coinvolgente e movimenti ritmati, migliorerai il tuo cardio e brucerai calorie senza nemmeno accorgertene. Adatto a tutti i livelli, offre un'atmosfera energica e motivante per chi ama ballare e allenarsi in compagnia.",
      short_description: "Fitness coreografico con musica ed energia.",
      location: "Centro Danza Joy, Via Manin 30, Udine",
      instructors: ["Elena Russo"],
      level: "BASIC",
      price: 12.0,
      payment_recurrence: PaymentRecurrence.SINGLE,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 25,
      tags: ["Dance", "Divertente", "Base", "Serale"],
      category: {
        connect: { id: categories[3].id },
      },
      owner: {
        connect: { applicationUserId: physiotherapist.id },
      },
      subscription_start_date: new Date("2025-04-08T20:30:00Z"),
      subscription_end_date: new Date("2025-08-08T20:30:00Z"),
      sessions: {
        create: [
          {
            id: "s18a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-10T20:00:00Z"),
            end_time: new Date("2025-04-10T21:00:00Z"),
          },
          {
            id: "s19a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-12T20:00:00Z"),
            end_time: new Date("2025-04-12T21:00:00Z"),
          },
        ],
      },
    },
    {
      id: "18f39116-bff7-424a-8687-8b3bba2ee4db",
      name: "Bootcamp: Resistenza Totale",
      description:
        "Un corso all'aperto che combina esercizi di forza, resistenza e cardio per un allenamento completo. Il programma è strutturato in stile militare e si svolge in gruppi, offrendo motivazione e supporto reciproco. Perfetto per chi ama le sfide e desidera allenarsi in modo dinamico e vario.",
      short_description: "Allenamento completo in stile bootcamp all'aperto.",
      location: "Parco Moretti, Via Mentana 60, Udine",
      instructors: ["Giorgio Bassi"],
      level: "MEDIUM",
      price: 18.0,
      payment_recurrence: PaymentRecurrence.SINGLE,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 20,
      tags: ["All'aperto", "Resistenza", "Medio", "Dinamico"],
      category: {
        connect: { id: categories[1].id },
      },
      owner: {
        connect: { applicationUserId: physiotherapist.id },
      },
      subscription_start_date: new Date("2025-04-08T20:30:00Z"),
      subscription_end_date: new Date("2025-08-08T20:30:00Z"),
      sessions: {
        create: [
          {
            id: "s20a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-08T19:00:00Z"),
            end_time: new Date("2025-04-08T20:30:00Z"),
          },
          {
            id: "s21a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p",
            start_time: new Date("2025-04-11T19:00:00Z"),
            end_time: new Date("2025-04-11T20:30:00Z"),
          },
        ],
      },
    },
  ];
};

export default getCourses;
