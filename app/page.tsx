'use client'

import { useState } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

import { auth } from '@/lib/firebase'


export default function Home() {

  const [
    isLoading,
    setIsLoading,
  ] = useState(false)


  const handleLogin = async () => {

    try {

      setIsLoading(true)

      const provider =
        new GoogleAuthProvider()

      await signInWithPopup(
        auth,
        provider
      )

    } catch (error) {

      console.error(
        'Ошибка входа:',
        error
      )

    } finally {

      setIsLoading(false)

    }
  }


  return (

    <div className="
      min-h-screen
      bg-stone-50
      p-8
    ">

      <div className="
        mx-auto
        max-w-4xl
      ">

        <h1 className="
          text-3xl
          font-bold
          text-gray-800
        ">
          🧵 Embroidery Tracker
        </h1>

        <p className="
          mt-2
          text-gray-500
        ">
          Трекер вышивки, процессов и челленджей
        </p>


        <div className="
          mt-8
          rounded-2xl
          border
          border-stone-200
          bg-white
          p-6
        ">

          <h2 className="
            text-xl
            font-bold
            text-gray-800
          ">
            Вход
          </h2>

          <p className="
            mt-2
            text-gray-500
          ">
            Войди через Google, чтобы открыть свой трекер.
          </p>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="
              mt-5
              rounded-xl
              bg-orange-500
              px-5
              py-3
              font-semibold
              text-white
              hover:bg-orange-600
              disabled:opacity-50
            "
          >
            {isLoading
              ? 'Вход...'
              : 'Войти через Google'}
          </button>

        </div>


        <div className="
          mt-6
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        ">

          <a
            href="/processes"
            className="
              rounded-2xl
              border
              border-stone-200
              bg-white
              p-5
              font-semibold
              text-gray-800
              hover:border-orange-300
            "
          >
            🧵
            <div className="mt-2">
              Процессы
            </div>
          </a>


          <a
            href="/challenges"
            className="
              rounded-2xl
              border
              border-stone-200
              bg-white
              p-5
              font-semibold
              text-gray-800
              hover:border-orange-300
            "
          >
            🎯
            <div className="mt-2">
              Челленджи
            </div>
          </a>


          <a
            href="/statistics"
            className="
              rounded-2xl
              border
              border-stone-200
              bg-white
              p-5
              font-semibold
              text-gray-800
              hover:border-orange-300
            "
          >
            📊
            <div className="mt-2">
              Статистика
            </div>
          </a>


          <a
            href="/challenges/achievements"
            className="
              rounded-2xl
              border
              border-stone-200
              bg-white
              p-5
              font-semibold
              text-gray-800
              hover:border-orange-300
            "
          >
            🏅
            <div className="mt-2">
              Достижения
            </div>
          </a>

        </div>

      </div>

    </div>
  )
}