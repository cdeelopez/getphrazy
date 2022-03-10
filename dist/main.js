"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Quick proj
 * TODO: REFACTOR / CLEANUP!!!!
 * 
 */
var setupGame = function setupGame(guessme) {
  var html = '<div>';
  var isSpace = false;

  var _iterator = _createForOfIteratorHelper(guessme),
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

var getPhrases = function getPhrases(cb) {
  $.getJSON("./phrazes-cat.json", function (data) {
    cb(data.phrazes);
  }).fail(function () {
    console.log("An error has occurred.");
  });
};

$(function () {
  var todaysDt = new Date();
  var todaysPattern = pattern[todaysDt.getDay()];
  var phrases;
  var guessme;
  var todaysPhraze;
  var guessmeLetters;
  var lettersCnt;
  var counter = 0;
  var showLetterTimer;
  var displayed = 0;
  var guessCnt = 1;
  var gameCompleted = false;
  getPhrases(function (p) {
    phrases = p;
    startGame();
  });

  var startGame = function startGame() {
    todaysPhraze = phrases[todaysDayInYear() % phrases.length];
    guessme = todaysPhraze.phraze.toUpperCase();
    guessmeLetters = guessme.split(" ").join("");
    lettersCnt = guessmeLetters.length;
    setupGame(guessme);
    initProgress(lettersCnt);
    initNextPhrazeCountdown();
    var todaysState = getTodaysStat();

    while (counter <= todaysState.counter) {
      showLetter(true);
    }

    if (todaysState.isComplete) {
      $(".popup.instructions").addClass("notransition").removeClass("initial-instructions show");
      displayEndPopup(todaysState.grade);
      setupCompleteGame(guessmeLetters, todaysState.grade === grades.F);
      $(".guess-now").prop("disabled", true);
      $(".progress-bar-timer").addClass("hide");
      $(".guessbox").addClass("playing");
    } else if (todaysState.guessCnt) {
      $(".popup.instructions").addClass("notransition").removeClass("initial-instructions show");
      guessCnt = todaysState.guessCnt;
      showCategory();
      onGuess(guessCnt);
    } else {
      $(".popup.instructions .play-now").on("click", function () {
        if (!todaysState.isComplete && !todaysState.guessCnt) {
          if (typeof showLetterTimer !== 'undefined') clearTimeout(showLetterTimer);
          showLetterTimer = setTimeout(function () {
            return showLetter();
          }, LETTER_TIMER);
        }

        updateProgress(displayed, lettersCnt);
        $(".popup.instructions").removeClass("initial-instructions show");
        showCategory();
      });
    }

    $("body").addClass("ready");
  };

  var showCategory = function showCategory() {
    $(".guessbox h2").text(todaysPhraze.category).addClass("show").parent().addClass("ready");
  };

  var endGame = function endGame() {
    if (gameCompleted) return;
    clearTimeout(showLetterTimer);
    showLetterTimer = undefined;
    setStats(grades.F, 100, guessmeLetters);
    displayEndPopup(grades.F);
    gameCompleted = true;
  };

  var winGame = function winGame() {
    if (gameCompleted) return;
    var pct = displayed / lettersCnt * 100;
    pct += (guessCnt - 1) * 5;
    var grade = getGrade(pct);
    setStats(grade, pct, guessmeLetters);
    displayEndPopup(grade);
    gameCompleted = true;
  };

  var displayEndPopup = function displayEndPopup(grade) {
    $(".guess-action").prop("disabled", true);
    $(".game-end-popup h3").text(messages[grade]);
    $(".game-end-popup h2").addClass(grade).attr("data-grade", grade);
    if (grade === grades.F) $(".game-end-popup p").text(guessme);
    displayStats();
    $(".game-end-popup").addClass("show");
  };

  var displayOverallStatsPopup = function displayOverallStatsPopup() {
    if ($(".game-end-popup h3").text() === "") $(".game-end-popup h3").text(messages.OVERALL);
    displayStats();
    $(".game-end-popup").addClass("show");
  };

  var displayInstructions = function displayInstructions() {
    $(".popup.instructions").removeClass("notransition").addClass("non-actionable show");
  };

  var showLetter = function showLetter(isSettingUp) {
    var letter = todaysPattern[counter % todaysPattern.length];
    var isOddCounter = counter % 2 !== 0;
    var chr = -1;
    if (!isSettingUp) setGameState(counter);
    if (isOddCounter) chr = guessmeLetters.indexOf(letter);else chr = guessmeLetters.lastIndexOf(letter);

    if (chr != -1) {
      var tempWrd = guessmeLetters.split("");
      tempWrd[chr] = tempWrd[chr].toLowerCase();
      guessmeLetters = tempWrd.join("");
      var el = $(".guessbox span").get(chr);
      $(el).text(letter);
      displayed++;
      counter++;
      updateProgress(displayed, lettersCnt);

      if (!isSettingUp) {
        if (typeof showLetterTimer !== 'undefined') clearTimeout(showLetterTimer);
        showLetterTimer = setTimeout(function () {
          return showLetter(isSettingUp);
        }, LETTER_TIMER);
      }
    } else {
      counter++;
      showLetter(isSettingUp);
    }

    if (displayed == lettersCnt && !isSettingUp) {
      endGame();
    }
  };

  $(".guess-now").on("click", function () {
    onGuess();
    clearTimeout(showLetterTimer);
    showLetterTimer = undefined;
  });
  $(".guess-check").on("click", function () {
    var isCorrect = onGuessSubmit(guessmeLetters);
    if (isCorrect) winGame();else if (isCorrect === false) {
      guessCnt++;
      $(".guess-chances span").slice(0, (guessCnt || 1) - 1).addClass("lost");
      updateProgressFromWrongGuess(displayed, lettersCnt, guessCnt);
      setGameStateGuess(guessCnt);
      $(".guessbox").addClass("wrong-guess");
      setTimeout(function () {
        $(".guessbox").removeClass("wrong-guess");
        $(".guessbox input").val("");
        $(".guessbox input").first().focus();
        if (guessCnt > MAX_GUESS) endGame();
      }, 1000);
    }
  });
  $(".main-section").on("keyup", "input[type='text']", function (e) {
    var inputs = $(e.target).closest(".guessbox").find("input[type='text']"); // backspace

    if (e.keyCode == 8) {
      inputs.eq(Math.max(inputs.index(e.target) - 1, 0)).val("").focus();
    } else if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90) {
      // a-z 0-9
      if ($(e.target).val() !== "") $(e.target).val(e.key);
      inputs.eq(inputs.index(e.target) + 1).focus();
    } else if (e.keyCode == 13) {
      // enter
      $(".guess-check").click();
    } else if (e.keyCode == 37) {
      // left arrow
      inputs.eq(Math.max(inputs.index(e.target) - 1, 0)).focus();
    }
  });
  $(".bottom-bar .share").on("click", function () {
    var a = shareStats(guessme, guessmeLetters, guessCnt);
  });
  $(".popup .close-popup").on("click", function () {
    $(this).parents(".popup").removeClass("non-actionable show");
  });
  $(".popup").on("click", function (e) {
    if ($(e.target).hasClass("initial-instructions") || $(e.target).parents(".initial-instructions").length) return;

    if (!$(e.target).hasClass("popup-content") && !$(e.target).parents(".popup-content").length) {
      $(".popup:not(.initial-instructions)").removeClass("show");
    }
  });
  $("header .game-actions .game-stats").on("click", displayOverallStatsPopup);
  $("header .game-actions .game-info").on("click", displayInstructions);
});

