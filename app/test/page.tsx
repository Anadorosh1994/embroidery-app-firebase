"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  limit
} from "firebase/firestore";

export default function TestPage() {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

console.log("Успешный вход:", result.user);

alert(
  `Привет, ${result.user.displayName}!\n\nUID:\n${result.user.uid}`
);
    } catch (error: any) {
      console.error(error);
    
      alert(
        `Код: ${error.code}\n\n${error.message}`
      );
    }
  };

  const createTestDocument = async () => {
    try {
      const docRef = await addDoc(
        collection(db, "test"),
        {
          name: "Тестовый процесс",
          author: "Анастасия",
          createdAt: new Date(),
        }
      );
  
      alert(`Документ создан: ${docRef.id}`);
    } catch (error) {
      console.error(error);
      alert("Ошибка записи");
    }
   
  };
  const addUserIdToProcesses = async () => {
    try {
      const user = auth.currentUser;
  
      if (!user) {
        alert("Сначала войдите через Google");
        return;
      }
  
      const snapshot = await getDocs(
        collection(db, "processes")
      );
  
      let updated = 0;
  
      for (const processDoc of snapshot.docs) {
        await updateDoc(
          doc(db, "processes", processDoc.id),
          {
            userId: user.uid,
          }
        );
  
        updated++;
      }
  
      alert(
        `Обновлено процессов: ${updated}`
      );
    } catch (error) {
      console.error(error);
      alert("Ошибка обновления");
    }
  };

  const fillLastActivityDates = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "processes")
      );
  
      let updated = 0;
  
      for (const processDoc of snapshot.docs) {
        const historySnapshot = await getDocs(
          query(
            collection(
              db,
              "processes",
              processDoc.id,
              "history"
            ),
            orderBy("sessionDate", "desc"),
            limit(1)
          )
        );
  
        if (!historySnapshot.empty) {
          const lastHistory =
            historySnapshot.docs[0].data();
  
          await updateDoc(
            doc(
              db,
              "processes",
              processDoc.id
            ),
            {
              lastActivityDate:
                lastHistory.sessionDate,
            }
          );
  
          updated++;
        }
      }
  
      alert(
        `Обновлено процессов: ${updated}`
      );
    } catch (error) {
      console.error(error);
      alert("Ошибка заполнения");
    }
  };
  return (
    <div style={{ padding: "40px" }}>
      <h1>Тест Firebase</h1>

      <button onClick={handleLogin}>
        Войти через Google
      </button>
      
<button
  onClick={createTestDocument}
  style={{ marginLeft: "10px" }}
>
  Создать тестовый документ
</button>
<button
  onClick={addUserIdToProcesses}
  style={{ marginLeft: "10px" }}
>
  Добавить userId
</button>


<button
  onClick={fillLastActivityDates}
  style={{ marginLeft: "10px" }}
>
  Заполнить lastActivityDate
</button>
    </div>
  );
}