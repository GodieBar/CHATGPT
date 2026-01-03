import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";
import admin from "firebase-admin";
import serviceAccount from "./serviceAccount.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

mercadopago.configure({
  access_token: "TU_ACCESS_TOKEN"
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-preference", async (req, res) => {
  const pref = {
    items: [{
      title: "Rifa",
      quantity: 1,
      unit_price: req.body.amount
    }],
    external_reference: req.body.external_reference,
    notification_url: "http://localhost:3000/webhook"
  };

  const result = await mercadopago.preferences.create(pref);
  res.json({ id: result.body.id });
});

app.post("/webhook", async (req, res) => {
  const paymentId = req.body.data.id;

  const payment = await mercadopago.payment.findById(paymentId);

  if (payment.body.status === "approved") {
    const ref = payment.body.external_reference;
    await db.collection("participants").doc(ref).update({
      paid: true
    });
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Servidor activo"));
