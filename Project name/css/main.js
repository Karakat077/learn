// Music player functionality
const music = document.getElementById('bgMusic');
const tracks = [
  { name: "Relaxing Study Music", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { name: "Focus Piano", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { name: "Concentration Mix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];
let currentTrack = 0;
let isPlaying = false;

// Initialize music player
music.src = tracks[currentTrack].url;
music.volume = 0.5;
updatePlayerUI();

function toggleMusic() {
  if (music.paused) {
    music.play()
      .then(() => {
        isPlaying = true;
        showToast("Music started: " + tracks[currentTrack].name);
      })
      .catch(error => {
        console.error("Audio playback failed:", error);
        showToast("Couldn't play music: " + error.message);
      });
  } else {
    music.pause();
    isPlaying = false;
    showToast("Music paused");
  }
  updatePlayerUI();
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  music.src = tracks[currentTrack].url;
  if (isPlaying) {
    music.play()
      .then(() => {
        showToast("Now playing: " + tracks[currentTrack].name);
      })
      .catch(error => {
        console.error("Audio playback failed:", error);
        showToast("Couldn't play next track");
      });
  }
  updatePlayerUI();
}

function changeVolume(change) {
  let newVolume = music.volume + change;
  if (newVolume < 0) newVolume = 0;
  if (newVolume > 1) newVolume = 1;
  music.volume = newVolume;
  showToast("Volume: " + Math.round(newVolume * 100) + "%");
}

function updatePlayerUI() {
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const nowPlaying = document.getElementById("nowPlaying");
  
  if (isPlaying) {
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline";
  } else {
    playIcon.style.display = "inline";
    pauseIcon.style.display = "none";
  }
  
  nowPlaying.textContent = "Now playing: " + tracks[currentTrack].name;
}

// Video player functionality
function loadVideo(url) {
  const player = document.getElementById("videoPlayer");
  player.src = url;
  player.setAttribute('title', 'Video Player - ' + url.split('/').pop());
}

// Random number generator
function generateNumber() {
  const number = Math.floor(Math.random() * 100) + 1;
  document.getElementById("toastMessage").textContent = `🎯 Your random number is: ${number}`;
  const toast = new bootstrap.Toast(document.getElementById("toastAlert"), { delay: 3000 });
  toast.show();
}

// Toast notification
function showToast(message) {
  document.getElementById("toastMessage").textContent = message;
  const toast = new bootstrap.Toast(document.getElementById("toastAlert"), { delay: 3000 });
  toast.show();
}

// Bot verification
let a = Math.floor(Math.random() * 5 + 1);
let b = Math.floor(Math.random() * 5 + 1);
const correct = a + b;
document.getElementById("mathQuestion").textContent = `What is ${a} + ${b}?`;

function checkMathAnswer() {
  const input = parseInt(document.getElementById("mathInput").value);
  const feedback = document.getElementById("mathFeedback");

  if (isNaN(input)) {
    feedback.textContent = "❌ Please enter a valid number";
    feedback.classList.remove("text-success");
    feedback.classList.add("text-danger");
    return;
  }

  if (input === correct) {
    feedback.textContent = "✅ Verified!";
    feedback.classList.remove("text-danger");
    feedback.classList.add("text-success");
    setTimeout(() => {
      document.getElementById("robotPopup").remove();
      document.getElementById("overlayBlocker").remove();
      document.getElementById("mainContent").style.filter = "none";
    }, 800);
  } else {
    feedback.textContent = "❌ Wrong answer. Try again.";
    feedback.classList.remove("text-success");
    feedback.classList.add("text-danger");
  }
}

// User authentication
document.addEventListener('DOMContentLoaded', function() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    document.getElementById("userWelcome").style.display = "inline-block";
    document.getElementById("logoutBtn").style.display = "inline-block";
    document.getElementById("loginLink").style.display = "none";
    document.getElementById("userNameText").textContent = currentUser.name;
  }
});

function logoutUser() {
  localStorage.removeItem("currentUser");
  showToast("You have been logged out");
  setTimeout(() => {
    location.reload();
  }, 1000);
}

// Focus management for accessibility
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('user-is-tabbing');
});

// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
  
  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});

// Service worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}