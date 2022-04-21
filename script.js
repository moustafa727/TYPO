$(function () {
  let typingWord; // a variable that holds the typing text
  let remainingWord; // a variable used to hold untyped remaining text
  let currentIndex = -1; // a variable to hold the index of the current character
  let wrongEntries;
  let html = ""; // a variable to style the the typing text with html
  let ticks; //a variable to hold setInterval function
  let seconds, minutes, hours; //time variables
  let touch = false; //a variable to indicate a device with a touchscreen

  // cashing some elements
  const $typingTextContainer = $("#typingTextContainer");
  const $typingBox = $("#typing-box");
  const $levelSelection = $("#level-selection");
  const $resultBox = $("#result-box");
  const $typewriterSound = $("#typewriter");
  const $errorSound = $("#error");
  const $textarea = $("textarea");
  //end of cashing

  // this code is used to make the typewriter effect

  const autoText = document.getElementById("auto-type");
  const autoWriter = new Typewriter(autoText, { loop: false });
  autoWriter.typeString("Typo, the best tool to practice your typing!").start();

  // an event listener to a click  on "get started" button
  $("#lets-start").on("click", function () {
    $(".homepage").toggleClass("hidden");
    $levelSelection.toggleClass("hidden");
  });

  $(".level").on("click", function () {
    wrongEntries = currentIndex = 0;
    remainingWord = html = "";
    $levelSelection.toggleClass("hidden");
    $typingBox.toggleClass("hidden");
    if ($(this).attr("id") == "basic-Level") {
      typingWord =
        "The best way to be a good typewriter is through  practice on the Typo web app.";
    } else if ($(this).attr("id") == "intermediate-Level") {
      typingWord =
        "Toronto is the best place to live! The people who live there are fun, friendly and welcoming.";
    } else {
      typingWord =
        "Newton's law of universal gravitation is force equal gravitational constant * ( (mass obj.(1) * mass obj.(2)) divided by squared of the distance between centers of the masses.";
    }
    $typingTextContainer.text(typingWord);
    remainingWord = typingWord;
    if (!touch) {
      modifyLetterStyle("");
    }
  });

  // a function to style the typed letter and to underline the current one
  const modifyLetterStyle = function (letterStatus) {
    let oneLetter = remainingWord.substring(0, 1);
    oneLetter = `<span class='underline'>${oneLetter}</span>`;
    remainingWord = remainingWord.substring(1);
    if (letterStatus !== "") {
      html = html.replace("underline", letterStatus);
    }
    html = html + oneLetter;
    $typingTextContainer.html(html + remainingWord);
  };

  // a function to start the timer
  const timerStart = function () {
    $("#timer").toggleClass("hidden");
    seconds = 0;
    minutes = 0;
    hours = 0;
    let time = 0;
    let hoursString, minutesString, secondsString;
    const $timer = $("time");
    $timer.text("00: 00: 00");
    ticks = setInterval(function () {
      time++;
      hoursString = hours = Math.floor(time / 3600);
      minutesString = minutes = Math.floor(time / 60);
      secondsString = seconds = Math.floor(time % 60);
      if (minutes < 10) {
        minutesString = "0" + minutes;
      }
      if (seconds < 10) {
        secondsString = "0" + seconds;
      }
      if (hours < 10) {
        hoursString = "0" + hours;
      }
      $timer.text(`${hoursString} : ${minutesString} : ${secondsString}`);
    }, 1000);
  };

  // a function to calculate the result
  const calculateResult = function () {
    const correctEntries = typingWord.length - wrongEntries;
    const accuracy = (correctEntries / typingWord.length) * 100;
    $("#accuracy").text("Accuracy: " + accuracy.toFixed(2) + " %");
    const timeInMinutes = minutes + hours * 60 + seconds / 60;
    const numberOfWords = typingWord.length / 5; //considring that the word length is 5 characters
    if (wrongEntries > numberOfWords) {
      //show an message to the user if he has too many mistakes and the speed can't be calculated
      $("#speed").text(
        `We can't calculate your speed because you have too many mistakes.`
      );
    } else {
      const speed = (numberOfWords - wrongEntries) / timeInMinutes;
      $("#speed").text("Speed: " + speed.toFixed(2) + " WPM");
    }
  };

  $(document).keypress(function (e) {
    if (!touch && currentIndex > -1 && currentIndex < typingWord.length) {
      if (currentIndex === 0) {
        timerStart();
      }
      const typedChar = String.fromCharCode(e.which);
      let letterStatus = "correct";
      if (typedChar !== typingWord.charAt(currentIndex)) {
        $errorSound[0].play();
        wrongEntries++;
        letterStatus = "wrong";
      } else {
        $typewriterSound[0].play();
      }
      modifyLetterStyle(letterStatus);
      currentIndex++;
      if (currentIndex === typingWord.length) {
        clearInterval(ticks);
        calculateResult();
        $typingBox.toggleClass("hidden");
        $resultBox.toggleClass("hidden");
        currentIndex = -1;
      }
    }
  });

  // an event listener to a click on "show levels" link
  $("#showLevel").on("click", function () {
    $("#timer").toggleClass("hidden");
    $resultBox.toggleClass("hidden");
    $levelSelection.toggleClass("hidden");
  });

  //an event listener to show the instructions div
  $("#showInstructions").on("click", function (e) {
    e.preventDefault();
    $(".instructions-box").fadeIn(500);
  });

  //an event listener to hide the instructions div
  $("#close").on("click", function (e) {
    $(".instructions-box").fadeOut(500);
  });
});
