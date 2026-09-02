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

const firstStitchDates:
  Record<string, string> = {}

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

</div>
  );
}