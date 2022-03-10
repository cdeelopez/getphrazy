"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _createForOfIteratorHelper(e,t){var a="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){a&&(e=a);var n=0,r=function(){};return{s:r,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,o=!0,i=!1;return{s:function(){a=a.call(e)},n:function(){var e=a.next();return o=e.done,e},e:function(e){i=!0,s=e},f:function(){try{o||null==a.return||a.return()}finally{if(i)throw s}}}}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}var setupGame=function(e){var t,a="<div>",n=!1,r=_createForOfIteratorHelper(e);try{for(r.s();!(t=r.n()).done;){" "===t.value?(n=!0,a+="</div><div>"):(a+='<span class="'.concat(n?"has-space":"",'"></span>'),n=!1)}}catch(e){r.e(e)}finally{r.f()}a+="</div>",$(".guessbox .guess-section").html(a)},getPhrases=function(e){$.getJSON("./phrazes-cat.json",function(t){e(t.phrazes)}).fail(function(){console.log("An error has occurred.")})};$(function(){var e,t,a,n,r,s,o=new Date,i=pattern[o.getDay()],c=0,u=0,l=1,d=!1;getPhrases(function(t){e=t,g()});var g=function(){a=e[todaysDayInYear()%e.length],t=a.phraze.toUpperCase(),n=t.split(" ").join(""),r=n.length,setupGame(t),initProgress(r),initNextPhrazeCountdown();for(var o=getTodaysStat();c<=o.counter;)h(!0);o.isComplete?(f(o.grade),$(".guess-now").prop("disabled",!0)):o.guessCnt?(l=o.guessCnt,p(),onGuess(l)):($(".popup.instructions").show(),$(".popup.instructions .play-now").on("click",function(){o.isComplete||o.guessCnt||(void 0!==s&&clearTimeout(s),s=setTimeout(function(){return h()},LETTER_TIMER)),updateProgress(u,r),$(".popup.instructions").hide(),p()}))},p=function(){$(".guessbox h2").text(a.category).addClass("show").parent().addClass("ready")},m=function(){d||(clearTimeout(s),s=void 0,setStats(grades.F,100),f(grades.F),d=!0)},f=function(e){$(".game-end-popup h3").text(messages[e]),$(".game-end-popup h2").addClass(e).attr("data-grade",e),e===grades.F&&$(".game-end-popup p").text(t),displayStats(),$(".game-end-popup").show()},h=function e(t){var a=i[c%i.length],o=c%2!=0,l=-1;if(t||setGameState(c),-1!=(l=o?n.indexOf(a):n.lastIndexOf(a))){var d=n.split("");d[l]=d[l].toLowerCase(),n=d.join("");var g=$(".guessbox span").get(l);$(g).text(a),c++,updateProgress(++u,r),t||(void 0!==s&&clearTimeout(s),s=setTimeout(function(){return e(t)},LETTER_TIMER))}else c++,e(t);u!=r||t||m()};$(".guess-now").on("click",function(){onGuess(),clearTimeout(s),s=void 0}),$(".guess-check").on("click",function(){var e=onGuessSubmit(n);e?function(){if(!d){var e=u/r*100,t=getGrade(e+=5*(l-1));setStats(t,e),f(t),d=!0}}():!1===e&&(l++,$(".guess-chances span").slice(0,(l||1)-1).addClass("lost"),updateProgressFromWrongGuess(u,r,l),setGameStateGuess(l),$(".guessbox").addClass("wrong-guess"),setTimeout(function(){$(".guessbox").removeClass("wrong-guess"),$(".guessbox input").val(""),$(".guessbox input").first().focus(),l>MAX_GUESS&&m()},1e3))}),$(".main-section").on("keyup","input[type='text']",function(e){var t=$(e.target).closest(".guessbox").find("input[type='text']");8==e.keyCode?t.eq(Math.max(t.index(e.target)-1,0)).val("").focus():t.eq(t.index(e.target)+1).focus()}),$(".bottom-bar .share").on("click",function(){shareStats(t,n,l)})});var setGameState=function(e){localStorage.setItem(items.GAME_STATE,'{ "counter": '.concat(e," }"))},getTodaysStat=function(){localStorage.getItem(items.LAST_PLAYED_DEP)&&(localStorage.removeItem(items.LAST_PLAYED_DEP),localStorage.removeItem(items.GAME_STATE),localStorage.removeItem(items.GRADES),localStorage.removeItem(items.TOTAL_PCT));var e=localStorage.getItem(items.LAST_PLAYED_PHRAZE),t=todaysDayInYear();return e!=t&&(localStorage.setItem(items.LAST_PLAYED_PHRAZE,t),localStorage.removeItem(items.GAME_STATE)),getObjectItem(items.GAME_STATE)},getObjectItem=function(e){var t=localStorage.getItem(e)||"{}";return $.parseJSON(t)},onGuess=function(e){setToGuessMode(),$(".progress-bar-timer").addClass("hide"),$(".guess-chances span").slice(0,(e||1)-1).addClass("lost"),setGameStateGuess(e||1),$(".guessbox").find("span").each(function(){$(this).text().trim().length||$(this).html("<input type='text' maxlength='1'>")}),$(".guessbox input").first().focus()},onGuessSubmit=function(e){var t="",a=!1;if($(".guessbox span").each(function(){$(this).find("input").length?(""===$(this).find("input").val()&&($(this).find("input[type='text']").each(function(e,t){$(t).val()||$(t).addClass("empty"),setTimeout(function(){$(".guessbox input.empty").first().focus(),$(".guessbox input").removeClass("empty")},300)}),a=!0),t+=$(this).find("input").val()||""):t+=$(this).text()||""}),!a)return t.toUpperCase()==e.toUpperCase()},setToGuessMode=function(){$(".main-section").addClass("guess-mode"),$(".guess-now").remove()},setGameStateGuess=function(e){var t=getObjectItem(items.GAME_STATE);t.guessCnt=e,localStorage.setItem(items.GAME_STATE,JSON.stringify(t))},setStats=function(e,t){var a=getObjectItem(items.GAME_STATE);a.didWin=e!=grades.F,a.isComplete=!0,a.grade=e,localStorage.setItem(items.GAME_STATE,JSON.stringify(a));var n=getObjectItem(items.GRADES),r=n[e]||0;n[e]=r+1,localStorage.setItem(items.GRADES,JSON.stringify(n));var s=localStorage.getItem(items.TOTAL_PCT)||0;localStorage.setItem(items.TOTAL_PCT,parseFloat(s)+parseFloat(t))},getGrade=function(e){return e>=0&&e<=40?grades.A:e>40&&e<=60?grades.B:e>60&&e<=80?grades.C:e<100?grades.D:grades.F},shareStats=function(e,t,a){var n=$(".game-end-popup h2.grade").attr("data-grade");n=Object.keys(grades).find(function(e){return grades[e]===n});var r="Phraze ".concat(todaysDayInYear(),",'").concat((new Date).getFullYear().toString().substring(2),"\nGrade: ").concat(n,", ").concat(getSubMsg(n,t,a),"\n\n").concat(buildPhraseStatus(e,t,n));$("body").append("<textarea class='share-msg'></textarea>"),$(".share-msg").html(r),navigator.share?navigator.share({title:"Get Phrazy",url:"https://getphrazy.com/",text:$(".share-msg").html()}).then(function(){console.log("Thanks for sharing!")}).catch(console.error):($(".share-msg").select(),document.execCommand("copy")),$(".share-msg").remove()},getSubMsg=function(e,t,a){return"F"===e&&t.toLowerCase()===t?"Ran out of time!":"F"===e?"Ran out of guesses!":"".concat(1===a?"1st":2===a?"2nd":"3rd"," Guess!")},buildPhraseStatus=function(e,t,a){for(var n=[],r="",s=0,o=0;o<e.length;o++)" "===e[o]&&n.push(o);for(var i=0;i<t.length;i++){if(i>=10&&i%10==0){var c=r.lastIndexOf(" ");r="".concat(r.substring(0,c),"\n\n").concat(r.substring(c+1))}n.indexOf(i+s)>-1&&(r+="  ",s++),t[i]===t[i].toUpperCase()?r+="F"===a?emojis.RED_BOX:emojis.GREEN_BOX:r+=emojis.REVEALED_BOX}return r},replaceAt=function(e,t,a){e.substr(0,t),e.substrr(t+a.length)},displayStats=function(){var e=$(".game-end-popup .stats"),t=getObjectItem(items.GRADES),a=localStorage.getItem(items.TOTAL_PCT),n=Object.values(t),r=Math.max.apply(Math,_toConsumableArray(n))||5,s=n.reduce(function(e,t){return e+t},0),o=a?getGrade(a/s):"",i='\n        <div class="chart">\n            <span data-grade="'.concat(grades.A,'">&nbsp;</span>\n            <span data-grade="').concat(grades.B,'">&nbsp;</span>\n            <span data-grade="').concat(grades.C,'">&nbsp;</span>\n            <span data-grade="').concat(grades.D,'">&nbsp;</span>\n            <span data-grade="').concat(grades.F,'">&nbsp;</span>\n        </div>\n        <div class="chart-labels">\n            <span class="').concat(grades.A,'"></span>\n            <span class="').concat(grades.B,'"></span>\n            <span class="').concat(grades.C,'"></span>\n            <span class="').concat(grades.D,'"></span>\n            <span class="').concat(grades.F,'"></span>\n        </div>\n    '),c='\n        <div class="overall-stats">\n            <span class="game-total">'.concat(s,'</span>\n            <span class="grade ').concat(o,'"></span>\n            <h5>Total Games Played</h5>\n            <h5>Overall Grade</h5>\n        </div>\n    ');e.html(i),e.after(c),e.find(".chart span").each(function(e,a){var n=$(a).attr("data-grade"),s=(t[n]||0)/r*100;$(a).css("height","".concat(s,"px")),t[n]&&$(a).text(t[n])})},updateProgress=function(e,t){var a=e/t*100,n=Math.min((e+1)/t*100,100);$(".progress-bar-cover").css("width","".concat(a,"%")),$(".progress-bar-timer").css("width","".concat(n,"%"))},updateProgressFromWrongGuess=function(e,t,a){var n=e/t*100;n+=5*(a-1),$(".progress-bar-cover").css("width","".concat(n,"%"))},initProgress=function(e){for(var t=1/e*100,a=0;a<e-1;a++)$(".progress-bar").append('<small class="divider" style="left:'.concat(t*(a+1),'%"></small>'))},getTodaysDt=function(){var e=new Date;return"".concat(e.getMonth()+1,"/").concat(e.getDate(),"/").concat(e.getFullYear())},todaysDayInYear=function(){var e=new Date,t=new Date(e.getFullYear(),0,0),a=e-t;return Math.floor(a/864e5)},displayCountdown=function(){var e=new Date,t=new Date(e);t.setDate(t.getDate()+1),t.setHours(0,0,0,0);var a=Date.parse(t)-Date.parse(e),n=("0"+Math.floor(a/1e3%60)).slice(-2),r=("0"+Math.floor(a/1e3/60%60)).slice(-2),s=("0"+Math.floor(a/36e5%24)).slice(-2);$(".game-end-popup .next-phraze span").text("".concat(s,":").concat(r,":").concat(n)),a<=0&&void 0!==window.nextPhrazeInterval&&clearInterval(window.nextPhrazeInterval),"00"===s&&"00"===r&&"00"===n&&location.reload()},initNextPhrazeCountdown=function(){void 0!==window.nextPhrazeInterval&&clearInterval(window.nextPhrazeInterval),displayCountdown(),window.nextPhrazeInterval=setInterval(function(){displayCountdown()},1e3)},randomizeItems=function(e){return e.map(function(e){return{sort:Math.random(),value:e}}).sort(function(e,t){return e.sort-t.sort}).map(function(e){return e.value})},pattern=[["D","L","Z","F","E","K","B","O","P","V","T","G","S","A","C","U","N","I","H","R","Y","J","M","X","Q","W"],["H","M","E","D","J","O","N","R","X","K","U","Y","V","S","B","W","F","T","A","P","Q","L","I","Z","C","G"],["Z","M","K","N","X","G","U","S","E","R","B","V","A","P","T","I","C","F","D","W","L","O","J","Y","H","Q"],["N","X","B","R","Y","T","L","I","S","P","E","C","V","J","H","Z","A","G","W","F","U","M","O","K","D","Q"],["I","N","F","Q","C","U","R","O","D","H","A","Z","L","K","V","J","S","M","G","P","Y","X","T","B","E","W"],["F","Q","V","H","K","Y","C","J","X","Z","M","R","W","E","N","S","P","I","B","U","O","A","G","D","T","L"],["W","G","Y","U","M","N","H","I","K","Z","O","R","B","Q","C","P","J","F","S","T","L","A","X","E","D","V"]],items={LAST_PLAYED_DEP:"last-played-date",LAST_PLAYED_PHRAZE:"last-played-phraze",GAME_STATE:"game-state",GRADES:"grades",TOTAL_PCT:"overall-pct-shown"},messages={"grade-a":"Rockstar!","grade-b":"You got it!","grade-c":"Good Guess!","grade-d":"Phew, that was close!","grade-f":""},grades={A:"grade-a",B:"grade-b",C:"grade-c",D:"grade-d",F:"grade-f"},emojis={GREEN_BOX:"&#129001;",REVEALED_BOX:"&#128307;",RED_BOX:"&#128997;"},MAX_GUESS=3,LETTER_TIMER=5e3,GUESS_PENALTY=5;