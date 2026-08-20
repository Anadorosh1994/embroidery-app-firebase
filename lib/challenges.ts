import {
  genericSpecialChallenges,
  autumnSpecialChallenges,
} from "./specialChallenges"

export type Challenge = {
  type: string

  title: string

  typeLabel: string

  description: string

  processId: string
  processTitle: string

  target: number

  progress: number

  completed: boolean
}
  
  type Process = {
    id: string
    title: string
  
    status?: string
  
    totalStitches: number
    completedStitches: number
  
    lastActivityDate?: string
    createdAt?: string
  }


  const stitchTargets = [
    50,
    100,
    150,
    200,
    250,
    300
  ]

  
  function getProcessesWithoutPrevious(
    processes: Process[],
    previousProcessId?: string
  ): Process[] {
  
    if (!previousProcessId) {
      return processes
    }
  
    const filteredProcesses =
      processes.filter(
        process =>
          process.id !==
          previousProcessId
      )
  
    return filteredProcesses.length > 0
      ? filteredProcesses
      : processes
  }
  function getAvailableSpecialChallenges() {

    const month =
      new Date().getMonth() + 1
  
    let challenges = [
      ...genericSpecialChallenges,
    ]
  
    if (
      month === 9 ||
      month === 10 ||
      month === 11
    ) {
      challenges = [
        ...challenges,
        ...autumnSpecialChallenges,
      ]
    }
  
    return challenges
  }
  export function generateChallenge(
    processes: Process[],
    previousChallengeType?: string,
    previousProcessId?: string
  ): Challenge | null {
  
    if (processes.length === 0) {
      return null
    }
  
    
  
    const target =
      stitchTargets[
        Math.floor(
          Math.random() *
          stitchTargets.length
        )
      ]

      const eligibleProcesses =
  processes.filter(
    (process) =>
      (
        process.totalStitches -
        process.completedStitches
      ) >= target
  )
  const finishableProcesses =
  processes.filter((process) => {

    const remaining =
      process.totalStitches -
      process.completedStitches

    return remaining > 0 && remaining <= 200
  })
  const challengeTypes = [
    {
      type: 'random_process',
      weight: 30,
    },
    {
      type: 'oldest_process',
      weight: 10,
    },
    {
      type: 'inactive_process',
      weight: 10,
    },
    {
      type: 'smallest_remaining',
      weight: 10,
    },
    {
      type: 'smallest_process',
      weight: 5,
    },
    {
      type: 'largest_process',
      weight: 5,
    },
  ]
  
  if (finishableProcesses.length > 0) {
    challengeTypes.push({
      type: 'finish_process',
      weight: 10,
    })
  }
  
  challengeTypes.push({
    type: 'special',
    weight: 15,
  })

  

  let availableChallengeTypes =
  challengeTypes

if (previousChallengeType) {
  availableChallengeTypes =
    challengeTypes.filter(
      challenge =>
        challenge.type !==
        previousChallengeType
    )
}

const totalWeight =
  availableChallengeTypes.reduce(
    (sum, challenge) =>
      sum + challenge.weight,
    0
  )

let random =
  Math.random() * totalWeight

let selectedChallengeType =
  availableChallengeTypes[
    availableChallengeTypes.length - 1
  ].type

for (
  const challenge of
    availableChallengeTypes
) {
  random -= challenge.weight

  if (random <= 0) {
    selectedChallengeType =
      challenge.type

    break
  }
}

const challengeType =
  selectedChallengeType
  
    if (
      challengeType ===
      'random_process'
    ) {
      const sourceProcesses =
      getProcessesWithoutPrevious(
        eligibleProcesses.length > 0
          ? eligibleProcesses
          : processes,
        previousProcessId
      )
      
      const randomProcess =
        sourceProcesses[
          Math.floor(
            Math.random() *
            sourceProcesses.length
          )
        ]
  
        return {
          type: 'random_process',
        
          title:
            `Вышей ${target} крестиков в процессе "${randomProcess.title}"`,
        
          typeLabel:
            'Случайный процесс',
        
          description:
            `Вышей ${target} крестиков`,
        
          processId:
            randomProcess.id,
        
          processTitle:
            randomProcess.title,
        
          target,
        
          progress: 0,
        
          completed: false,
        }
    }
  
    if (
      challengeType ===
      'oldest_process'
    ) {
      const oldestProcess =
        [...processes]
          .sort(
            (a, b) =>
              (a.createdAt || '')
                .localeCompare(
                  b.createdAt || ''
                )
          )[0]
  
          return {
            type: 'oldest_process',
          
            title:
              `Поработай над самым старым процессом "${oldestProcess.title}" и вышей ${target} крестиков`,
          
            typeLabel:
              'Самый старый процесс',
          
            description:
              `Вышей ${target} крестиков`,
          
            processId:
              oldestProcess.id,
          
            processTitle:
              oldestProcess.title,
          
            target,
          
            progress: 0,
            completed: false,
          }
    }

    if (
      challengeType ===
      'inactive_process'
    ) {

      const inactiveProcess =
  [...processes]
    .sort(
      (a, b) =>
        (a.lastActivityDate || '')
          .localeCompare(
            b.lastActivityDate || ''
          )
    )[0]

    const target =
  stitchTargets[
    Math.floor(
      Math.random() *
      stitchTargets.length
    )
  ]

  const descriptions = [
    `Ты давно не вышивала этот процесс. Время к нему вернуться.`,
    `Этот процесс скучает без внимания.`,
    `Дай работе ещё немного любви и сделай ${target} крестиков.`,
    `Пора стряхнуть пыль с этого процесса.`,
  ]

  const description =
  descriptions[
    Math.floor(
      Math.random() *
      descriptions.length
    )
  ]

  return {
    type:
      'inactive_process',
  
    title:
      `Вернись к процессу "${inactiveProcess.title}"`,
  
    typeLabel:
      'Давно не вышивали',
  
    description,
  
    processId:
      inactiveProcess.id,
  
    processTitle:
      inactiveProcess.title,
  
    target,
  
    progress: 0,
  
    completed: false,
  }
}

if (
  challengeType ===
  'largest_process'
) {

  const largestProcess =
  [...processes]
    .sort(
      (a, b) =>
        b.totalStitches -
        a.totalStitches
    )[0]

    const descriptions = [

      `Большие проекты тоже требуют внимания. Вышей ${target} крестиков.`,
    
      `Даже огромные картины создаются по одному крестику. Сделай ещё ${target}.`,
    
      `Пора уделить внимание самому масштабному процессу.`,
    
      `Этот большой проект обязательно станет шедевром. Добавь ещё ${target} крестиков.`
    
    ]

    const description =
  descriptions[
    Math.floor(
      Math.random() *
      descriptions.length
    )
  ]

  return {

    type:
      'largest_process',
  
    title:
      `Поработай над процессом "${largestProcess.title}"`,
  
    typeLabel:
      'Самый большой процесс',
  
    description,
  
    processId:
      largestProcess.id,
  
    processTitle:
      largestProcess.title,
  
    target,
  
    progress: 0,
  
    completed: false,
  }
}

if (
  challengeType ===
  'smallest_process'
) {
  const smallestProcess =
  [...processes]
    .sort(
      (a, b) =>
        a.totalStitches -
        b.totalStitches
    )[0]

    const descriptions = [

      `Небольшие проекты тоже заслуживают внимания. Вышей ${target} крестиков.`,
    
      `Маленькие работы могут принести большое удовольствие.`,
    
      `Пора уделить внимание самому компактному процессу.`,
    
      `Небольшие проекты часто завершаются быстрее, чем кажется.`
    
    ]

    const description =
  descriptions[
    Math.floor(
      Math.random() *
      descriptions.length
    )
  ]

  return {

    type:
      'smallest_process',
  
    title:
      `Поработай над процессом "${smallestProcess.title}"`,
  
    typeLabel:
      'Самый маленький процесс',
  
    description,
  
    processId:
      smallestProcess.id,
  
    processTitle:
      smallestProcess.title,
  
    target,
  
    progress: 0,
  
    completed: false,
  }
}

if (
  challengeType ===
  'special'
) {

  const availableSpecialChallenges =
  getAvailableSpecialChallenges()

const special =
  availableSpecialChallenges[
    Math.floor(
      Math.random() *
      availableSpecialChallenges.length
    )
  ]

  return {
    type: 'special',

    title: special.title,

    typeLabel: special.typeLabel,

    description:
      special.description.replace(
        "{target}",
        String(special.target)
      ),

    processId: "",

    processTitle: "",

    target: special.target,

    progress: 0,

    completed: false,
  }
}

    if (
      challengeType ===
      'finish_process'
    ) {
    
      const finishProcess =
        finishableProcesses[
          Math.floor(
            Math.random() *
            finishableProcesses.length
          )
        ]
    
      const remaining =
        finishProcess.totalStitches -
        finishProcess.completedStitches

        const descriptions = [
          `До завершения осталось всего ${remaining} крестиков. Доведи работу до финиша!`,
          `Финиш уже близко — осталось ${remaining} крестиков.`,
          `Последний рывок! Осталось вышить ${remaining} крестиков.`,
          `Этому процессу не хватает всего ${remaining} крестиков до завершения.`,
        ]

        const description =
  descriptions[
    Math.floor(
      Math.random() *
      descriptions.length
    )
  ]
    
      return {
        type:
          'finish_process',
    
        title:
          `Заверши процесс "${finishProcess.title}"`,
    
        typeLabel:
          'Финишная прямая',
    
          description:
          description,
    
        processId:
          finishProcess.id,
    
        processTitle:
          finishProcess.title,
    
        target:
          remaining,
    
        progress: 0,
    
        completed: false,
      }
    }
    const processWithLeastRemaining =
  [
    ...(
      eligibleProcesses.length > 0
        ? eligibleProcesses
        : processes
    )
  ]
        .sort(
          (a, b) =>
            (
              a.totalStitches -
              a.completedStitches
            ) -
            (
              b.totalStitches -
              b.completedStitches
            )
        )[0]
  
    return {
      type:
        'smallest_remaining',
  title:
  `Вышей ${target} крестиков в процессе "${processWithLeastRemaining.title}" с минимальным остатком`,
        typeLabel:
        'Минимальный остаток',
      
      description:
        `Вышей ${target} крестиков`,
  
      processId:
        processWithLeastRemaining.id,
  
      processTitle:
        processWithLeastRemaining.title,
  
      target,progress: 0,
      completed: false,
    }
  }