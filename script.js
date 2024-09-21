let timer;
let seconds = 0;
let isRunning = false;
let laps = [];
let countdownTimer;
let chart;

// DOM Elements
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const themeToggle = document.getElementById('themeToggle');
const lapsList = document.getElementById('lapsList');
const customTimeInput = document.getElementById('customTime');
const startCustomTimeBtn = document.getElementById('startCustomTime');
const elapsedTimeGraph = document.getElementById('elapsedTimeGraph').getContext('2d');

// Stopwatch Functions
function formatTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
}

function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            seconds++;
            display.textContent = formatTime(seconds);
            updateGraph();
        }, 1000);
    }
}

function stopStopwatch() {
    clearInterval(timer);
    isRunning = false;
}

function resetStopwatch() {
    clearInterval(timer);
    isRunning = false;
    seconds = 0;
    display.textContent = '00:00:00';
    laps = [];
    lapsList.innerHTML = '';
    resetGraph();
}

function recordLap() {
    const lapTime = formatTime(seconds);
    laps.push(lapTime);
    const lapItem = document.createElement('li');
    lapItem.textContent = `Lap ${laps.length}: ${lapTime}`;
    lapsList.appendChild(lapItem);
}

// Theme Toggle Function
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    themeToggle.textContent = document.body.classList.contains('dark') ? 'Switch to Light Theme' : 'Switch to Dark Theme';
});

// Start, Stop, Reset, Lap event listeners
startBtn.addEventListener('click', startStopwatch);
stopBtn.addEventListener('click', stopStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
        case 's':
            startStopwatch();
            break;
        case 'x':
            stopStopwatch();
            break;
        case 'r':
            resetStopwatch();
            break;
        case 'l':
            recordLap();
            break;
    }
});

// Custom Countdown Timer
startCustomTimeBtn.addEventListener('click', () => {
    const customSeconds = parseInt(customTimeInput.value);
    if (!isNaN(customSeconds) && customSeconds > 0) {
        resetStopwatch();
        seconds = customSeconds;
        display.textContent = formatTime(seconds);
        countdownTimer = setInterval(() => {
            if (seconds > 0) {
                seconds--;
                display.textContent = formatTime(seconds);
                updateGraph();
            } else {
                clearInterval(countdownTimer);
                alert('Time is up!');
            }
        }, 1000);
    }
});

// Graphing Feature
function initializeGraph() {
    chart = new Chart(elapsedTimeGraph, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Elapsed Time (seconds)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateGraph() {
    chart.data.labels.push(formatTime(seconds));
    chart.data.datasets[0].data.push(seconds);
    chart.update();
}

function resetGraph() {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();
}

// Initialize the graph
initializeGraph();
