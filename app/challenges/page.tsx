'use client'

import { useEffect, useState } from 'react'

import {
  onAuthStateChanged
} from 'firebase/auth'

import {
  generateChallenge,
  type Challenge,
} from '@/lib/challenges'

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



export default function ChallengesPage() {

  const [challenge, setChallenge] =
    useState<Challenge | null>(null)

    const [isLoadingChallenge, setIsLoadingChallenge] =
  useState(true)

  const [processes, setProcesses] =
    useState<any[]>([])

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
    processes
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

      return remaining > 0
    })

setProcesses(data)
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

      {
  !isLoadingChallenge &&
  (
    !challenge ||
    challenge.completed
  ) && (

    <button
      onClick={handleGenerate}
      className="rounded-xl bg-blue-500 px-4 py-2 text-white"
    >
      {
        challenge?.completed
          ? 'Получить новое задание'
          : 'Сгенерировать задание'
      }
    </button>

  )
}
{
  isLoadingChallenge && (
    <p>
      Загрузка задания...
    </p>
  )
}

      {challenge && (
       <div
       className={`
        mt-6
        max-w-xl
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
  {challenge.processTitle}
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
    text-green-700
    font-semibold
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
        </div>
      )}
    </div>
  )
}