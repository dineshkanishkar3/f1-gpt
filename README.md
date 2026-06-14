# F1-GPT

> **Your personal AI assistant for Formula 1 — drivers, races, regulations, and history, grounded in real F1 sources.**

<!-- ============================================================
     PLACEHOLDER: Project banner / demo GIF
     WHAT TO ADD: A short screen recording (10–20 seconds) or GIF
     showing the chat UI answering an F1 question. Host it on GitHub,
     Imgur, or attach when you post on LinkedIn.
     Example: ![F1-GPT demo](./docs/demo.gif)
     ============================================================ -->
<!-- [ADD YOUR DEMO GIF OR SCREENSHOT HERE] -->

---

## 📌 Project Overview

**F1-GPT** is a **Retrieval-Augmented Generation (RAG)** chat application built for Formula 1 fans, analysts, and anyone who wants fast, context-aware answers about the sport. Instead of relying only on a language model's training data, the app **searches a vector database of scraped F1 content** and feeds the most relevant passages to a **local LLM running via Ollama**.

The result: answers that are more grounded in current articles, Wikipedia pages, official F1 content, and news — while keeping inference **private and cost-free** on your own machine.

---

## Why I Built This

<!-- ============================================================
     PLACEHOLDER: Your personal story (great for LinkedIn)
     WHAT TO ADD: 2–4 sentences about YOUR motivation. Be specific.
     Examples:
     - "As an F1 fan, I wanted a single place to ask questions about
        standings, driver history, and rule changes without digging
        through ten websites."
     - "I built this to learn RAG end-to-end: scraping → embeddings →
        vector search → LLM prompting."
     - "I migrated from cloud APIs to Ollama to run everything locally
        and avoid API costs during development."
     ============================================================ -->

**[ADD YOUR STORY HERE — why this project matters to you, what problem it solves, or what you learned building it]**

---

## Key Features

| Feature | Description |
|--------|-------------|
| **RAG-powered answers** | User questions are embedded and matched against F1 documents stored in Astra DB |
| **Local LLM via Ollama** | No OpenAI dependency — chat and embeddings run through Ollama on your machine |
| **Web scraping pipeline** | Puppeteer loads F1 URLs, strips HTML, chunks text, and stores vectors |
| **Modern chat UI** | Next.js app with welcome screen, quick prompts, light/dark theme, and streaming-style responses |
| **Quick prompts** | One-click starter questions (championship winners, driver careers, calendar, etc.) |
| **Extensible data sources** | Add more URLs to the seed script to expand knowledge coverage |

---

## How It Works (Architecture)

When you ask a question, the app follows a standard RAG pipeline:

```mermaid
flowchart LR
    A[User question] --> B[Ollama Embeddings]
    B --> C[Vector search in Astra DB]
    C --> D[Top 5 relevant text chunks]
    D --> E[System prompt + context]
    E --> F[Ollama LLM]
    F --> G[Answer in chat UI]
```

### Step-by-step

1. **Ingestion (one-time / on demand)** — The seed script (`scripts/loadDb.ts`) uses Puppeteer to scrape F1 web pages, splits content into ~512-character chunks, generates embeddings with Ollama, and stores `{ text, $vector }` documents in **DataStax Astra DB**.

2. **Query time** — When you send a message in the chat:
   - Your question is embedded with the same Ollama embedding model.
   - Astra DB returns the **5 most similar chunks** via vector search.
   - Those chunks are injected into a system prompt.
   - **Ollama LLM** generates the final answer using that context plus conversation history.

3. **Fallback** — If no strong matches are found, the model still answers using its general F1 knowledge (as instructed in the prompt).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 |
| **Backend** | Next.js API Route (`/api/chat`) |
| **LLM & Embeddings** | [Ollama](https://ollama.com) via `@langchain/ollama` |
| **Vector database** | [DataStax Astra DB](https://www.datastax.com/products/datastax-astra) |
| **Orchestration** | LangChain (document loaders, text splitters) |
| **Scraping** | Puppeteer (`PuppeteerWebBaseLoader`) |
| **Language** | TypeScript |

### Default Ollama models

| Purpose | Default model | Env override |
|---------|---------------|--------------|
| Embeddings | `qwen3-embedding:0.6b-fp16` | `OLLAMA_EMBEDDING_MODEL` |
| Chat / LLM | `llama2:7b` | `OLLAMA_LLM_MODEL` |

You can swap these for any models you've pulled in Ollama (e.g. `llama3`, `mistral`, `gemma`).

---

## Project Structure

```
f1-gpt/
├── app/
│   ├── api/chat/route.ts      # RAG pipeline: embed → search → Ollama LLM
│   ├── components/            # Chat UI (header, messages, input, welcome)
│   ├── page.tsx               # Main chat page
│   └── layout.tsx
├── scripts/
│   └── loadDb.ts              # Scrape F1 URLs → chunk → embed → Astra DB
├── public/                    # Static assets
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **[Ollama](https://ollama.com)** installed and running locally
- **DataStax Astra DB** account with a vector-enabled collection
- Models pulled in Ollama, for example:

```bash
ollama pull llama2:7b
ollama pull qwen3-embedding:0.6b-fp16
```

### 1. Clone and install

```bash
git clone [ADD YOUR REPO URL]
cd f1-gpt
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
# DataStax Astra DB
ASTRA_DB_API_ENDPOINT=https://YOUR-DATABASE-ID-REGION.apps.astra.datastax.com
ASTRA_DB_APPLICATION_TOKEN=AstraCS:...
ASTRA_DB_NAMESPACE=default_keyspace
ASTRA_DB_COLLECTION=f1_collection

# Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_EMBEDDING_MODEL=qwen3-embedding:0.6b-fp16
OLLAMA_LLM_MODEL=llama2:7b
```

### 3. Seed the vector database

Make sure Ollama is running, then ingest F1 content:

```bash
npx ts-node ./scripts/loadDb.ts
```

This creates the collection (if needed), scrapes configured F1 URLs, and inserts embedded chunks. The first run can take several minutes depending on your network and hardware.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting.

---

## Data Sources

The seed script currently ingests content from sources such as:

- Wikipedia (Formula One, championships, driver lists)
- [formula1.com](https://www.formula1.com) (latest news, race results, calendars)
- F1 news and live coverage sites

<!-- ============================================================
     PLACEHOLDER: Custom data sources
     WHAT TO ADD: List any extra URLs or datasets YOU added, e.g.
     "I also added ESPN F1 standings and my own markdown notes on
     2026 regulations."
     ============================================================ -->

**[OPTIONAL: List any additional sources you configured beyond the defaults]**

---

## Screenshots

<!-- ============================================================
     PLACEHOLDER: Screenshots for GitHub & LinkedIn
     WHAT TO ADD: 2–3 images:
     1. Welcome screen with quick prompts (light or dark theme)
     2. A sample Q&A (e.g. "Who won the 2024 championship?")
     3. Optional: terminal showing Ollama + seed script success
     Save under docs/ or .github/ and uncomment the lines below.
     ============================================================ -->

<!-- ![Welcome screen](./docs/screenshot-welcome.png) -->
<!-- ![Chat example](./docs/screenshot-chat.png) -->

**[ADD SCREENSHOTS HERE]**

---

## Roadmap

- [ ] Streaming responses — show Ollama replies token-by-token in the chat  
- [ ] Source citations — link answers back to the F1 pages they came from  
- [ ] New chat — button to clear the conversation and start fresh  

