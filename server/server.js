const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");

const app = express();
const projectRoot = path.join(__dirname, "..");
const reviewsPath = process.env.REVIEWS_FILE
  ? path.resolve(process.env.REVIEWS_FILE)
  : path.join(projectRoot, "data", "reviews.json");
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10kb" }));

app.get("/api/reviews", async (request, response, next) => {
  try {
    const reviews = JSON.parse(await fs.readFile(reviewsPath, "utf8"));
    if (!Array.isArray(reviews)) {
      throw new Error("Reviews data must be a JSON array.");
    }

    response.json(reviews);
  } catch (error) {
    next(error);
  }
});

app.post("/api/reviews", (request, response, next) => {
  const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";
  const content =
    typeof request.body?.content === "string" ? request.body.content.trim() : "";
  const rating = request.body?.rating;

  if (
    !name ||
    name.length > 80 ||
    !content ||
    content.length > 1000 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    response.status(400).json({
      error: "Provide a name (up to 80 characters), review (up to 1000 characters), and rating from 1 to 5.",
    });
    return;
  }

  const review = {
    name,
    title: "Customer review",
    content,
    date: new Date().toISOString(),
    rating,
  };

  response.status(201).json(review);
});

app.use(express.static(projectRoot));

app.use((error, request, response, next) => {
  console.error("Request failed.", error);
  if (response.headersSent) {
    next(error);
    return;
  }

  const status = error.status === 413 ? 413 : error.status === 400 ? 400 : 500;
  response.status(status).json({
    error: status === 500 ? "The server could not process the request." : error.message,
  });
});

app.listen(port, () => {
  console.log(`Haysto landing page server listening on http://localhost:${port}`);
});
