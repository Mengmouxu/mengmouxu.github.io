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

  function updateClipping(hasPrevious, hasNext) {
    const { left, right } = track.getBoundingClientRect();
    const cards = Array.from(track.children, card => card.getBoundingClientRect());

    function edgeOpacity(edge, canScroll) {
      if (!canScroll) return 1;
      const card = cards.find(bounds => bounds.left < edge && edge < bounds.right);
      if (!card) return 1;
      const distance = Math.min(edge - card.left, card.right - edge);
      return 1 - Math.max(0, Math.min(1, (distance - 2) / 12));
    }

    const first = edgeOpacity(left, hasPrevious);
    const last = edgeOpacity(right, hasNext);
    track.style.setProperty("--first-edge-opacity", first);
    track.style.setProperty("--last-edge-opacity", last);
    track.toggleAttribute("data-clipping", first < 1 || last < 1);
  }

  function updateEdges() {
    const canScroll = track.scrollWidth - track.clientWidth > 1;
    const hasPrevious = track.scrollLeft > 1;
    const hasNext = track.scrollLeft + track.clientWidth < track.scrollWidth - 1;
    updateClipping(hasPrevious, hasNext);
    previous.hidden = !canScroll;
    next.hidden = !canScroll;
    previous.disabled = !hasPrevious;
    next.disabled = !hasNext;
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
