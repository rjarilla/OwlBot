import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://is215-openai.upou.io/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Create 5 short quiz questions and answers from this:\n${message}

Return JSON like:
{
  "questions": [
    {"question": "...", "answer": "..."}
  ]
}`
          }
        ]
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "No response generated.";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});