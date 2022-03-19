const phrazeInfo = {
    today: {
        phraze: "",
        category: ""
    },
    phraseLetters: "",
    letterCount: 0,
    letterPercent: 0,
    pattern: []
}
const gameStateInfo = {
    inProgressLetterCounter: -1,
    showLetterCounter: 0,
    displayed: 0,
    guessCount: 0,
    gameCompleted: false,
    finalGrade: "",
    answers: []
}
const todaysDate = new Date()

const items = {
    LAST_PLAYED_DEP: "last-played-date",
    LAST_PLAYED_PHRAZE: "last-played-phraze",
    GAME_STATE: "game-state",
    GRADES: "grades",
    TOTAL_PCT: "overall-pct-shown"
}

const messages = {
    "grade-a": "Rockstar!",
    "grade-b": "You got it!",
    "grade-c": "Good Guess!",
    "grade-d": "Phew, that was close!",
    "grade-f": "Better luck next time?",
    OVERALL: "Overall Game Stats"
}

const grades = {
    A: "grade-a",
    B: "grade-b",
    C: "grade-c",
    D: "grade-d",
    F: "grade-f",
}

const emojis = {
    GREEN_BOX: "&#129001;",
    REVEALED_BOX: "&#128307;",
    RED_BOX: "&#128997;" 
}

const actions = {
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
}

const MAX_GUESS = 3
const LETTER_TIMER = 5000

$(function() {
    getPhrases((phrases) => {
        setupPhrazeInfo(phrases[todaysDayInYear() % phrases.length])
        startGame()
    })

    
})

/* get phrases from json file */
const getPhrases = (cb) => {
    $.getJSON("./data/pdata.json", function(data){
        cb(data.phrazes)
    }).fail(function(){
        console.log("An error has occurred.")
    })
}

const setupPhrazeInfo = (phrase) => {
    //phrazeInfo.pattern = pattern[todaysDate.getDay()]
    phrazeInfo.pattern = phrase.pattern
    phrazeInfo.today = {...phrase, phraze: phrase.phraze.toUpperCase() }
    phrazeInfo.phraseLetters = phrase.phraze.split(" ").join("")
    phrazeInfo.letterCount = phrazeInfo.phraseLetters.length
    phrazeInfo.letterPercent = (1 / phrazeInfo.letterCount) * 100
}

const treatAsUTC = (date) => {
    const result = new Date(date)
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
    return result
}

/* gets today's day in the year */
const todaysDayInYear = () => {
    const today = new Date()
    const millisecondsPerDay = 24 * 60 * 60 * 1000
    const start = new Date(today.getFullYear(), 0, 0)
    return Math.floor((treatAsUTC(today) - treatAsUTC(start)) / millisecondsPerDay)
}

/* set up phrase board */
const setupBoard = () => {
    let html = '<div>'
    let isSpace = false
    for (const chr of phrazeInfo.today.phraze) {
        if (chr === " ") { 
            isSpace = true 
            html += '</div><div>'
        }
        else {
            html += `<span class="${isSpace ? "has-space" : ""}"></span>`
            isSpace = false
        }
    }
    html += '</div>'

    $(".guessbox .guess-section").html(html)
}

 /* set up percentage markers in progress bar */
const initProgressBar = () => {
    for(let i = 0; i < phrazeInfo.letterCount - 1; i++) {
        $(".progress-bar").append(`<small class="divider" style="left:${phrazeInfo.letterPercent * (i+1)}%"></small>`)
    }
}

/* initialize countdown until next phraze */
const initNextPhrazeCountdown = () => {
    if(typeof window.nextPhrazeInterval != 'undefined')
        clearInterval(window.nextPhrazeInterval)

    displayCountdown()

    window.nextPhrazeInterval = setInterval(() => {
        displayCountdown()
    }, 1000)
}

