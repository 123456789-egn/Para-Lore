const canvas = document.getElementById('universeCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Estrellas de fondo
const stars = [];
for (let i = 0; i < 500; i++) {
    stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005
    });
}

// Nebulosas de colores suaves
const nebulas = [
    { x: width * 0.2, y: height * 0.3, radius: 220, color: 'rgba(255, 117, 140, 0.12)' },
    { x: width * 0.8, y: height * 0.7, radius: 260, color: 'rgba(147, 112, 219, 0.12)' },
    { x: width * 0.5, y: height * 0.5, radius: 180, color: 'rgba(255, 182, 193, 0.08)' }
];

let journeyState = 'idle'; // idle, travelling, arrived
let progress = 0;

const saturn = { x: width * 0.28, y: height * 0.35, radius: 38 };
const moon = { x: width * 0.78, y: height * 0.65, radius: 48 };

// Mensajes espaciados durante el viaje
const journeyMessages = [
    "Iniciando travesía por nuestro universo mi amada Lore... 🤭🙈",
    "Contemplando la inmensidad de los cosmos juntos...🤭❤️",
    "Pasando junto a los mágicos anillos de Saturno... ❤️🪐❤️",
    "Navegando hacia donde brillan nuestras estrellas... ⭐❤️",
    "Aterrizando en la superficie lunar...Su lugar favorito❤️🤭🙈🌙"
];

const bgAudio = document.getElementById('bgAudio');

// Habilitar audio con la primera interacción
window.addEventListener('click', () => {
    if (bgAudio.paused && journeyState !== 'arrived') {
        bgAudio.play().catch(e => console.log("Autoplay esperando interacción"));
    }
}, { once: true });

// Botón de Inicio
document.getElementById('startJourneyBtn').addEventListener('click', () => {
    bgAudio.currentTime = 0;
    bgAudio.play().catch(e => console.log(e));
    startJourney();
});

function startJourney() {
    document.getElementById('intro-container').classList.add('hidden');
    document.getElementById('success-message').classList.add('hidden');
    
    journeyState = 'travelling';
    progress = 0;
    
    if (bgAudio.paused) {
        bgAudio.currentTime = 0;
        bgAudio.play().catch(e => console.log(e));
    }

    showJourneyTexts();
}

function showJourneyTexts() {
    const textEl = document.getElementById('journey-text');
    let delay = 1000;
    
    journeyMessages.forEach((msg, index) => {
        setTimeout(() => {
            if (journeyState === 'travelling') {
                textEl.innerText = msg;
                textEl.style.opacity = '1';
                setTimeout(() => {
                    textEl.style.opacity = '0';
                }, 3800);
            }
        }, delay + (index * 4000));
    });
}

// Dibujar Nebulosas
function drawNebulas() {
    nebulas.forEach(n => {
        let grad = ctx.createRadialGradient(n.x, n.y, 10, n.x, n.y, n.radius);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Dibujar Saturno
function drawSaturn() {
    ctx.save();
    ctx.translate(saturn.x, saturn.y);
    
    ctx.beginPath();
    ctx.arc(0, 0, saturn.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e5be85';
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(229, 190, 133, 0.4)';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 0, saturn.radius * 2.3, saturn.radius * 0.75, Math.PI / 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(235, 205, 160, 0.7)';
    ctx.lineWidth = 7;
    ctx.stroke();

    ctx.restore();
}

// Dibujar la Luna
function drawMoon() {
    ctx.save();
    ctx.translate(moon.x, moon.y);

    ctx.beginPath();
    ctx.arc(0, 0, moon.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e0e0e0';
    ctx.shadowBlur = 25;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();

    ctx.fillStyle = '#bfbfbf';
    ctx.beginPath();
    ctx.arc(-14, -10, 7, 0, Math.PI * 2);
    ctx.arc(14, 12, 10, 0, Math.PI * 2);
    ctx.arc(5, -16, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// Dibujar la Nave Espacial y sincronizar el aterrizaje real
function drawSpaceship() {
    let currentX, currentY;

    if (journeyState === 'idle') {
        currentX = width / 2;
        currentY = height + 50;
    } else {
        if (journeyState === 'travelling') {
            progress += 0.0007; // Velocidad pausada y romántica
            if (progress >= 1) {
                progress = 1;
                journeyState = 'arrived';
                // Mostrar la pregunta EXACTAMENTE cuando la nave aterriza en la luna
                document.getElementById('proposal-container').classList.remove('hidden');
            }
        }

        let p0 = { x: width / 2, y: height + 50 };
        let p1 = { x: saturn.x + 40, y: saturn.y - 90 };
        let p2 = { x: moon.x, y: moon.y - moon.radius - 18 };

        let u = 1 - progress;
        currentX = u * u * p0.x + 2 * u * progress * p1.x + progress * progress * p2.x;
        currentY = u * u * p0.y + 2 * u * progress * p1.y + progress * progress * p2.y;
    }

    ctx.save();
    ctx.translate(currentX, currentY);

    if (journeyState === 'travelling') {
        ctx.beginPath();
        ctx.moveTo(-5, 14);
        ctx.lineTo(5, 14);
        ctx.lineTo(0, 26 + Math.random() * 8);
        ctx.fillStyle = '#ff9900';
        ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(12, 14);
    ctx.lineTo(-12, 14);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff758c';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, -2, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ff758c';
    ctx.fill();

    ctx.restore();
}

// Bucle de animación
function animate() {
    ctx.fillStyle = '#030308';
    ctx.fillRect(0, 0, width, height);

    drawNebulas();

    stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
        ctx.fill();
    });

    drawSaturn();
    drawMoon();
    drawSpaceship();

    requestAnimationFrame(animate);
}

animate();

// --- Lógica del Botón Pícaro ("No") ---
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');

const ariscoPhrases = [
    " Este no mi bonita ❤️", // <--- ¡Aquí faltaba la coma abajo!
    "Este no tontita 😅😜",
    "No 🙈",
    "¡Ni lo intente, tontita!😅🤭",
    "¡Presiona el de la izquierda!😅",
    "¡Por ahí no es, muchachita traviesa!🤭",
    "¡Ese botón no existe!🤭",
    "¡Pruebe el otro botón!🤭",
    "¡Casi me atrapa! 🙈🤭",
    "¡El amor está a la izquierda! 🙈💖"
];

noBtn.addEventListener('mouseover', () => moveNoButton());
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

function moveNoButton() {
    const x = (Math.random() - 0.5) * 260;
    const y = (Math.random() - 0.5) * 160;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
    
    const randomPhrase = ariscoPhrases[Math.floor(Math.random() * ariscoPhrases.length)];
    noBtn.innerText = randomPhrase;
}

// --- Lógica del Botón Sí ---
yesBtn.addEventListener('click', () => {
    document.getElementById('proposal-container').classList.add('hidden');
    document.getElementById('success-message').classList.remove('hidden');

    confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff758c', '#ff7eb3', '#ffffff', '#ffb6c1']
    });

    let duration = 3.5 * 1000;
    let end = Date.now() + duration;
    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
});

// Botón de Volver a Viajar
document.getElementById('restartBtn').addEventListener('click', () => {
    bgAudio.pause();
    bgAudio.currentTime = 0;
    bgAudio.play().catch(e => console.log(e));
    startJourney();
});