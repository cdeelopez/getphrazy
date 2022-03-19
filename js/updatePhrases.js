const getPhrases2 = (cb) => {
    $.getJSON("./phrazes-cat.json", function(data){
        cb(data.phrazes)
    }).fail(function(){
        console.log("An error has occurred.")
    })
}

getPhrases2((phrases) => {
    const newArr = []
    phrases.forEach((a) => {
        const phraseLength = a.phraze.replaceAll(" ", "").length
        const letterArr = [...Array(phraseLength).keys()]
        const ab = letterArr
            .map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
            newArr.push({...a, pattern: ab})
        })
        newArr.forEach((item) => {
            console.log(`{ "phraze": "${item.phraze}", "category": "${item.category }", "pattern": [${[...item.pattern]}] }`)
        })   
    
})