/* displays the countdown text */
const displayCountdown = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const total = Date.parse(tomorrow) - Date.parse(today);
    const seconds = ('0'+Math.floor((total / 1000) % 60)).slice(-2);
    const minutes = ('0'+Math.floor((total / 1000 / 60) % 60)).slice(-2);
    const hours = ('0'+Math.floor((total / (1000 * 60 * 60)) % 24)).slice(-2);

    $(".game-end-popup .next-phraze span").text(`${hours}:${minutes}:${seconds}`)

    if (total <= 0 && typeof window.nextPhrazeInterval != 'undefined') {
        clearInterval(window.nextPhrazeInterval)
    }

    const lastPlayedPhraze = localStorage.getItem(items.LAST_PLAYED_PHRAZE)
    if (lastPlayedPhraze && lastPlayedPhraze != todaysDayInYear()) {
        clearInterval(window.nextPhrazeInterval)
        sendEvent(actions.NEXT_DAY_RELOAD)
        setTimeout(() => { location.reload() }, 500)
    }
}

/* get today's game state if any */
const getTodaysGameState = () => {
    // remove dep - wipeout old storage items
    if(localStorage.getItem(items.LAST_PLAYED_DEP)) {
        localStorage.removeItem(items.LAST_PLAYED_DEP)
        localStorage.removeItem(items.GAME_STATE)
        localStorage.removeItem(items.GRADES)
        localStorage.removeItem(items.TOTAL_PCT)
    }
    // remove dep - cleanup
    if(localStorage.getItem(items.TOTAL_PCT)) {
        const grades = getObjectItem(items.GRADES)
        grades[items.TOTAL_PCT] = localStorage.getItem(items.TOTAL_PCT) || 0
        localStorage.setItem(items.GRADES, JSON.stringify(grades))
        localStorage.removeItem(items.TOTAL_PCT)
    }
    const lastPlayed = localStorage.getItem(items.LAST_PLAYED_PHRAZE)
    const todaysDay = todaysDayInYear()
    if(lastPlayed != todaysDay) {
        localStorage.setItem(items.LAST_PLAYED_PHRAZE,todaysDay)
        localStorage.removeItem(items.GAME_STATE)
    }

    const inProgressStats = getObjectItem(items.GAME_STATE)
    if (typeof inProgressStats.counter === "number" && inProgressStats.counter >= 0) setTodaysState(inProgressStats)
    else localStorage.removeItem(items.GAME_STATE)
}

/* if game is in progress set today's state */
const setTodaysState = (stats) => {
    gameStateInfo.inProgressLetterCounter = stats.counter
    gameStateInfo.gameCompleted = stats.isComplete || false
    gameStateInfo.finalGrade = stats.grade || ""
    gameStateInfo.guessCount = stats.guessCnt || 0
    gameStateInfo.isGuessMode = stats.isGuessMode || false
}

/* show the completed board */
const setupCompleteGame = () => {
    const isFailed = gameStateInfo.finalGrade == grades.F
    $(".guessbox").find("span").each(function(i) {
         if(!$(this).text().trim().length) {
             $(this).html(`<input class='${isFailed ? "wrong-letter": "correct-letter"}' type='text' maxlength='1' value='${phrazeInfo.phraseLetters.charAt(i) || ""}' disabled>`)
         }
     })
 }

 const disableBoard = () => {
    $(".guess-action").prop("disabled",true)
    $(".progress-bar-timer").addClass("hide")
    $(".guessbox").addClass("playing")
 }

 const showCategory = () => {
    $(".guessbox h2").text(phrazeInfo.today.category)
        .addClass("show")
        .parent().addClass("ready")
}

const setGameStateGuess = () => {
    const state = getObjectItem(items.GAME_STATE)
    state.guessCnt = gameStateInfo.guessCount
    localStorage.setItem(items.GAME_STATE, JSON.stringify(state))
}

const setToGuessMode = (isGuessMode) => {
    if (isGuessMode) {
        $(".main-section").addClass("guess-mode")
    } else {
        $(".main-section").removeClass("guess-mode")
    }
    const state = getObjectItem(items.GAME_STATE)
    state.isGuessMode = isGuessMode
    localStorage.setItem(items.GAME_STATE, JSON.stringify(state))
}

