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


  export function generateChallenge(
    processes: Process[]
  ): Challenge | null {
  
    if (processes.length === 0) {
      return null
    }
  
    const challengeTypes = [
      'random_process',
      'oldest_process',
      'smallest_remaining',
    ]
  
    const challengeType =
      challengeTypes[
        Math.floor(
          Math.random() *
          challengeTypes.length
        )
      ]
  
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
  
    if (
      challengeType ===
      'random_process'
    ) {
        const sourceProcesses =
        eligibleProcesses.length > 0
          ? eligibleProcesses
          : processes
      
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