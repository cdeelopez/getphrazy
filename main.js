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

    $(".guessbox").html(html)
}
$(function() {
    // todo get one per day
    const guessme = phrases[4].toUpperCase()
    const guessmeLetters = guessme.replaceAll(' ', '')
    const lettersCnt = guessmeLetters.length
    let counter = 0
    let showInterval
    let displayed = 0
    let guessCnt = 1

    const endGame = () => {
        clearInterval(showInterval)
        showInterval = undefined
        
        setStats(grades.F)
        displayLostPopup()
    }

    const displayLostPopup = () => {
        $(".error-popup h2").addClass(grades.F)
        $(".error-popup p").text(guessme)
        displayStats($(".error-popup .stats"))
        $(".error-popup").show()
    }

    const winGame = () => {
        let pct = (displayed / lettersCnt) * 100
        pct += (guessCnt - 1) * 5
        const grade = getGrade(pct)
        
        setStats(grade)
        displayWonPopup(grade)
    }

    const displayWonPopup = (grade) => {
        $(".win-popup h2").addClass(grade)
        displayStats($(".win-popup .stats"))
        $(".win-popup").show()
    }

    const showLetter = (isSettingUp) => {
        const letter = pattern[counter]
        if(!isSettingUp) setGameState(counter)
        if (counter >= pattern.length) {
            endGame()
            return
        }
        const chr = guessmeLetters.indexOf(letter) 
        if(chr != -1) {
            guessmeLetters.split("").forEach((c, i) => {
                if(c == letter) {
                    const el = $(".guessbox span").get(i)
                    $(el).text(letter)
                    displayed++
                }
            })
            if (displayed == lettersCnt) {
                endGame()
                return
            }
            counter++
        }
        else {
            counter++
            showLetter(isSettingUp)
        }
    }
    
    setupGame(guessme)
    const todaysState = getTodaysStat()
    if(todaysState) {
        while(counter <= todaysState.counter)
            showLetter(true)
        if(todaysState.isComplete) {
            if(todaysState.didWin) displayWonPopup(todaysState.grade)
            else displayLostPopup(grades.F)
            $(".guess-now").prop("disabled",true)
        } else if(todaysState.guessCnt) {
            guessCnt = todaysState.guessCnt
            onGuess(guessCnt)
        }
    }

    if (typeof showInterval === 'undefined'){
        if(!todaysState || (todaysState && !todaysState.isComplete && !todaysState.guessCnt))
            showInterval = setInterval(showLetter, 3000)
    } else {
        clearInterval(showInterval)
    }

    $(".guess-now").on("click", () => {
        onGuess()
        clearInterval(showInterval)
        showInterval = undefined
    })

    $(".main-section").on("click", ".submit", () => {
        const isCorrect = onGuessSubmit(guessmeLetters)
        if (isCorrect) winGame()
        else if(isCorrect === false) {
            guessCnt++
            setGameStateGuess(guessCnt)
            
            $(".guess-popup .guessbox").addClass("wrong-guess")
            setTimeout(() => {
                $(".guess-popup .guessbox").removeClass("wrong-guess")
                $(".guess-popup .guessbox input").val("")
                $(".guess-popup .guessbox input").first().focus()
                $(".guess-popup h3 span").text(guessCnt)
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

    // const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    // console.log(randomizeItems(alphabet))

});

const setGameState = (counter) => {
    localStorage.setItem(items.GAME_STATE, `{ "counter": ${counter} }` )
}

const getTodaysStat = () => {
    const lastPlayed = localStorage.getItem(items.LAST_PLAYED)
    const todaysDt = getTodaysDt()
    if(lastPlayed != todaysDt) {
        localStorage.setItem(items.LAST_PLAYED,todaysDt)
        localStorage.removeItem(items.GAME_STATE)
    }

    return getObjectItem(items.GAME_STATE)
}

const getObjectItem = (key) => {
    const state = localStorage.getItem(key) || "{}"
    return $.parseJSON(state)
}

const onGuess = (guessCnt) => {
    $(".guess-now").prop("disabled",true)
    const guessContent = $(".guessbox").clone()
    setGameStateGuess(guessCnt || 1)
    $(guessContent).find("span").each(function() {
        if(!$(this).text().trim().length) {
            $(this).html("<input type='text' maxlength='1'>")
        }
    })
    const guessContentHtml = $(guessContent).html()
    $(".main-section").append(`
        <div class="popup guess-popup">
            <div class="content">
                <h3>Guess <span>${guessCnt || 1}</span> of 3</h3>
                <div class="guessbox">${guessContentHtml}</div>
                <span class="guess-action submit">Submit</span>
            </div>
        </div>
    `)
    $(".guess-popup").show()
    $(".guess-popup input").first().focus()
}

const onGuessSubmit = (answer) => {
    let guess = ''
    let invalid = false
    $(".guess-popup .guessbox span").each(function() {
        if($(this).find("input").length) {
            if($(this).find("input").val() === "") {
                $(this).find("input[type='text']").each((i, el) => {
                    if(!$(el).val()) $(el).addClass("empty")
                    setTimeout(() => {
                        $(".guess-popup .guessbox input.empty").first().focus()
                        $(".guess-popup .guessbox input").removeClass("empty")
                    }, 300)
                })
                invalid = true
            }
            guess += $(this).find("input").val() || ""
        } else guess += $(this).text() || ""
    })
    if (invalid) return
    if(guess.toUpperCase() == answer) {
        return true
    } 
    return false
}

const setGameStateGuess = (guessCnt) => {
    const state = getObjectItem(items.GAME_STATE)
    state.guessCnt = guessCnt
    localStorage.setItem(items.GAME_STATE, JSON.stringify(state))
}

const setStats = (grade) => {
    $(".guess-popup").hide()

    const currStats = getObjectItem(items.GAME_STATE)
    currStats.didWin = grade != grades.F
    currStats.isComplete = true
    currStats.grade = grade
    localStorage.setItem(items.GAME_STATE, JSON.stringify(currStats))

    const gameGrades = getObjectItem(items.GRADES)
    const currGradeCount = gameGrades[grade] || 0
    gameGrades[grade] = currGradeCount + 1
    localStorage.setItem(items.GRADES, JSON.stringify(gameGrades))
}

const getGrade = (pct) => {
    if(pct >= 0 && pct <= 40.0) return grades.A
    else if(pct > 40.0 && pct <= 60.0) return grades.B
    else if(pct > 60.0 && pct <= 80.0) return grades.C
    else return grades.D
}

const displayStats = (el) => {
    const gameGrades = getObjectItem(items.GRADES)
    const arr = Object.values(gameGrades)
    const max = Math.max(...arr) || 5
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
    el.html(statsHtml)
    el.find(".chart span").each((i, el) => {
        const g = $(el).attr("data-grade")
        const ht = ((gameGrades[g] || 0) / max) * 100
        $(el).css("height", `${ht}px`)
        if(gameGrades[g]) $(el).text(gameGrades[g])
    })
}

const getTodaysDt = () => {
    const dt = new Date()
    return `${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`
}

const randomizeItems = (items) => items
        .map((a) => ({sort: Math.random(), value: a}))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value)

const pattern = ['D','L','Z','F','E','K','B','O','P','V','T','G','S','A','C','U','N','I','H','R','Y','J','M','X','Q','W']

const phrases = [
    "A great place to unwind",
    "A hop skip and a jump",
    "A little rest and recuperation",
    "A mile a minute",
    "Based on actual events"
]

const items = {
    LAST_PLAYED: "last-played-date",
    GAME_STATE: "game-state",
    GRADES: "grades"
}

const grades = {
    A: "grade-a",
    B: "grade-b",
    C: "grade-c",
    D: "grade-d",
    F: "grade-f",
}

const MAX_GUESS = 3
const LETTER_TIMER = 5000
const GUESS_PENALTY = 5
