'use client'

import { useEffect, useState } from 'react'

import {
  generateChallenge,
  type Challenge,
} from '@/lib/challenges'

import { db } from '@/lib/firebase'

import {
  collection,
  getDocs,
} from 'firebase/firestore'

export default function ChallengesPage() {

  const [challenge, setChallenge] =
    useState<Challenge | null>(null)

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
    
      setChallenge(
        newChallenge
      )
    }

  useEffect(() => {
    loadProcesses()
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

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Челленджи
      </h1>

      <button
        onClick={handleGenerate}
        className="rounded-xl bg-blue-500 px-4 py-2 text-white"
      >
        Сгенерировать задание
      </button>

      {challenge && (
        <div className="mt-6 rounded-xl border p-4">
          <h2 className="font-bold">
            Текущее задание
          </h2>

          <p className="mt-2">
            {challenge.title}
          </p>
        </div>
      )}
    </div>
  )
}