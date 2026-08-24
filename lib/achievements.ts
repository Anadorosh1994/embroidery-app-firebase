export type AchievementCategory =
  | 'challenges'
  | 'stitches'
  | 'variety'
  | 'processes'
  | 'streaks'
  | 'special'


export type Achievement = {
  id: string
  category: AchievementCategory
  title: string
  description: string
  icon: string
  condition: string
  value: number
}


export const achievementCategories = [
  {
    id: 'challenges',
    title: 'Челленджи',
    icon: '🏆',
  },

  {
    id: 'stitches',
    title: 'Крестики',
    icon: '🧵',
  },

  {
    id: 'variety',
    title: 'Разнообразие',
    icon: '🎲',
  },

  {
    id: 'processes',
    title: 'Процессы',
    icon: '🧹',
  },

  {
    id: 'streaks',
    title: 'Серии',
    icon: '🔥',
  },

  {
    id: 'special',
    title: 'Особые',
    icon: '🍂',
  },
] as const


export const achievements: Achievement[] = [

  // 🏆 Челленджи

  {
    id: 'first_challenge',
    category: 'challenges',
    title: 'Первый шаг',
    description: 'Выполни 1 челлендж.',
    icon: '🏆',
    condition: 'completed_challenges',
    value: 1,
  },

  {
    id: 'five_challenges',
    category: 'challenges',
    title: 'Разогрелись',
    description: 'Выполни 5 челленджей.',
    icon: '🔥',
    condition: 'completed_challenges',
    value: 5,
  },

  {
    id: 'ten_challenges',
    category: 'challenges',
    title: 'В ритме',
    description: 'Выполни 10 челленджей.',
    icon: '🔥',
    condition: 'completed_challenges',
    value: 10,
  },

  {
    id: 'challenge_master',
    category: 'challenges',
    title: 'Мастер челленджей',
    description: 'Выполни 25 челленджей.',
    icon: '🎯',
    condition: 'completed_challenges',
    value: 25,
  },

  {
    id: 'challenge_legend',
    category: 'challenges',
    title: 'Легенда',
    description: 'Выполни 50 челленджей.',
    icon: '👑',
    condition: 'completed_challenges',
    value: 50,
  },


  // 🧵 Крестики

  {
    id: 'first_hundred_stitches',
    category: 'stitches',
    title: 'Первые крестики',
    description: 'Вышей через челленджи 100 крестиков.',
    icon: '🧵',
    condition: 'stitches',
    value: 100,
  },

  {
    id: 'five_hundred_stitches',
    category: 'stitches',
    title: 'Набираем темп',
    description: 'Вышей через челленджи 500 крестиков.',
    icon: '🪡',
    condition: 'stitches',
    value: 500,
  },

  {
    id: 'thousand_stitches',
    category: 'stitches',
    title: 'Тысяча крестиков',
    description: 'Вышей через челленджи 1000 крестиков.',
    icon: '🧶',
    condition: 'stitches',
    value: 1000,
  },

  {
    id: 'five_thousand_stitches',
    category: 'stitches',
    title: 'Пять тысяч',
    description: 'Вышей через челленджи 5000 крестиков.',
    icon: '🏅',
    condition: 'stitches',
    value: 5000,
  },

  {
    id: 'ten_thousand_stitches',
    category: 'stitches',
    title: 'Десять тысяч',
    description: 'Вышей через челленджи 10 000 крестиков.',
    icon: '👑',
    condition: 'stitches',
    value: 10000,
  },


  // 🎲 Разнообразие

  {
    id: 'five_challenge_types',
    category: 'variety',
    title: 'Не угадаешь!',
    description: 'Выполни челленджи 5 разных типов.',
    icon: '🎲',
    condition: 'unique_challenge_types',
    value: 5,
  },

  {
    id: 'all_main_challenge_types',
    category: 'variety',
    title: 'Всё попробовала',
    description: 'Выполни хотя бы по одному челленджу каждого основного типа.',
    icon: '🌈',
    condition: 'all_main_challenge_types',
    value: 7,
  },

  {
    id: 'no_same_type_twice',
    category: 'variety',
    title: 'Непредсказуемость',
    description: 'Выполни 10 челленджей, не получив один и тот же тип два раза подряд.',
    icon: '🃏',
    condition: 'no_same_type_twice',
    value: 10,
  },


  // 🧹 Процессы

  {
    id: 'return_to_process',
    category: 'processes',
    title: 'Пора возвращаться',
    description: 'Выполни 3 задания «Давно не вышивали».',
    icon: '⏳',
    condition: 'inactive_challenges',
    value: 3,
  },

  {
    id: 'finish_line',
    category: 'processes',
    title: 'Финишная прямая',
    description: 'Выполни 3 задания на завершение процесса.',
    icon: '🏁',
    condition: 'finish_challenges',
    value: 3,
  },

  {
    id: 'cleaning_up',
    category: 'processes',
    title: 'Разгребаем запасы',
    description: 'Выполни задания для 5 разных процессов.',
    icon: '🧹',
    condition: 'unique_processes',
    value: 5,
  },

  {
    id: 'finisher',
    category: 'processes',
    title: 'Финишер',
    description: 'Заверши 3 процесса в результате выполнения челленджей.',
    icon: '🏆',
    condition: 'finished_processes_from_challenges',
    value: 3,
  },


  // 🔥 Серии

  {
    id: 'three_day_streak',
    category: 'streaks',
    title: 'Три дня подряд',
    description: 'Выполняй челленджи 3 дня подряд.',
    icon: '🔥',
    condition: 'streak_days',
    value: 3,
  },

  {
    id: 'seven_day_streak',
    category: 'streaks',
    title: 'Неделя в деле',
    description: 'Выполняй челленджи 7 дней подряд.',
    icon: '🔥',
    condition: 'streak_days',
    value: 7,
  },

  {
    id: 'fourteen_day_streak',
    category: 'streaks',
    title: 'Две недели',
    description: 'Выполняй челленджи 14 дней подряд.',
    icon: '🔥',
    condition: 'streak_days',
    value: 14,
  },


  // 🍂 Особые

  {
    id: 'first_special_challenge',
    category: 'special',
    title: 'Особое задание',
    description: 'Выполни первое специальное задание.',
    icon: '🌟',
    condition: 'special_challenges',
    value: 1,
  },

  {
    id: 'autumn_mood',
    category: 'special',
    title: 'Осеннее настроение',
    description: 'Выполни 3 осенних специальных задания.',
    icon: '🍂',
    condition: 'autumn_special_challenges',
    value: 3,
  },

  {
    id: 'holiday_mood',
    category: 'special',
    title: 'Праздничное настроение',
    description: 'Выполни 3 сезонных специальных задания.',
    icon: '🎄',
    condition: 'seasonal_special_challenges',
    value: 3,
  },
]


