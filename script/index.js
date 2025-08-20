const questions = [
    {
        q: "A merchant sells a watch at 15% profit. If sold for ₹150 more, the profit becomes 25%. Find the cost price.",
        tip: "Example: 500"
    },
    {
        q: "A merchant uses 900g instead of 1kg and adds 10% adulteration. Find his total gain percentage.",
        tip: "Example: 15% gain"
    },
    {
        q: "A fruit vendor sells 10 apples for ₹6 at 20% profit. How many apples did he buy for ₹6?",
        tip: "Example: 15"
    },
    {
        q: "A businessman sells two articles at ₹2,000 each, gaining 10% on one and losing 10% on the other. Show he always loses and find the loss percentage.",
        tip: "Example: 5% loss"
    },
    {
        q: "A merchant uses 950g instead of 1kg and gives a 10% discount. Find his gain percentage.",
        tip: "Example: 8% profit"
    },
    {
        q: "If CP:SP = 5:6 and SP:MP = 4:5, find the discount % and profit %.",
        tip: "Example: Profit 10%, Discount 10%"
    },
    {
        q: "A trader earns 20% profit by selling at ₹720. At what price should he sell to gain 40%?",
        tip: "Example: 820"
    },
    {
        q: "A shopkeeper buys two articles at the same price, sells one at 20% profit and the other at 20% loss. Find his overall loss percentage.",
        tip: "Example: 5% loss"
    },
    {
        q: "A trader marks an article 40% above CP and gives successive discounts of 20% and 10%. Find profit or loss percentage.",
        tip: "Example: 2% loss"
    },
    {
        q: "A trader buys two articles at 25% and 40% discount, sells both at MP. If total MP = ₹8,000, find overall gain percentage.",
        tip: "Example: 35% gain"
    },
    {
        q: "A fruit vendor sells 15 bananas for ₹10 at 25% profit. How many bananas did he buy for ₹10?",
        tip: "Example: 10"
    },
    {
        q: "A seller sells 12 pens for ₹72 at 20% loss. How many pens must he sell for ₹72 to gain 20%?",
        tip: "Example: 10"
    },
    {
        q: "A businessman sells two articles at ₹4,000 each, gaining 25% on one and losing 25% on the other. Show he incurs an overall loss and find the loss amount.",
        tip: "Example: 200 loss"
    },
    {
        q: "A person sells two horses for ₹20,000 each, gaining x% on one and losing x% on the other. Prove he always loses and find the loss % when x = 30.",
        tip: "Example: 5% loss"
    },
    {
        q: "A merchant sells an article at 20% loss. If sold for ₹480 more, there would be a 20% gain. Find the cost price.",
        tip: "Example: 1000"
    },
    {
        q: "A trader sells a cycle at 10% loss. If sold for ₹1,200 more, there would be 25% gain. Find the cost price.",
        tip: "Example: 2500"
    },
    {
        q: "If CP:SP = 7:8, find the profit %. If SP:CP = 5:7, find the loss %.",
        tip: "Example: Profit 20%, Loss 20%"
    },
    {
        q: "A chair is bought for ₹1,800 and sold at 15% loss. At what price should it be sold to gain 20%?",
        tip: "Example: 2500"
    },
    {
        q: "A trader marks an article 50% above CP and gives successive discounts of 20% and 10%. Find profit or loss percentage.",
        tip: "Example: 15% loss"
    },
    {
        q: "A trader buys two articles at 30% and 40% discount, sells both at MP. If total MP = ₹10,000, find overall gain percentage.",
        tip: "Example: 20% gain"
    }
];


const answers = [
    "1500",
    "23.46% gain",
    "12",
    "1% loss",
    "5.26% loss",
    "Discount 20%, Profit 20%",
    "840",
    "0%",
    "0.80% profit",
    "48.15% gain",
    "18.75",
    "8",
    "₹533.33 loss",
    "Loss = x^2/100%; for x = 30 → 9% loss",
    "₹1200",
    "₹3428.57",
    "Profit 14.29%, Loss 28.57%",
    "₹2160",
    "8% profit",
    "53.85% gain"
];

const TIMER_DURATION = 240; // 4 min
let currentIndex = 0;
let timerInterval = null;
let userAnswers = JSON.parse(localStorage.getItem("userAnswers") || "[]");