var setupCompleteGame = function setupCompleteGame(endLetters, isFailed) {
  $(".guessbox").find("span").each(function (i) {
    if (!$(this).text().trim().length) {
      $(this).html("<input class='".concat(isFailed ? "wrong-letter" : "correct-letter", "' type='text' maxlength='1' value='").concat(endLetters.charAt(i) || "", "' disabled>"));
    }
  });
};

var setGameState = function setGameState(counter) {
  localStorage.setItem(items.GAME_STATE, "{ \"counter\": ".concat(counter, " }"));
};

var getTodaysStat = function getTodaysStat() {
  // remove dep - wipeout
  if (localStorage.getItem(items.LAST_PLAYED_DEP)) {
    localStorage.removeItem(items.LAST_PLAYED_DEP);
    localStorage.removeItem(items.GAME_STATE);
    localStorage.removeItem(items.GRADES);
    localStorage.removeItem(items.TOTAL_PCT);
  }

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

  return getObjectItem(items.GAME_STATE);
};

var getObjectItem = function getObjectItem(key) {
  var state = localStorage.getItem(key) || "{}";
  return $.parseJSON(state);
};

var onGuess = function onGuess(guessCnt) {
  setToGuessMode();
  $(".progress-bar-timer").addClass("hide");
  $(".guess-chances span").slice(0, (guessCnt || 1) - 1).addClass("lost");
  setGameStateGuess(guessCnt || 1);
  $(".guessbox").find("span").each(function () {
    if (!$(this).text().trim().length) {
      $(this).html("<input type='text' maxlength='1'>");
    }
  });
  $(".guessbox input").first().focus();
};

var onGuessSubmit = function onGuessSubmit(answer) {
  var guess = '';
  var invalid = false;
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

  if (guess.toUpperCase() == answer.toUpperCase()) {
    return true;
  }

  return false;
};

var setToGuessMode = function setToGuessMode() {
  $(".main-section").addClass("guess-mode");
  $(".guess-now").remove();
};

var setGameStateGuess = function setGameStateGuess(guessCnt) {
  var state = getObjectItem(items.GAME_STATE);
  state.guessCnt = guessCnt;
  localStorage.setItem(items.GAME_STATE, JSON.stringify(state));
};

