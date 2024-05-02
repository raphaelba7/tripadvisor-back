require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(express.json());
app.use(cors());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: process.env.MAILGUN_USERNAME,
  key: process.env.MAILGUN_API_KEY,
});

app.get("/", (req, res) => {
  res.send("server is up");
});

app.post("/form", async (req, res) => {
  try {
    const { firstname, lastname, email, message } = req.body;

    if (firstname && lastname && email && message) {
      const messageData = {
        from: `${firstname} ${lastname} <${email}>`,
        to: process.env.MAILGUN_MAIL,
        subject: `Formulaire inscription`,
        text: message,
      };

      const response = await client.messages.create(
        process.env.MAILGUN_DOMAIN,
        messageData
      );

      console.log(response);
      res.status(200).json(response);
    } else {
      res.status(400).json({ message: "Missing parameters" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
});

app.all("*", (req, res) => {
  res.json({ message: "All routes" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started !!!!!!!!");
});
