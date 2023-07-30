//Select Elemants
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".spans");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

//Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getquestions() {
  let myrequest = new XMLHttpRequest();
  myrequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      //Create Bullets
      createBullets(qCount);

      // Add Queation Data
      addQuestionData(questionsObject[currentIndex], qCount);

      // Start CountDown
      countdown(3, qCount);

      //Click On Submit
      submitButton.onclick = () => {
        let rightAnswer = questionsObject[currentIndex]["right_answer"];

        currentIndex++;

        //Check The Answar
        checkAnswer(rightAnswer, qCount);

        //Remove Previous Questions
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Queation Data
        addQuestionData(questionsObject[currentIndex], qCount);

        // Handle Bullets Classes
        handleBullets();

        // Start CountDown
        clearInterval(countdownInterval);
        countdown(3, qCount);

        //Show Results
        showResults(qCount);
      };
    }
  };
  myrequest.open("GET", "html_questions.json", true);
  myrequest.send();
}

getquestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (i = 0; i < num; i++) {
    spanBullet = document.createElement("span");

    if (i === 0) {
      spanBullet.className = "on";
    }

    bullets.appendChild(spanBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create H2 Question Title
    let questionsHeader = document.createElement("h2");
    questionsHeader.textContent = obj["title"];
    quizArea.appendChild(questionsHeader);

    //create The Answers
    for (i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let answersInput = document.createElement("input");

      answersInput.type = "radio";
      answersInput.name = "question";
      answersInput.id = `answer_${i}`;
      answersInput.dataset.answer = obj[`answer_${i}`];

      let answersLabel = document.createElement("label");

      answersLabel.htmlFor = `answer_${i}`;
      answersLabel.textContent = obj[`answer_${i}`];

      answersArea.appendChild(mainDiv);
      mainDiv.appendChild(answersInput);
      mainDiv.appendChild(answersLabel);
    }
  }
}

function checkAnswer(rAnswer, Count) {
  let answers = document.getElementsByName("question");
  let theChooseAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChooseAnswer = answers[i].dataset.answer;
    }
    if (rAnswer === theChooseAnswer) {
      rightAnswers++;
    }
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);

  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class='good'>Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class='perfect'>Perfect</span>, ${rightAnswers} From ${count}`;
    } else {
      theResult = `<span class='bad'>Bad</span>, ${rightAnswers} From ${count}`;
    }

    resultsContainer.innerHTML = theResult;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.marginTop = "10px";
    resultsContainer.style.backgroundColor = "white";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
