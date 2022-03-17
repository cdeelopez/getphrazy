"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var phrazeInfo = {
  today: {
    phraze: "",
    category: ""
  },
  phraseLetters: "",
  letterCount: 0,
  letterPercent: 0,
  pattern: []
};
var gameStateInfo = {
  inProgressLetterCounter: -1,
  showLetterCounter: 0,
  displayed: 0,
  guessCount: 0,
  gameCompleted: false,
  finalGrade: "",
  answers: []
};
var todaysDate = new Date();
var pattern = [['D', 'L', 'Z', 'F', 'E', 'K', 'B', 'O', 'P', 'V', 'T', 'G', 'S', 'A', 'C', 'U', 'N', 'I', 'H', 'R', 'Y', 'J', 'M', 'X', 'Q', 'W'], ['H', 'M', 'E', 'D', 'J', 'O', 'N', 'R', 'X', 'K', 'U', 'Y', 'V', 'S', 'B', 'W', 'F', 'T', 'A', 'P', 'Q', 'L', 'I', 'Z', 'C', 'G'], ['Z', 'M', 'K', 'N', 'X', 'G', 'U', 'S', 'E', 'R', 'B', 'V', 'A', 'P', 'T', 'I', 'C', 'F', 'D', 'W', 'L', 'O', 'J', 'Y', 'H', 'Q'], ['N', 'X', 'B', 'R', 'Y', 'T', 'L', 'I', 'S', 'P', 'E', 'C', 'V', 'J', 'H', 'Z', 'A', 'G', 'W', 'F', 'U', 'M', 'O', 'K', 'D', 'Q'], ['I', 'N', 'F', 'Q', 'C', 'U', 'R', 'O', 'D', 'H', 'A', 'Z', 'L', 'K', 'V', 'J', 'S', 'M', 'G', 'P', 'Y', 'X', 'T', 'B', 'E', 'W'], ['F', 'Q', 'V', 'H', 'K', 'Y', 'C', 'J', 'X', 'Z', 'M', 'R', 'W', 'E', 'N', 'S', 'P', 'I', 'B', 'U', 'O', 'A', 'G', 'D', 'T', 'L'], ['W', 'G', 'Y', 'U', 'M', 'N', 'H', 'I', 'K', 'Z', 'O', 'R', 'B', 'Q', 'C', 'P', 'J', 'F', 'S', 'T', 'L', 'A', 'X', 'E', 'D', 'V']];
var items = {
  LAST_PLAYED_DEP: "last-played-date",
  LAST_PLAYED_PHRAZE: "last-played-phraze",
  GAME_STATE: "game-state",
  GRADES: "grades",
  TOTAL_PCT: "overall-pct-shown"
};
var messages = {
  "grade-a": "Rockstar!",
  "grade-b": "You got it!",
  "grade-c": "Good Guess!",
  "grade-d": "Phew, that was close!",
  "grade-f": "Better luck next time?",
  OVERALL: "Overall Game Stats"
};
var grades = {
  A: "grade-a",
  B: "grade-b",
  C: "grade-c",
  D: "grade-d",
  F: "grade-f"
};
var emojis = {
  GREEN_BOX: "&#129001;",
  REVEALED_BOX: "&#128307;",
  RED_BOX: "&#128997;"
};
var actions = {
  SPLASH_PAGE: "splash_page",
  START_NEW_GAME: "start_new_game ",
  RESUME_GAME: "resume_game",
  COMPLETE_GAME: "game_completed",
  GAME_END_STATS: "game_end_stats",
  LOAD_ON_COMPLETE: "game_already_completed",
  START_ON_GUESS: "resume_on_guess",
  GUESS_CLICK: "guess_clicked",
  GUESS_CHECK_CLICK: "guess_check",
  GUESS_CANCEL_CLICK: "guess_cancel_clicked",
  SHARE_CLICK: "share_clicked",
  INFO_CLICK: "info_clicked",
  STATS_CLICK: "stats_clicked",
  MENU_CLICK: "menu_clicked",
  NEXT_DAY_RELOAD: "reload_next_day"
};
var MAX_GUESS = 3;
var LETTER_TIMER = 5000;
$(function () {
  getPhrases(function (phrases) {
    setupPhrazeInfo(phrases[todaysDayInYear() % phrases.length]);
    startGame();
  });
});
/* get phrases from json file */

