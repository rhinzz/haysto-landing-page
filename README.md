# Haysto Landing Page

A frontend clone of [haysto.com](https://haysto.com), created to fulfill the Mamikos Frontend Engineer technical test. This is an independent test project and is not an official Haysto website.

## Tools used

- HTML for the page structure.
- Tailwind CSS 4 for utility-based styling, built with the Tailwind CLI.
- Vanilla JavaScript for responsive navigation, review form interactions, and API requests.
- Node.js and Express 5 for serving the site and providing the reviews API.
- Google Fonts (DM Sans, Newsreader, and DM Mono) and Font Awesome for typography and icons.

## Run locally

Install dependencies and start the Express server:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). Express serves both the landing page and API, so run the project through this server rather than opening `index.html` directly.

To rebuild the generated Tailwind stylesheet after changing styles or markup:

```bash
npm run build
```

To rebuild automatically while developing:

```bash
npm run watch
```

The server uses port `3000` by default. Set the `PORT` environment variable to use a different port.

## Reviews API

### `GET /api/reviews`

Returns the sample reviews stored in `data/reviews.json` as a JSON array.

### `POST /api/reviews`

Validates and returns a review as JSON. The submitted review is shown immediately in the current page, but is not saved to disk; refreshing the page reloads only the sample reviews. The endpoint accepts a JSON request body:

```json
{
  "name": "Example customer",
  "content": "The team was helpful throughout the process.",
  "rating": 5
}
```

`name` is required and limited to 80 characters, `content` is required and limited to 1000 characters, and `rating` must be an integer from 1 to 5. A successful request returns `201 Created`; invalid input returns `400 Bad Request`.
