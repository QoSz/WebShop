const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

const stripe = require("stripe")("sk_test_51M5m3RDQwbwuxw7nXYAisLfp4ueGrAAZrSvIY77IxXCkkDjGnP8hWuEPOZu6kJQpKohMFvnDAsYzxJApJW6lupSf008NkNMdNP");

app.post("/checkout", async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: req.body.items.map((item) => ({
                currency: "usd",
                product_data: {
                    name: item.name,
                    image: [item.product],
                },
                unit_amount: item.price * 100
            })),
            mode: "payment",
            success_url: "http://localhost:4242/success.html",
            cancel_url: "http://localhost:4242/cancel.html", 
        });
        res.status(200).json({ session });

    } catch (error) {
        next(error);
    }
});

app.listen(4242, () => console.log("App running on port 4242"));