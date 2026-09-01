const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicIcon.textContent = "❚❚";
      musicText.textContent = "Nossa música está tocando";
      musicBtn.classList.add("playing");
    } catch (e) {
      musicText.textContent = "Toque novamente para ouvir";
    }
  } else {
    music.pause();
    musicIcon.textContent = "▶";
    musicText.textContent = "Ouvir nossa música";
    musicBtn.classList.remove("playing");
  }
});

music.addEventListener("ended", () => {
  musicIcon.textContent = "▶";
  musicText.textContent = "Ouvir nossa música";
  musicBtn.classList.remove("playing");
});

// Pequenos corações subindo pelo fundo.
function createHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = Math.random() > .5 ? "♥" : "♡";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${12 + Math.random() * 18}px`;
  heart.style.animationDuration = `${7 + Math.random() * 6}s`;
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 14000);
}

setInterval(createHeart, 900);
