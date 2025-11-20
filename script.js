// Questions data
const questions = [
    "沒有買一送一就喝星巴克",
    "沒有用折價券就搭 Uber",
    "一天用超過 2 片日用衛生棉，白天用夜用衛生棉",
    "吃摩斯漢堡",
    "迴轉壽司吃超過 300 元",
    "吃滷肉飯 25 元不會飽",
    "吃 85 度 C 的切片黑森林蛋糕",
    "用洗碗機",
    "吃飯沒 AA",
    "做美甲",
    "飲料點中杯",
    "洗髮精用到最後沒有加水",
    "跑咖（去咖啡廳）",
    "鹽酥雞兩人份點 365 元",
    "獨享 Netflix（不跟別人共享帳號）",
    "買原價巧克力（不等特價）",
    "假日看原價電影",
    "用四層舒潔衛生紙",
    "買加價外送（不自己去拿）",
    "追星看演唱會"
];

// Quiz state
let currentQuestion = 0;
let score = 0;
let answers = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add SVG gradient for score ring
    const svg = document.querySelector('.score-ring');
    if (svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'scoreGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#00ffff;stop-opacity:1');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('style', 'stop-color:#8000ff;stop-opacity:1');

        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('style', 'stop-color:#ff0080;stop-opacity:1');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
});

// Start quiz
function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];

    document.getElementById('startScreen').classList.remove('active');
    document.getElementById('quizScreen').classList.add('active');

    showQuestion();
}

// Show current question
function showQuestion() {
    const questionCard = document.getElementById('questionCard');
    const questionNumber = document.getElementById('questionNumber');
    const questionText = document.getElementById('questionText');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Update progress
    const progress = ((currentQuestion) / questions.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `${currentQuestion + 1} / ${questions.length}`;

    // Update question
    questionNumber.textContent = `問題 ${currentQuestion + 1}`;
    questionText.textContent = questions[currentQuestion];

    // Trigger animation
    questionCard.style.animation = 'none';
    setTimeout(() => {
        questionCard.style.animation = 'card-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 10);
}

// Handle answer
function answer(value) {
    answers.push(value);
    if (value) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        // Add a small delay for better UX
        setTimeout(() => {
            showQuestion();
        }, 200);
    } else {
        // Show results
        setTimeout(() => {
            showResults();
        }, 300);
    }
}

// Show results
function showResults() {
    document.getElementById('quizScreen').classList.remove('active');
    document.getElementById('resultScreen').classList.add('active');

    const percentage = Math.round((score / questions.length) * 100);
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreRing = document.getElementById('scoreRing');
    const resultMessage = document.getElementById('resultMessage');
    const resultDetails = document.getElementById('resultDetails');

    // Animate score
    let currentScore = 0;
    const scoreInterval = setInterval(() => {
        currentScore++;
        scoreNumber.textContent = currentScore;

        if (currentScore >= percentage) {
            clearInterval(scoreInterval);
        }
    }, 20);

    // Animate ring
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (percentage / 100) * circumference;
    setTimeout(() => {
        scoreRing.style.strokeDashoffset = offset;
    }, 100);

    // Get result message and details
    const result = getResultMessage(percentage);

    // Safely set message content using DOM methods
    resultMessage.textContent = '';
    result.message.forEach((line, index) => {
        const textNode = document.createTextNode(line);
        resultMessage.appendChild(textNode);
        if (index < result.message.length - 1) {
            resultMessage.appendChild(document.createElement('br'));
        }
    });

    // Safely set details content using DOM methods
    resultDetails.textContent = '';
    result.details.forEach(item => {
        if (item.bold) {
            const strong = document.createElement('strong');
            strong.textContent = item.text;
            resultDetails.appendChild(strong);
        } else {
            const textNode = document.createTextNode(item.text);
            resultDetails.appendChild(textNode);
        }
        if (item.lineBreak !== false) {
            resultDetails.appendChild(document.createElement('br'));
        }
    });
}

// Get result message based on score
function getResultMessage(percentage) {
    const baseDetails = [
        { text: `符合 ${score}/${questions.length} 項標準`, bold: true },
        { text: '' },
        { text: '' }
    ];

    if (percentage >= 80) {
        return {
            message: ['🔥 頂級台女認證 🔥', '妳就是傳說中的台女本人！'],
            details: [
                ...baseDetails,
                { text: '恭喜妳完美符合 DCard 與 Threads 的拜金台女標準！' },
                { text: '妳對生活品質的追求已經達到最高境界。' },
                { text: '記得：愛自己，就是要對自己好一點 💅✨', lineBreak: false }
            ]
        };
    } else if (percentage >= 60) {
        return {
            message: ['💎 準台女實習生 💎', '妳已經在路上了！'],
            details: [
                ...baseDetails,
                { text: '妳正在往台女的道路上前進！' },
                { text: '再加把勁，妳就能晉升為正港台女。' },
                { text: '繼續保持這個生活態度，未來可期 🌟', lineBreak: false }
            ]
        };
    } else if (percentage >= 40) {
        return {
            message: ['✨ 小資台女萌芽中 ✨', '正在學習中！'],
            details: [
                ...baseDetails,
                { text: '妳對生活品質有一定的要求，' },
                { text: '但還不到台女的標準。' },
                { text: '偶爾對自己好一點，沒什麼不好 😊', lineBreak: false }
            ]
        };
    } else if (percentage >= 20) {
        return {
            message: ['🌱 省錢達人 🌱', '妳很會精打細算！'],
            details: [
                ...baseDetails,
                { text: '妳是個務實的人，懂得理財規劃。' },
                { text: '偶爾奢侈一下也不錯哦！' },
                { text: '生活需要一點儀式感 🎯', lineBreak: false }
            ]
        };
    } else {
        return {
            message: ['💰 終極省錢王 💰', '妳真的超會省！'],
            details: [
                ...baseDetails,
                { text: '妳完全不符合台女標準，是個超級節儉的人！' },
                { text: '妳的理財觀念值得學習。' },
                { text: '但記得，偶爾也要犒賞自己哦 🎁', lineBreak: false }
            ]
        };
    }
}

// Restart quiz
function restartQuiz() {
    document.getElementById('resultScreen').classList.remove('active');
    document.getElementById('startScreen').classList.add('active');

    // Reset score ring
    const scoreRing = document.getElementById('scoreRing');
    scoreRing.style.strokeDashoffset = 565.48;
}

// Add keyboard support
document.addEventListener('keydown', (e) => {
    const quizScreen = document.getElementById('quizScreen');
    if (quizScreen.classList.contains('active')) {
        if (e.key === '1' || e.key.toLowerCase() === 'y') {
            answer(true);
        } else if (e.key === '2' || e.key.toLowerCase() === 'n') {
            answer(false);
        }
    }
});
