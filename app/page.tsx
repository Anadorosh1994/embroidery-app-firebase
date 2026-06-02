'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  orderBy
} from 'firebase/firestore'

type Process = {
  id: string
  title: string
  designer: string
  status: string
  total_stitches: number
  completed_stitches: number
  cover_image_url: string

  lastActivityDate?: string

  lastSession?: {
    sessionDate: string
    stitches: number
  }
}

export default function Home() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [stats, setStats] = useState({
    totalProcesses: 0,
    activeProcesses: 0,
    completedProcesses: 0,
  
    totalStitchesCompleted: 0,
    totalStitchesRemaining: 0,
  })
  const [sortField, setSortField] = useState<'created_at' | 'total_stitches' | 'completed_stitches'>('created_at');
const [sortAscending, setSortAscending] = useState<boolean>(false); // false = новые сверху

  const [historyOpen, setHistoryOpen] =
  useState(false)

const [historyEntries, setHistoryEntries] =
  useState<any[]>([])

const [historyTitle, setHistoryTitle] =
  useState('')

  const [title, setTitle] = useState('')
  const [designer, setDesigner] = useState('');
  const [status, setStatus] = useState('Активен')
  const [totalStitches, setTotalStitches] =
    useState('')
  const [completedStitches, setCompletedStitches] =
    useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [editingId, setEditingId] = useState<
    string | null
  >(null)

  const [processInput, setProcessInput] = useState<
  Record<
    string,
    {
      stitches?: string
      date?: string
    }
  >
