const express = require('express');
const bodyParser = require('body-parser');
const { Groq } = require('groq-sdk');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const TAWK_PROPERTY_ID = process.env.TAWK_PROPERTY_ID;

const groq = new Groq({ apiKey: GROQ_API_KEY });

app.post('/webhook', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'chat:message:created' && data.sender?.type === 'v') {
    const chatId = data.id;
    const message = data.message;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Tum ek friendly Hindi/English customer support ho. Short aur helpful jawab do." },
          { role: "user", content: message }
        ],
        model: "llama-3.1-70b-versatile",
        max_tokens: 200
      });

      const reply = completion.choices[0]?.message?.content || "Sorry, samajh nahi aaya!";

      // Yeh line testing ke liye hai, baad mein Tawk API add kar denge
      console.log("Bot reply =>", reply);
      
      // Temporary reply (baad mein real API se bhejenge)
      res.json({ reply: reply });

    } catch (err) {
      console.error(err);
      res.json({ reply: "Abhi busy hoon, thodi der mein jawab deta hoon!" });
    }
  } else {
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot chal raha hai port ${PORT} pe`);
});
