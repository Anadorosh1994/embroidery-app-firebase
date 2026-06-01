"use client";

import { supabase } from "@/lib/supabaseClient";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

export default function ImportPage() {
  const importAllProcesses = async () => {
    try {
      const { data, error } = await supabase
        .from("processes")
        .select("*");
  
      if (error) {
        console.error(error);
        alert("Ошибка чтения Supabase");
        return;
      }
  
      if (!data || data.length === 0) {
        alert("Процессы не найдены");
        return;
      }
  
      let imported = 0;
  
      for (const process of data) {
        await addDoc(
          collection(db, "processes"),
          {
            oldId: process.id,
  
            title: process.title,
            designer: process.designer,
            status: process.status,
  
            totalStitches:
              process.total_stitches,
  
            completedStitches:
              process.completed_stitches,
  
            imageUrl:
              process.cover_image_url,
  
            createdAt:
              process.created_at,
          }
        );
  
        imported++;
      }
  
      alert(
        `Импортировано процессов: ${imported}`
      );
    } catch (err) {
      console.error(err);
      alert("Ошибка импорта");
    }
  };

  const importHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("progress_history")
        .select("*");
  
      if (error) {
        console.error(error);
        alert("Ошибка чтения истории");
        return;
      }
  
      let imported = 0;
  
      for (const historyRecord of data) {
        const processQuery = query(
          collection(db, "processes"),
          where("oldId", "==", historyRecord.process_id)
        );
  
        const processSnapshot = await getDocs(processQuery);
  
        if (processSnapshot.empty) {
          console.warn(
            "Процесс не найден:",
            historyRecord.process_id
          );
          continue;
        }
  
        const processDoc = processSnapshot.docs[0];
  
        await addDoc(
          collection(
            db,
            "processes",
            processDoc.id,
            "history"
          ),
          {
            sessionDate:
              historyRecord.session_date,
  
            stitches:
              historyRecord.stitches,
          }
        );
  
        imported++;
      }
  
      alert(
        `Импортировано записей истории: ${imported}`
      );
    } catch (err) {
      console.error(err);
      alert("Ошибка импорта истории");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Импорт данных</h1>

      <button onClick={importAllProcesses}>
  Импортировать все процессы
</button>

<button
  onClick={importHistory}
  style={{ marginLeft: "10px" }}
>
  Импортировать историю
</button>
    </div>
  );
}