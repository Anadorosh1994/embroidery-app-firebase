'use client'

import { useEffect, useState } from 'react'

import {
  onAuthStateChanged
} from 'firebase/auth'

import {
  generateChallenge,
  type Challenge,
} from '@/lib/challenges'

import {
  achievements,
  getEarnedAchievementIds,
} from '@/lib/achievements'

import { auth, db } from '@/lib/firebase'

import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

import {
  collection,
  getDocs,
} from 'firebase/firestore'

type ChallengeHistory = {
  id: string
  challengeId: string
  type: string
  title: string
  typeLabel: string
  description: string
  processId?: string
  processTitle?: string
  target: number
  completedAt: string
}



export default function ChallengesPage() {

  const [challenge, setChallenge] =
    useState<Challenge | null>(null)

    const [isLoadingChallenge, setIsLoadingChallenge] =
  useState(true)

  const [processes, setProcesses] =
    useState<any[]>([])

    const [challengeHistory, setChallengeHistory] =
  useState<ChallengeHistory[]>([])

  const [earnedAchievementIds, setEarnedAchievementIds] =
  useState<string[]>([])

    const handleGenerate = () => {
      if (
        processes.length === 0
      ) {
        alert(
          'Нет процессов'
        )
        return
      }
    
      const newChallenge =
      generateChallenge(
        processes,
        challenge?.type,
        challenge?.processId
      )

  if (newChallenge) {

    setChallenge(
      newChallenge
    )
  
    saveChallenge(
      newChallenge
    )
  }
  
  }

  useEffect(() => {

    loadProcesses()
  
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
  
          if (user) {

            loadCurrentChallenge(
              user.uid
            )
          
            loadChallengeHistory(
              user.uid
            )
          
          }

          if (user) {

            loadCurrentChallenge(
              user.uid
            )
          
            loadChallengeHistory(
              user.uid
            )
          
            loadAchievements(
              user.uid
            )
          
          }
  
        }
      )
  
    return () =>
      unsubscribe()
  
  }, [])

  async function loadProcesses() {
    const snapshot =
      await getDocs(
        collection(
          db,
          'processes'
        )
      )
  
      const data =
  snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((process: any) => {

      const remaining =
        process.totalStitches -
        process.completedStitches
    
      return (
        remaining > 0 &&
        (
          process.status === 'Активен' ||
          process.status === 'Пауза'
        )
      )
    })

setProcesses(data)
  }

  async function loadChallengeHistory(
    uid: string
  ) {
  
    try {
  
      const historyRef =
        collection(
          db,
          'users',
          uid,
          'challengeHistory'
        )
  
      const snapshot =
        await getDocs(
          historyRef
        )
  
      const items =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          } as ChallengeHistory)
        )
  
      items.sort(
        (a, b) =>
          new Date(
            b.completedAt
          ).getTime() -
          new Date(
            a.completedAt
          ).getTime()
      )
  
      setChallengeHistory(
        items
      )
      
      const earnedAchievementIds =
        getEarnedAchievementIds(items)
      
      console.log(
        'Заработанные достижения:',
        earnedAchievementIds
      )
      
      await saveEarnedAchievements(
        uid,
        earnedAchievementIds
      )
  
    } catch (error) {
  
      console.error(
        'Ошибка загрузки истории челленджей:',
        error
      )
  
    }
  }

  async function loadAchievements(
    uid: string
  ) {
    try {
      const achievementsRef =
        collection(
          db,
          'users',
          uid,
          'achievements'
        )
  
      const snapshot =
        await getDocs(
          achievementsRef
        )
  
      const ids =
        snapshot.docs.map(
          (doc) => doc.id
        )
  
      setEarnedAchievementIds(
        ids
      )

      console.log(
        'Загруженные достижения:',
        ids
      )
  
    } catch (error) {
      console.error(
        'Ошибка загрузки достижений:',
        error
      )
    }
  }

  async function saveChallenge(
    challenge: Challenge
  ) {
  
    const user =
      auth.currentUser
  
    if (!user) return
  
    await setDoc(
      doc(
        db,
        'currentChallenges',
        user.uid
      ),
      challenge
    )
  }

  async function saveEarnedAchievements(
    uid: string,
    achievementIds: string[]
  ) {
    try {
      for (const achievementId of achievementIds) {
        const achievementRef = doc(
          db,
          'users',
          uid,
          'achievements',
          achievementId
        )
  
        const achievementDoc =
          await getDoc(achievementRef)
  
        if (!achievementDoc.exists()) {
          await setDoc(
            achievementRef,
            {
              achievementId,
              earnedAt: new Date().toISOString(),
            }
          )
        }
      }
    } catch (error) {
      console.error(
        'Ошибка сохранения достижений:',
        error
      )
    }
  }

  async function loadCurrentChallenge(
    uid: string
  ) {
  
    const challengeDoc =
      await getDoc(
        doc(
          db,
          'currentChallenges',
          uid
        )
      )
  
    if (
      challengeDoc.exists()
    ) {
  
      const challengeData =
  challengeDoc.data()

setChallenge(
  challengeData as any
)
    }
    setIsLoadingChallenge(
      false
    )
    if (
      challengeDoc.exists()
    ) {
    
      const challengeData =
        challengeDoc.data()
    
      setChallenge(
        challengeData as any
      )
    }
    
    setIsLoadingChallenge(
      false
    )
  }

  const challengeProcess =
  processes.find(
    process =>
      process.id ===
      challenge?.processId
  )

  console.log(
    challengeProcess?.cover_image_url
  )

  return (
    <div className="p-8">
  
      <h1 className="mb-6 text-3xl font-bold">
        Челленджи
      </h1>
  
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.0fr_0.9fr_0.7fr]">
  
        {/* Левая колонка - текущее задание */}
  
        <div>
  
       {!isLoadingChallenge && !challenge && (
  <div className="h-[48px]">
    <button
      onClick={handleGenerate}
      className="
        rounded-xl
        bg-blue-500
        px-4
        py-2
        text-white
      "
    >
      Получить новое задание
    </button>
  </div>
)}

