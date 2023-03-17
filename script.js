$(document).ready(function () {
  let quizData;
  let curQuestionIdx = 0;
  let score = 0;
  let scoreList = [];
  let answerList = [];

  $.getJSON("data.json", function (data) {
    quizData = data;
    showQuestion();
  });

  // async function startQuiz() {
  //   try {
  //     const data = await getData();
  //     questions = data.questions;
  //     console.log("q length", questions.length);
  //     showQuestion();
  //   } catch (error) {
  //     console.error("There was a problem fetching the data:", error);
  //   }
  // }

  // function getData() {
  //   console.log("get data1");
  //   return new Promise((resolve, reject) => {
  //     $.getJSON("data.json")
  //       .done((data) => resolve(data))
  //       .fail((error) => reject(error));
  //   });
  // }

  function showQuestion() {
    $("#question").text(quizData[curQuestionIdx].question);
    $("#answer").val("");
  }

  $("#next_btn").click(() => {
    checkAnswer();
    curQuestionIdx++;
    if (curQuestionIdx < quizData.length) {
      showQuestion();
    } else {
      if (confirm("All done! do you want to submit?")) {
        showResult();
      }
    }
  });

  $("#submit_btn").click(() => {
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

  $("#restart_btn").click(() => {
    location.reload();
  });

  function checkAnswer() {
    let userAnswer = $("#answer").val();
    answerList[curQuestionIdx] = userAnswer;
    let correctAnswer = quizData[curQuestionIdx].answer;
    if (userAnswer === correctAnswer) {
      scoreList[curQuestionIdx] = quizData[curQuestionIdx].point;
      console.log("score", scoreList);
    } else {
      scoreList[curQuestionIdx] = 0;
    }
  }

  function showResult() {
    $("#question").text("");
    $("#answer").val("");
    $.each(scoreList, (index, value) => {
      let item = $(
        "<li>" +
          "Q[" +
          (index + 1) +
          "] " +
          quizData[index].question +
          "<br>" +
          "Your answer: " +
          answerList[index] +
          "<br>" +
          "Correct Answer: " +
          quizData[index].answer +
          "<br>" +
          "Your point: " +
          value +
          "</li>"
      );
      score += value;
      $("#resList").append(item);
      if (index === scoreList.length - 1) {
        $("#totalScore").text("Your total point is: " + score);
        $("#totalScore").removeClass("invisible").addClass("visible");
      }
      $("#resList").removeClass("invisible").addClass("visible");
    });
  }

});