var getPhrases = function getPhrases(cb) {
  $.getJSON("./phrazes-cat.json", function (data) {
    cb(data.phrazes);
  }).fail(function () {
    console.log("An error has occurred.");
  });
};

var setupPhrazeInfo = function setupPhrazeInfo(phrase) {
  phrazeInfo.pattern = pattern[todaysDate.getDay()];
  phrazeInfo.today = _objectSpread(_objectSpread({}, phrase), {}, {
    phraze: phrase.phraze.toUpperCase()
  });
  phrazeInfo.phraseLetters = phrase.phraze.split(" ").join("");
  phrazeInfo.letterCount = phrazeInfo.phraseLetters.length;
  phrazeInfo.letterPercent = 1 / phrazeInfo.letterCount * 100;
};

var treatAsUTC = function treatAsUTC(date) {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
};
/* gets today's day in the year */


var todaysDayInYear = function todaysDayInYear() {
  var today = new Date();
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  var start = new Date(today.getFullYear(), 0, 0);
  return Math.floor((treatAsUTC(today) - treatAsUTC(start)) / millisecondsPerDay);
};
/* set up phrase board */


var setupBoard = function setupBoard() {
  var html = '<div>';
  var isSpace = false;

  var _iterator = _createForOfIteratorHelper(phrazeInfo.today.phraze),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var chr = _step.value;

      if (chr === " ") {
        isSpace = true;
        html += '</div><div>';
      } else {
        html += "<span class=\"".concat(isSpace ? "has-space" : "", "\"></span>");
        isSpace = false;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  html += '</div>';
  $(".guessbox .guess-section").html(html);
};
/* set up percentage markers in progress bar */


var initProgressBar = function initProgressBar() {
  for (var i = 0; i < phrazeInfo.letterCount - 1; i++) {
    $(".progress-bar").append("<small class=\"divider\" style=\"left:".concat(phrazeInfo.letterPercent * (i + 1), "%\"></small>"));
  }
};
/* initialize countdown until next phraze */


var initNextPhrazeCountdown = function initNextPhrazeCountdown() {
  if (typeof window.nextPhrazeInterval != 'undefined') clearInterval(window.nextPhrazeInterval);
  displayCountdown();
  window.nextPhrazeInterval = setInterval(function () {
    displayCountdown();
  }, 1000);
};
/* displays the countdown text */


var displayCountdown = function displayCountdown() {
  var today = new Date();
  var tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  var total = Date.parse(tomorrow) - Date.parse(today);
  var seconds = ('0' + Math.floor(total / 1000 % 60)).slice(-2);
  var minutes = ('0' + Math.floor(total / 1000 / 60 % 60)).slice(-2);
  var hours = ('0' + Math.floor(total / (1000 * 60 * 60) % 24)).slice(-2);
  $(".game-end-popup .next-phraze span").text("".concat(hours, ":").concat(minutes, ":").concat(seconds));

  if (total <= 0 && typeof window.nextPhrazeInterval != 'undefined') {
    clearInterval(window.nextPhrazeInterval);
  }

  var lastPlayedPhraze = localStorage.getItem(items.LAST_PLAYED_PHRAZE);

  if (lastPlayedPhraze && lastPlayedPhraze != todaysDayInYear()) {
    clearInterval(window.nextPhrazeInterval);
    sendEvent(actions.NEXT_DAY_RELOAD);
    setTimeout(function () {
      location.reload();
    }, 500);
  }
};
/* get today's game state if any */


var getTodaysGameState = function getTodaysGameState() {
  // remove dep - wipeout old storage items
  if (localStorage.getItem(items.LAST_PLAYED_DEP)) {
    localStorage.removeItem(items.LAST_PLAYED_DEP);
    localStorage.removeItem(items.GAME_STATE);
    localStorage.removeItem(items.GRADES);
    localStorage.removeItem(items.TOTAL_PCT);
  } // remove dep - cleanup


  if (localStorage.getItem(items.TOTAL_PCT)) {
    var _grades = getObjectItem(items.GRADES);

    _grades[items.TOTAL_PCT] = localStorage.getItem(items.TOTAL_PCT) || 0;
    localStorage.setItem(items.GRADES, JSON.stringify(_grades));
    localStorage.removeItem(items.TOTAL_PCT);
  }

  var lastPlayed = localStorage.getItem(items.LAST_PLAYED_PHRAZE);
  var todaysDay = todaysDayInYear();

  if (lastPlayed != todaysDay) {
    localStorage.setItem(items.LAST_PLAYED_PHRAZE, todaysDay);
    localStorage.removeItem(items.GAME_STATE);
  }

  var inProgressStats = getObjectItem(items.GAME_STATE);
  if (typeof inProgressStats.counter === "number" && inProgressStats.counter >= 0) setTodaysState(inProgressStats);else localStorage.removeItem(items.GAME_STATE);
};
/* if game is in progress set today's state */


var setTodaysState = function setTodaysState(stats) {
  gameStateInfo.inProgressLetterCounter = stats.counter;
  gameStateInfo.gameCompleted = stats.isComplete || false;
  gameStateInfo.finalGrade = stats.grade || "";
  gameStateInfo.guessCount = stats.guessCnt || 0;
  gameStateInfo.isGuessMode = stats.isGuessMode || false;
};
/* show the completed board */


var setupCompleteGame = function setupCompleteGame() {
  var isFailed = gameStateInfo.finalGrade == grades.F;
  $(".guessbox").find("span").each(function (i) {
    if (!$(this).text().trim().length) {
      $(this).html("<input class='".concat(isFailed ? "wrong-letter" : "correct-letter", "' type='text' maxlength='1' value='").concat(phrazeInfo.phraseLetters.charAt(i) || "", "' disabled>"));
    }
  });
};

var disableBoard = function disableBoard() {
  $(".guess-action").prop("disabled", true);
  $(".progress-bar-timer").addClass("hide");
  $(".guessbox").addClass("playing");
};

var showCategory = function showCategory() {
  $(".guessbox h2").text(phrazeInfo.today.category).addClass("show").parent().addClass("ready");
};

var setGameStateGuess = function setGameStateGuess() {
  var state = getObjectItem(items.GAME_STATE);
  state.guessCnt = gameStateInfo.guessCount;
  localStorage.setItem(items.GAME_STATE, JSON.stringify(state));
};

var setToGuessMode = function setToGuessMode(isGuessMode) {
  if (isGuessMode) {
    $(".main-section").addClass("guess-mode");
  } else {
    $(".main-section").removeClass("guess-mode");
  }

  var state = getObjectItem(items.GAME_STATE);
  state.isGuessMode = isGuessMode;
  localStorage.setItem(items.GAME_STATE, JSON.stringify(state));
};
/* on clicking guess, or if guess already in progress */


var onGuess = function onGuess(fromClick) {
  setToGuessMode(true);
  $(".progress-bar-timer").addClass("hide");
  if (fromClick && gameStateInfo.guessCount == 0) gameStateInfo.guessCount++;
  $(".guess-chances span").slice(0, gameStateInfo.guessCount - 1).addClass("lost");
  setGameStateGuess();
  $(".guessbox").find("span").each(function () {
    if (!$(this).text().trim().length) {
      $(this).html("<input type='text' maxlength='1'>");
    }
  });
  $(".guessbox input").first().focus();
};
/* on canceling guess mode, remove input boxes */


var revertGuessMode = function revertGuessMode() {
  setToGuessMode(false);
  $(".progress-bar-timer").removeClass("hide");
  $(".guessbox").find("span input").remove();
  if (isProgressInMax()) completeGame();else window.showLetterTimer = setTimeout(function () {
    return showLetter();
  }, LETTER_TIMER);
};

var setupInitGameState = function setupInitGameState() {
  while (gameStateInfo.showLetterCounter <= gameStateInfo.inProgressLetterCounter) {
    showLetter(true);
  }
  /* if today's game in complete, show popup */


  if (gameStateInfo.gameCompleted) {
    /* remove transition for the instruction popup so it hides immediately */
    $(".popup.instructions").addClass("notransition").removeClass("initial-instructions show");
    sendEvent(actions.LOAD_ON_COMPLETE, {
      grade: gameStateInfo.finalGrade
    });
    displayEndPopup(gameStateInfo.finalGrade);
    setupCompleteGame();
    disableBoard();
    updateProgressBar();
  } else if (gameStateInfo.isGuessMode) {
    /* remove transition for the instruction popup so it hides immediately */
    $(".popup.instructions").addClass("notransition").removeClass("initial-instructions show");
    sendEvent(actions.START_ON_GUESS, gameStateInfo.guessCount);
    showCategory();
    onGuess();
    updateProgressBar();
  } else {
    if (gameStateInfo.inProgressLetterCounter >= 0) {
      $(".popup.instructions .play-now").text("Resume Game").addClass("resume");
      sendEvent(actions.SPLASH_PAGE, {
        status: actions.RESUME_GAME
      });
    } else sendEvent(actions.SPLASH_PAGE, {
      status: actions.START_NEW_GAME
    });

    $(".popup.instructions .play-now").on("click", function (e) {
      clearShowLetterTimeout();
      window.showLetterTimer = setTimeout(function () {
        return showLetter();
      }, LETTER_TIMER);
      if ($(e.target).hasClass("resume")) sendEvent(actions.RESUME_GAME, {
        counter: gameStateInfo.inProgressLetterCounter,
        guessCount: gameStateInfo.guessCount
      });else sendEvent(actions.START_NEW_GAME, {});
      updateProgressBar();
      $(".popup.instructions").removeClass("initial-instructions show");
      showCategory();
    });
  }

  $("body").addClass("ready");
};
/* sets game counter in local storage */


var setGameCounter = function setGameCounter() {
  var gs = getObjectItem(items.GAME_STATE);
  gs.counter = gameStateInfo.showLetterCounter;
  localStorage.setItem(items.GAME_STATE, JSON.stringify(gs));
};

var showLetterInBoard = function showLetterInBoard(index, _char) {
  var el = $(".guessbox span").get(index);
  $(el).text(_char).addClass("show-letter");
};

var updateProgressBarFromPenalty = function updateProgressBarFromPenalty() {
  $(".progress-bar-cover").addClass("penalty");
  setTimeout(function () {
    return $(".progress-bar-cover").removeClass("penalty");
  }, 1000);
  updateProgressBar();
};

var isProgressInMax = function isProgressInMax() {
  return Math.ceil(getCurrentPct()) >= 100;
};

var getCurrentPct = function getCurrentPct() {
  var pct = gameStateInfo.displayed / phrazeInfo.letterCount * 100;
  pct += Math.max(gameStateInfo.guessCount - 1, 0) * phrazeInfo.letterPercent;
  return pct;
};

var updateProgressBar = function updateProgressBar() {
  var pct = getCurrentPct();
  $(".progress-bar-cover").css("width", "".concat(Math.min(pct, 100), "%"));
  $(".progress-bar-timer").css("width", "".concat(Math.min(pct + phrazeInfo.letterPercent, 100), "%"));
};

var clearShowLetterTimeout = function clearShowLetterTimeout() {
  if (typeof window.showLetterTimer !== 'undefined') clearTimeout(window.showLetterTimer);
  window.showLetterTimer = undefined;
};
/* get grade based on percentage of letters revealed */


var getGrade = function getGrade(pct) {
  if (pct >= 0 && pct <= 40.0) return grades.A;else if (pct > 40.0 && pct <= 60.0) return grades.B;else if (pct > 60.0 && pct <= 80.0) return grades.C;else if (pct < 99.0) return grades.D;else return grades.F;
};
/* sets the completed game status in local storage */


var setCompleteGameStats = function setCompleteGameStats(grade, pct) {
  var currStats = getObjectItem(items.GAME_STATE);
  currStats.didWin = grade != grades.F;
  currStats.isComplete = true;
  currStats.grade = grade;
  localStorage.setItem(items.GAME_STATE, JSON.stringify(currStats));
  var gameGrades = getObjectItem(items.GRADES);
  var currGradeCount = gameGrades[grade] || 0;
  gameGrades[grade] = currGradeCount + 1;
  var totalPct = gameGrades[items.TOTAL_PCT] || 0;
  gameGrades[items.TOTAL_PCT] = parseFloat(totalPct) + parseFloat(pct);
  localStorage.setItem(items.GRADES, JSON.stringify(gameGrades));
};
/* builds the html for the game stats chart */


var displayStats = function displayStats() {
  var el = $(".game-end-popup .stats");
  var gameGrades = getObjectItem(items.GRADES);
  var overallPct = gameGrades[items.TOTAL_PCT] || 100;
  var gradeObj = Object.keys(gameGrades).filter(function (key) {
    return key.includes('grade');
  }).reduce(function (cur, key) {
    return Object.assign(cur, _defineProperty({}, key, gameGrades[key]));
  }, {});
  var gradeArr = Object.values(gradeObj);
  var max = Math.max.apply(Math, _toConsumableArray(gradeArr)) || 5;
  var gameTotal = gradeArr.reduce(function (a, b) {
    return a + b;
  }, 0);
  var overallGrade = overallPct ? getGrade(overallPct / gameTotal) : "";
  var statsHtml = "\n        <div class=\"chart\">\n            <span data-grade=\"".concat(grades.A, "\">&nbsp;</span>\n            <span data-grade=\"").concat(grades.B, "\">&nbsp;</span>\n            <span data-grade=\"").concat(grades.C, "\">&nbsp;</span>\n            <span data-grade=\"").concat(grades.D, "\">&nbsp;</span>\n            <span data-grade=\"").concat(grades.F, "\">&nbsp;</span>\n        </div>\n        <div class=\"chart-labels\">\n            <span class=\"").concat(grades.A, "\"></span>\n            <span class=\"").concat(grades.B, "\"></span>\n            <span class=\"").concat(grades.C, "\"></span>\n            <span class=\"").concat(grades.D, "\"></span>\n            <span class=\"").concat(grades.F, "\"></span>\n        </div>\n    ");
  var overallStatsHtml = "\n        <div class=\"overall-stats\">\n            <span class=\"game-total\">".concat(gameTotal, "</span>\n            <span class=\"grade ").concat(overallGrade, "\"></span>\n            <h5>Total Games Played</h5>\n            <h5>Overall Grade</h5>\n        </div>\n    ");
  el.html(statsHtml + overallStatsHtml);
  el.find(".chart span").each(function (i, el) {
    var g = $(el).attr("data-grade");
    var ht = (gameGrades[g] || 0) / max * 100;
    $(el).css("height", "".concat(ht, "px"));
    if (gameGrades[g]) $(el).text(gameGrades[g]);
  });
  sendEvent(actions.GAME_END_STATS, {
    gamesPlayed: gameTotal,
    overallGrade: overallGrade
  });
};

var displayEndPopup = function displayEndPopup(grade) {
  $(".guess-action").prop("disabled", true);
  $(".game-end-popup h3").text(messages[grade]);
  $(".game-end-popup h2").addClass(grade).attr("data-grade", grade);
  if (grade === grades.F) $(".game-end-popup p").text(phrazeInfo.today.phraze);
  displayStats();
  $(".game-end-popup").addClass("show");
  $(".bottom-bar .share").show();
};

var completeGame = function completeGame() {
  var grade, pct;
  if (gameStateInfo.gameCompleted) return;
  clearShowLetterTimeout();

  if (gameStateInfo.guessCount > MAX_GUESS) {
    grade = grades.F;
    pct = 100;
  } else {
    pct = getCurrentPct();
    grade = getGrade(pct);
  }

  var gamestate = getObjectItem(items.GAME_STATE);
  if (!gamestate.isComplete) sendEvent(actions.COMPLETE_GAME, {
    grade: grade,
    pct: pct,
    guessCount: gameStateInfo.guessCount,
    answers: gameStateInfo.answers.join(",")
  });
  setCompleteGameStats(grade, pct);
  displayEndPopup(grade);
  gameStateInfo.gameCompleted = true;
};
/* finds and shows the next letter in board */


var showLetter = function showLetter(isSettingUp) {
  var letter = phrazeInfo.pattern[gameStateInfo.showLetterCounter % phrazeInfo.pattern.length];
  var isOddCounter = gameStateInfo.displayed % 2 !== 0;
  /* somewhat randomizing which instance of the letter is displayed */

  var chr = -1;
  if (isOddCounter) chr = phrazeInfo.phraseLetters.indexOf(letter);else chr = phrazeInfo.phraseLetters.lastIndexOf(letter);
  if (!isSettingUp) setGameCounter();

  if (chr != -1) {
    var tempWrd = phrazeInfo.phraseLetters.split("");
    tempWrd[chr] = tempWrd[chr].toLowerCase();
    phrazeInfo.phraseLetters = tempWrd.join("");
    showLetterInBoard(chr, letter);
    gameStateInfo.displayed++;
    gameStateInfo.showLetterCounter++;
    updateProgressBar();

    if (!isSettingUp) {
      clearShowLetterTimeout();
      window.showLetterTimer = setTimeout(function () {
        return showLetter();
      }, LETTER_TIMER);
    }
  } else {
    gameStateInfo.showLetterCounter++;
    showLetter(isSettingUp);
  }

  if (gameStateInfo.displayed == phrazeInfo.letterCount && !isSettingUp || isProgressInMax()) {
    completeGame();
  }
};

var onGuessNowClick = function onGuessNowClick() {
  onGuess(true);
  clearShowLetterTimeout();
  sendEvent(actions.GUESS_CLICK, {
    displayed: gameStateInfo.displayed,
    letterCount: phrazeInfo.letterCount
  });
};

var isGuessCorrect = function isGuessCorrect() {
  var guess = '';
  var invalid = false;
  /* gets the phrase from spans and inputs */

  $(".guessbox span").each(function () {
    if ($(this).find("input").length) {
      if ($(this).find("input").val() === "") {
        $(this).find("input[type='text']").each(function (i, el) {
          if (!$(el).val()) $(el).addClass("empty");
          setTimeout(function () {
            $(".guessbox input.empty").first().focus();
            $(".guessbox input").removeClass("empty");
          }, 300);
        });
        invalid = true;
      }

      guess += $(this).find("input").val() || "";
    } else guess += $(this).text() || "";
  });
  if (invalid) return;
  gameStateInfo.answers.push(guess);
  sendEvent(actions.GUESS_CHECK_CLICK, {
    guess: guess
  });

  if (guess.toUpperCase() == phrazeInfo.phraseLetters.toUpperCase()) {
    return true;
  }

  return false;
};

var onGuessSubmit = function onGuessSubmit(forceIncorrect) {
  var isCorrect = forceIncorrect === true ? false : isGuessCorrect();
  var animTimeout = 1000;
  if (isCorrect) completeGame();else if (isCorrect === false) {
    gameStateInfo.guessCount++;
    $(".guess-chances span").slice(0, gameStateInfo.guessCount - 1).addClass("lost");
    updateProgressBarFromPenalty();
    setGameStateGuess();
    $(".guessbox").addClass("wrong-guess");
    $(".guess-mode-actions .guess-action").prop("disabled", true);
    setTimeout(function () {
      $(".guessbox").removeClass("wrong-guess");
      $(".guessbox input").val("");
      $(".guessbox input").first().focus();
      $(".guess-mode-actions .guess-action").prop("disabled", false);
      if (gameStateInfo.guessCount > MAX_GUESS) completeGame();else revertGuessMode();
    }, animTimeout);
  }
};

var onInputKeyUp = function onInputKeyUp(e) {
  var inputs = $(e.target).closest(".guessbox").find("input[type='text']"); // backspace

  if (e.keyCode == 8) {
    inputs.eq(Math.max(inputs.index(e.target) - 1, 0)).val("").focus();
  } else if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode === 0 || e.keyCode === 229) {
    // a-z 0-9
    // if($(e.target).val() !== "") $(e.target).val(e.key)
    inputs.eq(inputs.index(e.target) + 1).focus();
  } else if (e.keyCode == 13) {
    // enter
    $(".guess-check").click();
  } else if (e.keyCode == 37) {
    // left arrow
    inputs.eq(Math.max(inputs.index(e.target) - 1, 0)).focus();
  }
};

