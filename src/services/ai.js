export async function askAI(message, history = []) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return {
    role: "assistant",
    content: data.reply,
    ragActive: data.ragActive || false,
  };
}