{isLoadingChallenge && (
  <p>
    Загрузка задания...
  </p>
)}

{challenge && (
  
            <div
              className={`
                mt-6
                rounded-2xl
                border
                p-5
  
                ${
                  challenge.completed
                    ? 'border-green-300 bg-green-50'
                    : 'border-amber-200 bg-amber-50'
                }
              `}
            >
  
              <h2
                className={`
                  mb-6
                  text-xl
                  font-bold
  
                  ${
                    challenge.completed
                      ? 'text-green-700'
                      : 'text-orange-700'
                  }
                `}
              >
                {
                  challenge.completed
                    ? '🎉 Задание выполнено'
                    : '🎯 Текущее задание'
                }
              </h2>
  
              <div className="flex gap-4">
  
                {challengeProcess && (
                  <img
                    src={challengeProcess.imageUrl}
                    alt={challengeProcess.title}
                    className="
                      h-32
                      w-32
                      rounded-xl
                      object-cover
                      shrink-0
                    "
                  />
                )}
  
                <div className="flex-1">
  
                  <p className="text-xl font-bold">
                    {
                      challenge.processTitle ||
                      challenge.title
                    }
                  </p>
  
                  <p
                    className="
                      mt-1
                      text-l
                      text-gray-500
                      italic
                    "
                  >
                    {challenge.typeLabel}
                  </p>
  
                  <p className="mt-2 text-lg">
                    {challenge.description}
                  </p>
  
                  <p className="mt-4 text-2xl font-bold">
                    {challenge.progress} / {challenge.target}
  
                    <span className="ml-2 text-base text-gray-500">
                      (
                      {Math.round(
                        challenge.progress /
                        challenge.target *
                        100
                      )}
                      %)
                    </span>
                  </p>
  
                </div>
  
              </div>
  
              <div
                className="
                  mt-4
                  h-4
                  w-full
                  rounded-full
                  bg-gray-200
                "
              >
  
                <div
                  className={`
                    h-4
                    rounded-full
                    transition-all
  
                    ${
                      challenge.completed
                        ? 'bg-green-500'
                        : 'bg-orange-400'
                    }
                  `}
                  style={{
                    width: `${Math.min(
                      challenge.progress /
                      challenge.target *
                      100,
                      100
                    )}%`
                  }}
                />
  
              </div>
  
              {challenge.completed && (
  
                <p
                  className="
                    mt-5
                    font-semibold
                    text-green-700
                  "
                >
                  ✨ Поздравляем! Задание выполнено.
                </p>
  
              )}
  
              {challenge.completed && (
  
                <button
                  onClick={handleGenerate}
                  className="
                    mt-4
                    rounded-xl
                    bg-green-600
                    px-4
                    py-2
                    text-white
                  "
                >
                  Получить новое задание
                </button>
  
              )}
  
              <button
                onClick={handleGenerate}
                className="
                  mt-4
                  rounded-xl
                  bg-gray-500
                  px-4
                  py-2
                  text-white
                "
              >
                🔄 Новое задание (dev)
              </button>
  
            </div>
  
          )}
  
        </div>
  
  
        {/* Правая колонка - история */}
  
        <div
  className="
  self-start
  mt-5.5
  rounded-2xl
  border
  border-stone-200
