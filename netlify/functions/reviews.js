const sampleReviews = require("../../data/reviews.json");

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    return jsonResponse(200, sampleReviews);
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "");
  } catch {
    return jsonResponse(400, { error: "Request body must be valid JSON." });
  }

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  const rating = body?.rating;

  if (
    !name ||
    name.length > 80 ||
    !content ||
    content.length > 1000 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return jsonResponse(400, {
      error:
        "Provide a name (up to 80 characters), review (up to 1000 characters), and rating from 1 to 5.",
    });
  }

  return jsonResponse(201, {
    name,
    title: "Customer review",
    content,
    date: new Date().toISOString(),
    rating,
  });
};