/* on clicking guess, or if guess already in progress */
const onGuess = (fromClick) => {
    setToGuessMode(true)
    $(".progress-bar-timer").addClass("hide")

    if (fromClick && gameStateInfo.guessCount == 0) gameStateInfo.guessCount++
    $(".guess-chances span").slice(0, (gameStateInfo.guessCount-1)).addClass("lost")

    setGameStateGuess()
    $(".guessbox").find("span").each(function() {
        if(!$(this).text().trim().length) {
            $(this).html("<input type='text' maxlength='1'>")
        }
    })
    $(".guessbox input").first().focus()
}

/* on canceling guess mode, remove input boxes */
const revertGuessMode = () => {
    setToGuessMode(false)

    $(".progress-bar-timer").removeClass("hide")
    $(".guessbox").find("span input").remove()

    if(isProgressInMax()) completeGame()
    else window.showLetterTimer = setTimeout(() => showLetter(), LETTER_TIMER)
}

const setupInitGameState = () => {
    while(gameStateInfo.showLetterCounter <= gameStateInfo.inProgressLetterCounter)
        showLetter(true)

    /* if today's game in complete, show popup */
    if(gameStateInfo.gameCompleted) {
        /* remove transition for the instruction popup so it hides immediately */
        $(".popup.instructions").addClass("notransition").removeClass("initial-instructions show")

        sendEvent(actions.LOAD_ON_COMPLETE, {grade: gameStateInfo.finalGrade})
            
        displayEndPopup(gameStateInfo.finalGrade)
        setupCompleteGame()
        disableBoard()

        updateProgressBar()
    } else if(gameStateInfo.isGuessMode) {
        /* remove transition for the instruction popup so it hides immediately */
        $(".popup.instructions").addClass("notransition").removeClass("initial-instructions show")

        sendEvent(actions.START_ON_GUESS, gameStateInfo.guessCount)
        showCategory()
        onGuess()
        updateProgressBar()
    } else { 
        if(gameStateInfo.inProgressLetterCounter >= 0) {
            $(".popup.instructions .play-now").text("Resume Game").addClass("resume")
            sendEvent(actions.SPLASH_PAGE, { status: actions.RESUME_GAME })
        } else sendEvent(actions.SPLASH_PAGE, { status: actions.START_NEW_GAME })
        $(".popup.instructions .play-now").on("click", (e) => {
            clearShowLetterTimeout()
            window.showLetterTimer = setTimeout(() => showLetter(), LETTER_TIMER)

            if($(e.target).hasClass("resume")) sendEvent(actions.RESUME_GAME, { counter: gameStateInfo.inProgressLetterCounter, guessCount: gameStateInfo.guessCount})
            else sendEvent(actions.START_NEW_GAME, {}) 
            
            updateProgressBar()
            $(".popup.instructions").removeClass("initial-instructions show")
            showCategory()
        })
    }

    $("body").addClass("ready")
}

/* sets game counter in local storage */
const setGameCounter = () => {
    const gs = getObjectItem(items.GAME_STATE)
    gs.counter = gameStateInfo.showLetterCounter
    localStorage.setItem(items.GAME_STATE, JSON.stringify(gs))
}

const showLetterInBoard = (index, char) => {
    const el = $(".guessbox span").get(index)
    $(el).text(char).addClass("show-letter")
}

const updateProgressBarFromPenalty = () => {
    $(".progress-bar-cover").addClass("penalty")
    setTimeout(() => $(".progress-bar-cover").removeClass("penalty"), 1000)
    updateProgressBar()
}

const isProgressInMax = () => {
    return Math.ceil(getCurrentPct()) >= 100
}

const getCurrentPct = () => {
    let pct = (gameStateInfo.displayed / phrazeInfo.letterCount) * 100
    pct += (Math.max(gameStateInfo.guessCount - 1, 0)) * phrazeInfo.letterPercent

    return pct
}

