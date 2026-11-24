for (const video of document.querySelectorAll(".video-frame video")) {
  const label = video.getAttribute("aria-label");
  const preview = document.createElement("button");
  preview.className = "video-play";
  preview.type = "button";
  preview.setAttribute("aria-label", `Play ${label}`);
  video.after(preview);
  video.controls = false;

  video.addEventListener("play", () => {
    video.controls = true;
    preview.hidden = true;
  });

  video.addEventListener("ended", () => {
    video.controls = false;
    preview.setAttribute("aria-label", `Replay ${label}`);
    preview.hidden = false;
  });

  preview.addEventListener("click", async () => {
    video.controls = true;
    preview.hidden = true;
    video.focus({ preventScroll: true });
    try {
      await video.play();
    } catch {
      // Native controls stay available if the browser rejects the first play.
    }
  });
}

for (const rail of document.querySelectorAll(".media-rail")) {
  const track = rail.querySelector(".media-track");
  const previous = rail.querySelector(".rail-arrow.previous");
  const next = rail.querySelector(".rail-arrow.next");

  function updateEdges() {
    const hasPrevious = track.scrollLeft > 1;
    const hasNext = track.scrollLeft + track.clientWidth < track.scrollWidth - 1;
    rail.toggleAttribute("data-before", hasPrevious);
    rail.toggleAttribute("data-after", hasNext);
    previous.hidden = !hasPrevious;
    next.hidden = !hasNext;
  }

  function advance(direction) {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({ left: direction * (track.clientWidth + gap) });
  }

  previous.addEventListener("click", () => advance(-1));
  next.addEventListener("click", () => advance(1));
  track.addEventListener("scroll", updateEdges, { passive: true });
  new ResizeObserver(updateEdges).observe(track);
  updateEdges();
}
