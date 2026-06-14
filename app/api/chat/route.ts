import { OllamaEmbeddings } from "@langchain/ollama";
import { Ollama } from "@langchain/ollama";
import { DataAPIClient } from "@datastax/astra-db-ts";
import "dotenv/config";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OLLAMA_BASE_URL,
  OLLAMA_EMBEDDING_MODEL,
  OLLAMA_LLM_MODEL,
} = process.env;

const ollamaBaseUrl = OLLAMA_BASE_URL || "http://localhost:11434";

const ollamaEmbeddings = new OllamaEmbeddings({
  model: OLLAMA_EMBEDDING_MODEL || "qwen3-embedding:0.6b-fp16",
  baseUrl: ollamaBaseUrl,
});

const ollamaLLM = new Ollama({
  model: OLLAMA_LLM_MODEL || "llama2:7b",
  baseUrl: ollamaBaseUrl,
  temperature: 0.7,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT, {
  keyspace: ASTRA_DB_NAMESPACE,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const latestMessage = messages[messages.length - 1];

    let documentContext = "";

    // Get embedding for the latest message
    const embedding = await ollamaEmbeddings.embedQuery(
      latestMessage.content || latestMessage.text,
    );

    // Query Astra DB for similar documents
    const collection = db.collection(ASTRA_DB_COLLECTION);
    const similarDocs = await collection
      .find(
        {},
        {
          sort: {
            $vector: embedding,
          },
          limit: 5,
        },
      )
      .toArray();

    // Build context from retrieved documents
    if (similarDocs && similarDocs.length > 0) {
      documentContext = similarDocs.map((doc) => doc.text).join("\n\n");
    }

    // Build the system prompt with context
    const systemPrompt = `You are an expert Formula 1 AI assistant. Use the following context to answer questions about Formula 1:

${documentContext}

If the context doesn't contain relevant information, provide your general knowledge about Formula 1. Always be accurate and helpful.`;

    // Build the conversation for the LLM
    const conversationMessages = [
      ...messages.slice(0, -1),
      {
        role: "user",
        content: `${systemPrompt}\n\nUser Question: ${latestMessage.content || latestMessage.text}`,
      },
    ];

    // Call Ollama LLM
    const response = await ollamaLLM.invoke(
      conversationMessages
        .map(
          (m) =>
            `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`,
        )
        .join("\n\n"),
    );

    return new Response(response, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error in chat route...", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