const updateProgressBar = () => {
    const pct = getCurrentPct()

    $(".progress-bar-cover").css("width", `${Math.min(pct, 100)}%`)
    $(".progress-bar-timer").css("width", `${Math.min(pct + phrazeInfo.letterPercent, 100)}%`)
}

const clearShowLetterTimeout = () => {
    if(typeof window.showLetterTimer !== 'undefined') clearTimeout(window.showLetterTimer)
    window.showLetterTimer = undefined
}

/* get grade based on percentage of letters revealed */
const getGrade = (pct) => {
    if(pct >= 0 && pct <= 40.0) return grades.A
    else if(pct > 40.0 && pct <= 60.0) return grades.B
    else if(pct > 60.0 && pct <= 80.0) return grades.C
    else if(pct < 99.0) return grades.D
    else return grades.F
}

/* sets the completed game status in local storage */
const setCompleteGameStats = (grade, pct) => {
    const currStats = getObjectItem(items.GAME_STATE)
    currStats.didWin = grade != grades.F
    currStats.isComplete = true
    currStats.grade = grade
    localStorage.setItem(items.GAME_STATE, JSON.stringify(currStats))

    const gameGrades = getObjectItem(items.GRADES)
    const currGradeCount = gameGrades[grade] || 0
    gameGrades[grade] = currGradeCount + 1
    const totalPct = gameGrades[items.TOTAL_PCT] || 0
    gameGrades[items.TOTAL_PCT] = parseFloat(totalPct) + parseFloat(pct)
    localStorage.setItem(items.GRADES, JSON.stringify(gameGrades))
}

/* builds the html for the game stats chart */
const displayStats = () => {
    const el = $(".game-end-popup .stats")
    const gameGrades = getObjectItem(items.GRADES)
    const overallPct = gameGrades[items.TOTAL_PCT] || 100
    const gradeObj = Object.keys(gameGrades).
                    filter((key) => key.includes('grade')).
                    reduce((cur, key) => Object.assign(cur, { [key]: gameGrades[key] }), {})
    const gradeArr = Object.values(gradeObj)
    const max = Math.max(...gradeArr) || 5
    const gameTotal = gradeArr.reduce((a, b) => a + b, 0)
    const overallGrade = overallPct ? getGrade(overallPct / gameTotal) : ""
    const statsHtml =  `
        <div class="chart">
            <span data-grade="${grades.A}">&nbsp;</span>
            <span data-grade="${grades.B}">&nbsp;</span>
            <span data-grade="${grades.C}">&nbsp;</span>
            <span data-grade="${grades.D}">&nbsp;</span>
            <span data-grade="${grades.F}">&nbsp;</span>
        </div>
        <div class="chart-labels">
            <span class="${grades.A}"></span>
            <span class="${grades.B}"></span>
            <span class="${grades.C}"></span>
            <span class="${grades.D}"></span>
            <span class="${grades.F}"></span>
        </div>
    `
    const overallStatsHtml = `
        <div class="overall-stats">
            <span class="game-total">${gameTotal}</span>
            <span class="grade ${overallGrade}"></span>
            <h5>Total Games Played</h5>
            <h5>Overall Grade</h5>
        </div>
    `
  
    el.html(statsHtml + overallStatsHtml)
    
    el.find(".chart span").each((i, el) => {
        const g = $(el).attr("data-grade")
        const ht = ((gameGrades[g] || 0) / max) * 100
        $(el).css("height", `${ht}px`)
        if(gameGrades[g]) $(el).text(gameGrades[g])
    })

    sendEvent(actions.GAME_END_STATS, { gamesPlayed: gameTotal, overallGrade: overallGrade })
}

const displayEndPopup = (grade) => {
    $(".guess-action").prop("disabled",true)
    $(".game-end-popup h3").text(messages[grade])
    $(".game-end-popup h2").addClass(grade)
                .attr("data-grade", grade)
    if (grade === grades.F) $(".game-end-popup p").text(phrazeInfo.today.phraze)
    displayStats()
    $(".game-end-popup").addClass("show")
    $(".bottom-bar .share").show()
}

