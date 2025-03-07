const canvas = document.getElementById("fallCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const heightInput = document.getElementById("heightInput");
const gravityInput = document.getElementById("gravityInput"); 
const summaryContainer = document.getElementById("summaryContainer");
const progressBar = document.getElementById("progress");

// Variables
let g = 9.81; // Gravedad inicial en m/s²
let pixelsPerMeter = 50; // 50 píxeles = 1 metro
let animationFrame;
let elapsedTime = 0; // Tiempo acumulado en segundos
let startTime = 0; // Marca de tiempo de inicio


let ball = {
    x: canvas.width / 2,
    y: 0,
    radius: 20,
    velocityY: 0,
    ground: canvas.height - 10, 
    initialHeight: 0,
};


function adjustCanvasSize() {
    const newHeight = ball.initialHeight * pixelsPerMeter + 100; 
    canvas.height = Math.max(newHeight, 500); 
    ball.ground = canvas.height - 10;
}


function resetBall() {
    adjustCanvasSize();
    ball.y = ball.radius;
    ball.velocityY = 0;
    elapsedTime = 0;
    summaryContainer.innerHTML = ""; 
    progressBar.style.width = "0%"; 
}


function update(deltaTime) {
    ball.velocityY += g * deltaTime * pixelsPerMeter;
    ball.y += ball.velocityY * deltaTime;

    if (ball.y + ball.radius >= ball.ground) {
        ball.y = ball.ground - ball.radius;
        elapsedTime = (performance.now() - startTime) / 1000; 
        showSummary();
        cancelAnimationFrame(animationFrame);
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function updatePPM() {
    let heightValue = parseFloat(heightInput.value);
    if (!isNaN(heightValue) && heightValue > 0) {
        // Ajustar PPM para que la altura máxima del canvas no supere los 500 píxeles
        const maxCanvasHeight = 500; 
        pixelsPerMeter = maxCanvasHeight / heightValue; 
        
        resetBall(); 
    } else {
        alert("Por favor, ingrese una altura válida.");
    }
}



function updateProgress() {
    const totalDistance = ball.initialHeight * pixelsPerMeter; // Distancia total en píxeles
    const currentDistance = ball.y; // Posición actual de la pelota en píxeles
    const progress = (currentDistance / totalDistance) * 100; // Porcentaje de progreso
    progressBar.style.width = `${progress}%`;
}

// Función principal de animación
function animate(timestamp) {
    if (!startTime) startTime = timestamp; // Iniciar el tiempo correctamente
    const deltaTime = (timestamp - startTime) / 1000 - elapsedTime; // Diferencia en segundos
    elapsedTime = (timestamp - startTime) / 1000; // Actualizar el tiempo total transcurrido
    
    update(deltaTime);
    draw();
    updateProgress(); // Actualizar la barra de progreso
    
    if (ball.y + ball.radius < ball.ground) {
        animationFrame = requestAnimationFrame(animate);
    }
}

// Muestra el resumen de la simulación
function showSummary() {
    const summaryData = {
        gravity: g.toFixed(2),
        initialHeight: ball.initialHeight.toFixed(2),
        fallTime: elapsedTime.toFixed(2),
        finalVelocity: Math.sqrt(2 * g * ball.initialHeight).toFixed(2),
        theoreticalTime: Math.sqrt((2 * ball.initialHeight) / g).toFixed(2),
        theoreticalVelocity: (g * Math.sqrt((2 * ball.initialHeight) / g)).toFixed(2),
    };

    summaryContainer.innerHTML = `
        <h2>Resumen de la simulación:</h2>
        <ul>
            <li><strong>Gravedad utilizada:</strong> ${summaryData.gravity} m/s²</li>
            <li><strong>Altura inicial:</strong> ${summaryData.initialHeight} metros</li>
            <li><strong>Tiempo de caída (simulado):</strong> ${summaryData.fallTime} segundos</li>
            <li><strong>Velocidad final (simulada):</strong> ${summaryData.finalVelocity} m/s</li>
            <li><strong>Tiempo de caída (teórico):</strong> ${summaryData.theoreticalTime} segundos</li>
            <li><strong>Velocidad final (teórica):</strong> ${summaryData.theoreticalVelocity} m/s</li>
        </ul>
    `;
}

// Evento para iniciar la simulación
startButton.addEventListener("click", function () {
    updatePPM();
    ball.initialHeight = parseFloat(heightInput.value);
    g = parseFloat(gravityInput.value); // Actualizar la gravedad con el valor del input
    
    resetBall();
    
    startTime = 0; // Resetear tiempo de inicio para nueva simulación
    requestAnimationFrame(animate);
});