>({})

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('Все')

  const [sortOption, setSortOption] =
    useState('По умолчанию')

    

    async function fetchProcessesFirebase(user: any) {
      const processesQuery = query(
        collection(db, "processes"),
        where("userId", "==", user.uid)
      );
    
      const snapshot = await getDocs(
        processesQuery
      );
    
      const processesData = snapshot.docs.map(
        (docSnapshot) => ({
          id: docSnapshot.id,
    
          title:
            docSnapshot.data().title || "",
    
          designer:
            docSnapshot.data().designer || "",
    
          status:
            docSnapshot.data().status || "",
    
          total_stitches:
            docSnapshot.data().totalStitches || 0,
    
          completed_stitches:
            docSnapshot.data()
              .completedStitches || 0,
    
          cover_image_url:
            docSnapshot.data().imageUrl || "",
            
            lastActivityDate:
  docSnapshot.data()
    .lastActivityDate || "",

            createdAt:
  docSnapshot.data().createdAt || "",
        })
      );
      
      processesData.sort((a: any, b: any) =>
        b.createdAt.localeCompare(
          a.createdAt
        )
      );
    
      setProcesses(
        processesData as Process[]
      );
    
      setStats({
        totalProcesses:
          processesData.length,
    
        activeProcesses:
          processesData.filter(
            (p) =>
              p.status === "Активен"
          ).length,
    
        completedProcesses:
          processesData.filter(
            (p) =>
              p.status === "Завершён"
          ).length,
    
        totalStitchesCompleted:
          processesData.reduce(
            (acc, p) =>
              acc +
              p.completed_stitches,
            0
          ),
    
        totalStitchesRemaining:
          processesData.reduce(
            (acc, p) =>
              acc +
              (p.total_stitches -
                p.completed_stitches),
            0
          ),
      });
    }

    async function openHistory(
      processId: string,
      processTitle: string
    ) {
      try {
        const historySnapshot =
          await getDocs(
            query(
              collection(
                db,
                'processes',
                processId,
                'history'
              ),
              orderBy(
                'sessionDate',
                'desc'
              )
            )
          )
    
        const historyData =
          historySnapshot.docs.map(
            doc => ({
              id: doc.id,
              ...doc.data(),
            })
          )
    
        setHistoryEntries(
          historyData
        )
    
        setHistoryTitle(
          processTitle
        )
    
        setHistoryOpen(true)
      } catch (error) {
        console.error(error)
      }
    }

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(
            'Пользователь найден:',
            user.email
          )
  
          fetchProcessesFirebase(user)
        } else {
          console.log(
            'Пользователь не авторизован'
          )
        }
      })
  
    return () => unsubscribe()
  }, [])

  async function handleSave() {
    if (!title) return
  
    const user = auth.currentUser
  
    if (!user) {
      alert('Сначала войдите через Google')
      return
    }
  
    const processData = {
      title,
      status,
      designer,
  
      totalStitches: Number(totalStitches),
  
      completedStitches: Number(
        completedStitches
      ),
  
      imageUrl: imageUrl,
  
      userId: user.uid,
    }
  
    try {
      if (editingId) {
        await updateDoc(
          doc(db, 'processes', editingId),
          processData
        )
      } else {
        await addDoc(
          collection(db, 'processes'),
          {
            ...processData,
      
            createdAt:
              new Date().toISOString(),
          }
        )
      }
  
      resetForm()
  
      fetchProcessesFirebase(user)
    } catch (error) {
      console.error(error)
      alert('Ошибка сохранения')
    }
  }

  async function handleDelete(id: string) {
    const confirmed = confirm(
      'Удалить процесс?'
    )
  
    if (!confirmed) return
  
    try {
      await deleteDoc(
        doc(db, 'processes', id)
      )
  
      const user = auth.currentUser
  
      if (user) {
        fetchProcessesFirebase(user)
      }
    } catch (error) {
      console.error(error)
      alert('Ошибка удаления')
    }
  }

  function handleEdit(process: Process) {
    setEditingId(process.id)

    setTitle(process.title)
    setStatus(process.status)

    setTotalStitches(
      process.total_stitches.toString()
    )

    setCompletedStitches(
      process.completed_stitches.toString()
    )

    setImageUrl(process.cover_image_url)
  }

  async function addStitches(processId: string) {
    const input = processInput[processId]
  
    if (!input) return
  
    const amount = Number(input.stitches)
  
    if (!amount || amount <= 0) return
  
    const process = processes.find(
      p => p.id === processId
    )
  
    if (!process) return
  
    const sessionDate =
      input.date ||
      new Date()
        .toISOString()
        .split('T')[0]
  
    const newValue =
      process.completed_stitches +
      amount
  
    let newStatus = process.status
  
    if (
      process.total_stitches -
        newValue <=
      0
    ) {
      newStatus = 'Завершён'
    }
  
    try {
      // обновляем процесс
  
      await updateDoc(
        doc(db, 'processes', processId),
        {
          completedStitches: newValue,
      
          status: newStatus,
      
          lastActivityDate:
            sessionDate,
        }
      )
  
      // добавляем запись в history
  
      await addDoc(
        collection(
          db,
          'processes',
          processId,
          'history'
        ),
        {
          sessionDate,
          stitches: amount,
        }
      )
  
      setProcessInput({
        ...processInput,
        [processId]: {},
      })
  
      const user =
        auth.currentUser
  
      if (user) {
        await fetchProcessesFirebase(
          user
        )
      }
    } catch (error) {
      console.error(error)
  
      alert(
        'Ошибка сохранения прогресса'
      )
    }
  }

  function resetForm() {
    setEditingId(null)

    setTitle('')
    setStatus('Активен')
    setTotalStitches('')
    setCompletedStitches('')
    setImageUrl('')
    setDesigner('')
  }

  const filteredProcesses = processes.filter(
    (process) => {
      const matchesSearch =
        process.title
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'Все' ||
        process.status === statusFilter

      return (
        matchesSearch && matchesStatus
      )
    }
  )

  const statusGroups = [
    'Активен',
    'Запланирован',
    'Пауза',
    'Завершён',
  ]

  function sortProcesses(
    processes: Process[]
  ) {
    const sorted = [...processes]
    if (
      sortOption ===
      'По последней вышивке'
    ) {
      sorted.sort((a, b) =>
        (b.lastActivityDate || '')
          .localeCompare(
            a.lastActivityDate || ''
          )
      )
    }
    if (
      sortOption ===
      'По проценту выполнения'
    ) {
      sorted.sort((a, b) => {
        const aPercent =
          a.completed_stitches /
          a.total_stitches

        const bPercent =
          b.completed_stitches /
          b.total_stitches

        return bPercent - aPercent
      })
    }

    if (
      sortOption ===
      'По оставшимся стежкам'
    ) {
      sorted.sort((a, b) => {
        const aRemaining =
          a.total_stitches -
          a.completed_stitches

        const bRemaining =
          b.total_stitches -
          b.completed_stitches

        return aRemaining - bRemaining
      })
    }

    if (
      sortOption ===
      'Размер ↑'
    ) {
      sorted.sort(
        (a, b) =>
          a.total_stitches -
          b.total_stitches
      )
    }

    if (
      sortOption ===
      'Размер ↓'
    ) {
      sorted.sort(
        (a, b) =>
          b.total_stitches -
          a.total_stitches
      )
    }

    return sorted
  }

  return (
    <main className="min-h-screen bg-stone-100 p-6">
      <h1 className="mb-6 text-4xl font-bold text-stone-800">
        Мои процессы
      </h1>
      <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-stone-500">Всего процессов</p>
    <p className="mt-1 text-xl font-bold text-stone-800">{stats.totalProcesses}</p>
  </div>

  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-stone-500">Активные</p>
    <p className="mt-1 text-xl font-bold text-stone-800">{stats.activeProcesses}</p>
  </div>

  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-stone-500">Завершённые</p>
    <p className="mt-1 text-xl font-bold text-stone-800">{stats.completedProcesses}</p>
  </div>

  <div className="rounded-xl bg-white p-4 shadow">
  <p className="text-sm text-stone-500">
    Вышито крестиков
  </p>

  <p className="mt-1 text-xl font-bold text-stone-800">
    {stats.totalStitchesCompleted}
  </p>
</div>

<div className="rounded-xl bg-white p-4 shadow">
  <p className="text-sm text-stone-500">
    Осталось крестиков
  </p>

  <p className="mt-1 text-xl font-bold text-stone-800">
    {stats.totalStitchesRemaining}
  </p>
</div>

</div>

      <div className="mb-8 rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">
          {editingId
            ? 'Редактировать процесс'
            : 'Добавить процесс'}
        </h2>

        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Название процесса"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="rounded-xl border p-3"
          />
          <input
  type="text"
  placeholder="Дизайнер / Производитель"
  value={designer}
  onChange={(e) => setDesigner(e.target.value)}
  className="rounded-xl border p-3"
/>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-xl border p-3"
          >
            <option value="Запланирован">
              Запланирован
            </option>

            <option value="Активен">
              Активен
            </option>

            <option value="Пауза">
              Пауза
            </option>

            <option value="Завершён">
              Завершён
            </option>
          </select>

          <input
            type="number"
            placeholder="Всего крестиков"
            value={totalStitches}
            onChange={(e) =>
              setTotalStitches(
                e.target.value
              )
            }
            className="rounded-xl border p-3"
          />

          <input
            type="number"
            placeholder="Вышито крестиков"
            value={completedStitches}
            onChange={(e) =>
              setCompletedStitches(
                e.target.value
              )
            }
            className="rounded-xl border p-3"
          />

          <input
            type="text"
            placeholder="Ссылка на изображение"
            value={imageUrl}
            onChange={(e) =>
              setImageUrl(e.target.value)
            }
            className="rounded-xl border p-3"
          />

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-white"
            >
              {editingId
                ? 'Сохранить изменения'
                : 'Добавить процесс'}
            </button>

            <button
              onClick={resetForm}
              className="rounded-2xl bg-stone-300 px-6 py-3 font-semibold"
            >
              Очистить
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Поиск по названию"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 rounded-xl border p-3"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="rounded-xl border p-3"
        >
          <option value="Все">
            Все статусы
          </option>

          <option value="Активен">
            Активные
          </option>

          <option value="Запланирован">
            Запланированные
          </option>

          <option value="Пауза">
            Пауза
          </option>

          <option value="Завершён">
            Завершённые
          </option>
        </select>

        <select
          value={sortOption}
          onChange={(e) =>
            setSortOption(
              e.target.value
            )
          }
          className="rounded-xl border p-3"
        >
          <option>
            По умолчанию
          </option>

          <option>
  По последней вышивке
</option>

          <option>
            По проценту выполнения
          </option>

          <option>
            По оставшимся стежкам
          </option>

          <option>
            Размер ↑
          </option>

          <option>
            Размер ↓
          </option>
        </select>
      </div>

      {statusGroups.map((groupStatus) => {
        const groupProcesses =
          sortProcesses(
            filteredProcesses.filter(
              (process) =>
                process.status ===
                groupStatus
            )
          )

        if (
          groupProcesses.length === 0
        )
          return null

        return (
          <section
            key={groupStatus}
            className="mb-10"
          >
            <h2 className="mb-4 text-3xl font-bold text-stone-700">
              {groupStatus}
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {groupProcesses.map(
                (process) => {
                  const progress =
                    Math.round(
                      (process.completed_stitches /
                        process.total_stitches) *
                        100
                    )

                  return (
                    <div
                      key={process.id}
                      className="overflow-hidden rounded-3xl bg-white shadow-lg"
                    >
                      {process.cover_image_url && (
  <img
    src={process.cover_image_url}
    alt={process.title}
    className="h-40 w-full object-cover"
  />
)}


                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-stone-800">
                            {
                              process.title
                            }
                          </h3>
                          
                          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                            {
                              process.status
                            }
                          </span>
                        </div>
                        {process.designer && (
  <p className="mt-1 text-sm text-stone-500">
    {process.designer}
  </p>
)}

                        <div className="mt-4 flex gap-2 items-center">
                        <input
  type="number"
  placeholder="Стежки"
  value={
    processInput[process.id]
      ?.stitches || ''
  }
  onChange={(e) =>
    setProcessInput({
      ...processInput,

      [process.id]: {
        ...processInput[
          process.id
        ],

        stitches: e.target.value,
      },
    })
  }
  className="w-22 rounded-xl border p-2"
/>
<input
  type="date"
  value={
    processInput[process.id]
      ?.date || ''
  }
  onChange={(e) =>
    setProcessInput({
      ...processInput,

      [process.id]: {
        ...processInput[
          process.id
        ],

        date: e.target.value,
      },
    })
  }
  className="w-32 rounded-xl border p-2"
/>
  <button
    onClick={() => addStitches(process.id)}
    className="rounded-2xl bg-orange-400 px-3 py-2 text-white font-medium"
  >
    Добавить
  </button>
</div>
<h3 className="text-sm text-gray-500">
  {process.lastActivityDate
    ? `Последняя вышивка: ${new Date(
        process.lastActivityDate
      ).toLocaleDateString('ru-RU')}`
    : 'Нет записей'}
</h3>


                        <div className="mt-4">
                          <div className="mb-1 flex justify-between text-xs text-stone-600">
                            <span>
                              Прогресс
                            </span>

                            <span>
                              {progress}%
                            </span>
                          </div>

                          <div className="h-2 w-full rounded-full bg-stone-200">
                            <div
                              className="h-2 rounded-full bg-orange-400"
                              style={{
                                width: `${progress}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="rounded-2xl bg-stone-100 p-3">
                            <p className="text-xs text-stone-500">
                              Вышито
                            </p>

                            <p className="mt-1 text-lg font-bold text-stone-800">
                              {
                                process.completed_stitches
                              }
                            </p>
                          </div>

                          <div className="rounded-2xl bg-stone-100 p-3">
                            <p className="text-xs text-stone-500">
                              Осталось
                            </p>

                            <p className="mt-1 text-lg font-bold text-stone-800">
                              {process.total_stitches -
                                process.completed_stitches}
                            </p>
                          </div>
                          <div className="mt-1 text-sm text-stone-500">
  Всего крестиков: {process.total_stitches}
</div>
                        </div>

                        <div className="mt-4 flex gap-2 items-center">

</div>
<button
  onClick={() =>
    openHistory(
      process.id,
      process.title
    )
  }
  className="flex-1 rounded-2xl bg-blue-500 px-4 py-2 text-sm font-medium text-white"
>
  История
</button>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() =>
                              handleEdit(
                                process
                              )
                            }
                            className="flex-1 rounded-2xl bg-stone-200 px-3 py-2 text-sm font-medium"
                          >
                            Редактировать
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                process.id
                              )
                            }
                            className="flex-1 rounded-2xl bg-red-400 px-3 py-2 text-sm font-medium text-white"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </section>
        )
      })}
      {historyOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="max-h-[80vh] w-[90%] max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
      <h2 className="mb-4 text-xl font-bold">
        История: {historyTitle}
      </h2>

      {historyEntries.length === 0 ? (
        <p>Нет записей</p>
      ) : (
        <ul className="space-y-2">
          {historyEntries.map((entry) => (
            <li key={entry.id} className="flex justify-between border-b py-2">
              <span>{entry.sessionDate}</span>
              <span>{entry.stitches} крестиков</span>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => setHistoryOpen(false)}
        className="mt-4 w-full rounded-xl bg-gray-300 px-4 py-2 font-semibold"
      >
        Закрыть
      </button>
    </div>
  </div>
)}
    </main>
  )
}