export function getEarnedAchievementIds(
  challengeHistory: {
    type: string
    target: number
    stitchesCompleted?: number
    completedAt?: string
  }[]
  ): string[] {

  const earned: string[] = []

  const completedCount =
    challengeHistory.length

    const totalStitches =
  challengeHistory.reduce(
    (sum, challenge) =>
      sum +
      (challenge.stitchesCompleted || 0),
    0
  )


  if (completedCount >= 1) {
    earned.push('first_challenge')
  }

  if (completedCount >= 5) {
    earned.push('five_challenges')
  }

  if (completedCount >= 10) {
    earned.push('ten_challenges')
  }

  if (completedCount >= 25) {
    earned.push('challenge_master')
  }

  if (completedCount >= 50) {
    earned.push('challenge_legend')
  }

  const uniqueChallengeTypes =
  new Set(
    challengeHistory
      .map(
        (challenge) =>
          challenge.type
      )
      .filter(Boolean)
  ).size

  const inactiveChallenges =
  challengeHistory.filter(
    (challenge) =>
      challenge.type ===
      'inactive_process'
  ).length

const finishChallenges =
  challengeHistory.filter(
    (challenge) =>
      challenge.type ===
      'finish_process'
  ).length

const uniqueChallengeProcesses =
  new Set(
    challengeHistory
      .map(
        (challenge) =>
          challenge.processId
      )
      .filter(Boolean)
  ).size

const finishedProcessesFromChallenges =
  challengeHistory.filter(
    (challenge) =>
      challenge.finishedProcess === true
  ).length

  const sortedHistory =
  [...challengeHistory]
    .filter(
      (challenge) =>
        challenge.completedAt
    )
    .sort(
      (a, b) =>
        new Date(
          a.completedAt!
        ).getTime() -
        new Date(
          b.completedAt!
        ).getTime()
    )

let currentNoRepeatStreak = 0
let longestNoRepeatStreak = 0
let previousType: string | undefined

for (
  const challenge of sortedHistory
) {

  if (
    challenge.type &&
    challenge.type !== previousType
  ) {
    currentNoRepeatStreak += 1
  } else {
    currentNoRepeatStreak = 1
  }

  longestNoRepeatStreak =
    Math.max(
      longestNoRepeatStreak,
      currentNoRepeatStreak
    )

  previousType =
    challenge.type
}


if (uniqueChallengeTypes >= 5) {
  earned.push('five_challenge_types')
}

if (longestNoRepeatStreak >= 10) {
  earned.push('no_same_type_twice')
}
const mainChallengeTypes = [
  'random_process',
  'oldest_process',
  'inactive_process',
  'smallest_remaining',
  'smallest_process',
  'largest_process',
  'finish_process',
]

const completedMainChallengeTypes =
  mainChallengeTypes.filter(
    (type) =>
      challengeHistory.some(
        (challenge) =>
          challenge.type === type
      )
  ).length

  if (
    completedMainChallengeTypes >=
    mainChallengeTypes.length
  ) {
    earned.push(
      'all_main_challenge_types'
    )
  }

  if (inactiveChallenges >= 3) {
    earned.push('return_to_process')
  }
  
  if (finishChallenges >= 3) {
    earned.push('finish_line')
  }
  
  if (uniqueChallengeProcesses >= 5) {
    earned.push('cleaning_up')
  }
  
  if (finishedProcessesFromChallenges >= 3) {
    earned.push('finisher')
  }

  if (totalStitches >= 100) {
    earned.push('first_hundred_stitches')
  }
  
  if (totalStitches >= 500) {
    earned.push('five_hundred_stitches')
  }
  
  if (totalStitches >= 1000) {
    earned.push('thousand_stitches')
  }
  
  if (totalStitches >= 5000) {
    earned.push('five_thousand_stitches')
  }
  
  if (totalStitches >= 10000) {
    earned.push('ten_thousand_stitches')
  }


  return earned
}

