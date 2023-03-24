document.addEventListener("DOMContentLoaded", ()=> {
  let quizData;
  let curQuestionIdx = 0;
  let score = 0;
  let scoreList = [];
  let answerList = [];

  // use promise to deal with the quiz data loading
  function getData() {
    return new Promise((resolve, reject) => {
        fetch("data.json")
        .then(response => resolve(response.json()))
        .catch(error => reject(error));
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

  function showQuestion() {
    document.getElementById("question").textContent = quizData[curQuestionIdx].question;
    document.getElementById("answer").value = "";
  }

  document.getElementById("next_btn").addEventListener("click", ()=>{
    checkAnswer();
    curQuestionIdx++;
    document.getElementById("check").classList.add("invisible");
    if (curQuestionIdx < quizData.length) {
      showQuestion();
    } else {
      if (confirm("All done! do you want to submit?")) {
        showResult();
      }
    }
  });

  document.getElementById("submit_btn").addEventListener("click", ()=>{
    //console.log("curidx", curQuestionIdx);
    if (curQuestionIdx === quizData.length - 1) {
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

  document.getElementById("restart_btn").addEventListener("click", ()=>{
    location.reload();
  });

  document.getElementById("answer").addEventListener("input", () => {
    let userAnswer = $("#answer").val();
    savePromise(curQuestionIdx, userAnswer)
    .then((message) => {
      console.log("Success: ", message);
      document.getElementById("check").classList.remove("invisible");
    })
    .catch((error) => {
      console.error(error);
    });
  });
  function savePromise(index, obj){
    return new Promise((resolve, reject) => {
      const timeOutId = setTimeout(() => {
        reject(new Error("Unable to save answer within 3 seconds"));
      }, 3000);
      answerList[index] = obj;
      clearTimeout(timeOutId);
      resolve("Store successfully!");
    });
  }

  function checkAnswer() {
    let correctAnswer = quizData[curQuestionIdx].answer;
    if (answerList[curQuestionIdx] === correctAnswer) {
      scoreList[curQuestionIdx] = quizData[curQuestionIdx].point;
      console.log("score", scoreList);
    } else {
      scoreList[curQuestionIdx] = 0;
    }
  }
  
  function showResult() {
    document.getElementById("question").textContent = "";
    document.getElementById("answer").value = "";
    // $("#question").text("");
    // $("#answer").val("");
    $.each(scoreList, (index, value) => {
      let liItem = document.createElement("li");
      let item = document.createTextNode(
          "Q[" +
          (index + 1) +
          "] " +
          quizData[index].question +
          "\nYour answer: " +
          answerList[index] +
          "\nCorrect Answer: " +
          quizData[index].answer +
          "\n" + 
          "Your point: " +
          value
      );
      score += value;
      liItem.append(item);
      document.getElementById("resList").appendChild(liItem);
      if (index === scoreList.length - 1) {
        document.getElementById("totalScore").textContent = "Your total point is: " + score;
        document.getElementById("totalScore").classList.remove("invisible");
      }
      document.getElementById("resList").classList.remove("invisible");
    });
  }
});
