const setupGame = (guessme) => {
    let html = '<div>'
    let isSpace = false
    for (const chr of guessme) {
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
const getPhrases = (cb) => {
    $.getJSON("./phrazes-cat.json", function(data){
        cb(data.phrazes)
    }).fail(function(){
        console.log("An error has occurred.")
    });
}
$(function() {
    const todaysDt = new Date()
    const todaysPattern = pattern[todaysDt.getDay()]
    let phrases
    let guessme
    let todaysPhraze
    let guessmeLetters
    let lettersCnt
    let counter = 0
    let showLetterTimer
    let displayed = 0
    let guessCnt = 1
    let gameCompleted = false

    getPhrases((p) => {
        phrases = p
        
        startGame()
    })

    const startGame = () => {
        todaysPhraze = phrases[todaysDayInYear() % phrases.length]
        guessme = todaysPhraze.phraze.toUpperCase()
        guessmeLetters = guessme.split(" ").join("")
        lettersCnt = guessmeLetters.length

        setupGame(guessme)
        initProgress(lettersCnt)
        initNextPhrazeCountdown()
        const todaysState = getTodaysStat()
    
        while(counter <= todaysState.counter)
            showLetter(true)
        if(todaysState.isComplete) {
            displayEndPopup(todaysState.grade)
            $(".guess-now").prop("disabled",true)
        } else if(todaysState.guessCnt) {
            guessCnt = todaysState.guessCnt
            showCategory()
            onGuess(guessCnt)
        } else {
            $(".popup.instructions").show()
            $(".popup.instructions .play-now").on("click", () => {
                if(!todaysState.isComplete && !todaysState.guessCnt) {
                    if(typeof showLetterTimer !== 'undefined') clearTimeout(showLetterTimer)
                    showLetterTimer = setTimeout(() => showLetter(), LETTER_TIMER)
                }
                updateProgress(displayed, lettersCnt)
                $(".popup.instructions").hide()
                showCategory()
            })
        }
    }

    const showCategory = () => {
        $(".guessbox h2").text(todaysPhraze.category)
            .addClass("show")
            .parent().addClass("ready")
    }
    

    const endGame = () => {
        if(gameCompleted) return
        clearTimeout(showLetterTimer)
        showLetterTimer = undefined
        setStats(grades.F, 100)
        displayEndPopup(grades.F)
        gameCompleted = true
    }

    const winGame = () => {
        if(gameCompleted) return
        let pct = (displayed / lettersCnt) * 100
        pct += (guessCnt - 1) * 5
        const grade = getGrade(pct)
        setStats(grade, pct)
        displayEndPopup(grade)
        gameCompleted = true
    }

    const displayEndPopup = (grade) => {
        $(".game-end-popup h3").text(messages[grade])
        $(".game-end-popup h2").addClass(grade)
                    .attr("data-grade", grade)
        if (grade === grades.F) $(".game-end-popup p").text(guessme)
        displayStats()
        $(".game-end-popup").show()
    }

    const showLetter = (isSettingUp) => {
        const letter = todaysPattern[counter % todaysPattern.length]
        const isOddCounter = counter % 2 !== 0
        let chr = -1
        if(!isSettingUp) setGameState(counter)
     
        if(isOddCounter) chr = guessmeLetters.indexOf(letter) 
        else chr = guessmeLetters.lastIndexOf(letter)

        if(chr != -1) {
            const tempWrd = guessmeLetters.split("")
            tempWrd[chr] = tempWrd[chr].toLowerCase()
            guessmeLetters = tempWrd.join("")
            const el = $(".guessbox span").get(chr)
            $(el).text(letter)
            displayed++
            counter++
            updateProgress(displayed, lettersCnt)
            if(!isSettingUp) {
                if(typeof showLetterTimer !== 'undefined') clearTimeout(showLetterTimer)
                showLetterTimer = setTimeout(() => showLetter(isSettingUp), LETTER_TIMER)
            }
        }
        else {
            counter++
            showLetter(isSettingUp)
        }
        if (displayed == lettersCnt && !isSettingUp) {
            endGame()
        }
    }
    

    $(".guess-now").on("click", () => {
        onGuess()
        clearTimeout(showLetterTimer)
        showLetterTimer = undefined
    })

    $(".guess-check").on("click", () => {
        const isCorrect = onGuessSubmit(guessmeLetters)
        if (isCorrect) winGame()
        else if(isCorrect === false) {
            guessCnt++
            $(".guess-chances span").slice(0, (guessCnt || 1)-1).addClass("lost")
            updateProgressFromWrongGuess(displayed, lettersCnt, guessCnt)
            setGameStateGuess(guessCnt)
            
            $(".guessbox").addClass("wrong-guess")
            setTimeout(() => {
                $(".guessbox").removeClass("wrong-guess")
                $(".guessbox input").val("")
                $(".guessbox input").first().focus()
                if(guessCnt > MAX_GUESS) endGame()
            }, 1000)
            
        }
    })

    $(".main-section").on("keyup", "input[type='text']", (e) => {
        const inputs = $(e.target).closest(".guessbox").find("input[type='text']")
        if(e.keyCode == 8) {
            inputs.eq(Math.max(inputs.index(e.target) - 1, 0))
                .val("")
                .focus()
        } else {
            inputs.eq(inputs.index(e.target) + 1).focus();
        }
    })

    $(".bottom-bar .share").on("click", function() {
        const a = shareStats(guessme, guessmeLetters, guessCnt)
    })


});

const setGameState = (counter) => {
    localStorage.setItem(items.GAME_STATE, `{ "counter": ${counter} }` )
}

const getTodaysStat = () => {
    // remove dep - wipeout
    if(localStorage.getItem(items.LAST_PLAYED_DEP)) {
        localStorage.removeItem(items.LAST_PLAYED_DEP)
        localStorage.removeItem(items.GAME_STATE)
        localStorage.removeItem(items.GRADES)
        localStorage.removeItem(items.TOTAL_PCT)
    }
    const lastPlayed = localStorage.getItem(items.LAST_PLAYED_PHRAZE)
    const todaysDay = todaysDayInYear()
    if(lastPlayed != todaysDay) {
        localStorage.setItem(items.LAST_PLAYED_PHRAZE,todaysDay)
        localStorage.removeItem(items.GAME_STATE)
    }

    return getObjectItem(items.GAME_STATE)
}

const getObjectItem = (key) => {
    const state = localStorage.getItem(key) || "{}"
    return $.parseJSON(state)
}

const onGuess = (guessCnt) => {
    setToGuessMode()
    $(".progress-bar-timer").addClass("hide")
    $(".guess-chances span").slice(0, (guessCnt || 1)-1).addClass("lost")
    setGameStateGuess(guessCnt || 1)
    $(".guessbox").find("span").each(function() {
        if(!$(this).text().trim().length) {
            $(this).html("<input type='text' maxlength='1'>")
        }
    })
    $(".guessbox input").first().focus()
}

const onGuessSubmit = (answer) => {
    let guess = ''
    let invalid = false
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
    if(guess.toUpperCase() == answer.toUpperCase()) {
        return true
    }
    return false
}

const setToGuessMode = () => {
    $(".main-section").addClass("guess-mode")
    $(".guess-now").remove()
}

const setGameStateGuess = (guessCnt) => {
    const state = getObjectItem(items.GAME_STATE)
    state.guessCnt = guessCnt
    localStorage.setItem(items.GAME_STATE, JSON.stringify(state))
}

const setStats = (grade, pct) => {

    const currStats = getObjectItem(items.GAME_STATE)
    currStats.didWin = grade != grades.F
    currStats.isComplete = true
    currStats.grade = grade
    localStorage.setItem(items.GAME_STATE, JSON.stringify(currStats))

    const gameGrades = getObjectItem(items.GRADES)
    const currGradeCount = gameGrades[grade] || 0
    gameGrades[grade] = currGradeCount + 1
    localStorage.setItem(items.GRADES, JSON.stringify(gameGrades))

    const totalPct = localStorage.getItem(items.TOTAL_PCT) || 0
    localStorage.setItem(items.TOTAL_PCT, parseFloat(totalPct) + parseFloat(pct))

}

const getGrade = (pct) => {
    if(pct >= 0 && pct <= 40.0) return grades.A
    else if(pct > 40.0 && pct <= 60.0) return grades.B
    else if(pct > 60.0 && pct <= 80.0) return grades.C
    else if(pct < 100.0) return grades.D
    else return grades.F
}

const shareStats = (origWord, word, guessCnt) => {
    let grade = $(".game-end-popup h2.grade").attr("data-grade")
    grade = Object.keys(grades).find(key => grades[key] === grade)
    const message = `Phraze ${todaysDayInYear()},'${new Date().getFullYear().toString().substring(2)}
Grade: ${grade}, ${getSubMsg(grade, word, guessCnt)}

${buildPhraseStatus(origWord, word, grade)}`
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
      } else {
        $(".share-msg").select()
        document.execCommand("copy")
      }
      $(".share-msg").remove()

}

const getSubMsg = (grade, word, guessCnt) => {
    if(grade === "F" && word.toLowerCase() === word)
        return "Ran out of time!"
    if(grade === "F")
        return "Ran out of guesses!"
    else 
        return `${guessCnt === 1 ? '1st' : (guessCnt === 2 ? '2nd' : '3rd')} Guess!`
}

const buildPhraseStatus = (origWord, word, grade) => {
    const spaceIndices = []
    let phrase = ""
    let offset = 0
    for(let i = 0; i < origWord.length; i++) {
        if(origWord[i] === " ") spaceIndices.push(i)
    }

    for(let i = 0; i < word.length; i++) {
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
      
        if(word[i] === word[i].toUpperCase()) {
            if(grade === "F") phrase += emojis.RED_BOX
            else phrase += emojis.GREEN_BOX
        }
        else phrase += emojis.REVEALED_BOX
    } 
    return phrase
}

const replaceAt = (word, index, char) => {
    word.substr(0, index) + char + word.substrr(index + char.length)
}

const displayStats = () => {
    const el = $(".game-end-popup .stats")
    const gameGrades = getObjectItem(items.GRADES)
    const overallPct = localStorage.getItem(items.TOTAL_PCT)
    const arr = Object.values(gameGrades)
    const max = Math.max(...arr) || 5
    const gameTotal = arr.reduce((a, b) => a + b, 0)
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
  
    el.html(statsHtml)
    el.after(overallStatsHtml)
    el.find(".chart span").each((i, el) => {
        const g = $(el).attr("data-grade")
        const ht = ((gameGrades[g] || 0) / max) * 100
        $(el).css("height", `${ht}px`)
        if(gameGrades[g]) $(el).text(gameGrades[g])
    })
}

const updateProgress = (displayed, lettersCnt) => {
    const p = (displayed / lettersCnt) * 100
    const ptimer = Math.min(((displayed+1) / lettersCnt) * 100, 100)
    $(".progress-bar-cover").css("width", `${p}%`)
    $(".progress-bar-timer").css("width", `${ptimer}%`)
}

const updateProgressFromWrongGuess = (displayed, lettersCnt, guessCnt) => {
    let pct = (displayed / lettersCnt) * 100
    pct += (guessCnt - 1) * 5
    $(".progress-bar-cover").css("width", `${pct}%`)
}

const initProgress = (lettersCnt) => {
    const letterPct = (1 / lettersCnt) * 100
    for(let i=0; i<lettersCnt - 1; i++) {
        $(".progress-bar").append(`<small class="divider" style="left:${letterPct * (i+1)}%"></small>`)
    }
}

const getTodaysDt = () => {
    const dt = new Date()
    return `${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`
}

const todaysDayInYear = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now - start
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
}

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

    if (hours === "00" && minutes === "00" && seconds === "01") {
        location.reload()
    }
}

