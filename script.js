// =====================================================
// 🥷 FRUIT NINJA AI
// AI HAND CONTROLLED GAME
// =====================================================


// =====================================================
// HTML ELEMENTS
// =====================================================

const video =
    document.getElementById("video");

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const statusText =
    document.getElementById("status");

const aiStatus =
    document.getElementById("aiStatus");

const scoreElement =
    document.getElementById("score");

const comboElement =
    document.getElementById("combo");

const livesElement =
    document.getElementById("lives");

const startScreen =
    document.getElementById("startScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const finalScore =
    document.getElementById("finalScore");

const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");


// =====================================================
// CANVAS
// =====================================================

canvas.width = 900;
canvas.height = 600;


// =====================================================
// GAME VARIABLES
// =====================================================

let score = 0;

let lives = 3;

let combo = 0;

let gameRunning = false;

let gameOver = false;

let fruits = [];

let particles = [];

let slashTrail = [];

let spawnTimer = 0;

let lastTime = 0;

const GRAVITY = 650;

const SPAWN_TIME = 0.75;


// =====================================================
// HAND VARIABLES
// =====================================================

let handDetected = false;

let currentHandX =
    canvas.width / 2;

let currentHandY =
    canvas.height / 2;

let previousHandX = null;

let previousHandY = null;

let handSpeed = 0;


// =====================================================
// MEDIAPIPE HANDS
// =====================================================

const hands = new Hands({

    locateFile: (file) => {

        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

    }

});


hands.setOptions({

    maxNumHands: 1,

    modelComplexity: 1,

    minDetectionConfidence: 0.5,

    minTrackingConfidence: 0.5

});


// =====================================================
// HAND RESULTS
// =====================================================

hands.onResults((results) => {

    if (
        results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0
    ) {

        const landmarks =
            results.multiHandLandmarks[0];

        const indexFinger =
            landmarks[8];


        // Convert MediaPipe coordinates
        // to canvas coordinates

        currentHandX =
            (1 - indexFinger.x) *
            canvas.width;

        currentHandY =
            indexFinger.y *
            canvas.height;


        handDetected = true;


        statusText.textContent =
            "⚔️ HAND DETECTED — SLASH!";

        aiStatus.textContent =
            "HAND DETECTED";


        // ---------------------------------------------
        // Movement
        // ---------------------------------------------

        if (
            previousHandX !== null &&
            gameRunning
        ) {

            const dx =
                currentHandX -
                previousHandX;

            const dy =
                currentHandY -
                previousHandY;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            handSpeed =
                distance;


            // -----------------------------------------
            // Slash
            // -----------------------------------------

            if (distance > 12) {

                createSlash(
                    previousHandX,
                    previousHandY,
                    currentHandX,
                    currentHandY
                );


                checkFruitCut(
                    previousHandX,
                    previousHandY,
                    currentHandX,
                    currentHandY
                );

            }

        }


        previousHandX =
            currentHandX;

        previousHandY =
            currentHandY;


    }

    else {

        handDetected = false;

        previousHandX = null;

        previousHandY = null;

        handSpeed = 0;


        statusText.textContent =
            "👋 SHOW YOUR HAND";

        aiStatus.textContent =
            "SEARCHING HAND...";

    }

});


// =====================================================
// CAMERA
// =====================================================

const camera =
    new Camera(video, {

        onFrame: async () => {

            await hands.send({
                image: video
            });

        },

        width: 640,

        height: 480

    });


camera.start();


// =====================================================
// FRUIT TYPES
// =====================================================

const fruitTypes = [

    {
        emoji: "🍎",
        color: "#ef4444"
    },

    {
        emoji: "🍊",
        color: "#f97316"
    },

    {
        emoji: "🍋",
        color: "#facc15"
    },

    {
        emoji: "🥝",
        color: "#84cc16"
    },

    {
        emoji: "🍉",
        color: "#16a34a"
    },

    {
        emoji: "🍇",
        color: "#8b5cf6"
    }

];


// =====================================================
// CREATE FRUIT
// =====================================================

function createFruit() {

    const type =
        fruitTypes[
            Math.floor(
                Math.random() *
                fruitTypes.length
            )
        ];


    fruits.push({

        x:
            80 +
            Math.random() *
            (canvas.width - 160),

        y:
            canvas.height + 50,

        radius: 32,

        velocityX:
            (Math.random() - 0.5) *
            180,

        velocityY:
            -(700 +
                Math.random() *
                180),

        color:
            type.color,

        emoji:
            type.emoji,

        cut: false,

        isBomb: false

    });

}


// =====================================================
// CREATE BOMB
// =====================================================

function createBomb() {

    fruits.push({

        x:
            80 +
            Math.random() *
            (canvas.width - 160),

        y:
            canvas.height + 50,

        radius: 34,

        velocityX:
            (Math.random() - 0.5) *
            150,

        velocityY:
            -(700 +
                Math.random() *
                150),

        color: "#111827",

        emoji: "💣",

        cut: false,

        isBomb: true

    });

}


// =====================================================
// CHECK FRUIT CUT
// =====================================================

function checkFruitCut(
    x1,
    y1,
    x2,
    y2
) {

    fruits.forEach(
        (fruit) => {

            if (fruit.cut) {
                return;
            }


            const distance =
                distanceFromLine(
                    fruit.x,
                    fruit.y,
                    x1,
                    y1,
                    x2,
                    y2
                );


            if (
                distance <
                fruit.radius + 20
            ) {

                fruit.cut = true;


                // -------------------------------------
                // BOMB
                // -------------------------------------

                if (
                    fruit.isBomb
                ) {

                    lives--;

                    combo = 0;

                    createExplosion(
                        fruit.x,
                        fruit.y
                    );


                    if (lives <= 0) {

                        endGame();

                    }

                }


                // -------------------------------------
                // FRUIT
                // -------------------------------------

                else {

                    score +=
                        10 +
                        combo * 2;

                    combo++;

                    createFruitParticles(
                        fruit.x,
                        fruit.y,
                        fruit.color
                    );

                }


                updateHUD();

            }

        }
    );

}


// =====================================================
// DISTANCE FROM LINE
// =====================================================

function distanceFromLine(
    px,
    py,
    x1,
    y1,
    x2,
    y2
) {

    const dx =
        x2 - x1;

    const dy =
        y2 - y1;


    if (
        dx === 0 &&
        dy === 0
    ) {

        return Math.sqrt(
            (px - x1) ** 2 +
            (py - y1) ** 2
        );

    }


    const t =
        Math.max(
            0,
            Math.min(
                1,
                (
                    (px - x1) * dx +
                    (py - y1) * dy
                ) /
                (dx * dx + dy * dy)
            )
        );


    const closestX =
        x1 + t * dx;

    const closestY =
        y1 + t * dy;


    return Math.sqrt(
        (px - closestX) ** 2 +
        (py - closestY) ** 2
    );

}


// =====================================================
// SLASH
// =====================================================

function createSlash(
    x1,
    y1,
    x2,
    y2
) {

    slashTrail.push({

        x1,
        y1,

        x2,
        y2,

        life: 1

    });

}


// =====================================================
// FRUIT PARTICLES
// =====================================================

function createFruitParticles(
    x,
    y,
    color
) {

    for (
        let i = 0;
        i < 25;
        i++
    ) {

        particles.push({

            x,

            y,

            velocityX:
                (Math.random() - 0.5) *
                500,

            velocityY:
                (Math.random() - 0.5) *
                500,

            size:
                3 +
                Math.random() * 6,

            color,

            life: 1

        });

    }

}


// =====================================================
// EXPLOSION
// =====================================================

function createExplosion(
    x,
    y
) {

    for (
        let i = 0;
        i < 40;
        i++
    ) {

        particles.push({

            x,

            y,

            velocityX:
                (Math.random() - 0.5) *
                700,

            velocityY:
                (Math.random() - 0.5) *
                700,

            size:
                4 +
                Math.random() * 8,

            color:
                Math.random() > 0.5
                    ? "#f97316"
                    : "#facc15",

            life: 1

        });

    }

}


// =====================================================
// UPDATE
// =====================================================

function updateGame(deltaTime) {

    if (!gameRunning) {
        return;
    }


    // ---------------------------------------------
    // Spawn
    // ---------------------------------------------

    spawnTimer +=
        deltaTime;


    if (
        spawnTimer >=
        SPAWN_TIME
    ) {

        createFruit();


        if (
            Math.random() < 0.12
        ) {

            createBomb();

        }


        spawnTimer = 0;

    }


    // ---------------------------------------------
    // Fruits
    // ---------------------------------------------

    fruits.forEach(
        (fruit) => {

            if (fruit.cut) {
                return;
            }


            fruit.velocityY +=
                GRAVITY *
                deltaTime;


            fruit.x +=
                fruit.velocityX *
                deltaTime;


            fruit.y +=
                fruit.velocityY *
                deltaTime;

        }
    );


    // ---------------------------------------------
    // Remove fruits
    // ---------------------------------------------

    fruits =
        fruits.filter(
            (fruit) => {

                if (
                    fruit.y <
                    canvas.height + 100
                ) {

                    return true;

                }


                if (
                    !fruit.cut &&
                    !fruit.isBomb
                ) {

                    lives--;

                    combo = 0;

                    updateHUD();


                    if (
                        lives <= 0
                    ) {

                        endGame();

                    }

                }


                return false;

            }
        );


    // ---------------------------------------------
    // Particles
    // ---------------------------------------------

    particles.forEach(
        (particle) => {

            particle.x +=
                particle.velocityX *
                deltaTime;

            particle.y +=
                particle.velocityY *
                deltaTime;

            particle.velocityY +=
                600 *
                deltaTime;

            particle.life -=
                deltaTime * 2;

        }
    );


    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );


    // ---------------------------------------------
    // Slash
    // ---------------------------------------------

    slashTrail.forEach(
        (slash) => {

            slash.life -=
                deltaTime * 5;

        }
    );


    slashTrail =
        slashTrail.filter(
            slash =>
                slash.life > 0
        );

}


