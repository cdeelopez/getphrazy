"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _createForOfIteratorHelper(e,t){var a="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){a&&(e=a);var n=0,s=function(){};return{s:s,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:s}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,r=!0,i=!1;return{s:function(){a=a.call(e)},n:function(){var e=a.next();return r=e.done,e},e:function(e){i=!0,o=e},f:function(){try{r||null==a.return||a.return()}finally{if(i)throw o}}}}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}function ownKeys(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(a),!0).forEach(function(t){_defineProperty(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):ownKeys(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var phrazeInfo={today:{phraze:"",category:""},phraseLetters:"",letterCount:0,letterPercent:0,pattern:[]},gameStateInfo={inProgressLetterCounter:-1,showLetterCounter:0,displayed:0,guessCount:0,gameCompleted:!1,finalGrade:"",answers:[]},todaysDate=new Date,pattern=[["D","L","Z","F","E","K","B","O","P","V","T","G","S","A","C","U","N","I","H","R","Y","J","M","X","Q","W"],["H","M","E","D","J","O","N","R","X","K","U","Y","V","S","B","W","F","T","A","P","Q","L","I","Z","C","G"],["Z","M","K","N","X","G","U","S","E","R","B","V","A","P","T","I","C","F","D","W","L","O","J","Y","H","Q"],["N","X","B","R","Y","T","L","I","S","P","E","C","V","J","H","Z","A","G","W","F","U","M","O","K","D","Q"],["I","N","F","Q","C","U","R","O","D","H","A","Z","L","K","V","J","S","M","G","P","Y","X","T","B","E","W"],["F","Q","V","H","K","Y","C","J","X","Z","M","R","W","E","N","S","P","I","B","U","O","A","G","D","T","L"],["W","G","Y","U","M","N","H","I","K","Z","O","R","B","Q","C","P","J","F","S","T","L","A","X","E","D","V"]],items={LAST_PLAYED_DEP:"last-played-date",LAST_PLAYED_PHRAZE:"last-played-phraze",GAME_STATE:"game-state",GRADES:"grades",TOTAL_PCT:"overall-pct-shown"},messages={"grade-a":"Rockstar!","grade-b":"You got it!","grade-c":"Good Guess!","grade-d":"Phew, that was close!","grade-f":"Better luck next time?",OVERALL:"Overall Game Stats"},grades={A:"grade-a",B:"grade-b",C:"grade-c",D:"grade-d",F:"grade-f"},emojis={GREEN_BOX:"&#129001;",REVEALED_BOX:"&#128307;",RED_BOX:"&#128997;"},actions={SPLASH_PAGE:"splash_page",START_NEW_GAME:"start_new_game ",RESUME_GAME:"resume_game",COMPLETE_GAME:"game_completed",GAME_END_STATS:"game_end_stats",LOAD_ON_COMPLETE:"game_already_completed",START_ON_GUESS:"resume_on_guess",GUESS_CLICK:"guess_clicked",GUESS_CHECK_CLICK:"guess_check",GUESS_CANCEL_CLICK:"guess_cancel_clicked",SHARE_CLICK:"share_clicked",INFO_CLICK:"info_clicked",STATS_CLICK:"stats_clicked",MENU_CLICK:"menu_clicked",NEXT_DAY_RELOAD:"reload_next_day"},MAX_GUESS=3,LETTER_TIMER=5e3;$(function(){getPhrases(function(e){setupPhrazeInfo(e[todaysDayInYear()%e.length]),startGame()})});var getPhrases=function(e){$.getJSON("./phrazes-cat.json",function(t){e(t.phrazes)}).fail(function(){console.log("An error has occurred.")})},setupPhrazeInfo=function(e){phrazeInfo.pattern=pattern[todaysDate.getDay()],phrazeInfo.today=_objectSpread(_objectSpread({},e),{},{phraze:e.phraze.toUpperCase()}),phrazeInfo.phraseLetters=e.phraze.split(" ").join(""),phrazeInfo.letterCount=phrazeInfo.phraseLetters.length,phrazeInfo.letterPercent=1/phrazeInfo.letterCount*100},treatAsUTC=function(e){var t=new Date(e);return t.setMinutes(t.getMinutes()-t.getTimezoneOffset()),t},todaysDayInYear=function(){var e=new Date,t=new Date(e.getFullYear(),0,0);return Math.floor((treatAsUTC(e)-treatAsUTC(t))/864e5)},setupBoard=function(){var e,t="<div>",a=!1,n=_createForOfIteratorHelper(phrazeInfo.today.phraze);try{for(n.s();!(e=n.n()).done;){" "===e.value?(a=!0,t+="</div><div>"):(t+='<span class="'.concat(a?"has-space":"",'"></span>'),a=!1)}}catch(e){n.e(e)}finally{n.f()}t+="</div>",$(".guessbox .guess-section").html(t)},initProgressBar=function(){for(var e=0;e<phrazeInfo.letterCount-1;e++)$(".progress-bar").append('<small class="divider" style="left:'.concat(phrazeInfo.letterPercent*(e+1),'%"></small>'))},initNextPhrazeCountdown=function(){void 0!==window.nextPhrazeInterval&&clearInterval(window.nextPhrazeInterval),displayCountdown(),window.nextPhrazeInterval=setInterval(function(){displayCountdown()},1e3)},displayCountdown=function(){var e=new Date,t=new Date(e);t.setDate(t.getDate()+1),t.setHours(0,0,0,0);var a=Date.parse(t)-Date.parse(e),n=("0"+Math.floor(a/1e3%60)).slice(-2),s=("0"+Math.floor(a/1e3/60%60)).slice(-2),o=("0"+Math.floor(a/36e5%24)).slice(-2);$(".game-end-popup .next-phraze span").text("".concat(o,":").concat(s,":").concat(n)),a<=0&&void 0!==window.nextPhrazeInterval&&clearInterval(window.nextPhrazeInterval);var r=localStorage.getItem(items.LAST_PLAYED_PHRAZE);r&&r!=todaysDayInYear()&&(clearInterval(window.nextPhrazeInterval),sendEvent(actions.NEXT_DAY_RELOAD),setTimeout(function(){location.reload()},500))},getTodaysGameState=function(){if(localStorage.getItem(items.LAST_PLAYED_DEP)&&(localStorage.removeItem(items.LAST_PLAYED_DEP),localStorage.removeItem(items.GAME_STATE),localStorage.removeItem(items.GRADES),localStorage.removeItem(items.TOTAL_PCT)),localStorage.getItem(items.TOTAL_PCT)){var e=getObjectItem(items.GRADES);e[items.TOTAL_PCT]=localStorage.getItem(items.TOTAL_PCT)||0,localStorage.setItem(items.GRADES,JSON.stringify(e)),localStorage.removeItem(items.TOTAL_PCT)}var t=localStorage.getItem(items.LAST_PLAYED_PHRAZE),a=todaysDayInYear();t!=a&&(localStorage.setItem(items.LAST_PLAYED_PHRAZE,a),localStorage.removeItem(items.GAME_STATE));var n=getObjectItem(items.GAME_STATE);"number"==typeof n.counter&&n.counter>=0?setTodaysState(n):localStorage.removeItem(items.GAME_STATE)},setTodaysState=function(e){gameStateInfo.inProgressLetterCounter=e.counter,gameStateInfo.gameCompleted=e.isComplete||!1,gameStateInfo.finalGrade=e.grade||"",gameStateInfo.guessCount=e.guessCnt||0,gameStateInfo.isGuessMode=e.isGuessMode||!1},setupCompleteGame=function(){var e=gameStateInfo.finalGrade==grades.F;$(".guessbox").find("span").each(function(t){$(this).text().trim().length||$(this).html("<input class='".concat(e?"wrong-letter":"correct-letter","' type='text' maxlength='1' value='").concat(phrazeInfo.phraseLetters.charAt(t)||"","' disabled>"))})},disableBoard=function(){$(".guess-action").prop("disabled",!0),$(".progress-bar-timer").addClass("hide"),$(".guessbox").addClass("playing")},showCategory=function(){$(".guessbox h2").text(phrazeInfo.today.category).addClass("show").parent().addClass("ready")},setGameStateGuess=function(){var e=getObjectItem(items.GAME_STATE);e.guessCnt=gameStateInfo.guessCount,localStorage.setItem(items.GAME_STATE,JSON.stringify(e))},setToGuessMode=function(e){e?$(".main-section").addClass("guess-mode"):$(".main-section").removeClass("guess-mode");var t=getObjectItem(items.GAME_STATE);t.isGuessMode=e,localStorage.setItem(items.GAME_STATE,JSON.stringify(t))},onGuess=function(e){setToGuessMode(!0),$(".progress-bar-timer").addClass("hide"),e&&0==gameStateInfo.guessCount&&gameStateInfo.guessCount++,$(".guess-chances span").slice(0,gameStateInfo.guessCount-1).addClass("lost"),setGameStateGuess(),$(".guessbox").find("span").each(function(){$(this).text().trim().length||$(this).html("<input type='text' maxlength='1'>")}),$(".guessbox input").first().focus()},revertGuessMode=function(){setToGuessMode(!1),$(".progress-bar-timer").removeClass("hide"),$(".guessbox").find("span input").remove(),isProgressInMax()?completeGame():window.showLetterTimer=setTimeout(function(){return showLetter()},LETTER_TIMER)},setupInitGameState=function(){for(;gameStateInfo.showLetterCounter<=gameStateInfo.inProgressLetterCounter;)showLetter(!0);gameStateInfo.gameCompleted?($(".popup.instructions").addClass("notransition").removeClass("initial-instructions show"),sendEvent(actions.LOAD_ON_COMPLETE,{grade:gameStateInfo.finalGrade}),displayEndPopup(gameStateInfo.finalGrade),setupCompleteGame(),disableBoard(),updateProgressBar()):gameStateInfo.isGuessMode?($(".popup.instructions").addClass("notransition").removeClass("initial-instructions show"),sendEvent(actions.START_ON_GUESS,gameStateInfo.guessCount),showCategory(),onGuess(),updateProgressBar()):(gameStateInfo.inProgressLetterCounter>=0?($(".popup.instructions .play-now").text("Resume Game").addClass("resume"),sendEvent(actions.SPLASH_PAGE,{status:actions.RESUME_GAME})):sendEvent(actions.SPLASH_PAGE,{status:actions.START_NEW_GAME}),$(".popup.instructions .play-now").on("click",function(e){clearShowLetterTimeout(),window.showLetterTimer=setTimeout(function(){return showLetter()},LETTER_TIMER),$(e.target).hasClass("resume")?sendEvent(actions.RESUME_GAME,{counter:gameStateInfo.inProgressLetterCounter,guessCount:gameStateInfo.guessCount}):sendEvent(actions.START_NEW_GAME,{}),updateProgressBar(),$(".popup.instructions").removeClass("initial-instructions show"),showCategory()})),$("body").addClass("ready")},setGameCounter=function(){var e=getObjectItem(items.GAME_STATE);e.counter=gameStateInfo.showLetterCounter,localStorage.setItem(items.GAME_STATE,JSON.stringify(e))},showLetterInBoard=function(e,t){var a=$(".guessbox span").get(e);$(a).text(t).addClass("show-letter")},updateProgressBarFromPenalty=function(){$(".progress-bar-cover").addClass("penalty"),setTimeout(function(){return $(".progress-bar-cover").removeClass("penalty")},1e3),updateProgressBar()},isProgressInMax=function(){return Math.ceil(getCurrentPct())>=100},getCurrentPct=function(){var e=gameStateInfo.displayed/phrazeInfo.letterCount*100;return e+=Math.max(gameStateInfo.guessCount-1,0)*phrazeInfo.letterPercent},updateProgressBar=function(){var e=getCurrentPct();$(".progress-bar-cover").css("width","".concat(Math.min(e,100),"%")),$(".progress-bar-timer").css("width","".concat(Math.min(e+phrazeInfo.letterPercent,100),"%"))},clearShowLetterTimeout=function(){void 0!==window.showLetterTimer&&clearTimeout(window.showLetterTimer),window.showLetterTimer=void 0},getGrade=function(e){return e>=0&&e<=40?grades.A:e>40&&e<=60?grades.B:e>60&&e<=80?grades.C:e<99?grades.D:grades.F},setCompleteGameStats=function(e,t){var a=getObjectItem(items.GAME_STATE);a.didWin=e!=grades.F,a.isComplete=!0,a.grade=e,localStorage.setItem(items.GAME_STATE,JSON.stringify(a));var n=getObjectItem(items.GRADES),s=n[e]||0;n[e]=s+1;var o=n[items.TOTAL_PCT]||0;n[items.TOTAL_PCT]=parseFloat(o)+parseFloat(t),localStorage.setItem(items.GRADES,JSON.stringify(n))},displayStats=function(){var e=$(".game-end-popup .stats"),t=getObjectItem(items.GRADES),a=t[items.TOTAL_PCT]||100,n=Object.keys(t).filter(function(e){return e.includes("grade")}).reduce(function(e,a){return Object.assign(e,_defineProperty({},a,t[a]))},{}),s=Object.values(n),o=Math.max.apply(Math,_toConsumableArray(s))||5,r=s.reduce(function(e,t){return e+t},0),i=a?getGrade(a/r):"",u='\n        <div class="chart">\n            <span data-grade="'.concat(grades.A,'">&nbsp;</span>\n            <span data-grade="').concat(grades.B,'">&nbsp;</span>\n            <span data-grade="').concat(grades.C,'">&nbsp;</span>\n            <span data-grade="').concat(grades.D,'">&nbsp;</span>\n            <span data-grade="').concat(grades.F,'">&nbsp;</span>\n        </div>\n        <div class="chart-labels">\n            <span class="').concat(grades.A,'"></span>\n            <span class="').concat(grades.B,'"></span>\n            <span class="').concat(grades.C,'"></span>\n            <span class="').concat(grades.D,'"></span>\n            <span class="').concat(grades.F,'"></span>\n        </div>\n    '),c='\n        <div class="overall-stats">\n            <span class="game-total">'.concat(r,'</span>\n            <span class="grade ').concat(i,'"></span>\n            <h5>Total Games Played</h5>\n            <h5>Overall Grade</h5>\n        </div>\n    ');e.html(u+c),e.find(".chart span").each(function(e,a){var n=$(a).attr("data-grade"),s=(t[n]||0)/o*100;$(a).css("height","".concat(s,"px")),t[n]&&$(a).text(t[n])}),sendEvent(actions.GAME_END_STATS,{gamesPlayed:r,overallGrade:i})},displayEndPopup=function(e){$(".guess-action").prop("disabled",!0),$(".game-end-popup h3").text(messages[e]),$(".game-end-popup h2").addClass(e).attr("data-grade",e),e===grades.F&&$(".game-end-popup p").text(phrazeInfo.today.phraze),displayStats(),$(".game-end-popup").addClass("show"),$(".bottom-bar .share").show()},completeGame=function(){var e,t;gameStateInfo.gameCompleted||(clearShowLetterTimeout(),gameStateInfo.guessCount>MAX_GUESS?(e=grades.F,t=100):(t=getCurrentPct(),e=getGrade(t)),getObjectItem(items.GAME_STATE).isComplete||sendEvent(actions.COMPLETE_GAME,{grade:e,pct:t.toFixed(2),phraze:todaysDayInYear(),guessCount:gameStateInfo.guessCount,answers:gameStateInfo.answers.join(",")}),setCompleteGameStats(e,t),displayEndPopup(e),gameStateInfo.gameCompleted=!0)},showLetter=function e(t){var a=phrazeInfo.pattern[gameStateInfo.showLetterCounter%phrazeInfo.pattern.length],n=-1;if(n=gameStateInfo.displayed%2!=0?phrazeInfo.phraseLetters.indexOf(a):phrazeInfo.phraseLetters.lastIndexOf(a),t||setGameCounter(),-1!=n){var s=phrazeInfo.phraseLetters.split("");s[n]=s[n].toLowerCase(),phrazeInfo.phraseLetters=s.join(""),showLetterInBoard(n,a),gameStateInfo.displayed++,gameStateInfo.showLetterCounter++,updateProgressBar(),t||(clearShowLetterTimeout(),window.showLetterTimer=setTimeout(function(){return e()},LETTER_TIMER))}else gameStateInfo.showLetterCounter++,e(t);(gameStateInfo.displayed==phrazeInfo.letterCount&&!t||isProgressInMax())&&completeGame()},onGuessNowClick=function(){onGuess(!0),clearShowLetterTimeout(),sendEvent(actions.GUESS_CLICK,{displayed:gameStateInfo.displayed,letterCount:phrazeInfo.letterCount})},isGuessCorrect=function(){var e="",t=!1;if($(".guessbox span").each(function(){$(this).find("input").length?(""===$(this).find("input").val()&&($(this).find("input[type='text']").each(function(e,t){$(t).val()||$(t).addClass("empty"),setTimeout(function(){$(".guessbox input.empty").first().focus(),$(".guessbox input").removeClass("empty")},300)}),t=!0),e+=$(this).find("input").val()||""):e+=$(this).text()||""}),!t)return gameStateInfo.answers.push(e),sendEvent(actions.GUESS_CHECK_CLICK,{guess:e}),e.toUpperCase()==phrazeInfo.phraseLetters.toUpperCase()},onGuessSubmit=function(e){var t=!0!==e&&isGuessCorrect();t?completeGame():!1===t&&(gameStateInfo.guessCount++,$(".guess-chances span").slice(0,gameStateInfo.guessCount-1).addClass("lost"),updateProgressBarFromPenalty(),setGameStateGuess(),$(".guessbox").addClass("wrong-guess"),$(".guess-mode-actions .guess-action").prop("disabled",!0),setTimeout(function(){$(".guessbox").removeClass("wrong-guess"),$(".guessbox input").val(""),$(".guessbox input").first().focus(),$(".guess-mode-actions .guess-action").prop("disabled",!1),gameStateInfo.guessCount>MAX_GUESS?completeGame():revertGuessMode()},1e3))},onInputKeyUp=function(e){var t=$(e.target).closest(".guessbox").find("input[type='text']");8==e.keyCode?t.eq(Math.max(t.index(e.target)-1,0)).val("").focus():e.keyCode>=48&&e.keyCode<=57||e.keyCode>=65&&e.keyCode<=90||0===e.keyCode||229===e.keyCode?t.eq(t.index(e.target)+1).focus():13==e.keyCode?$(".guess-check").click():37==e.keyCode&&t.eq(Math.max(t.index(e.target)-1,0)).focus()},getSubMessage=function(e){return"F"===e&&phrazeInfo.phraseLetters.toLowerCase()===phrazeInfo.phraseLetters?"Ran out of time!":"F"===e&&gameStateInfo.guessCount>MAX_GUESS?"Ran out of guesses!":"F"===e?"Ran out of time!":"".concat(1===gameStateInfo.guessCount?"1st":2===gameStateInfo.guessCount?"2nd":"3rd"," Guess!")},buildPhraseStatus=function(e){for(var t=[],a="",n=0,s=0;s<phrazeInfo.today.phraze.length;s++)" "===phrazeInfo.today.phraze[s]&&t.push(s);for(var o=0;o<phrazeInfo.phraseLetters.length;o++){if(o>=10&&o%10==0){var r=a.lastIndexOf(" ");a="".concat(a.substring(0,r),"\n\n").concat(a.substring(r+1))}t.indexOf(o+n)>-1&&(a+="  ",n++),phrazeInfo.phraseLetters[o]===phrazeInfo.phraseLetters[o].toUpperCase()?a+="F"===e?emojis.RED_BOX:emojis.GREEN_BOX:a+=emojis.REVEALED_BOX}return a},shareCurrentGradeMessage=function(e){return"Phraze ".concat(todaysDayInYear(),",'").concat(todaysDate.getFullYear().toString().substring(2),"\nGrade: ").concat(e,", ").concat(getSubMessage(e),"\n\n").concat(buildPhraseStatus(e))},shareTotalGradeMessage=function(){return""},shareStats=function(e){var t,a=$(".game-end-popup h2.grade").attr("data-grade");t=(a=Object.keys(grades).find(function(e){return grades[e]===a}))?shareCurrentGradeMessage(a):shareTotalGradeMessage(),$("body").append("<textarea class='share-msg'></textarea>"),$(".share-msg").html(t),navigator.share?(navigator.share({title:"Get Phrazy",url:"https://getphrazy.com/",text:$(".share-msg").html()}).then(function(){console.log("Thanks for sharing!")}).catch(console.error),sendEvent(actions.SHARE_CLICK,"Navigator share")):($(".share-msg").select(),document.execCommand("copy"),$(".share").removeClass("copied"),setTimeout(function(){return $(".share").addClass("copied")},100),sendEvent(actions.SHARE_CLICK,"Copy to clipboard")),$(".share-msg").remove()},onClosePopup=function(e){$(e.target).parents(".popup").removeClass("non-actionable show")},onPopupClick=function(e){$(e.target).hasClass("initial-instructions")||$(e.target).parents(".initial-instructions").length||$(e.target).hasClass("popup-content")||$(e.target).parents(".popup-content").length||$(".popup:not(.initial-instructions)").removeClass("show")},onGuessCancel=function(){onGuessSubmit(!0),sendEvent(actions.GUESS_CANCEL_CLICK,{displayed:gameStateInfo.displayed,letterCount:phrazeInfo.letterCount})},displayOverallStatsPopup=function(){""===$(".game-end-popup h3").text()?($(".game-end-popup h3").text(messages.OVERALL),$(".bottom-bar .share").hide()):$(".bottom-bar .share").show(),displayStats(),$(".game-end-popup").addClass("show"),sendEvent(actions.STATS_CLICK)},displayInstructions=function(){$(".popup.instructions").removeClass("notransition").addClass("non-actionable show"),sendEvent(actions.INFO_CLICK)},toggleMenu=function(){$(".main-nav ul").toggleClass("show"),sendEvent(actions.MENU_CLICK)},checkForOpenMenu=function(e){$(e.target).hasClass("nav-list")||$(e.target).parents(".nav-list").length||$(e.target).hasClass("menu-icon")||$(".main-nav ul").removeClass("show")},addEventListeners=function(){$(".guess-now").on("click",onGuessNowClick),$(".guess-check").on("click",onGuessSubmit),$(".guess-cancel").on("click",onGuessCancel),$(".main-section").on("keyup","input[type='text']",function(e){return onInputKeyUp(e)}),$(".bottom-bar .share").on("click",shareStats),$(".popup .close-popup").on("click",function(e){return onClosePopup(e)}),$(".popup").on("click",function(e){return onPopupClick(e)}),$("header .game-actions .game-stats").on("click",displayOverallStatsPopup),$("header .game-actions .game-info").on("click",displayInstructions),$("header .game-actions .menu-icon").on("click",toggleMenu),$("body").on("click",checkForOpenMenu)},getObjectItem=function(e){var t=localStorage.getItem(e)||"{}";return $.parseJSON(t)},sendEvent=function(e,t){window.gtag&&-1===window.location.search.indexOf("debug=true")&&gtag("event",e,{data:JSON.stringify(t)})},startGame=function(){setupBoard(),initProgressBar(),getTodaysGameState(),initNextPhrazeCountdown(),setupInitGameState(),addEventListeners()};