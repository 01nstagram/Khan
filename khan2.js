let loadedPlugins = [];

console.clear();
const noop = () => {};
console.warn = console.error = window.debug = noop;

const splash = document.createElement('splashScreen');
const painel = document.createElement('div');

const delay = ms => new Promise(r => setTimeout(r, ms));
const click = selector => document.querySelector(selector)?.click();

function toast(txt, tempo = 4000) {
  Toastify({
    text: txt,
    duration: tempo,
    gravity: "bottom",
    position: "center",
    style: { background: "#111", color: "white" }
  }).showToast();
}

async function splashShow() {
  splash.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:0.5s;user-select:none;color:white;font-family:sans-serif;font-size:35px;";
  splash.innerHTML = '<span style="color:white;">PAKISTAN</span><span style="color:red;"> HUNTERS V1</span>';
  document.body.appendChild(splash);
  setTimeout(() => splash.style.opacity = '1', 10);
}

async function splashHide() {
  splash.style.opacity = '0';
  setTimeout(() => splash.remove(), 800);
}

async function loadScript(url, label) {
  const res = await fetch(url);
  const scr = await res.text();
  loadedPlugins.push(label);
  eval(scr);
}

async function loadCss(url) {
  return new Promise(res => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = res;
    document.head.appendChild(link);
  });
}

function criarPainel() {
  painel.style.cssText = `
    position:fixed;
    top:20px;
    right:20px;
    background:#111;
    color:white;
    padding:20px;
    border-radius:10px;
    box-shadow:0 0 15px red;
    z-index:99999;
    font-family:sans-serif;
  `;
  painel.innerHTML = `
    <h3 style="margin:0 0 10px 0;">
      <span style="color:white;">PAKISTAN</span>
      <span style="color:red;"> HUNTERS V1</span>
    </h3>
    <label><input type="checkbox" id="autoClick"> Auto Click</label><br>
    <label><input type="checkbox" id="videoBypass"> Video Bypass</label><br>
    <label><input type="checkbox" id="questBypass"> Questão Bypass</label><br>
    <label><input type="checkbox" id="autoFarm"> Auto Farm XP</label><br>
    <label><input type="checkbox" id="speedHack"> Speed Hack</label><br>
    <label><input type="checkbox" id="nextLesson"> Auto Next Lesson</label><br>
    <label><input type="checkbox" id="muteSounds"> Mute Sons</label><br>
    <label><input type="checkbox" id="darkMode" checked> Dark Mode</label><br>
    <button id="closePainel" style="margin-top:10px;background:red;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">Fechar</button>
  `;
  document.body.appendChild(painel);

  document.getElementById('closePainel').onclick = () => painel.style.display = 'none';
}

function setup() {
  const originalFetch = window.fetch;

  window.fetch = async function(input, init) {
    let body;
    if (input instanceof Request) body = await input.clone().text();
    else if (init?.body) body = init.body;

    const videoBypass = document.getElementById('videoBypass')?.checked;
    const questBypass = document.getElementById('questBypass')?.checked;

    if (videoBypass && body?.includes('"operationName":"updateUserVideoProgress"')) {
      try {
        const obj = JSON.parse(body);
        if (obj.variables?.input) {
          const dur = obj.variables.input.durationSeconds;
          obj.variables.input.secondsWatched = dur;
          obj.variables.input.lastSecondWatched = dur;
          body = JSON.stringify(obj);
          if (input instanceof Request) input = new Request(input, { body });
          else init.body = body;
          toast("💉｜Video pulado kkk");
        }
      } catch (e) {}
    }

    const res = await originalFetch.apply(this, arguments);

    try {
      const clone = res.clone();
      const txt = await clone.text();
      const json = JSON.parse(txt);

      if (questBypass && json?.data?.assessmentItem?.item?.itemData) {
        const item = JSON.parse(json.data.assessmentItem.item.itemData);
        item.question.content = "PAKISTAN HUNTERS V1 [[☃ radio 1]]";
        item.question.widgets = {
          "radio 1": {
            type: "radio",
            options: { choices: [{ content: "💉", correct: true }] }
          }
        };
        json.data.assessmentItem.item.itemData = JSON.stringify(item);

        return new Response(JSON.stringify(json), {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers
        });
      }
    } catch (e) {}

    return res;
  };

  (async () => {
    const selectors = [
      `[data-testid="choice-icon__library-choice-icon"]`,
      `[data-testid="exercise-check-answer"]`,
      `[data-testid="exercise-next-question"]`,
      `._1udzurba`,
      `._awve9b`
    ];

    while (true) {
      const autoClick = document.getElementById('autoClick')?.checked;
      const autoFarm = document.getElementById('autoFarm')?.checked;
      const speedHack = document.getElementById('speedHack')?.checked;
      const nextLesson = document.getElementById('nextLesson')?.checked;
      const muteSounds = document.getElementById('muteSounds')?.checked;

      if (autoClick || autoFarm) {
        for (const selector of selectors) {
          click(selector);
          const ele = document.querySelector(`${selector} > div`);
          if (ele?.innerText === "Mostrar resumo") toast("✅｜Concluído mlk", 2000);
        }
      }

      if (nextLesson) click(`[data-testid="exercise-next-question"]`);
      if (speedHack) document.querySelector('video') && (document.querySelector('video').playbackRate = 100);
      if (muteSounds) document.querySelectorAll('audio, video').forEach(e => e.muted = true);

      await delay(1200);
    }
  })();
}

if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  window.location.href = "https://pt.khanacademy.org/";
} else {
  (async () => {
    await splashShow();
    await Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'DarkReader').then(() => {
        if (document.getElementById('darkMode')?.checked) {
          DarkReader.enable();
        }
      }),
      loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
      loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'Toastify')
    ]);
    await delay(1800);
    await splashHide();
    criarPainel();
    setup();
    toast("💉｜Pakistan Destroyer ligado fi!");
    console.clear();
  })();
}
