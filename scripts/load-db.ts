import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import OpenAI from "openai";
import "dotenv/config";

type SimilarityMetric = "cosine" | "euclidean" | "dot_product";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const f1Data = [
  "https://en.wikipedia.org/wiki/Formula_One",
  "https://www.formula1.com/en/latest/article/everything-you-need-to-know-about-the-new-f1-rules-for-2026.48bv0VTxhIlhrQXmxercXk",
  "https://www.skysports.com/f1/live-blog/12433/13553491/f1-barcelona-catalunya-gp-live-final-practice-and-qualifying-updates-results-stream-highlights-from-spanish-f1-race-weekend",
  "https://www.formula1.com/en/latest",
  "https://www.total-motorsport.com/f1-news/",
  "https://en.wikipedia.org/wiki/2025_Formula_One_World_Championship",
  "https://en.wikipedia.org/wiki/2026_Formula_One_World_Championship",
  "https://en.wikipedia.org/wiki/2024_Formula_One_World_Championship",
  "https://en.wikipedia.org/wiki/List_of_Formula_One_drivers",
  "https://www.formula1.com/en/racing/2024.html",
  "https://www.formula1.com/en/racing/2025.html",
  "https://www.formula1.com/en/racing/2026.html",
  "https://www.formula1.com/en/results/2024/races.html",
  "https://www.formula1.com/en/results/2025/races.html",
  "https://www.formula1.com/en/results/2026/races.html",
  "https://en.wikipedia.org/wiki/List_of_female_Formula_One_drivers",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT, {
  keyspace: ASTRA_DB_NAMESPACE,
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product",
) => {
  const response = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 1536,
      metric: similarityMetric,
    },
  });
  console.log("Collection created:", response);
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION);
  for await (const url of f1Data) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for await (const chunk of chunks) {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float",
      });

      const vector = embedding.data[0].embedding;
      const response = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });
      console.log("Inserted chunk:", response);
    }
  }
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });
  return (await loader.scrape())?.replace(/<[^>]*>?/gm, "") || "";
}

createCollection().then(() => loadSampleData());






