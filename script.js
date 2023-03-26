document.addEventListener("DOMContentLoaded", () => {
  let quizData;
  let curQuestionIdx = 0;
  let score = 0;
  let scoreList = [];
  let answerList = [];
  const nextBtn = document.getElementById("next_btn");
  const submitBtn = document.getElementById("submit_btn");
  const failSign = document.getElementById("fail");
  const successSign = document.getElementById("success");

  // use promise to deal with the quiz data loading
  function getData() {
    return new Promise((resolve, reject) => {
      fetch("data.json")
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error));
    });
  }
  getData()
    .then((data) => {
      quizData = data;
      showQuestion();
    })
    .catch((error) => {
      console.log("Error: ", error);
      // use Boostrap Alerts to show error message
      let alert = document.getElementById("error_alert");
      alert.style.display = "";
    });
  // display question
  function showQuestion() {
    document.getElementById("question").textContent =
      quizData[curQuestionIdx].question;
    document.getElementById("answer").value = "";
  }
  /* Bind to the next button here */
  nextBtn.addEventListener("click", () => {
    checkAnswer();
    curQuestionIdx++;
    document.getElementById("success").classList.add("invisible");
    if (curQuestionIdx < quizData.length) {
      showQuestion();
    } else {
      if (answerList.length === quizData.length) {
        if (confirm("All done! do you want to submit?")) {
          showResult();
        }
      } else {
        if (confirm("You don't complete all questions, still submit?")) {
          showResult();
        }
      }
    }
  });
  /* Bind to the submit button here */
  submitBtn.addEventListener("click", () => {
    if (answerList === quizData.length) {
      if (confirm("All done! do you want to submit?")) {
        checkAnswer();
        showResult();
      }
    } else {
      if (confirm("You don't complete all questions, still submit?")) {
        checkAnswer();
        showResult();
      }
    }
  });
  /* Bind to the restart button here */
  document.getElementById("restart_btn").addEventListener("click", () => {
    location.reload();
  });
  // user input answer, and use a promise check whether store successfully
  document.getElementById("answer").addEventListener("input", () => {
    let userAnswer = $("#answer").val();
    const storePromise = new Promise((resolve, reject) => {
      setTimeout(() => {  // after 3 seconds, check whether store successfully
        if (answerList.length === curQuestionIdx + 1) {
          resolve("Save within 3 seconds!");
        } else {
          reject(new Error("Unable to save answer within 3 seconds."));
        }
      }, 3000);
      answerList[curQuestionIdx] = userAnswer; // try to store input into array
      successSign.classList.add("invisible");  // every time change input, clear the check state
      failSign.classList.add("invisible");
    });
    storePromise
      .then((data) => {  // store successfully, show green tick
        console.log(data);
        failSign.classList.add("invisible");
        nextBtn.disabled = false;
        submitBtn.disabled = false;
        successSign.classList.remove("invisible");
      })
      .catch((error) => {  // store failed, show red cross
        console.error("stroe failed", error.message);
        successSign.classList.add("invisible");
        failSign.classList.remove("invisible");
        nextBtn.disabled = true;
        submitBtn.disabled = true;
      });
  });
  // check answer
  function checkAnswer() {
    let correctAnswer = quizData[curQuestionIdx].answer;
    if (answerList[curQuestionIdx] === correctAnswer) {
      scoreList[curQuestionIdx] = quizData[curQuestionIdx].point;
      console.log("score", scoreList);
    } else {
      scoreList[curQuestionIdx] = 0;
    }
  }
  // display result list
  function showResult() {
    scoreList.forEach((value, index) => {
      let liItem = document.createElement("li");
      liItem.innerHTML =
        "Q[" +
        (index + 1) +
        "] " +
        quizData[index].question +
        "<br>Your answer: " +
        answerList[index] +
        "<br>Correct Answer: " +
        quizData[index].answer +
        "<br>Your point: " +
        value;
      document.getElementById("resList").appendChild(liItem);
      score += value;
    });
    document.getElementById("totalScore").textContent =
      "Your total point is: " + score;
    document.getElementById("result").classList.remove("invisible");
    successSign.classList.add("invisible");
    document.getElementById("question").textContent = "";
    document.getElementById("answer").value = "";
    document.getElementById("answer").disabled = true;
    nextBtn.disabled = true;
    submitBtn.disabled = true;
  }
});
