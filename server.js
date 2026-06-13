import app from "./app.js";
import { db } from "./config/db.js";
import qdrantClient, { initFrameworkCollection } from "./config/qdrant.js";

const port = process.env.PORT || 3000;

// db 
db();

// Test Qdrant connection and initialize collection asynchronously (non-blocking)
qdrantClient.getCollections()
  .then((res) => {
    console.log("✅ Qdrant Database Connected:", res.collections.length, "collections found.");
    return initFrameworkCollection();
  })
  .catch((err) => {
    console.error("❌ Qdrant Database Connection Error:", err);
  });

//  localhost:
app.listen(port, () => {
  console.log(`localhost running at ${port}`);
});
