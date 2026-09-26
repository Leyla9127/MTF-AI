export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing GEMINI_API_KEY" });
    return;
  }

  try {
    const { system, messages, max_tokens } = req.body;

    // Convert Anthropic-style messages into Gemini's format
    const contents = (messages || []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: system ? { parts: [{ text: system }] } : undefined,
          generationConfig: { maxOutputTokens: max_tokens || 1000 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || "Gemini API error" });
      return;
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Reshape into the same format your app already expects from Anthropic
    res.status(200).json({
      content: [{ type: "text", text }],
    });
  } catch (err) {
    res.status(500).json({ error: "Server error calling Gemini API" });
  }
}
