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

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Челленджи
      </h1>

      {
  !isLoadingChallenge &&
  !challenge && (

    <button
      onClick={handleGenerate}
      className="rounded-xl bg-blue-500 px-4 py-2 text-white"
    >
      Сгенерировать задание
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
        <div className="mt-6 rounded-xl border p-4">
          <h2 className="font-bold">
            Текущее задание
          </h2>

          <p className="mt-2">
            {challenge.title}
          </p>
          <p className="mt-4 text-lg font-bold">
  {challenge.progress} / {challenge.target}
</p>
        </div>
      )}
    </div>
  )
}