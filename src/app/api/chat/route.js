import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * RAG Context Retriever
 * Extracts relevant memory snippets from past conversation turns
 * to ensure MAX AI retains full context of previous chat information.
 */
function extractRAGContext(currentQuery, history = []) {
  if (!history || history.length === 0) return null;

  const queryTerms = currentQuery
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const matchedTurns = history.filter((msg) => {
    if (!msg.content) return false;
    const contentLower = msg.content.toLowerCase();
    return queryTerms.some((term) => contentLower.includes(term));
  });

  // Take recent turns + matched turns
  const relevantTurns = [
    ...matchedTurns,
    ...history.slice(-6),
  ].filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.content === item.content)
  );

  if (relevantTurns.length === 0) return null;

  return relevantTurns
    .map(
      (msg) =>
        `[${msg.role === "user" ? "User" : "MAX AI"}]: ${msg.content.slice(0, 300)}`
    )
    .join("\n");
}

export async function POST(req) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || !message.trim()) {
      return Response.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    // 1. Build RAG Memory Block
    const ragContext = extractRAGContext(message, history);

    // 2. High-Energy System Persona Prompt
    const systemPrompt = `You are MAX AI 🚀 — an ultra-energetic, high-vibe, super-smart, and proactive AI assistant!

Your Personality & Behavior Guidelines:
1. ⚡ High Energy & Positive Vibe: Radiate enthusiasm, confidence, and warmth in every response! Use energetic greetings (like "Hey there! 🚀", "Awesome question!", "Let's dive in! 💡").
2. 🧠 RAG & Context Memory: You have full access to previous chat history and context. Reference past topics, names, details, or code mentioned earlier whenever relevant.
3. 🎯 Fast, Smart & Actionable: Give direct, accurate, well-structured answers using clear Markdown formatting, bullet points, code blocks, and bold highlights.
4. 🌟 Proactive Suggestions: End responses with a quick energetic tip or a relevant follow-up suggestion when appropriate!

${ragContext ? `\n[RELEVANT RAG CONTEXT FROM PAST CONVERSATIONS]:\n${ragContext}\n` : ""}`;

    // 3. Format History Messages for Groq API
    const formattedHistory = history.slice(-10).map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: message },
    ];

    // 4. Call Groq with Fallback Model Support
    const modelsToTry = [
      "llama-3.3-70b-versatile",
      "mixtral-8x7b-32768",
      "openai/gpt-oss-20b",
      "llama3-70b-8192",
    ];

    let reply = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: apiMessages,
          temperature: 0.75,
          max_tokens: 2048,
        });

        reply = completion.choices[0]?.message?.content;
        if (reply) break;
      } catch (err) {
        console.warn(`Model ${model} failed, trying next fallback...`, err.message);
        lastError = err;
      }
    }

    if (!reply) {
      throw lastError || new Error("Failed to generate response from AI models.");
    }

    return Response.json({
      success: true,
      reply,
      ragActive: Boolean(ragContext),
    });
  } catch (error) {
    console.error("GROQ CHAT ERROR:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}