import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    const lineItems = items.map(item => ({
      price: item.stripePriceId,
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["SE"]
      },
      line_items: lineItems,
      success_url: "https://www.pdbygg.se/success",
      cancel_url: "https://www.pdbygg.se/cancel"
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Stripe-session kunde inte skapas" });
  }
});

app.listen(3000, () => console.log("Servern flyger på port 3000 🚀😄"));
