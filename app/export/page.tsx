"use client";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ExportPage() {
  const exportData = async () => {
    try {
      const processesSnapshot = await getDocs(
        collection(db, "processes")
      );

      const exportData: any[] = [];

      for (const processDoc of processesSnapshot.docs) {
        const processData = processDoc.data();

        const historySnapshot = await getDocs(
          collection(
            db,
            "processes",
            processDoc.id,
            "history"
          )
        );

        const history = historySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        exportData.push({
          firebaseId: processDoc.id,
          ...processData,
          history,
        });
      }

      const blob = new Blob(
        [JSON.stringify(exportData, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "embroidery-backup.json";

      a.click();

      URL.revokeObjectURL(url);

      alert("Резервная копия создана");
    } catch (error) {
      console.error(error);
      alert("Ошибка экспорта");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Экспорт Firebase</h1>

      <button onClick={exportData}>
        Скачать резервную копию
      </button>
    </div>
  );
}