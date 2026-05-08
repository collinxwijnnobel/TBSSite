document.querySelectorAll('.custom-audio-player').forEach(player => {
  const audio = player.querySelector('.audioElement');
  const btn = player.querySelector('.playPauseBtn');
  const progress = player.querySelector('.progressBar');
  const volume = player.querySelector('.volumeBar');
  const timeDisplay = player.querySelector('.timeDisplay');
  const muteBtn = player.querySelector('.muteBtn');
  
  let isDragging = false;
  let animationFrame;
  let lastVolume = 1; // Onthoudt het volume voor un-mute

  function updateFill(slider) {
    const val = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #003366 ${val}%, #ccc ${val}%)`;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function smoothUpdate() {
    if (!isDragging && audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progress.value = pct;
      updateFill(progress);
      timeDisplay.textContent = formatTime(audio.currentTime);
    }
    if (!audio.paused) {
      animationFrame = requestAnimationFrame(smoothUpdate);
    }
  }

  // Play/Pause
  btn.onclick = () => {
    if (audio.paused) {
      document.querySelectorAll('audio').forEach(a => {
        a.pause();
        a.parentElement.querySelector('.playPauseBtn').innerHTML = '&#128266;';
      });
      audio.play();
      btn.innerHTML = '&#10074;&#10074;';
      animationFrame = requestAnimationFrame(smoothUpdate);
    } else {
      audio.pause();
      btn.innerHTML = '&#128266;';
      cancelAnimationFrame(animationFrame);
    }
  };

  // Mute Logica
  muteBtn.onclick = () => {
    if (audio.volume > 0) {
      lastVolume = audio.volume; // Sla huidige stand op
      audio.volume = 0;
      volume.value = 0;
      muteBtn.innerHTML = '&#128263;'; // Mute icoon (luidspreker met kruis)
    } else {
      audio.volume = lastVolume;
      volume.value = lastVolume * 100;
      muteBtn.innerHTML = '&#128266;'; // Speaker icoon
    }
    updateFill(volume);
  };

  // Seeker
  progress.oninput = () => {
    isDragging = true;
    updateFill(progress);
    if (audio.duration) {
      timeDisplay.textContent = formatTime((progress.value / 100) * audio.duration);
    }
  };

  progress.onchange = () => {
    if (audio.duration) {
      audio.currentTime = (progress.value / 100) * audio.duration;
    }
    isDragging = false;
  };

  // Volume slider update
  volume.oninput = () => {
    audio.volume = volume.value / 100;
    updateFill(volume);
    // Update icoon als je de slider naar 0 schuift
    muteBtn.innerHTML = audio.volume === 0 ? '&#128263;' : '&#128266;';
  };

  audio.onended = () => {
    btn.innerHTML = '&#128266;';
    progress.value = 0;
    updateFill(progress);
  };

  updateFill(progress);
  updateFill(volume);
});