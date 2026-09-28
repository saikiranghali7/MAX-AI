export function parseCommand(input) {
  if (!input || typeof input !== "string") {
    return {
      type: "chat",
      command: input || "",
    };
  }

  const text = input.trim();

  if (!text) {
    return {
      type: "empty",
      command: "",
    };
  }

  const normalized = text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  /*
   * CALL COMMAND
   *
   * Examples:
   *
   * MAX call Rahul
   * call Rahul
   * MAX please call Rahul
   * hey MAX call Rahul
   */

  const callPatterns = [
    /^max[\s,]*(?:please\s+)?call\s+(.+)$/i,

    /^(?:please\s+)?call\s+(.+)$/i,

    /^max[\s,]+(?:can you\s+)?call\s+(.+)$/i,

    /^hey\s+max[\s,]+(?:please\s+)?call\s+(.+)$/i,

    /^okay\s+max[\s,]+(?:please\s+)?call\s+(.+)$/i,
  ];

  for (const pattern of callPatterns) {
    const match = text.match(pattern);

    if (match) {
      const contactName = match[1]
        .trim()
        .replace(/[.!?]+$/, "");

      if (contactName) {
        return {
          type: "call",
          contactName,
          originalCommand: text,
        };
      }
    }
  }

  /*
   * MESSAGE COMMAND
   *
   * Examples:
   *
   * MAX message Rahul hello
   * MAX send a message to Rahul
   */

  const messagePatterns = [
    /^max[\s,]+(?:send\s+)?(?:a\s+)?message\s+to\s+(.+)$/i,

    /^max[\s,]+text\s+(.+)$/i,
  ];

  for (const pattern of messagePatterns) {
    const match = text.match(pattern);

    if (match) {
      return {
        type: "message",
        target: match[1].trim(),
        originalCommand: text,
      };
    }
  }

  /*
   * OPEN COMMAND
   */

  const openPatterns = [
    /^max[\s,]+open\s+(.+)$/i,

    /^max[\s,]+launch\s+(.+)$/i,
  ];

  for (const pattern of openPatterns) {
    const match = text.match(pattern);

    if (match) {
      return {
        type: "open",
        target: match[1].trim(),
        originalCommand: text,
      };
    }
  }

  /*
   * SEARCH COMMAND
   */

  const searchPatterns = [
    /^max[\s,]+search\s+(?:for\s+)?(.+)$/i,

    /^max[\s,]+google\s+(.+)$/i,
  ];

  for (const pattern of searchPatterns) {
    const match = text.match(pattern);

    if (match) {
      return {
        type: "search",
        query: match[1].trim(),
        originalCommand: text,
      };
    }
  }

  /*
   * NORMAL AI CHAT
   */

  return {
    type: "chat",
    command: text,
    originalCommand: text,
  };
}