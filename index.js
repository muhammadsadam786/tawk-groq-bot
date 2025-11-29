const express = require('express');
const bodyParser = require('body-parser');
const { Groq } = require('groq-sdk');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const TAWK_PROPERTY_ID = process.env.TAWK_PROPERTY_ID;
const TAWK_USERNAME = process.env.TAWK_USERNAME || "smmcheep.com@gmail.com";  // ← yahan apna Tawk.to login email daal do
const TAWK_PASSWORD = process.env.TAWK_PASSWORD || "ahmad112233@";        // ← yahan apna Tawk.to password daal do

const groq = new Groq({ apiKey: GROQ_API_KEY });

app.post('/webhook', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'chat:message:created' && data.sender?.type === 'v') {
    const chatId = data.id;
    const message = data.message.trim();

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Tum ek friendly Hindi/English customer support ho. Short, polite aur helpful jawab do." },
          { role: "user", content: message }
        ],
        model: "llama-3.1-70b-versatile",
        max_tokens: 200
      });

      let reply = completion.choices[0]?.message?.content || "Sorry, samajh nahi aaya!";

      // Real reply bhejo Tawk.to pe
      await axios.post(https://api.tawk.to/v1/chats/\( {TAWK_PROPERTY_ID}/ \){chatId}/messages, {
        type: 'msg',
        message: reply,
        delay: 0
      }, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(\( {TAWK_USERNAME}: \){TAWK_PASSWORD}).toString('base64'),
          'Content-Type': 'application/json'
        }
      });

      console.log("Bot reply bheja:", reply);
    } catch (err) {
      console.error("Error:", err.message);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Bot live on port ${PORT}));
