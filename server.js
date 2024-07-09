import express from "express";
const app = express();
import Stripe from "stripe";
import cors from "cors";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const stripe = new Stripe(process.env.SECRET_KEY);

const port = 3000;

app.post("/create-stripe-payment", async (req, res) => {
  try {
    const { amount, currency, paymentMethod } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: [paymentMethod],
    });
    console.log("paymentIntent", paymentIntent);

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    return res.json({
      status: "false",
      message: "something went wrong",
    });
  }
});

app.post("/confirm-order", (req, res) => {
  try {
    console.log(req.body);
    if (req.body.id) {
      return res.json({
        success: "true",
        message: "Order Saved",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: "false",
      message: "Something went wrong",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    status: "true",
    message: "stripe api is running successfully.",
  });
});

app.listen(port, () => {
  console.log("server is running on port:" + port);
});
