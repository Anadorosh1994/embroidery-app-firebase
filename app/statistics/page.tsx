"use client";

import { useEffect, useState } from "react";
import {
  collection,
  collectionGroup,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function StatisticsPage() {
  const [todayStitches, setTodayStitches] =
    useState(0);
    const [monthStitches, setMonthStitches] =
  useState(0);

const [activeDays, setActiveDays] =
  useState(0);

const [averagePerDay, setAveragePerDay] =
  useState(0);

  const now = new Date()

  const [dailyStitches, setDailyStitches] =
  useState<number[]>([])

const [selectedMonth, setSelectedMonth] =
  useState(
    String(now.getMonth() + 1).padStart(2, '0')
  )

const [selectedYear, setSelectedYear] =
  useState(
    String(now.getFullYear())
  )

  const [processStats, setProcessStats] =
  useState<
    {
      title: string
      stitches: number
    }[]
  >([])

  const [finishedProcesses, setFinishedProcesses] =
  useState<string[]>([])
  const [startedProcesses, setStartedProcesses] =
  useState<string[]>([])

  const [yearlyStitches, setYearlyStitches] =
  useState<number[]>([])

const [yearlyDays, setYearlyDays] =
  useState(0)

const [yearlyStarts, setYearlyStarts] =
  useState(0)

const [yearlyFinishes, setYearlyFinishes] =
  useState(0)

  const [bestMonth, setBestMonth] =
  useState<number | null>(null)

const [worstMonth, setWorstMonth] =
  useState<number | null>(null)

  useEffect(() => {
    loadStatistics()
  }, [
    selectedMonth,
    selectedYear,
  ]);

  async function loadStatistics() {
    const today = new Date()
      .toISOString()
      .split("T")[0];

      const selectedPeriod =
  `${selectedYear}-${selectedMonth}`

    const snapshot = await getDocs(
      collectionGroup(db, "history")
    );
    const processesSnapshot =
  await getDocs(
    collection(db, "processes")
  );

const processMap:
  Record<string, string> = {};

  const processCompletedStitches:
  Record<string, number> = {}

  const finished: string[] = []

const started: string[] = []

const yearlyFinished: string[] = []

const yearlyStarted: string[] = []

const firstStitchDates:
  Record<string, string> = {}

  const yearlyTotals =
  Array(12).fill(0)

const yearlyDaysSet =
  new Set<string>()

const historyStitches:
  Record<string, number> = {}

processesSnapshot.forEach(
  (processDoc) => {
    const data =
      processDoc.data();

    processMap[
      processDoc.id
    ] = data.title;

    processCompletedStitches[
      processDoc.id
    ] =
      Number(
        data.completedStitches
      ) || 0

    const finishDate =
  data.finishedAt ||
  data.lastActivityDate;

if (
  data.status === 'Завершён' &&
  finishDate?.startsWith(
    selectedPeriod
  )
) {
  finished.push(
    data.title
  );
}

if (
  data.status === 'Завершён' &&
  finishDate?.startsWith(
    selectedYear
  )
) {
  yearlyFinished.push(
    data.title
  )
}

  }
);

    let totalToday = 0;
    let totalMonth = 0;

    const daysInMonth =
    new Date(
      Number(selectedYear),
      Number(selectedMonth),
      0
    ).getDate()
  
  const dailyTotals =
    Array(daysInMonth).fill(0)

const activeDaysSet =
  new Set<string>();

  const processTotals:
  Record<string, number> = {};




  snapshot.forEach((doc) => {
    const data = doc.data();
  
    const stitches =
      Number(data.stitches) || 0;
  
    const sessionDate =
      data.sessionDate;

      if (
        sessionDate?.startsWith(
          selectedYear
        )
      ) {
        const month =
          Number(sessionDate.slice(5, 7))
      
        if (
          month >= 1 &&
          month <= 12
        ) {
          yearlyTotals[month - 1] += stitches
          yearlyDaysSet.add(sessionDate)
        }
      }

      const processId =
  doc.ref.parent.parent?.id

if (
  processId &&
  sessionDate
) {

  if (
    !firstStitchDates[processId] ||
    sessionDate <
      firstStitchDates[processId]
  ) {
    firstStitchDates[processId] =
      sessionDate
  }
}

if (processId) {
  historyStitches[processId] =
    (historyStitches[processId] || 0) +
    stitches
}
  
    if (sessionDate === today) {
      totalToday += stitches;
    }
  
    if (
      sessionDate?.startsWith(
        selectedPeriod
      )
    ) {
      totalMonth += stitches;

      const day =
  Number(sessionDate.slice(8, 10))

if (
  day >= 1 &&
  day <= daysInMonth
) {
  dailyTotals[day - 1] += stitches
}

      const processId =
  doc.ref.parent.parent?.id;

if (
  processId &&
  processMap[processId]
) {
  const title =
    processMap[processId];

  processTotals[title] =
    (processTotals[title] || 0) +
    stitches;
}
  
      activeDaysSet.add(
        sessionDate
      );
    }
  });
  Object.entries(
    firstStitchDates
  ).forEach(
    ([processId, firstDate]) => {
  
      const totalHistoryStitches =
        historyStitches[processId] || 0
  
      const completedStitches =
        processCompletedStitches[
          processId
        ] || 0
  
      const historyContainsAllStitches =
        totalHistoryStitches ===
        completedStitches
  
      if (
        historyContainsAllStitches &&
        firstDate.startsWith(
          selectedPeriod
        ) &&
        processMap[processId]
      ) {
        started.push(
          processMap[processId]
        )
      }

      if (
        historyContainsAllStitches &&
        firstDate.startsWith(
          selectedYear
        ) &&
        processMap[processId]
      ) {
        yearlyStarted.push(
          processMap[processId]
        )
      }
    }
  )

    setTodayStitches(totalToday);
    setMonthStitches(totalMonth);

    setDailyStitches(dailyTotals)

setActiveDays(
  activeDaysSet.size
);

setAveragePerDay(
  activeDaysSet.size > 0
    ? Math.round(
        totalMonth /
          activeDaysSet.size
      )
    : 0
);
setProcessStats(
  Object.entries(processTotals)
    .map(
      ([title, stitches]) => ({
        title,
        stitches,
      })
    )
    .sort(
      (a, b) =>
        b.stitches - a.stitches
    )
)

setFinishedProcesses(
  finished.sort()
)

setStartedProcesses(
  started.sort()
)

setYearlyStitches(yearlyTotals)
setYearlyDays(yearlyDaysSet.size)
setYearlyStarts(
  yearlyStarted.length
)

setYearlyFinishes(
  yearlyFinished.length
)

const activeYearlyMonths =
  yearlyTotals
    .map((stitches, index) => ({
      month: index,
      stitches,
    }))
    .filter(
      (item) => item.stitches > 0
    )

if (activeYearlyMonths.length > 0) {
  const best =
    activeYearlyMonths.reduce(
      (max, item) =>
        item.stitches > max.stitches
          ? item
          : max
    )

  const worst =
    activeYearlyMonths.reduce(
      (min, item) =>
        item.stitches < min.stitches
          ? item
          : min
    )

  setBestMonth(best.month)
  setWorstMonth(worst.month)
} else {
  setBestMonth(null)
  setWorstMonth(null)
}


  }
  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ]

  const yearlyTotal =
  yearlyStitches.reduce(
    (sum, value) => sum + value,
    0
  )

const yearlyAverage =
  yearlyDays > 0
    ? Math.round(
        yearlyTotal / yearlyDays
      )
    : 0

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Статистика
      </h1>

      <div className="mb-6 flex gap-3">

      <select
  value={selectedMonth}
  onChange={(e) =>
    setSelectedMonth(
      e.target.value
    )
  }
  className="rounded-xl border p-2"
>
  {months.map(
    (month, index) => {
      const value =
        String(index + 1).padStart(
          2,
          '0'
        )

      return (
        <option
          key={value}
          value={value}
        >
          {month}
        </option>
      )
    }
  )}
</select>

  <select
    value={selectedYear}
    onChange={(e) =>
      setSelectedYear(
        e.target.value
      )
    }
    className="rounded-xl border p-2"
  >
    <option>2025</option>
    <option>2026</option>
    <option>2027</option>
  </select>

</div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-lg text-stone-500">
          Стежков сегодня
        </h2>

        <p className="mt-2 text-4xl font-bold">
          {todayStitches}
        </p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">

  <div className="rounded-2xl bg-white p-6 shadow">
    <h2 className="text-lg text-stone-500">
      За месяц
    </h2>

    <p className="mt-2 text-3xl font-bold">
      {monthStitches}
    </p>
  </div>

  <div className="rounded-2xl bg-white p-6 shadow">
    <h2 className="text-lg text-stone-500">
      Вышивальных дней
    </h2>

    <p className="mt-2 text-3xl font-bold">
      {activeDays}
    </p>
  </div>

  <div className="rounded-2xl bg-white p-6 shadow">
    <h2 className="text-lg text-stone-500">
      Среднее за день
    </h2>

    <p className="mt-2 text-3xl font-bold">
      {averagePerDay}
    </p>
  </div>
  </div>

  <div className="mt-8 rounded-2xl bg-white p-6 shadow">
  <h2 className="mb-6 text-xl font-bold">
    Стежки по дням
  </h2>

  <div className="flex h-64 items-end gap-1">
  {dailyStitches.map((stitches, index) => {
    const maxStitches =
      Math.max(...dailyStitches, 1)

    const height =
      stitches > 0
        ? Math.max(
            (stitches / maxStitches) * 100,
            3
          )
        : 0

        

    return (
      <div
        key={index}
        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
      >
        <div className="mb-1 text-xs text-stone-500">
          {stitches > 0 ? stitches : ''}
        </div>

        <div
          className="w-full rounded-t-md bg-stone-400"
          style={{
            height: `${height}%`,
          }}
          title={`${index + 1} число: ${stitches} стежков`}
        />

        <div className="mt-2 text-xs text-stone-500">
          {index + 1}
        </div>
      </div>
    )
  })}
</div>
</div>


<div className="mt-8 grid gap-4 md:grid-cols-3">

  <div className="rounded-2xl bg-white p-6 shadow">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-bold">
        Процессы за период
      </h2>

      <span className="text-sm text-stone-500">
        Активных: {processStats.length}
      </span>
    </div>

    {processStats.map(
      (process) => (
        <div
          key={process.title}
          className="flex justify-between border-b py-2"
        >
          <span>
            {process.title}
          </span>

          <span>
            {process.stitches}
            {' '}
            (
            {monthStitches > 0
              ? Math.round(
                  process.stitches /
                    monthStitches *
                    100
                )
              : 0}
            %)
          </span>
        </div>
      )
    )}
  </div>

  <div className="rounded-2xl bg-white p-6 shadow">
    <h2 className="mb-4 text-xl font-bold">
      Финиши за период
    </h2>

    <p className="mb-3 text-stone-600">
      Всего: {finishedProcesses.length}
    </p>

    {finishedProcesses.length === 0 ? (
      <p>Нет финишей</p>
    ) : (
      finishedProcesses.map(
        (title) => (
          <div
            key={title}
            className="border-b py-2"
          >
            ✓ {title}
          </div>
        )
      )
    )}
  </div>

  <div className="rounded-2xl bg-white p-6 shadow">
    <h2 className="mb-4 text-xl font-bold">
      Начато за период
    </h2>

    <p className="mb-3 text-stone-600">
      Всего: {startedProcesses.length}
    </p>

    {startedProcesses.length === 0 ? (
      <p>Нет новых процессов</p>
    ) : (
      startedProcesses.map(
        (title) => (
          <div
            key={title}
            className="border-b py-2"
          >
            + {title}
          </div>
        )
      )
    )}
  </div>

</div>

<div className="mt-8">
  <h2 className="mb-6 text-2xl font-bold">
    Годовая статистика
  </h2>

  <div className="grid gap-4 md:grid-cols-4">

    <div className="rounded-2xl bg-white p-6 shadow">
      <p className="text-sm text-stone-500">
        Стежков за год
      </p>
      <p className="mt-2 text-3xl font-bold">
        {yearlyTotal}
      </p>
    </div>

    <div className="rounded-2xl bg-white p-6 shadow">
      <p className="text-sm text-stone-500">
        Вышивальных дней
      </p>
      <p className="mt-2 text-3xl font-bold">
        {yearlyDays}
      </p>
    </div>

    <div className="rounded-2xl bg-white p-6 shadow">
      <p className="text-sm text-stone-500">
        Среднее за день
      </p>
      <p className="mt-2 text-3xl font-bold">
        {yearlyAverage}
      </p>
    </div>

    <div className="rounded-2xl bg-white p-6 shadow">
      <p className="text-sm text-stone-500">
        Начато / финишей
      </p>
      <p className="mt-2 text-3xl font-bold">
        {yearlyStarts} / {yearlyFinishes}
      </p>
    </div>

  </div>

  <div className="mt-8 rounded-2xl bg-white p-6 shadow">
  <h2 className="mb-6 text-xl font-bold">
    Стежки по месяцам
  </h2>

  <div className="flex h-64 items-end gap-2">
    {yearlyStitches.map((stitches, index) => {
      const maxStitches =
        Math.max(...yearlyStitches, 1)

      const height =
        stitches > 0
          ? Math.max(
              (stitches / maxStitches) * 100,
              3
            )
          : 0

      return (
        <div
          key={index}
          className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
        >
          <div className="mb-1 text-xs text-stone-500">
            {stitches > 0 ? stitches : ''}
          </div>

          <div
            className="w-full rounded-t-md bg-stone-400"
            style={{
              height: `${height}%`,
            }}
            title={`${months[index]}: ${stitches} стежков`}
          />

          <div className="mt-2 text-xs text-stone-500">
            {months[index].slice(0, 3)}
          </div>
        </div>
      )
    })}
  </div>
</div>


<div className="mt-8 grid gap-4 md:grid-cols-2">

  <div className="rounded-2xl bg-white p-6 shadow">
    <h2 className="mb-3 text-xl font-bold">
      Лучший месяц
    </h2>

    {bestMonth !== null ? (
      <>
        <p className="text-2xl font-bold">
          {months[bestMonth]}
        </p>
        <p className="mt-1 text-stone-500">
          {yearlyStitches[bestMonth]} стежков
        </p>
      </>
    ) : (
      <p className="text-stone-500">
        Пока нет данных
      </p>
    )}
  </div>

  <div className="rounded-2xl bg-white p-6 shadow">
    <h2 className="mb-3 text-xl font-bold">
      Самый спокойный месяц
    </h2>

    {worstMonth !== null ? (
      <>
        <p className="text-2xl font-bold">
          {months[worstMonth]}
        </p>
        <p className="mt-1 text-stone-500">
          {yearlyStitches[worstMonth]} стежков
        </p>
      </>
    ) : (
      <p className="text-stone-500">
        Пока нет данных
      </p>
    )}
  </div>

</div>

</div>

</div>
  );
}