var getSubMessage = function getSubMessage(grade) {
  if (grade === "F" && phrazeInfo.phraseLetters.toLowerCase() === phrazeInfo.phraseLetters) return "Ran out of time!";
  if (grade === "F" && gameStateInfo.guessCount > MAX_GUESS) return "Ran out of guesses!";
  if (grade === "F") return "Ran out of time!";else return "".concat(gameStateInfo.guessCount === 1 ? '1st' : gameStateInfo.guessCount === 2 ? '2nd' : '3rd', " Guess!");
};

var buildPhraseStatus = function buildPhraseStatus(grade) {
  var spaceIndices = [];
  var phrase = "";
  var offset = 0;

  for (var i = 0; i < phrazeInfo.today.phraze.length; i++) {
    if (phrazeInfo.today.phraze[i] === " ") spaceIndices.push(i);
  }

  for (var _i = 0; _i < phrazeInfo.phraseLetters.length; _i++) {
    // add newline to most recent space
    if (_i >= 10 && _i % 10 == 0) {
      var lastSpace = phrase.lastIndexOf(" ");
      phrase = "".concat(phrase.substring(0, lastSpace), "\n\n").concat(phrase.substring(lastSpace + 1));
    }

    if (spaceIndices.indexOf(_i + offset) > -1) {
      phrase += "  ";
      offset++;
    }

    if (phrazeInfo.phraseLetters[_i] === phrazeInfo.phraseLetters[_i].toUpperCase()) {
      if (grade === "F") phrase += emojis.RED_BOX;else phrase += emojis.GREEN_BOX;
    } else phrase += emojis.REVEALED_BOX;
  }

  return phrase;
};

