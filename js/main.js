const toggle = document.querySelector("#navbar-toggle");
const menu = document.querySelector("#navbar-menu");
const closeButton = document.querySelector("#navbar-close");
const desktopViewport = window.matchMedia("(min-width: 64rem)");

if (toggle && menu) {
  const setMenuOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    menu.classList.toggle("hidden", !open);
    document.body.classList.toggle("overflow-hidden", open && !desktopViewport.matches);
  };

  toggle.addEventListener("click", () => {
    setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  closeButton?.addEventListener("click", () => {
    setMenuOpen(false);
    toggle.focus();
  });

  menu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  desktopViewport.addEventListener("change", (event) => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
}

const whoWeHelpImage = document.querySelector("#who-we-help-image");
const whoWeHelpArticles = document.querySelectorAll("#who-we-help article[data-image]");

if (whoWeHelpImage instanceof HTMLImageElement) {
  const defaultSrc = whoWeHelpImage.getAttribute("src");
  const defaultAlt = whoWeHelpImage.alt;

  whoWeHelpArticles.forEach((article) => {
    const showArticleImage = () => {
      const imageSrc = article.getAttribute("data-image");
      const imageAlt = article.getAttribute("data-image-alt");

      if (imageSrc && imageAlt) {
        whoWeHelpImage.src = imageSrc;
        whoWeHelpImage.alt = imageAlt;
      }
    };

    const restoreDefaultImage = () => {
      if (defaultSrc) {
        whoWeHelpImage.src = defaultSrc;
        whoWeHelpImage.alt = defaultAlt;
      }
    };

    article.addEventListener("pointerenter", showArticleImage);
    article.addEventListener("pointerleave", restoreDefaultImage);
    article.addEventListener("focusin", showArticleImage);
    article.addEventListener("focusout", (event) => {
      if (!article.contains(event.relatedTarget)) {
        restoreDefaultImage();
      }
    });
  });
}

const reviewDialog = document.querySelector("#review-dialog");
const reviewForm = document.querySelector("#review-form");
const reviewList = document.querySelector("#review-list");
const openReviewDialog = document.querySelector("#open-review-dialog");
const closeReviewDialog = document.querySelector("#close-review-dialog");
const cancelReview = document.querySelector("#cancel-review");
const reviewFormStatus = document.querySelector("#review-form-status");
const reviewLoadStatus = document.querySelector("#review-load-status");

const createReviewCard = ({ name, title, content, date, rating, isSample = false }) => {
  const article = document.createElement("article");
  article.className = "bg-white p-6";

  if (isSample) {
    const sampleLabel = document.createElement("p");
    sampleLabel.className = "mb-2 text-sm font-semibold text-black/60";
    sampleLabel.textContent = "Sample review";
    article.append(sampleLabel);
  }

  const stars = document.createElement("div");
  stars.className = "text-brightOrange";
  stars.setAttribute("aria-label", `${rating} out of 5 stars`);
  for (let index = 0; index < rating; index += 1) {
    const star = document.createElement("i");
    star.className = "fa-solid fa-star";
    star.setAttribute("aria-hidden", "true");
    stars.append(star);
  }

  const heading = document.createElement("h3");
  heading.className = "font-newsreader text-2xl font-extrabold";
  heading.textContent = title;

  const body = document.createElement("p");
  body.className = "mt-4 text-black/80";
  body.textContent = content;

  const footer = document.createElement("footer");
  footer.className = "mt-6 flex items-end justify-between gap-4 text-sm";

  const reviewer = document.createElement("span");
  reviewer.className = "font-semibold";
  reviewer.textContent = name;

  const time = document.createElement("time");
  const reviewDate = new Date(date);
  time.dateTime = reviewDate.toISOString();
  time.className = "text-black/60";
  time.textContent = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(reviewDate);

  footer.append(reviewer, time);
  article.append(stars, heading, body, footer);
  return article;
};

if (
  reviewDialog instanceof HTMLDialogElement &&
  reviewForm instanceof HTMLFormElement &&
  reviewList instanceof HTMLElement &&
  openReviewDialog instanceof HTMLButtonElement
) {
  const loadReviews = async () => {
    if (reviewList instanceof HTMLElement) {
      reviewList.setAttribute("aria-busy", "true");
    }

    try {
      const response = await fetch("/api/reviews");
      if (!response.ok) {
        throw new Error(`The reviews service returned an error (${response.status}).`);
      }

      const reviews = await response.json();
      if (
        !Array.isArray(reviews) ||
        !reviews.every(
          (review) =>
            review &&
            typeof review.name === "string" &&
            typeof review.title === "string" &&
            typeof review.content === "string" &&
            typeof review.date === "string" &&
            Number.isInteger(review.rating) &&
            review.rating >= 1 &&
            review.rating <= 5 &&
            (review.isSample === undefined || typeof review.isSample === "boolean") &&
            Number.isFinite(new Date(review.date).getTime()),
        )
      ) {
        throw new Error("Reviews response has an invalid format.");
      }

      reviewList.replaceChildren();
      reviews.forEach((review) => {
        reviewList.append(createReviewCard(review));
      });
      if (reviewLoadStatus instanceof HTMLElement) {
        reviewLoadStatus.textContent = "";
        reviewLoadStatus.setAttribute("role", "status");
      }
    } catch (error) {
      console.error("Unable to load reviews.", error);
      if (reviewLoadStatus instanceof HTMLElement) {
        reviewLoadStatus.textContent =
          error instanceof TypeError
            ? "Could not connect to load reviews. Check your connection and try again."
            : "Reviews could not be loaded. Please try again later.";
        reviewLoadStatus.setAttribute("role", "alert");
      }
    } finally {
      reviewList.setAttribute("aria-busy", "false");
    }
  };

  const reviewsLoaded = loadReviews();

  const closeReviewForm = () => {
    reviewDialog.close();
    openReviewDialog.focus();
  };

  openReviewDialog.addEventListener("click", () => {
    reviewFormStatus.textContent = "";
    reviewDialog.showModal();
    reviewForm.elements.namedItem("name")?.focus();
  });

  closeReviewDialog?.addEventListener("click", closeReviewForm);
  cancelReview?.addEventListener("click", closeReviewForm);

  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submissionStatus = document.querySelector("#review-submit-status");
    if (submissionStatus instanceof HTMLElement) {
      submissionStatus.hidden = true;
      submissionStatus.textContent = "";
    }
    reviewFormStatus.textContent = "";
    reviewFormStatus.setAttribute("role", "status");

    const formData = new FormData(reviewForm);
    const reviewerName = String(formData.get("name") ?? "").trim();
    const reviewContent = String(formData.get("review") ?? "").trim();
    const rating = Number(formData.get("rating"));

    if (!reviewerName || !reviewContent || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      reviewFormStatus.textContent = "Please enter your name, review, and a rating from 1 to 5 stars.";
      reviewFormStatus.setAttribute("role", "alert");
      return;
    }

    const submitButton = reviewForm.querySelector('button[type="submit"]');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }

    try {
      await reviewsLoaded;
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: reviewerName, content: reviewContent, rating }),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error(
          response.ok
            ? "The server returned an unreadable response."
            : `The server returned an error (${response.status}).`,
        );
      }

      if (!response.ok) {
        const serverMessage =
          result && typeof result.error === "string" ? result.error : "";
        const message =
          response.status === 400
            ? serverMessage || "Please check your review details and try again."
            : `The reviews service could not submit your review (${response.status}).`;
        reviewFormStatus.textContent = message;
        reviewFormStatus.setAttribute("role", "alert");
        return;
      }

      reviewList.prepend(createReviewCard(result));
      reviewForm.reset();
      if (submissionStatus instanceof HTMLElement) {
        submissionStatus.textContent = "Your review was submitted successfully.";
        submissionStatus.hidden = false;
        submissionStatus.setAttribute("role", "status");
      }
      closeReviewForm();
    } catch (error) {
      console.error("Unable to submit review.", error);
      reviewFormStatus.textContent =
        error instanceof TypeError
          ? "Network error: your review could not be sent. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Your review could not be submitted. Please try again.";
      reviewFormStatus.setAttribute("role", "alert");
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }
    }
  });
}