const completeGame = () => {
    let grade, pct
    if(gameStateInfo.gameCompleted) return
    clearShowLetterTimeout()

    if(gameStateInfo.guessCount > MAX_GUESS) {
        grade = grades.F
        pct = 100
    } else {
        pct = getCurrentPct()
        grade = getGrade(pct)
    }

    const gamestate = getObjectItem(items.GAME_STATE)
    if(!gamestate.isComplete) sendEvent(actions.COMPLETE_GAME, { grade: grade, pct: pct.toFixed(2), phraze: todaysDayInYear(),guessCount: gameStateInfo.guessCount, answers: gameStateInfo.answers.join(",") })

    setCompleteGameStats(grade, pct)

    displayEndPopup(grade)
    gameStateInfo.gameCompleted = true
}

/* finds and shows the next letter in board */
const showLetter = (isSettingUp) => {
   
    if(!isSettingUp) setGameCounter()

    const chr = phrazeInfo.pattern.indexOf(gameStateInfo.showLetterCounter++)
    if(chr == -1) { 
        completeGame() 
        return
    }
      
    const letter = phrazeInfo.phraseLetters.charAt(chr)
    const tempWrd = phrazeInfo.phraseLetters.split("")
    tempWrd[chr] = tempWrd[chr].toLowerCase()
    phrazeInfo.phraseLetters = tempWrd.join("")
    showLetterInBoard(chr, letter)
    
    gameStateInfo.displayed++

    updateProgressBar()

    if(!isSettingUp) {
        clearShowLetterTimeout()
        window.showLetterTimer = setTimeout(() => showLetter(), LETTER_TIMER)
    }

    if ((gameStateInfo.showLetterCounter == phrazeInfo.letterCount && !isSettingUp) || isProgressInMax()) {
        completeGame()
    }

}

const onGuessNowClick = () => {
     onGuess(true)
     clearShowLetterTimeout()

     sendEvent(actions.GUESS_CLICK, { displayed: gameStateInfo.displayed, letterCount: phrazeInfo.letterCount })
}

const isGuessCorrect = () => {
    let guess = ''
    let invalid = false
    /* gets the phrase from spans and inputs */
    $(".guessbox span").each(function() {
        if($(this).find("input").length) {
            if($(this).find("input").val() === "") {
                $(this).find("input[type='text']").each((i, el) => {
                    if(!$(el).val()) $(el).addClass("empty")
                    setTimeout(() => {
                        $(".guessbox input.empty").first().focus()
                        $(".guessbox input").removeClass("empty")
                    }, 300)
                })
                invalid = true
            }
            guess += $(this).find("input").val() || ""
        } else guess += $(this).text() || ""
    })
    if (invalid) return

    gameStateInfo.answers.push(guess)
    sendEvent(actions.GUESS_CHECK_CLICK, { guess: guess })
    if(guess.toUpperCase() == phrazeInfo.phraseLetters.toUpperCase()) {
        return true
    }
    return false
}

const onGuessSubmit = (forceIncorrect) => {
    const isCorrect = forceIncorrect === true ? false : isGuessCorrect()
    let animTimeout = 1000
    if (isCorrect) completeGame()
    else if(isCorrect === false) {
        gameStateInfo.guessCount++
        $(".guess-chances span").slice(0, gameStateInfo.guessCount-1).addClass("lost")
        updateProgressBarFromPenalty()
        setGameStateGuess()
        
        $(".guessbox").addClass("wrong-guess")
        $(".guess-mode-actions .guess-action").prop("disabled",true)

        setTimeout(() => {
            $(".guessbox").removeClass("wrong-guess")
            $(".guessbox input").val("")
            $(".guessbox input").first().focus()
            $(".guess-mode-actions .guess-action").prop("disabled",false)
            if(gameStateInfo.guessCount > MAX_GUESS) completeGame()
            else revertGuessMode()
        }, animTimeout)
        
    }
}

