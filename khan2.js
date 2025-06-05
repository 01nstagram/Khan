let loadedPlugins = [];

console.clear();
const noop = () => {};
console.warn = console.error = window.debug = noop;

const splashScreen = document.createElement('splashScreen');
const painel = document.createElement('div');

class EventEmitter {
constructor() { this.events = {}; }
on(t, e) {
(Array.isArray(t) ? t : [t]).forEach(t => {
(this.events[t] = this.events[t] || []).push(e);
});
}
off(t, e) {
(Array.isArray(t) ? t : [t]).forEach(t => {
this.events[t] && (this.events[t] = this.events[t].filter(h => h !== e));
});
}
emit(t, ...e) {
this.events[t]?.forEach(h => h(...e));
}
}

const plppdo = new EventEmitter();

new MutationObserver(mutationsList =>
mutationsList.some(m => m.type === 'childList') && plppdo.emit('domChanged')
).observe(document.body, { childList: true, subtree: true });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const findAndClickBySelector = selector => document.querySelector(selector)?.click();

function sendToast(text, duration = 5000) {
Toastify({
text,
duration,
gravity: 'bottom',
position: 'center',
stopOnFocus: true,
style: { background: '#000000', borderRadius: '10px' }
}).showToast();
}

async function showSplashScreen() {
splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:white;font-family:Poppins,sans-serif;font-size:30px;text-align:center;";
splashScreen.innerHTML = '<span style="color:white;">KHAN</span><span style="color:#b84eff;"> DESTROYER BY 1NSTA</span>';
document.body.appendChild(splashScreen);
setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideSplashScreen() {
splashScreen.style.opacity = '0';
setTimeout(() => splashScreen.remove(), 1000);
}

async function loadScript(url, label) {
const response = await fetch(url);
const script = await response.text();
loadedPlugins.push(label);
eval(script);
}

async function loadCss(url) {
return new Promise(resolve => {
const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = url;
link.onload = resolve;
document.head.appendChild(link);
});
}

function criarPainel() {
painel.style.cssText = `
position:fixed;
top:20px;
right:20px;
background:rgba(10,10,10,0.95);
color:white;
padding:20px;
border-radius:20px;
box-shadow:0 0 20px #b84eff,0 0 40px #b84eff;
z-index:9999;
font-family:'Poppins',sans-serif;
backdrop-filter:blur(12px);
border:2px solid #b84eff;
max-width:280px;
`;

painel.innerHTML = `
<h2 style="
margin:0 0 15px 0;
font-size:24px;
text-align:center;
text-shadow:0 0 10px #b84eff;
">
<span style="color:white;">KHAN</span> 
<span style="color:#b84eff;">DESTROYER</span><br>
<span style="font-size:12px;color:#aaa;">by 1nstagram</span>
</h2>

<div style="margin-bottom:10px;">
<label style="display:block;margin-bottom:8px;">
<input type="checkbox" id="autoClickerToggle" checked> 🇻🇦 Auto Click
</label>
<label style="display:block;margin-bottom:8px;">
<input type="checkbox" id="videoExploitToggle" checked> 🇻🇦 Video Exploit
</label>
<label style="display:block;margin-bottom:8px;">
<input type="checkbox" id="answerBypassToggle" checked> 🇻🇦 Bypass Questão
</label>
<label style="display:block;">
<input type="checkbox" id="skipExerciseToggle" checked> 🇻🇦 Pular Exercício
</label>
</div>

<button id="fecharPainel" style="
margin-top:8px;
width:100%;
background:red;
color:white;
border:none;
padding:10px;
border-radius:10px;
cursor:pointer;
font-weight:bold;
transition:0.3s;
">
🧟‍♂️ Fechar Painel
</button>
`;

document.body.appendChild(painel);
document.getElementById('fecharPainel').onclick = () => painel.style.display = 'none';
}

function setupMain() {
const originalFetch = window.fetch;

window.fetch = async function(input, init) {
let body;
if (input instanceof Request) {
body = await input.clone().text();
} else if (init?.body) {
body = init.body;
}

const videoExploit = document.getElementById('videoExploitToggle')?.checked;  
const answerBypass = document.getElementById('answerBypassToggle')?.checked;  

if (videoExploit && body?.includes('"operationName":"updateUserVideoProgress"')) {  
  try {  
    let bodyObj = JSON.parse(body);  
    if (bodyObj.variables?.input) {  
      const durationSeconds = bodyObj.variables.input.durationSeconds;  
      bodyObj.variables.input.secondsWatched = durationSeconds;  
      bodyObj.variables.input.lastSecondWatched = durationSeconds;  
      body = JSON.stringify(bodyObj);  
        
      if (input instanceof Request) {  
        input = new Request(input, { body });  
      } else {  
        init.body = body;  
      }  
        
      sendToast("🎥｜Video exploitado!", 1000);  
    }  
  } catch (e) {}  
}  

const originalResponse = await originalFetch.apply(this, arguments);  

try {  
  const clonedResponse = originalResponse.clone();  
  const responseBody = await clonedResponse.text();  
  let responseObj = JSON.parse(responseBody);  
    
  if (answerBypass && responseObj?.data?.assessmentItem?.item?.itemData) {  
    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);  
      
    if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {  
      itemData.answerArea = {  
        calculator: false,  
        chi2Table: false,  
        periodicTable: false,  
        tTable: false,  
        zTable: false  
      };  
        
      itemData.question.content = "Dev by 1nsta  [[☃ radio 1]]";  
      itemData.question.widgets = {  
        "radio 1": {  
          type: "radio",  
          options: {  
            choices: [{ content: "💉", correct: true }]  
          }  
        }  
      };  
        
      responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);  
        
      return new Response(JSON.stringify(responseObj), {  
        status: originalResponse.status,  
        statusText: originalResponse.statusText,  
        headers: originalResponse.headers  
      });  
    }  
  }  
} catch (e) {}  
  
return originalResponse;

};