var shareCurrentGradeMessage = function shareCurrentGradeMessage(grade) {
  return "Phraze ".concat(todaysDayInYear(), ",'").concat(todaysDate.getFullYear().toString().substring(2), "\nGrade: ").concat(grade, ", ").concat(getSubMessage(grade), "\n\n").concat(buildPhraseStatus(grade));
};

var shareTotalGradeMessage = function shareTotalGradeMessage() {
  return "";
};

var shareStats = function shareStats(e) {
  var grade = $(".game-end-popup h2.grade").attr("data-grade");
  var message;
  grade = Object.keys(grades).find(function (key) {
    return grades[key] === grade;
  });

  if (grade) {
    message = shareCurrentGradeMessage(grade);
  } else {
    message = shareTotalGradeMessage();
  }

  $("body").append("<textarea class='share-msg'></textarea>");
  $(".share-msg").html(message);

  if (navigator.share) {
    navigator.share({
      title: "Get Phrazy",
      url: "https://getphrazy.com/",
      text: $(".share-msg").html()
    }).then(function () {
      console.log('Thanks for sharing!');
    })["catch"](console.error);
    sendEvent(actions.SHARE_CLICK, "Navigator share");
  } else {
    $(".share-msg").select();
    document.execCommand("copy");
    $(".share").removeClass("copied");
    setTimeout(function () {
      return $(".share").addClass("copied");
    }, 100);
    sendEvent(actions.SHARE_CLICK, "Copy to clipboard");
  }

  $(".share-msg").remove();
};