// =====================================================
// DRAW BACKGROUND
// =====================================================

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );


    gradient.addColorStop(
        0,
        "#172554"
    );

    gradient.addColorStop(
        0.5,
        "#0f172a"
    );

    gradient.addColorStop(
        1,
        "#020617"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Neon circles

    ctx.globalAlpha =
        0.12;


    ctx.fillStyle =
        "#22d3ee";


    ctx.beginPath();

    ctx.arc(
        150,
        150,
        120,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#a855f7";


    ctx.beginPath();

    ctx.arc(
        750,
        450,
        150,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.globalAlpha = 1;

}


// =====================================================
// DRAW FRUITS
// =====================================================

function drawFruits() {

    fruits.forEach(
        (fruit) => {

            if (fruit.cut) {
                return;
            }


            ctx.save();


            ctx.translate(
                fruit.x,
                fruit.y
            );


            // Glow

            ctx.shadowBlur = 25;

            ctx.shadowColor =
                fruit.color;


            ctx.font =
                "55px Arial";


            ctx.textAlign =
                "center";


            ctx.textBaseline =
                "middle";


            ctx.fillText(
                fruit.emoji,
                0,
                0
            );


            ctx.restore();

        }
    );

}


// =====================================================
// DRAW PARTICLES
// =====================================================

function drawParticles() {

    particles.forEach(
        (particle) => {

            ctx.globalAlpha =
                particle.life;

            ctx.fillStyle =
                particle.color;


            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );


    ctx.globalAlpha = 1;

}


// =====================================================
// DRAW SLASH
// =====================================================

function drawSlash() {

    slashTrail.forEach(
        (slash) => {

            ctx.save();


            ctx.globalAlpha =
                slash.life;


            ctx.strokeStyle =
                "#ffffff";


            ctx.shadowBlur =
                20;


            ctx.shadowColor =
                "#22d3ee";


            ctx.lineWidth = 8;


            ctx.lineCap =
                "round";


            ctx.beginPath();


            ctx.moveTo(
                slash.x1,
                slash.y1
            );


            ctx.lineTo(
                slash.x2,
                slash.y2
            );


            ctx.stroke();


            ctx.restore();

        }
    );

}


// =====================================================
// DRAW HAND CURSOR
// =====================================================

function drawHandCursor() {

    if (!handDetected) {
        return;
    }


    ctx.save();


    ctx.shadowBlur = 20;

    ctx.shadowColor =
        "#22d3ee";


    ctx.beginPath();

    ctx.arc(
        currentHandX,
        currentHandY,
        12,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#ffffff";


    ctx.fill();


    ctx.strokeStyle =
        "#22d3ee";


    ctx.lineWidth = 4;


    ctx.stroke();


    ctx.restore();

}


// =====================================================
// DRAW GAME
// =====================================================

function drawGame() {

    drawBackground();

    drawFruits();

    drawParticles();

    drawSlash();

    drawHandCursor();

}


// =====================================================
// HUD
// =====================================================

function updateHUD() {

    scoreElement.textContent =
        score;


    comboElement.textContent =
        "x" + combo;


    livesElement.textContent =
        "❤️".repeat(
            Math.max(
                lives,
                0
            )
        );

}


// =====================================================
// START GAME
// =====================================================

function startGame() {

    score = 0;

    lives = 3;

    combo = 0;

    fruits = [];

    particles = [];

    slashTrail = [];

    spawnTimer = 0;

    gameOver = false;

    gameRunning = true;


    startScreen.classList.add(
        "hidden"
    );


    gameOverScreen.classList.add(
        "hidden"
    );


    updateHUD();


    statusText.textContent =
        "⚔️ MOVE YOUR HAND TO SLASH!";

}


// =====================================================
// GAME OVER
// =====================================================

function endGame() {

    gameRunning = false;

    gameOver = true;


    finalScore.textContent =
        score;


    gameOverScreen.classList.remove(
        "hidden"
    );


    statusText.textContent =
        "💀 GAME OVER";

}


// =====================================================
// BUTTONS
// =====================================================

startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


// =====================================================
// GAME LOOP
// =====================================================

function gameLoop(timestamp) {

    if (!lastTime) {

        lastTime =
            timestamp;

    }


    let deltaTime =
        (
            timestamp -
            lastTime
        ) / 1000;


    deltaTime =
        Math.min(
            deltaTime,
            0.03
        );


    lastTime =
        timestamp;


    updateGame(
        deltaTime
    );


    drawGame();


    requestAnimationFrame(
        gameLoop
    );

}


// =====================================================
// START RENDER LOOP
// =====================================================

requestAnimationFrame(
    gameLoop
);


// =====================================================
// INITIAL HUD
// =====================================================

updateHUD();