export type SpecialChallenge = {
    id: string
  
    title: string
  
    typeLabel: string
  
    description: string
  
    target: number
  }
  
  export const genericSpecialChallenges: SpecialChallenge[] = [

    {
      id: "tea",
  
      title: "☕ Уютный вечер",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Налей чай или кофе, устройся поудобнее и вышей {target} крестиков.",
  
      target: 100,
    },
  
    {
      id: "movie",
  
      title: "🍿 Киновечер",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Включи любимый фильм и вышей {target} крестиков.",
  
      target: 150,
    },
  
    {
      id: "audiobook",
  
      title: "🎧 Под аудиокнигу",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Погрузись в историю и вышей {target} крестиков.",
  
      target: 200,
    },
  
    {
      id: "music",
  
      title: "🎵 Любимая музыка",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Включи любимый плейлист и вышей {target} крестиков.",
  
      target: 100,
    },
  
    {
      id: "evening",
  
      title: "🌙 Вечерняя вышивка",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Оставь дела на потом и посвяти немного времени любимому хобби. Вышей {target} крестиков.",
  
      target: 100,
    },
  
    {
      id: "selfCare",
  
      title: "🕯 Время для себя",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Сделай паузу, устройся поудобнее и проведи немного времени за вышивкой. Вышей {target} крестиков.",
  
      target: 100,
    },
  
    {
      id: "morning",
  
      title: "🌅 Доброе утро",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Начни день с любимого хобби. Вышей {target} крестиков.",
  
      target: 50,
    },
  
    {
      id: "playlist",
  
      title: "🎶 Музыкальная пауза",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Выбери несколько любимых песен и вышивай, пока они играют. Сделай {target} крестиков.",
  
      target: 150,
    },
  
    {
      id: "rain",
  
      title: "🌧 Дождливый день",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Если за окном дождь — самое время немного повышивать. Сделай {target} крестиков.",
  
      target: 100,
    },
  
    {
      id: "cozy",
  
      title: "🧦 Тёплый уют",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Плед, тёплый напиток и любимая вышивка — отличный план на вечер. Вышей {target} крестиков.",
  
      target: 150,
    },
  
    {
      id: "noRush",
  
      title: "🌿 Без спешки",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Сегодня никуда не торопимся. Спокойно вышивай и сделай {target} крестиков.",
  
      target: 100,
    },
  
    {
      id: "favorite",
  
      title: "💛 Любимый процесс",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Выбери работу, к которой особенно приятно возвращаться, и вышей {target} крестиков.",
  
      target: 150,
    },
  
    {
      id: "smallPause",
  
      title: "🌸 Маленькая пауза",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Всего несколько минут для себя. Вышей хотя бы {target} крестиков.",
  
      target: 50,
    },
  
    {
      id: "creative",
  
      title: "✨ Творческое настроение",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Настройся на творчество и проведи немного времени за вышивкой. Сделай {target} крестиков.",
  
      target: 150,
    },
  
    {
      id: "oneMore",
  
      title: "⭐ Ещё немного",
  
      typeLabel: "Для вдохновения",
  
      description:
        "Не обязательно вышивать много. Просто добавь к своей работе ещё {target} крестиков.",
  
      target: 100,
    },
  
  ]

  export const autumnSpecialChallenges: SpecialChallenge[] = [

    {
      id: "autumnTea",
  
      title: "🍂 Осенний уют",
  
      typeLabel: "Осеннее задание",
  
      description:
        "Завари что-нибудь тёплое, устройся поудобнее и вышей {target} крестиков.",
  
      target: 100,
    },
  
    {
      id: "rainyEvening",
  
      title: "🌧 Дождливый вечер",
  
      typeLabel: "Осеннее задание",
  
      description:
        "За окном дождь — самое время для вышивки. Проведи этот вечер за любимым процессом и вышей {target} крестиков.",
  
      target: 150,
    },
  
    {
      id: "autumnAudiobook",
  
      title: "🎧 Осенняя история",
  
      typeLabel: "Осеннее задание",
  
      description:
        "Включи аудиокнигу, завернись в плед и погрузись в историю. Вышей {target} крестиков.",
  
      target: 200,
    },
  
    {
      id: "warmBlanket",
  
      title: "🧣 Тёплый плед",
  
      typeLabel: "Осеннее задание",
  
      description:
        "Самое время достать тёплый плед и провести немного времени за вышивкой. Сделай {target} крестиков.",
  
      target: 100,
    },
  
    {
      id: "autumnMusic",
  
      title: "🎵 Осенний плейлист",
  
      typeLabel: "Осеннее задание",
  
      description:
        "Выбери музыку под настроение этого дня и вышей {target} крестиков.",
  
      target: 150,
    },
  
    {
      id: "darkEvening",
  
      title: "🕯 Ранний вечер",
  
      typeLabel: "Осеннее задание",
  
      description:
        "На улице уже темнеет — включи уютный свет и посвяти немного времени любимому хобби. Вышей {target} крестиков.",
  
      target: 100,
    },
  
    {
      id: "autumnWalk",
  
      title: "🍁 После прогулки",
  
      typeLabel: "Осеннее задание",
  
      description:
        "После осенней прогулки самое время согреться и немного повышивать. Сделай {target} крестиков.",
  
      target: 100,
    },
  
    {
      id: "autumnWeekend",
  
      title: "☕ Осенние выходные",
  
      typeLabel: "Осеннее задание",
  
      description:
        "Сегодня можно никуда не спешить. Выбери любимый процесс и вышей {target} крестиков.",
  
      target: 150,
    },
  
  ]