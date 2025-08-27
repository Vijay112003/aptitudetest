const questions = [
    {
        q: "A book was sold for 27.50 with a profit of 10%. If it were sold for 25.75, then what would have been the percentage of profit or loss?",
        tip: "Example: 15"
    },
    {
        q: "By selling 33 metres of cloth, one gains the selling price of 11 metres. Find the gain percent.",
        tip: "Example: 75"
    },
    {
        q: "If the manufacturer gains 10%, the wholesale dealer 15% and the retailer 25%, then find the cost of production of a table, the retail price of which is 1265 ?",
        tip: "Example: 300"
    },
    {
        q: "The price of a jewel, passing through three hands, rises on the whole by 65%. If the first and the second sellers earned 20% and 25% profit respectively, find the percentage profit earned by the third seller.",
        tip: "Example: 20"
    },
    {
        q: "A retailer buys 40 pens at the marked price of 36 pens from a wholesaler. If he sells these pens giving a discount of 1%, what is the profit percent?",
        tip: "Example: 50"
    },
    {
        q: "Jacob bought a scooter for a certain sum of money. He spent 10% of the cost on repairs and sold the scooter for a profit of 1100. How much did he spend on repairs if he made a profit of 20%?",
        tip: "750"
    },
    {
        q: "Abhishek purchased 140 shirts and 250 trousers @ 450 and @ 550 respectively. What should be the overall average selling price of shirts and trousers so that 40% profit is earned? (rounded off to next integer)",
        tip: "Example: 820"
    },
    {
        q: "By selling a bicycle for 2850, a shopkeeper gains 14%. If the profit is reduced to 8% then the selling price will be",
        tip: "Example: 1200"
    },
    {
        q: "When an article is sold for 116, the profit percent is thrice as much as when it is sold for 92. The cost price of the article is ",
        tip: "Example: 60"
    },
    {
        q:"Mohan bought 20 dining tables for 12000 and sold them at a profit equal to the selling price of 4 dining tables. The selling price of 1 dining table is",
        tip:"Example: 560"
    },
    {
        q:"By selling 100 pencils, a shopkeeper gains the selling price of 20 pencils. His gain percent is",
        tip:"Example: 37"
    },
    {
        q:"By selling 12 toffees for a rupee, a man loses 20%. How many for a rupee should he sell to get a gain of 20%?",
        tip:"Example: 1"
    },
    {
        q:"A wholeseller buys 20 pens at the marked price of 16 pens to a retailer. The retailer in turn sells them at the marked price. Determine the gain or loss percent to the retailer.",
        tip:"Example: 17"
    },
    {
        q:`<p>In terms of percentage profit, which is the best
</p>
<table class="table table-bordered table-striped w-auto mx-auto">
    <thead>
        <tr>
            <th>Option</th>
            <th>C.P. (in ₹)</th>
            <th>Profit (in ₹)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>(a)</td>
            <td>36</td>
            <td>17</td>
        </tr>
        <tr>
            <td>(b)</td>
            <td>50</td>
            <td>24</td>
        </tr>
        <tr>
            <td>(c)</td>
            <td>40</td>
            <td>19</td>
        </tr>
        <tr>
            <td>(d)</td>
            <td>60</td>
            <td>29</td>
        </tr>
    </tbody>
</table>`,
        tip:"Example: Write any one option (a/b/c/d) only"
    },
    {
        q:"A gold bracelet is sold for 14500 at a loss of 20%. What is the cost price of the gold bracelet?",
        tip:"Example: 181"
    }
];


const answers = [
    "3",
    "50",
    "800",
    "10",
    "10",
    "500",
    "720",
    "2700",
    "80",
    "750",
    "25",
    "8",
    "25",
    "d",
    "18125"
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
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Question</th>
                            <th>Your Answer</th>
                            <th>Correct Answer</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${questions.map((q, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${typeof q.q === 'string' ? q.q : ''}</td>
                                <td>${userAnswers[i] || ''}</td>
                                <td>${answers[i]}</td>
                                <td>
                                    ${((userAnswers[i] || "").toLowerCase().replace(/\s+/g, '') ===
                                        answers[i].toLowerCase().replace(/\s+/g, '')) ?
                                        '<span class="text-success">✔️</span>' :
                                        '<span class="text-danger">❌</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
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
