class Column {
    constructor(height, xcor, isbottom) {
        const div = document.createElement("div")
        div.style.cssText = `
            background-color: green;
            width: 60px;
            height:${height};
            position: absolute;
            left: ${xcor};
            top:${isbottom ? window.innerHeight - parseInt(height) + "px" : 0}`
        document.body.appendChild(div)
    }
}
const column1 = new Column("500px", "300px", true)
const column2 = new Column("400px", "200px", false)