export function getAchievementProgress(
  challengeHistory: {
    type: string
    target: number
    stitchesCompleted?: number
    completedAt?: string
    processId?: string
    finishedProcess?: boolean
  }[]
  ) {
  
    const completedChallenges =
      challengeHistory.length
  
    const totalStitches =
      challengeHistory.reduce(
        (sum, challenge) =>
          sum +
          (challenge.stitchesCompleted || 0),
        0
      )

      const uniqueChallengeTypes =
  new Set(
    challengeHistory
      .map(
        (challenge) =>
          challenge.type
      )
      .filter(Boolean)
  ).size

  
  const mainChallengeTypes = [
    'random_process',
    'oldest_process',
    'inactive_process',
    'smallest_remaining',
    'smallest_process',
    'largest_process',
    'finish_process',
  ]
  
  const completedMainChallengeTypes =
    mainChallengeTypes.filter(
      (type) =>
        challengeHistory.some(
          (challenge) =>
            challenge.type === type
        )
    ).length

    const sortedHistory =
    [...challengeHistory]
      .filter(
        (challenge) =>
          challenge.completedAt
      )
      .sort(
        (a, b) =>
          new Date(
            a.completedAt!
          ).getTime() -
          new Date(
            b.completedAt!
          ).getTime()
      )
  
  let currentNoRepeatStreak = 0
  let longestNoRepeatStreak = 0
  let previousType: string | undefined
  
  for (
    const challenge of sortedHistory
  ) {
  
    if (
      challenge.type &&
      challenge.type !== previousType
    ) {
      currentNoRepeatStreak += 1
    } else {
      currentNoRepeatStreak = 1
    }
  
    longestNoRepeatStreak =
      Math.max(
        longestNoRepeatStreak,
        currentNoRepeatStreak
      )
  
    previousType =
      challenge.type
  }
  const inactiveChallenges =
  challengeHistory.filter(
    (challenge) =>
      challenge.type ===
      'inactive_process'
  ).length

const finishChallenges =
  challengeHistory.filter(
    (challenge) =>
      challenge.type ===
      'finish_process'
  ).length

const uniqueChallengeProcesses =
  new Set(
    challengeHistory
      .map(
        (challenge) =>
          challenge.processId
      )
      .filter(Boolean)
  ).size

const finishedProcessesFromChallenges =
  challengeHistory.filter(
    (challenge) =>
      challenge.finishedProcess === true
  ).length
  
  return {
    completedChallenges,
    totalStitches,
    uniqueChallengeTypes,
    completedMainChallengeTypes,
    longestNoRepeatStreak,
    inactiveChallenges,
    finishChallenges,
    uniqueChallengeProcesses,
    finishedProcessesFromChallenges,
  }
  }