var setStats = function setStats(grade, pct, guessmeLetters) {
  var currStats = getObjectItem(items.GAME_STATE);
  currStats.didWin = grade != grades.F;
  currStats.isComplete = true;
  currStats.grade = grade;
  currStats.endLetters = guessmeLetters;
  localStorage.setItem(items.GAME_STATE, JSON.stringify(currStats));
  var gameGrades = getObjectItem(items.GRADES);
  var currGradeCount = gameGrades[grade] || 0;
  gameGrades[grade] = currGradeCount + 1;
  var totalPct = gameGrades[items.TOTAL_PCT] || 0;
  gameGrades[items.TOTAL_PCT] = parseFloat(totalPct) + parseFloat(pct);
  localStorage.setItem(items.GRADES, JSON.stringify(gameGrades));
};

var getGrade = function getGrade(pct) {
  if (pct >= 0 && pct <= 40.0) return grades.A;else if (pct > 40.0 && pct <= 60.0) return grades.B;else if (pct > 60.0 && pct <= 80.0) return grades.C;else if (pct < 100.0) return grades.D;else return grades.F;
};

var shareStats = function shareStats(origWord, word, guessCnt) {
  var grade = $(".game-end-popup h2.grade").attr("data-grade");
  grade = Object.keys(grades).find(function (key) {
    return grades[key] === grade;
  });
  var message = "Phraze ".concat(todaysDayInYear(), ",'").concat(new Date().getFullYear().toString().substring(2), "\nGrade: ").concat(grade, ", ").concat(getSubMsg(grade, word, guessCnt), "\n\n").concat(buildPhraseStatus(origWord, word, grade));
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
  } else {
    $(".share-msg").select();
    document.execCommand("copy");
  }

  $(".share-msg").remove();
};

var getSubMsg = function getSubMsg(grade, word, guessCnt) {
  if (grade === "F" && word.toLowerCase() === word) return "Ran out of time!";
  if (grade === "F") return "Ran out of guesses!";else return "".concat(guessCnt === 1 ? '1st' : guessCnt === 2 ? '2nd' : '3rd', " Guess!");
};

var buildPhraseStatus = function buildPhraseStatus(origWord, word, grade) {
  var spaceIndices = [];
  var phrase = "";
  var offset = 0;

  for (var i = 0; i < origWord.length; i++) {
    if (origWord[i] === " ") spaceIndices.push(i);
  }

  for (var _i = 0; _i < word.length; _i++) {
    // add newline to most recent space
    if (_i >= 10 && _i % 10 == 0) {
      var lastSpace = phrase.lastIndexOf(" ");
      phrase = "".concat(phrase.substring(0, lastSpace), "\n\n").concat(phrase.substring(lastSpace + 1));
    }

    if (spaceIndices.indexOf(_i + offset) > -1) {
      phrase += "  ";
      offset++;
    }

    if (word[_i] === word[_i].toUpperCase()) {
      if (grade === "F") phrase += emojis.RED_BOX;else phrase += emojis.GREEN_BOX;
    } else phrase += emojis.REVEALED_BOX;
  }

  return phrase;
};

var replaceAt = function replaceAt(word, index, _char) {
  word.substr(0, index) + _char + word.substrr(index + _char.length);
};

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
};

var updateProgress = function updateProgress(displayed, lettersCnt) {
  var p = displayed / lettersCnt * 100;
  var ptimer = Math.min((displayed + 1) / lettersCnt * 100, 100);
  $(".progress-bar-cover").css("width", "".concat(p, "%"));
  $(".progress-bar-timer").css("width", "".concat(ptimer, "%"));
};

var updateProgressFromWrongGuess = function updateProgressFromWrongGuess(displayed, lettersCnt, guessCnt) {
  var pct = displayed / lettersCnt * 100;
  pct += (guessCnt - 1) * 5;
  $(".progress-bar-cover").css("width", "".concat(pct, "%"));
};

var initProgress = function initProgress(lettersCnt) {
  var letterPct = 1 / lettersCnt * 100;

  for (var i = 0; i < lettersCnt - 1; i++) {
    $(".progress-bar").append("<small class=\"divider\" style=\"left:".concat(letterPct * (i + 1), "%\"></small>"));
  }
};

var getTodaysDt = function getTodaysDt() {
  var dt = new Date();
  return "".concat(dt.getMonth() + 1, "/").concat(dt.getDate(), "/").concat(dt.getFullYear());
};

var todaysDayInYear = function todaysDayInYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

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

  if (hours === "00" && minutes === "00" && seconds === "01") {
    location.reload();
  }
};

var initNextPhrazeCountdown = function initNextPhrazeCountdown() {
  if (typeof window.nextPhrazeInterval != 'undefined') clearInterval(window.nextPhrazeInterval);
  displayCountdown();
  window.nextPhrazeInterval = setInterval(function () {
    displayCountdown();
  }, 1000);
};

var randomizeItems = function randomizeItems(items) {
  return items.map(function (a) {
    return {
      sort: Math.random(),
      value: a
    };
  }).sort(function (a, b) {
    return a.sort - b.sort;
  }).map(function (a) {
    return a.value;
  });
};

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
var MAX_GUESS = 3;
var LETTER_TIMER = 5000;
var GUESS_PENALTY = 5;