var onClosePopup = function onClosePopup(e) {
  $(e.target).parents(".popup").removeClass("non-actionable show");
};

var onPopupClick = function onPopupClick(e) {
  if ($(e.target).hasClass("initial-instructions") || $(e.target).parents(".initial-instructions").length) return;

  if (!$(e.target).hasClass("popup-content") && !$(e.target).parents(".popup-content").length) {
    $(".popup:not(.initial-instructions)").removeClass("show");
  }
};

var onGuessCancel = function onGuessCancel() {
  onGuessSubmit(true);
  sendEvent(actions.GUESS_CANCEL_CLICK, {
    displayed: gameStateInfo.displayed,
    letterCount: phrazeInfo.letterCount
  });
};

var displayOverallStatsPopup = function displayOverallStatsPopup() {
  if ($(".game-end-popup h3").text() === "") {
    $(".game-end-popup h3").text(messages.OVERALL);
    $(".bottom-bar .share").hide();
  } else $(".bottom-bar .share").show();

  displayStats();
  $(".game-end-popup").addClass("show");
  sendEvent(actions.STATS_CLICK);
};

var displayInstructions = function displayInstructions() {
  $(".popup.instructions").removeClass("notransition").addClass("non-actionable show");
  sendEvent(actions.INFO_CLICK);
};

