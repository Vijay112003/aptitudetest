const questions = [
    {
        q: "The sum of the greatest and smallest number of five digits is",
        tip: ""
    },
    {
        q: "If the largest three-digit number is subtracted from the smallest five-digit number, then the remainder is",
        tip: ""
    },
    {
        q: "The smallest number of 5 digits beginning with 3 and ending with 5 will be",
        tip: ""
    },
    {
        q: "What is the minimum number of four digits formed by using the digits 2, 4, 0, 7 ?",
        tip: ""
    },
    {
        q: "There are just two ways in which 5 may be expressed as the sum of two different positive integers. In how many ways, 9 can be expressed as the sum of two different positive integers?",
        tip: ""
    },
    {
        q: "P and Q are two positive integers such that PQ = 64. Which of the following cannot be the value of P + Q? (a) 16 (b) 20 (c) 35 (d) 65",
        tip: ""
    },
    {
        q: "If x + y + z = 9 and both y and z are positive integers greater than zero, then the maximum value x can take is",
        tip: ""
    },
    {
        q: "What is the sum of the squares of the digits from 1 to 9?",
        tip: ""
    },
    {
        q: "If n is an integer between 20 and 80, then any of the following could be n + 7 except (a) 47 (b) 58 (c) 84 (d) 88",
        tip: ""
    },
    {
        q: "If the numbers from 1 to 24, which are divisible by 2 are arranged in descending order, which number will be at the 8th place from the bottom?",
        tip: ""
    },
    {
        q: "2 – 2 + 2 – 2 + .......... 101 terms = ?",
        tip: ""
    },
    {
        q: "98th term of the infinite series 1, 2, 3, 4, 1, 2, 3, 4, ... is",
        tip: ""
    }
];

const answers = [
    "109999",
    "9001",
    "30005",
    "2047",
    "4",
    "35",
    "7",
    "285",
    "88",
    "16",
    "2",
    "2"
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