function getEndTimeKey(idx) { return 'question_end_time_' + idx; }
function getCurrentIndexKey() { return 'question_current_index'; }
function getCompletionKey() { return 'test_completed'; }

// Already completed?
if (localStorage.getItem(getCompletionKey())) {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
        if ((userAnswers[i] || "").toLowerCase().replace(/\s+/g, '') ===
            answers[i].toLowerCase().replace(/\s+/g, '')) {
            score++;
        }
    }
    document.body.innerHTML = `
        <div class="container py-5 text-center">
            <div class="alert alert-success shadow-lg">
                <h2 class="mb-3">✅ You have already completed the test</h2>
                <p>Your result was saved. Retake is not allowed.</p>
                <h4 class="mt-3">Your Score: ${score} / ${questions.length}</h4>
            </div>
        </div>
    `;
    throw new Error("Test already attempted");
}

// Render question
function renderQuestion(index) {
    document.getElementById('questionNumber').textContent =
        `Question ${index + 1} of ${questions.length}`;

    const progress = ((index + 1) / questions.length) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;

    const list = document.getElementById('questions-list');
    list.innerHTML = '';

    const liQ = document.createElement('li');
    liQ.className = "list-group-item";
    liQ.innerHTML = `<strong>Q:</strong> ${questions[index].q}</br><span style="color:red">${questions[index].tip}</span>`;
    list.appendChild(liQ);

    const liInput = document.createElement('li');
    liInput.className = "list-group-item bg-light";
    liInput.innerHTML = `
        <input type="text" class="form-control" id="userAnswer"
               placeholder="Enter your answer here"
               value="${userAnswers[index] || ''}">
    `;
    list.appendChild(liInput);

    document.getElementById('nextBtn').style.display =
        (index < questions.length - 1) ? 'block' : 'block';
}

// Timer
function startTimer() {
    clearInterval(timerInterval);

    let endTime = localStorage.getItem(getEndTimeKey(currentIndex));
    if (!endTime) {
        endTime = Date.now() + TIMER_DURATION * 1000;
        localStorage.setItem(getEndTimeKey(currentIndex), endTime);
    } else {
        endTime = parseInt(endTime, 10);
    }

    function updateTimerDisplay() {
        const now = Date.now();
        let timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;
        document.getElementById('timer').textContent =
            `Time Left: ${min}:${sec < 10 ? '0' : ''}${sec}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            moveToNextQuestion();
        }
    }

    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

// Save & Next
function moveToNextQuestion() {
    const input = document.getElementById("userAnswer");
    if (input) {
        userAnswers[currentIndex] = input.value.trim();
        localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    }

    localStorage.removeItem(getEndTimeKey(currentIndex));

    if (currentIndex < questions.length - 1) {
        currentIndex++;
        localStorage.setItem(getCurrentIndexKey(), currentIndex);
        renderQuestion(currentIndex);
        startTimer();
    } else {
        finishTest();
    }
}

// Finish Test
function finishTest() {
    document.getElementById('questions-list').innerHTML =
        '<li class="list-group-item list-group-item-success text-center">🎉 Test Completed</li>';
    document.getElementById('timer').textContent = '';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('questionNumber').textContent = '';
    document.querySelector('.progress-bar').style.width = '100%';

    localStorage.setItem(getCompletionKey(), "true");

    let score = 0;
    for (let i = 0; i < questions.length; i++) {
        if ((userAnswers[i] || "").toLowerCase().replace(/\s+/g, '') ===
            answers[i].toLowerCase().replace(/\s+/g, '')) {
            score++;
        }
    }

    const result = document.createElement("div");
    result.className = "alert alert-info mt-3 text-center";
    result.innerHTML = `<h4>Your Score: ${score} / ${questions.length}</h4>`;
    document.querySelector(".card-body").appendChild(result);
}

// Next button
document.getElementById('nextBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    moveToNextQuestion();
});

// Restore saved progress
const savedIndex = localStorage.getItem(getCurrentIndexKey());
if (savedIndex !== null && !isNaN(savedIndex) && savedIndex < questions.length) {
    currentIndex = parseInt(savedIndex, 10);
}
renderQuestion(currentIndex);
startTimer();

// Prevent accidental exit
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = 'Leaving will close your test.';
});
