'use client'

import { useEffect, useState } from 'react'

import {
  onAuthStateChanged,
} from 'firebase/auth'

import {
  collection,
  getDocs,
} from 'firebase/firestore'

import Link from 'next/link'

import {
    achievements,
    achievementCategories,
    getAchievementProgress,
  } from '@/lib/achievements'

import {
  auth,
  db,
} from '@/lib/firebase'


type EarnedAchievement = {
  achievementId: string
  earnedAt: string
}

type ChallengeHistory = {
    type: string
    target: number
    stitchesCompleted?: number
    completedAt?: string
    processId?: string
    finishedProcess?: boolean
  }


export default function AchievementsPage() {

  const [
    earnedAchievements,
    setEarnedAchievements,
  ] = useState<EarnedAchievement[]>([])

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    challengeHistory,
    setChallengeHistory,
  ] = useState<ChallengeHistory[]>([])


  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (!user) {
            setIsLoading(false)
            return
          }

          try {

            const achievementsRef =
              collection(
                db,
                'users',
                user.uid,
                'achievements'
              )

            const snapshot =
              await getDocs(
                achievementsRef
              )

            const data =
              snapshot.docs.map(
                (doc) => ({
                  achievementId:
                    doc.id,

                  earnedAt:
                    doc.data().earnedAt || '',
                })
              )

            setEarnedAchievements(
              data
            )

            const historyRef =
  collection(
    db,
    'users',
    user.uid,
    'challengeHistory'
  )

const historySnapshot =
  await getDocs(
    historyRef
  )

const history =
  historySnapshot.docs.map(
    (doc) =>
      doc.data() as ChallengeHistory
  )

setChallengeHistory(
  history
)

          } catch (error) {

            console.error(
              'Ошибка загрузки достижений:',
              error
            )

          } finally {

            setIsLoading(false)

          }

        }
      )

    return () =>
      unsubscribe()

  }, [])


  const earnedMap =
    new Map(
      earnedAchievements.map(
        (item) => [
          item.achievementId,
          item.earnedAt,
        ]
      )
    )

    const achievementProgress =
  getAchievementProgress(
    challengeHistory
  )

  const challengeTypes =
  Array.from(
    new Set(
      challengeHistory
        .map(
          (challenge) =>
            challenge.type
        )
        .filter(Boolean)
    )
  )
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


  const sortedAchievements =
    [...achievements].sort(
      (a, b) => {

        const aEarned =
          earnedMap.has(a.id)

        const bEarned =
          earnedMap.has(b.id)

        if (aEarned && !bEarned) {
          return -1
        }

        if (!aEarned && bEarned) {
          return 1
        }

        return 0

      }
    )


  return (

    <div className="p-8">

      <div className="mb-8">

        <Link
          href="/challenges"
          className="
            text-sm
            font-semibold
            text-orange-700
            hover:underline
          "
        >
          ← Вернуться к челленджам
        </Link>

        <h1 className="
          mt-4
          text-3xl
          font-bold
        ">
          🏅 Достижения
        </h1>

        <p className="
          mt-2
          text-gray-500
        ">
          Собирай достижения, выполняя челленджи.
        </p>

      </div>


      <div className="
        mb-8
        rounded-2xl
        border
        border-stone-200
        bg-white
        p-5
      ">

        <p className="text-gray-600">

          Получено{' '}

          <span className="
            font-bold
            text-orange-600
          ">
            {earnedAchievements.length}
          </span>

          {' '}из{' '}

          <span className="font-bold">
            {achievements.length}
          </span>

        </p>

      </div>


      {isLoading ? (

        <p className="text-gray-500">
          Загрузка достижений...
        </p>

      ) : (

        achievementCategories.map(
            (category) => {
          
              const categoryAchievements =
                achievements.filter(
                  (achievement) =>
                    achievement.category ===
                    category.id
                )
          
              const categoryEarned =
                categoryAchievements.filter(
                  (achievement) =>
                    earnedMap.has(
                      achievement.id
                    )
                ).length

                const stitchTargets = [
                  100,
                  500,
                  1000,
                  5000,
                  10000,
                ]
                
                const nextStitchTarget =
                  stitchTargets.find(
                    (target) =>
                      target >
                      achievementProgress.totalStitches
                  )
                
                const stitchesToNextAchievement =
                  nextStitchTarget !== undefined
                    ? nextStitchTarget -
                      achievementProgress.totalStitches
                    : 0

                
          
              return (
                <section
                  key={category.id}
                  className="mb-10"
                >
          
                  <div className="
                    mb-4
                    flex
                    items-end
                    justify-between
                  ">
          
                    <div>
          
                      <h2 className="
                        text-xl
                        font-bold
                        text-gray-800
                      ">
                        {category.icon}{' '}
                        {category.title}
                      </h2>
          
                      <p className="
                        mt-1
                        text-sm
                        text-gray-500
                      ">
                        Выполнено{' '}
                        <span className="
                          font-semibold
                          text-gray-700
                        ">
                          {categoryEarned}
                        </span>
                        {' '}из{' '}
                        <span className="
                          font-semibold
                          text-gray-700
                        ">
                          {categoryAchievements.length}
                        </span>
                      </p>

                      {category.id === 'stitches' && (
                    <p className="mt-1 text-sm text-gray-500">
                      Вышито через челленджи:{' '}
                      <span className="font-semibold text-gray-700">
                        {achievementProgress.totalStitches}
                      </span>
                    </p>
                  )}
          {category.id === 'stitches' &&
  nextStitchTarget !== undefined && (
    <p className="mt-1 text-sm text-gray-500">
      До следующего достижения:{' '}
      <span className="font-semibold text-gray-700">
        {stitchesToNextAchievement}
      </span>
      {' '}крестиков
    </p>
  )}

{category.id === 'variety' && (
  <p className="mt-1 text-sm text-gray-500">
    Попробовано разных типов:{' '}
    <span className="font-semibold text-gray-700">
      {achievementProgress.uniqueChallengeTypes}
    </span>
  </p>
)}

{category.id === 'variety' && (
  <p className="mt-1 text-sm text-gray-500">
    Основных типов:{' '}
    <span className="font-semibold text-gray-700">
      {achievementProgress.completedMainChallengeTypes}
    </span>
    {' '}из{' '}
    <span className="font-semibold text-gray-700">
      7
    </span>
  </p>
)}


{category.id === 'variety' && (
  <p className="mt-1 text-sm text-gray-500">
    Лучшая серия без повторов:{' '}
    <span className="font-semibold text-gray-700">
      {achievementProgress.longestNoRepeatStreak}
    </span>
  </p>
)}




{category.id === 'processes' && (
  <>
    <p className="mt-1 text-sm text-gray-500">
      Заданий «Давно не вышивали»:{' '}
      <span className="font-semibold text-gray-700">
        {achievementProgress.inactiveChallenges}
      </span>
    </p>

    <p className="mt-1 text-sm text-gray-500">
      Заданий «Финишная прямая»:{' '}
      <span className="font-semibold text-gray-700">
        {achievementProgress.finishChallenges}
      </span>
    </p>

    <p className="mt-1 text-sm text-gray-500">
      Разных процессов:{' '}
      <span className="font-semibold text-gray-700">
        {achievementProgress.uniqueChallengeProcesses}
      </span>
    </p>

    <p className="mt-1 text-sm text-gray-500">
      Завершено через челленджи:{' '}
      <span className="font-semibold text-gray-700">
        {achievementProgress.finishedProcessesFromChallenges}
      </span>
    </p>

   
  </>
)}

{category.id === 'streaks' && (
  <p className="mt-1 text-sm text-gray-500">
    Лучшая серия дней подряд:{' '}
    <span className="font-semibold text-gray-700">
      {achievementProgress.longestDayStreak}
    </span>
  </p>
)}


                    </div>
          
                  </div>
          
          
                  <div className="
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                  ">
          
                    {categoryAchievements.map(
                      (achievement) => {
          
                        const earned =
                          earnedMap.has(
                            achievement.id
                          )
          
                        const earnedAt =
                          earnedMap.get(
                            achievement.id
                          )
          
                        return (
          
                          <div
                            key={achievement.id}
                            className={`
                              rounded-2xl
                              border
                              p-5
                              ${
                                earned
                                  ? `
                                    border-amber-200
                                    bg-amber-50
                                  `
                                  : `
                                    border-stone-200
                                    bg-gray-50
                                  `
                              }
                            `}
                          >
          
                            <div className="
                              flex
                              items-start
                              gap-4
                            ">
          
                              <div className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                text-2xl
                              ">
                                {earned
                                  ? achievement.icon
                                  : '🔒'}
                              </div>
          
          
                              <div className="min-w-0">
          
                                <h3 className={`
                                  font-bold
                                  ${
                                    earned
                                      ? 'text-gray-900'
                                      : 'text-gray-500'
                                  }
                                `}>
                                  {achievement.title}
                                </h3>
          
          
                                <p className="
                                  mt-1
                                  text-sm
                                  leading-5
                                  text-gray-600
                                ">
                                  {achievement.description}
                                </p>
          
          
                                {earned &&
                                  earnedAt && (
          
                                  <p className="
                                    mt-3
                                    text-xs
                                    font-semibold
                                    text-green-700
                                  ">
                                    ✓ Получено{' '}
          
                                    {new Date(
                                      earnedAt
                                    ).toLocaleDateString(
                                      'ru-RU',
                                      {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                      }
                                    )}
                                  </p>
          
                                )}
          
          
                                {!earned && (
          
                                  <p className="
                                    mt-3
                                    text-xs
                                    text-gray-400
                                  ">
                                    🔒 Пока не получено
                                  </p>
          
                                )}
          
                              </div>
          
                            </div>
          
                          </div>
          
                        )
          
                      }
                    )}
          
                  </div>
          
                </section>
              )
            }
          )

      )}

    </div>

  )

}