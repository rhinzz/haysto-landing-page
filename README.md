# Haysto Landing Page

A frontend clone of [haysto.com](https://haysto.com), created to fulfill the Mamikos Frontend Engineer technical test. This is an independent test project and is not an official Haysto website.

## Introduction
The approach used in this project are assisted with Github Copilot to boost the development. Some output are not correct and needed manual adjustments.

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

## Deploy to Netlify

The repository includes `netlify.toml` and a Netlify Function for the reviews API. To deploy:

1. Import this repository in Netlify and use the repository root as the base directory.
2. Set the build command to `npm run build` and the publish directory to `.` (these are also configured in `netlify.toml`).
3. Deploy the site. Netlify builds the Tailwind stylesheet, publishes the landing page and assets, and routes `/api/reviews` to the serverless function.

The local Express server remains available with `npm start`; Netlify uses its function instead. As with the local API, submitted reviews are returned for immediate display but are not persisted, so only the sample reviews remain after refresh.

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
