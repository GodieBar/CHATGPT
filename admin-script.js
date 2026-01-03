import {
  db,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp
} from "./firebase.js";

document.getElementById("draw").onclick = async () => {
  const q = query(
    collection(db, "participants"),
    where("paid", "==", true)
  );

  const snap = await getDocs(q);
  const list = snap.docs.map(d => d.data());

  if (list.length === 0) {
    alert("No hay pagados");
    return;
  }

  const winner = list[Math.floor(Math.random() * list.length)];

  await addDoc(collection(db, "winners"), {
    ...winner,
    date: Timestamp.now()
  });

  alert("Ganador: " + winner.name);
};