const onInputKeyUp = (e) => {
    const inputs = $(e.target).closest(".guessbox").find("input[type='text']")
    // backspace
    if(e.keyCode == 8) {
        inputs.eq(Math.max(inputs.index(e.target) - 1, 0))
            .val("")
            .focus()
    } else if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 0 || e.keyCode === 229) { // a-z 0-9
        // if($(e.target).val() !== "") $(e.target).val(e.key)
        inputs.eq(inputs.index(e.target) + 1).focus()
    } else if(e.keyCode == 13) { // enter
        $(".guess-check").click()
    } else if(e.keyCode == 37) { // left arrow
        inputs.eq(Math.max(inputs.index(e.target) - 1, 0))
            .focus()
    }
}

const getSubMessage = (grade) => {
    if(grade === "F" && phrazeInfo.phraseLetters.toLowerCase() === phrazeInfo.phraseLetters)
        return "Ran out of time!"
    if(grade === "F" && gameStateInfo.guessCount > MAX_GUESS)
        return "Ran out of guesses!"
    if(grade === "F") 
        return "Ran out of time!"
    else 
        return `${gameStateInfo.guessCount === 1 ? '1st' : (gameStateInfo.guessCount === 2 ? '2nd' : '3rd')} Guess!`
}

const buildPhraseStatus = (grade) => {
    const spaceIndices = []
    let phrase = ""
    let offset = 0
    for(let i = 0; i < phrazeInfo.today.phraze.length; i++) {
        if(phrazeInfo.today.phraze[i] === " ") spaceIndices.push(i)
    }

    for(let i = 0; i < phrazeInfo.phraseLetters.length; i++) {
        // add newline to most recent space
        if(i >= 10 && i % 10 == 0) {
            const lastSpace = phrase.lastIndexOf(" ")
            phrase = `${phrase.substring(0, lastSpace)}

${phrase.substring(lastSpace + 1)}`
        }

        if(spaceIndices.indexOf(i + offset) > -1) {
            phrase += "  "
            offset++
        }
      
        if(phrazeInfo.phraseLetters[i] === phrazeInfo.phraseLetters[i].toUpperCase()) {
            if(grade === "F") phrase += emojis.RED_BOX
            else phrase += emojis.GREEN_BOX
        }
        else phrase += emojis.REVEALED_BOX
    } 
    return phrase
}

const shareCurrentGradeMessage = (grade) => {
    return `Phraze ${todaysDayInYear()},'${todaysDate.getFullYear().toString().substring(2)}
Grade: ${grade}, ${getSubMessage(grade)}

${buildPhraseStatus(grade)}`
}

const shareTotalGradeMessage = () => {
    return ``
}

const shareStats = (e) => {
    let grade = $(".game-end-popup h2.grade").attr("data-grade")
    let message
    grade = Object.keys(grades).find(key => grades[key] === grade)
    if(grade) {
        message = shareCurrentGradeMessage(grade)
    } else {
        message = shareTotalGradeMessage()
    }
    
    $("body").append("<textarea class='share-msg'></textarea>")
    $(".share-msg").html(message)
    
    if (navigator.share) {
        navigator.share({
          title: "Get Phrazy",
          url: "https://getphrazy.com/",
          text: $(".share-msg").html()
        }).then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);

        sendEvent(actions.SHARE_CLICK, "Navigator share")
      } else {
        $(".share-msg").select()
        document.execCommand("copy")
        $(".share").removeClass("copied")
        setTimeout(() =>$(".share").addClass("copied"), 100)
        sendEvent(actions.SHARE_CLICK, "Copy to clipboard")
      }
      $(".share-msg").remove()
}

const onClosePopup = (e) => {
    $(e.target).parents(".popup").removeClass("non-actionable show")
}

const onPopupClick = (e) => {
    if($(e.target).hasClass("initial-instructions") || $(e.target).parents(".initial-instructions").length) return
    if(!$(e.target).hasClass("popup-content") && !$(e.target).parents(".popup-content").length) {
        $(".popup:not(.initial-instructions)").removeClass("show")
    }
}

