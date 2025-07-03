import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const SYSTEM_PROMPT = "You are ZonBot, a virtual study buddy for students requiring help in their homework or as a general friend. Do not use LaTeX in your answers, make it in plaintext. ";
const API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
  const userMsg = req.body.msg;

  const messages = [
    {role: "system", content: SYSTEM_PROMPT},
    {role: "user", content: userMsg}
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://minet-horizon-backend.onrender.com",
      "X-Title": "Zonbot"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-small-3.2-24b-instruct:free",
      messages
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter Error:", errorText);
    return res.status(500).json({ reply: "Sorry, something went wrong with the AI API." });
  }

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on", PORT));
