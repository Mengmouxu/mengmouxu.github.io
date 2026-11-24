const teaser = document.querySelector(".hero-teaser");
let framePending = false;

function updateTeaser() {
  const fadeDistance = Math.max(teaser.offsetHeight * 0.85, 120);
  const progress = Math.min(Math.max(window.scrollY / fadeDistance, 0), 1);

  teaser.style.setProperty("--teaser-fade", progress.toFixed(3));
  teaser.style.setProperty("--teaser-zoom", (1 + progress * 0.12).toFixed(3));
  teaser.style.setProperty("--teaser-blur", `${(progress * 9).toFixed(2)}px`);
  framePending = false;
}

function scheduleTeaserUpdate() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(updateTeaser);
}

window.addEventListener("scroll", scheduleTeaserUpdate, { passive: true });
window.addEventListener("resize", scheduleTeaserUpdate);
updateTeaser();