const initNextPhrazeCountdown = () => {
    if(typeof window.nextPhrazeInterval != 'undefined')
        clearInterval(window.nextPhrazeInterval)

    displayCountdown()

    window.nextPhrazeInterval = setInterval(() => {
        displayCountdown()
    }, 1000)
}

const randomizeItems = (items) => items
        .map((a) => ({sort: Math.random(), value: a}))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value)

const pattern = [
    ['D','L','Z','F','E','K','B','O','P','V','T','G','S','A','C','U','N','I','H','R','Y','J','M','X','Q','W'],
    ['H','M','E','D','J','O','N','R','X','K','U','Y','V','S','B','W','F','T','A','P','Q','L','I','Z','C','G'],
    ['Z','M','K','N','X','G','U','S','E','R','B','V','A','P','T','I','C','F','D','W','L','O','J','Y','H','Q'],
    ['N','X','B','R','Y','T','L','I','S','P','E','C','V','J','H','Z','A','G','W','F','U','M','O','K','D','Q'],
    ['I','N','F','Q','C','U','R','O','D','H','A','Z','L','K','V','J','S','M','G','P','Y','X','T','B','E','W'],
    ['F','Q','V','H','K','Y','C','J','X','Z','M','R','W','E','N','S','P','I','B','U','O','A','G','D','T','L'],
    ['W','G','Y','U','M','N','H','I','K','Z','O','R','B','Q','C','P','J','F','S','T','L','A','X','E','D','V']]

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
    "grade-f": "",
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

const MAX_GUESS = 3
const LETTER_TIMER = 5000
const GUESS_PENALTY = 5