bg-white
  p-5
"
>
  
  <h2 className="text-lg font-bold text-orange-700">
            🏆 Выполненные задания
          </h2>
  
          <div className="mt-4 text-sm text-gray-600">
  Выполнено заданий:
  <span className="ml-2 text-xl font-bold text-orange-600">
    {challengeHistory.length}
  </span>
</div>
  
          {challengeHistory.length > 0 && (
  
            <div className="mt-6">
  
              <h3 className="mb-3 text-sm font-semibold text-gray-600">
                Последние задания
              </h3>
  
              <div className="space-y-3">
  
                {challengeHistory
                  .slice(0, 3)
                  .map((item) => (
  
                    <div
                      key={item.id}
                      className="
  rounded-xl
  border
  border-stone-100
  bg-stone-50
  p-3
                      "
                    >
  
                      <p className="text-sm italic text-gray-500">
                        {item.typeLabel}
                      </p>
  
                      <p className="mt-1 font-semibold">
                        {item.title}
                      </p>
  
                      {item.processTitle && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.processTitle}
                        </p>
                      )}
  
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(
                          item.completedAt
                        ).toLocaleDateString(
                          'ru-RU',
                          {
                            day: 'numeric',
                            month: 'long',
                          }
                        )}
                      </p>
  
                    </div>
  
                  ))}
  
              </div>
  
            </div>
  
          )}
  
          <a
            href="/challenges/history"
            className="
              mt-6
              block
              text-center
              font-semibold
              text-orange-700
              hover:underline
            "
          >
            Посмотреть всю историю →
          </a>
  
        </div>


{/* Третья колонка - достижения */}

<div
  className="
    self-start
  mt-5.5
    rounded-2xl
    border
    border-stone-200
    bg-white
    p-5
  "
>

  <h2 className="text-lg font-bold text-gray-800">
    🏅 Достижения
  </h2>

  <p className="mt-3 text-sm text-gray-500">
    Получено{' '}
    <span className="font-semibold text-gray-700">
      {earnedAchievementIds.length}
    </span>
    {' '}из{' '}
    <span className="font-semibold text-gray-700">
      {achievements.length}
    </span>
  </p>

  <div className="mt-5 space-y-2">

    {achievements.map((achievement) => {

      const earned =
        earnedAchievementIds.includes(
          achievement.id
        )

      return (
        <div
          key={achievement.id}
          className={`
            rounded-xl
            p-3
            ${
              earned
                ? 'bg-amber-50'
                : 'bg-gray-50 opacity-60'
            }
          `}
        >

          <div className="flex items-start gap-2">

            <span className="text-xl">
              {earned
                ? achievement.icon
                : '🔒'}
            </span>

            <div className="min-w-0">

              <p
                className={`
                  text-sm
                  font-semibold
                  ${
                    earned
                      ? 'text-gray-800'
                      : 'text-gray-500'
                  }
                `}
              >
                {achievement.title}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {achievement.description}
              </p>

            </div>

          </div>

        </div>
      )

    })}

  </div>

  <a
    href="/challenges/achievements"
    className="
      mt-5
      block
      text-center
      text-sm
      font-semibold
      text-orange-700
      hover:underline
    "
  >
    Все достижения →
  </a>

</div>


  
      </div>
  
    </div>
  )
}