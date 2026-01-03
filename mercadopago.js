import { db, collection, addDoc, Timestamp } from "./firebase.js";

const mp = new MercadoPago("TU_PUBLIC_KEY", { locale: "es-CO" });

const form = document.getElementById("raffleForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const participant = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    paid: false,
    date: Timestamp.now()
  };

  const docRef = await addDoc(collection(db, "participants"), participant);

  const res = await fetch("http://localhost:3000/create-preference", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      external_reference: docRef.id,
      amount: 5000
    })
  });

  const data = await res.json();

  mp.checkout({
    preference: { id: data.id },
    render: {
      container: "#payment-button",
      label: "Pagar"
    }
  });
});