(async () => {
const selectors = [
'[data-testid="choice-icon__library-choice-icon"]',
'[data-testid="exercise-check-answer"]',
'[data-testid="exercise-next-question"]',
'._1udzurba',
'._awve9b'
];

window.khanwareDominates = true;  
  
while (window.khanwareDominates) {  
  const autoClick = document.getElementById('autoClickerToggle')?.checked;  
  const skipExercise = document.getElementById('skipExerciseToggle')?.checked;

  if (autoClick) {  
    let clicked = false;
    for (const selector of selectors) {  
      const el = document.querySelector(selector);
      if (el) {
        el.click();
        clicked = true;
        const texto = el.innerText || el.textContent;
        if (texto?.includes("Mostrar resumo")) {
          sendToast("💉｜Exercício finalizado!", 3000);
          if (skipExercise) {
            const nextBtn = document.querySelector('[data-testid="exercise-next-question"]') ||
                            document.querySelector('._1udzurba') ||
                            document.querySelector('._awve9b');
            nextBtn?.click();
            sendToast("⏭️｜Pulando pro próximo!", 2000);
          }
        }
      }
    }
    if (!clicked) console.log("👀｜Nada pra clicar...");
  }  
  await delay(1500);   
}

})();
}

if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
window.location.href = "https://pt.khanacademy.org/";
} else {
(async function init() {
await showSplashScreen();

await Promise.all([  
  loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin').then(()=>{  
    DarkReader.setFetchMethod(window.fetch);   
    DarkReader.enable();   
  }),  
  loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),  
  loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin'),  
  loadCss('https://fonts.googleapis.com/css2?family=Poppins&display=swap')  
]);  
  
await delay(2000);  
await hideSplashScreen();  
  
criarPainel();  
setupMain();  
sendToast("💉｜Khan Destroyer by 1nsta iniciado!");  
console.clear();

})();
}
