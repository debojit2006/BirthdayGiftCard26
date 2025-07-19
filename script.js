document.addEventListener('DOMContentLoaded', () => {
    // --- General Elements ---
    const bgMusic = document.getElementById('bg-music');
    const welcomeScene = document.getElementById('welcome-scene');
    const letterModal = document.getElementById('letter-modal');
    const constellationScene = document.getElementById('constellation-scene');

    // --- Button Game Elements & Logic ---
    const runawayBtn = document.getElementById('runaway-btn');
    let clicksNeeded = Math.floor(Math.random() * 5) + 5;
    runawayBtn.textContent = `Catch me!`;

    function moveButton() {
        const w = window.innerWidth, h = window.innerHeight;
        runawayBtn.style.top = `${Math.random() * (h - 150)}px`;
        runawayBtn.style.left = `${Math.random() * (w - 200)}px`;
    }

    runawayBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.volume = 0.2;
            bgMusic.play().catch(() => {});
        }
        clicksNeeded--;
        if (clicksNeeded > 0) {
            moveButton();
        } else {
            runawayBtn.textContent = '✅ Got it!';
            runawayBtn.style.pointerEvents = 'none';
            setTimeout(() => {
                bgMusic.pause();
                letterModal.style.display = 'block';
            }, 500);
        }
    });

    // --- Letter Modal Logic ---
    const closeModalBtn = document.querySelector('.close-btn');
    closeModalBtn.addEventListener('click', () => {
        letterModal.style.display = 'none';
        welcomeScene.classList.remove('active');
        constellationScene.classList.add('active');
        bgMusic.play();
        initConstellationGame(); // Start the next game
    });

    // --- Constellation Game Logic ---
    const starCanvas = document.getElementById('star-canvas');
    const revealWord = document.getElementById('reveal-word');
    const instructionText = document.getElementById('instruction-text');
    const starPoints = [{x: 20, y: 40}, {x: 40, y: 70}, {x: 65, y: 60}, {x: 80, y: 30}];
    let currentStarIndex = 0;

    function initConstellationGame() {
        starPoints.forEach((point, i) => {
            const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            star.setAttribute('cx', `${point.x}%`);
            star.setAttribute('cy', `${point.y}%`);
            star.setAttribute('r', '5');
            star.setAttribute('class', 'interactive-star');
            star.dataset.index = i;
            
            star.addEventListener('click', handleStarClick);
            starCanvas.appendChild(star);
        });
    }

    function handleStarClick(event) {
        const clickedIndex = parseInt(event.target.dataset.index);

        if (clickedIndex === currentStarIndex) {
            const star = event.target;
            star.classList.remove('interactive-star');
            star.classList.add('connected-star');
            star.style.pointerEvents = 'none';

            if (currentStarIndex > 0) {
                const prevPoint = starPoints[currentStarIndex - 1];
                const currentPoint = starPoints[currentStarIndex];
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', `${prevPoint.x}%`);
                line.setAttribute('y1', `${prevPoint.y}%`);
                line.setAttribute('x2', `${currentPoint.x}%`);
                line.setAttribute('y2', `${currentPoint.y}%`);
                line.setAttribute('class', 'constellation-line');
                starCanvas.insertBefore(line, starCanvas.firstChild);
            }

            currentStarIndex++;

            if (currentStarIndex === starPoints.length) {
                // Game Won
                instructionText.style.opacity = '0';
                revealWord.style.opacity = '1';
            }
        }
    }
});
