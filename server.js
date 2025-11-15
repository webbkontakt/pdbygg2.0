import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe("***REMOVED***");

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    const lineItems = items.map(item => ({
  price_data: {
    currency: "sek",
    product_data: {
      name: item.name,
      images: [item.imageUrl]   // ✅ Här sätter du bild-URL
    },
    unit_amount: item.price * 100,
  },
  quantity: item.quantity,
}));

    const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: "https://dinhemsida.se/success",
    cancel_url: "https://dinhemsida.se/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).send("Något gick fel!");
  }
});

app.listen(3000, () => console.log("Servern flyger iväg på port 3000 🚀😄"));
