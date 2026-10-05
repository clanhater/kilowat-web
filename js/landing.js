// Web/js/landing.js
document.addEventListener('DOMContentLoaded', () => {
    initElectricCanvas();
    initPowerSimulator();
    initTournamentCountdown();
});

function initElectricCanvas() {
    const canvas = document.getElementById('electric-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 1.5 + 0.8;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00f2ff';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00f2ff';
            ctx.fill();
        }
    }

    for (let i = 0; i < 30; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 242, 255, ${0.15 - dist / 700})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[i].x, particles[i].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

function initPowerSimulator() {
    let currentKwp = 1482.000000000;
    const powerIndicator = document.getElementById('live-power-indicator');
    if (!powerIndicator) return;
    setInterval(() => {
        currentKwp += 0.000000045;
        powerIndicator.innerText = `Red Eléctrica: ${currentKwp.toFixed(9)} KWP`;
    }, 1000);
}

// Conteo regresivo del Torneo sincronizado con Supabase
async function initTournamentCountdown() {
    const timerEl = document.getElementById('tournament-countdown');
    if (!timerEl) return;

    let remainingSeconds = 154800; // 1d 19h

    if (typeof supabaseClient !== 'undefined') {
        try {
            const { data } = await supabaseClient.rpc('get_power_competition_leaderboard');
            if (data && data.remaining_seconds && data.remaining_seconds > 0) {
                remainingSeconds = Number(data.remaining_seconds);
            }
        } catch (e) {
            console.log("[Torneo Timer] Usando tiempo local");
        }
    }

    function update() {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            const d = Math.floor(remainingSeconds / 86400);
            const h = Math.floor((remainingSeconds % 86400) / 3600);
            const m = Math.floor((remainingSeconds % 3600) / 60);
            const s = remainingSeconds % 60;

            timerEl.innerText = `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
        } else {
            timerEl.innerText = "¡Evento Finalizado!";
        }
    }
    update();
    setInterval(update, 1000);
}

// Asigna los enlaces directos de descarga configurados en config.js
document.addEventListener('DOMContentLoaded', () => {
    setupDownloadButtons();
});

function setupDownloadButtons() {
    const apkBtn = document.getElementById('btn-download-apk');
    const winBtn = document.getElementById('btn-download-windows');
    const mobileApkBtn = document.getElementById('btn-download-apk-mobile');

    if (apkBtn && CONFIG.DOWNLOAD_APK_URL) {
        apkBtn.href = CONFIG.DOWNLOAD_APK_URL;
    }
    if (winBtn && CONFIG.DOWNLOAD_WINDOWS_URL) {
        winBtn.href = CONFIG.DOWNLOAD_WINDOWS_URL;
    }
    if (mobileApkBtn && CONFIG.DOWNLOAD_APK_URL) {
        mobileApkBtn.href = CONFIG.DOWNLOAD_APK_URL;
    }
}