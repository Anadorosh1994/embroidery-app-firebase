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
  collectionGroup,
  getDoc,
  deleteDoc,
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

  const showHistory = async () => {
  const snapshot = await getDocs(
    collectionGroup(db, "history")
  );

  snapshot.forEach((doc) => {
    console.log(
      doc.ref.path,
      doc.data()
    );
  });
};
const cleanOrphanHistory = async () => {
  try {
    const processesSnapshot =
      await getDocs(
        collection(db, "processes")
      );

    const processIds = new Set(
      processesSnapshot.docs.map(
        (doc) => doc.id
      )
    );

    const historySnapshot =
      await getDocs(
        collectionGroup(
          db,
          "history"
        )
      );

    let deleted = 0;

    for (const historyDoc of historySnapshot.docs) {
      const processId =
        historyDoc.ref.parent.parent?.id;

      if (
        !processId ||
        !processIds.has(processId)
      ) {
        await deleteDoc(
          historyDoc.ref
        );

        deleted++;
      }
    }

    alert(
      `Удалено сиротских записей: ${deleted}`
    );
  } catch (error) {
    console.error(error);
    alert("Ошибка очистки");
  }
};

const restoreHistory = async () => {
  try {
    const response = await fetch(
      "/embroidery-backup.json"
    );

    const backup = await response.json();

    let restored = 0;

    for (const process of backup) {

      const processRef = doc(
        db,
        "processes",
        process.firebaseId
      );
    
      const processSnapshot =
        await getDoc(processRef);
    
      if (!processSnapshot.exists()) {
        continue;
      }
    
      if (
        !process.history ||
        process.history.length === 0
      ) {
        continue;
      }
    
      for (const entry of process.history) {
        await addDoc(
          collection(
            db,
            "processes",
            process.firebaseId,
            "history"
          ),
          {
            sessionDate: entry.sessionDate,
            stitches: entry.stitches,
          }
        );
    
        restored++;
      }
    }

    alert(
      `Восстановлено записей: ${restored}`
    );
  } catch (error) {
    console.error(error);
    alert(
      "Ошибка восстановления"
    );
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

<button
  onClick={showHistory}
  style={{ marginLeft: "10px" }}
>
  Показать историю
</button>

    </div>
  );
}