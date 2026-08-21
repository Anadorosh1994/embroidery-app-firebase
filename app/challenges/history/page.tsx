"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../lib/firebase";

type ChallengeHistory = {
  id: string;
  challengeId: string;
  type: string;
  title: string;
  typeLabel: string;
  description: string;
  processId?: string;
  processTitle?: string;
  target: number;
  completedAt: string;
};

export default function ChallengeHistoryPage() {
  const [history, setHistory] =
    useState<ChallengeHistory[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (!user) {
            setHistory([]);
            setIsLoading(false);
            return;
          }

          try {
            const historyRef =
              collection(
                db,
                "users",
                user.uid,
                "challengeHistory"
              );

            const snapshot =
              await getDocs(historyRef);

            const items =
              snapshot.docs.map(
                (doc) => ({
                  id: doc.id,
                  ...doc.data(),
                } as ChallengeHistory)
              );

            items.sort(
              (a, b) =>
                new Date(
                  b.completedAt
                ).getTime() -
                new Date(
                  a.completedAt
                ).getTime()
            );

            setHistory(items);

          } catch (error) {
            console.error(
              "Ошибка загрузки истории челленджей:",
              error
            );
          } finally {
            setIsLoading(false);
          }
        }
      );

    return () =>
      unsubscribe();
  }, []);

  function formatDate(
    dateString: string
  ) {
    return new Date(
      dateString
    ).toLocaleDateString(
      "ru-RU",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function formatTime(
    dateString: string
  ) {
    return new Date(
      dateString
    ).toLocaleTimeString(
      "ru-RU",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">

      <h1 className="mb-2 text-3xl font-bold">
        Выполненные задания
      </h1>

      <p className="mb-8 text-stone-500">
        Всего выполнено:{" "}
        <span className="font-semibold">
          {history.length}
        </span>
      </p>

      {isLoading ? (
        <p className="text-stone-500">
          Загружаем историю...
        </p>
      ) : history.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
          <p className="text-stone-600">
            Пока нет выполненных заданий.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-4">

          {history.map(
            (item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >

                <div className="mb-2 flex items-start justify-between gap-4">

                  <div>
                    <p className="text-sm italic text-stone-500">
                      {item.typeLabel}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      {item.title}
                    </h2>
                  </div>

                  <div className="shrink-0 text-right text-sm text-stone-400">
                    <div>
                      {formatDate(
                        item.completedAt
                      )}
                    </div>

                    <div>
                      {formatTime(
                        item.completedAt
                      )}
                    </div>
                  </div>

                </div>

                <p className="mt-3 text-stone-700">
                  {item.description}
                </p>

                {item.processTitle && (
                  <p className="mt-3 text-sm text-stone-500">
                    Процесс:{" "}
                    <span className="font-medium text-stone-700">
                      {item.processTitle}
                    </span>
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-700">
                  <span>✓</span>
                  <span>
                    Выполнено ·{" "}
                    {item.target} крестиков
                  </span>
                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}