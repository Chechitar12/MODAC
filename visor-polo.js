const poloViews = [...document.querySelectorAll("[data-polo-view]")];
const poloZoom = document.querySelector("#poloZoom");
const viewNames = ["Frente", "Manga", "Espalda"];
let currentPoloView = 0;
let pointerStart;
let paused = false;
const viewFiles = ["frente", "manga", "espalda-cherry-club"];

function showPoloView(index) {
  currentPoloView = (index + viewNames.length) % viewNames.length;
  const file = viewFiles[currentPoloView];
  for (const view of poloViews) {
    view.style.setProperty("--polo-image", `url("assets/polo-cerezas-${file}.webp")`);
    view.setAttribute(
      "aria-label",
      `Vista ${viewNames[currentPoloView].toLowerCase()} del polo MODAC`,
    );
  }
  document.querySelectorAll(".polo-carousel-dots").forEach((dots) => {
    [...dots.children].forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentPoloView);
    });
  });
}

document.querySelectorAll("[data-polo-step]").forEach((button) => {
  button.addEventListener("click", () => {
    showPoloView(currentPoloView + Number(button.dataset.poloStep));
    paused = true;
  });
});

for (const view of poloViews) {
  view.addEventListener("pointerdown", (event) => {
    if (
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    view.setPointerCapture(event.pointerId);
  });
  view.addEventListener("pointerup", (event) => {
    if (pointerStart?.id !== event.pointerId) return;
    const horizontal = event.clientX - pointerStart.x;
    const vertical = event.clientY - pointerStart.y;
    pointerStart = undefined;
    if (
      Math.abs(horizontal) > 28 &&
      Math.abs(horizontal) > Math.abs(vertical)
    ) {
      showPoloView(currentPoloView + (horizontal < 0 ? 1 : -1));
      paused = true;
    } else if (Math.hypot(horizontal, vertical) < 8) {
      paused = !paused;
    }
  });
  view.addEventListener("lostpointercapture", () => {
    pointerStart = undefined;
  });
  view.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      paused = !paused;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      showPoloView(currentPoloView + (event.key === "ArrowRight" ? 1 : -1));
      paused = true;
    }
  });
}

document
  .querySelector("#openPoloZoom")
  .addEventListener("click", () => poloZoom.showModal());
document
  .querySelector("#closePoloZoom")
  .addEventListener("click", () => poloZoom.close());

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setInterval(() => {
    if (!document.hidden && !paused)
      showPoloView(currentPoloView + 1);
  }, 3000);
}

showPoloView(0);