var toggleMenu = function toggleMenu() {
  $(".main-nav ul").toggleClass("show");
  sendEvent(actions.MENU_CLICK);
};

var checkForOpenMenu = function checkForOpenMenu(e) {
  if (!$(e.target).hasClass("nav-list") && !$(e.target).parents(".nav-list").length && !$(e.target).hasClass("menu-icon")) {
    $(".main-nav ul").removeClass("show");
  }
};

var addEventListeners = function addEventListeners() {
  $(".guess-now").on("click", onGuessNowClick);
  $(".guess-check").on("click", onGuessSubmit);
  $(".guess-cancel").on("click", onGuessCancel);
  $(".main-section").on("keyup", "input[type='text']", function (e) {
    return onInputKeyUp(e);
  });
  $(".bottom-bar .share").on("click", shareStats);
  $(".popup .close-popup").on("click", function (e) {
    return onClosePopup(e);
  });
  $(".popup").on("click", function (e) {
    return onPopupClick(e);
  });
  $("header .game-actions .game-stats").on("click", displayOverallStatsPopup);
  $("header .game-actions .game-info").on("click", displayInstructions);
  $("header .game-actions .menu-icon").on("click", toggleMenu);
  $("body").on("click", checkForOpenMenu);
};
/* get local storage object */


var getObjectItem = function getObjectItem(key) {
  var state = localStorage.getItem(key) || "{}";
  return $.parseJSON(state);
};

var sendEvent = function sendEvent(action, values) {
  if (window.gtag && window.location.search.indexOf("debug=true") === -1) {
    gtag("event", action, {
      data: JSON.stringify(values)
    });
  }
};

var startGame = function startGame() {
  /* set up phrase board */
  setupBoard();
  /* set up percentage markers in progress bar */

  initProgressBar();
  /* get and set today's game state data if any */

  getTodaysGameState();
  /* initialize countdown until next phraze */

  initNextPhrazeCountdown();
  /* setup game state considering in progress data */

  setupInitGameState();
  addEventListeners();
};