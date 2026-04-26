// 1. Fade-in on Scroll & Specific Section Triggers using Intersection Observer
const observerOptions = { threshold: 0.3 };
let chaosLoopActive = false; // Prevents the loop from firing multiple times

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');

            // Trigger Section 5 Assembly Line Animation
            if (entry.target.classList.contains('puzzle-section')) {
                entry.target.classList.add('trigger-anim');
            }

            // NEW: Trigger Section 4 Chaos Loop
            if (entry.target.classList.contains('chaos-section') && !chaosLoopActive) {
                chaosLoopActive = true;
                const elements = document.querySelectorAll('.chaos-overlay > div');

                const runChaosLoop = () => {
                    // Step 1: Hide all popups and reset their positions
                    elements.forEach(el => {
                        el.style.opacity = 0;
                        el.style.transform = 'translateY(30px) scale(0.9)';
                    });

                    // Step 2: Pop them in sequentially
                    elements.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.opacity = 1;
                            el.style.transform = 'translateY(0) scale(1)';
                        }, index * 300 + 400); // 300ms gap between each popup
                    });

                    // Step 3: Schedule the next loop (Wait for all to appear + 2 seconds)
                    setTimeout(runChaosLoop, (elements.length * 300) + 2500);
                };

                runChaosLoop(); // Start the infinite loop
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.fade').forEach(el => observer.observe(el));

// 2. SCROLLYTELLING: Dynamic Background Fades
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // --- INTRO: Glitch to IDE transition ---
    const glitchBg = document.getElementById('glitchBg');
    const ideBg = document.getElementById('ideBg');

    // Calculate how far down the user has scrolled in the first viewport
    let scrollProgress = scrollY / windowHeight;

    if (scrollProgress < 1.2) {
        glitchBg.style.opacity = Math.max(1 - scrollProgress, 0);
        ideBg.style.opacity = Math.min(scrollProgress, 0.4);
    } else {
        glitchBg.style.opacity = 0;
    }

    // --- SCROLLYTELLING BACKGROUND TRIGGERS ---
    const bgElements = document.querySelectorAll('[data-bg]');
    bgElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight * 0.6 && rect.bottom > windowHeight * 0.4) {
            const bgType = el.getAttribute('data-bg');

            // Hide all backgrounds except the intro glitch/IDE
            document.querySelectorAll('.fixed-bg:not(#glitchBg):not(#ideBg)').forEach(bg => bg.style.opacity = 0);

            const targetBg = document.querySelector(`.${bgType}-layer`);
            if (targetBg) {
                if (bgType === 'navy' || bgType === 'black') {
                    targetBg.style.opacity = 1;
                } else if (bgType.includes('iceberg')) {
                    targetBg.style.opacity = 0.35;
                } else {
                    targetBg.style.opacity = 0.3;
                }
            }
        }
    });

    // --- EXISTING LOGIC: SECTION 6 FULL ICEBERG ---
    const outro = document.querySelector('.outro');
    if (outro && outro.classList.contains('show')) {
        document.body.classList.add('outro-active');
        const icebergBg = document.querySelector('.iceberg-layer');
        if(icebergBg) icebergBg.style.opacity = 0.6;
    }
});

// --- INTERACTABLE TEMPERATURE LOGIC ---
const heatSlider = document.getElementById('heatSlider');
const tempOutput = document.getElementById('tempOutput');
const tempValueLabel = document.getElementById('tempValue');

const hallucinations = [
    "The field of engineering is built on logic.",
    "Engineering creates digital bridges between thoughts and systems.",
    "The architecture of the soul is written in C++ and neon light.",
    "Algorithms are just ghosts in the machine eating data-sandwiches.",
    "0x4F dreaming of recursive static 110111... logic is a blue circle."
];

if (heatSlider) {
    heatSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        const temp = (val / 50).toFixed(1);

        tempValueLabel.innerText = temp;

        if (val < 20) {
            tempOutput.innerText = hallucinations[0];
            tempOutput.style.color = "var(--text-color)";
        } else if (val < 40) {
            tempOutput.innerText = hallucinations[1];
            tempOutput.style.color = "#aaffaa";
        } else if (val < 60) {
            tempOutput.innerText = hallucinations[2];
            tempOutput.style.color = "#ffffaa";
        } else if (val < 80) {
            tempOutput.innerText = hallucinations[3];
            tempOutput.style.color = "#ffaaaa";
        } else {
            tempOutput.innerText = hallucinations[4];
            tempOutput.style.color = "var(--hallucination-color)";
        }
    });
}