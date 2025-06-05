<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron&display=swap');

#painelPak {
  position: fixed;
  top: 50px;
  right: 50px;
  background: #121212;
  color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 30px #b84eff, 0 0 10px #000;
  z-index: 99999;
  font-family: 'Orbitron', sans-serif;
  width: 300px;
}

#painelPak h3 {
  margin-top: 0;
  text-align: center;
  color: #b84eff;
  font-size: 20px;
}

#painelPak label {
  display: block;
  margin: 10px 0;
  cursor: pointer;
}

.pak-btn {
  background: #b84eff;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 5px;
  transition: background 0.3s;
}

.pak-btn:hover {
  background: #8f00ff;
}

#painelPak .top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

#painelPak.minimizado {
  height: 40px;
  overflow: hidden;
}

</style>

<div id="painelPak">
  <div class="top-bar">
    <button id="minBtn" class="pak-btn">—</button>
    <button id="fecharBtn" class="pak-btn">X</button>
  </div>
  <h3>KHAN DESTROYER</h3>
  <label><input type="checkbox" id="autoClickerToggle" checked> Auto Click</label>
  <label><input type="checkbox" id="videoExploitToggle" checked> Bypass Vídeo</label>
  <label><input type="checkbox" id="answerBypassToggle" checked> Bypass Questão</label>
  <label><input type="checkbox" id="autoNextToggle" checked> Auto Next</label>
  <label><input type="checkbox" id="darkModeToggle" checked> Dark Mode</label>
  <label><input type="checkbox" id="muteToggle" checked> Mute</label>
</div>

<script>
// painel brabo
const painel = document.getElementById('painelPak')
document.getElementById('fecharBtn').onclick = () => painel.remove()
document.getElementById('minBtn').onclick = () => {
  painel.classList.toggle('minimizado')
}

// funções das checkbox
const autoClickerToggle = document.getElementById('autoClickerToggle')
const videoExploitToggle = document.getElementById('videoExploitToggle')
const answerBypassToggle = document.getElementById('answerBypassToggle')
const autoNextToggle = document.getElementById('autoNextToggle')
const darkModeToggle = document.getElementById('darkModeToggle')
const muteToggle = document.getElementById('muteToggle')

// Auto Click
setInterval(() => {
  if (autoClickerToggle.checked) {
    document.querySelector('video')?.click()
    document.querySelector('button.next-button')?.click()
  }
}, 500)

// Bypass Vídeo
setInterval(() => {
  if (videoExploitToggle.checked) {
    const vid = document.querySelector('video')
    if (vid) {
      vid.playbackRate = 10
      vid.currentTime = vid.duration - 0.1
    }
  }
}, 1000)

// Bypass Questão
setInterval(() => {
  if (answerBypassToggle.checked) {
    document.querySelectorAll('input[type=radio]').forEach(e => e.checked = true)
  }
}, 1000)

// Auto Next
setInterval(() => {
  if (autoNextToggle.checked) {
    document.querySelector('button.next-button')?.click()
  }
}, 2000)

// Dark Mode
setInterval(() => {
  if (darkModeToggle.checked) {
    document.body.style.background = '#121212'
    document.body.style.color = '#fff'
  } else {
    document.body.style.background = ''
    document.body.style.color = ''
  }
}, 1000)

// Mute
setInterval(() => {
  if (muteToggle.checked) {
    const vid = document.querySelector('video')
    if (vid) vid.muted = true
  }
}, 500)

</script>