const onGuessCancel = () => {
    onGuessSubmit(true)

    sendEvent(actions.GUESS_CANCEL_CLICK, { displayed: gameStateInfo.displayed, letterCount: phrazeInfo.letterCount })
}

const displayOverallStatsPopup = () => {
    if($(".game-end-popup h3").text() === "") {
        $(".game-end-popup h3").text(messages.OVERALL)
        $(".bottom-bar .share").hide()
    } else $(".bottom-bar .share").show()
    displayStats()
    $(".game-end-popup").addClass("show")

    sendEvent(actions.STATS_CLICK)
}

const displayInstructions = () => {
    $(".popup.instructions").removeClass("notransition").addClass("non-actionable show")
    sendEvent(actions.INFO_CLICK)
}

const toggleMenu = () => {
    $(".main-nav ul").toggleClass("show")
    sendEvent(actions.MENU_CLICK)
}

const checkForOpenMenu = (e) => {
    if(!$(e.target).hasClass("nav-list") && !$(e.target).parents(".nav-list").length && !$(e.target).hasClass("menu-icon")) {
        $(".main-nav ul").removeClass("show")
    }
}

const buildShareContent = () => {
    const boardHtml = $(".guessbox").clone()
     $(boardHtml).find("h2").text(phrazeInfo.today.category).addClass("show-no-anim")
     $(boardHtml).find("span.show-letter").html("<i class='fa fa-solid fa-eye-slash'></i>")
     $(boardHtml).find("span input.wrong-letter").each((i, val) => {
         $(val).parent().html("<i class='fa fa-solid fa-xmark'></i>").addClass("wrong-letter")
     })
     $(boardHtml).find("span input.correct-letter").each((i, val) => {
        $(val).parent().html("<i class='fa fa-solid fa-check'></i>").addClass("correct-letter")
    })
    $(".popup-share .phraze-number").text(`(#${todaysDayInYear()})`)
    $(".popup-share h2.grade").addClass(gameStateInfo.finalGrade)
    $(".popup-share .board-state").html(`<div class="guessbox">${boardHtml.html()}</div>`)
}

const shareScreenshot = async() => {
    if (!("share" in navigator)) return
    const canvas = await html2canvas($(".popup-share .content").get(0))
    canvas.toBlob(async function (blob) {
        const files = [new File([blob], 'image.png', { type: blob.type })]
        const shareData = {
            title: "Get Phrazy",
            files
        }
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.error(err.name, err.message);      
            }
          }
        } else {
          console.warn('Sharing not supported', shareData);            
        }
    })
}

const addEventListeners = () => {
    $(".guess-now").on("click", onGuessNowClick)
    $(".guess-check").on("click", onGuessSubmit)
    $(".guess-cancel").on("click", onGuessCancel)
    $(".main-section").on("keyup", "input[type='text']", (e) => onInputKeyUp(e))
    $(".bottom-bar .share").on("click", shareStats)
    $(".popup .close-popup").on("click", (e) => onClosePopup(e))
    $(".popup").on("click", (e) => onPopupClick(e))

    $("header .game-actions .game-stats").on("click", displayOverallStatsPopup)
    $("header .game-actions .game-info").on("click", displayInstructions)
    $("header .game-actions .menu-icon").on("click", toggleMenu)
    $("body").on("click", checkForOpenMenu)

}

/* get local storage object */
const getObjectItem = (key) => {
    const state = localStorage.getItem(key) || "{}"
    return $.parseJSON(state)
}

const sendEvent = (action, values) => {
    if(window.gtag && window.location.search.indexOf("debug=true") === -1 ) {
        gtag("event", action, { data: JSON.stringify(values) })
    }
}

const startGame = () => {
    /* set up phrase board */
    setupBoard()
    /* set up percentage markers in progress bar */
    initProgressBar()
    /* get and set today's game state data if any */
    getTodaysGameState()
    /* initialize countdown until next phraze */
    initNextPhrazeCountdown()
    /* setup game state considering in progress data */
    setupInitGameState()
    addEventListeners()
}
