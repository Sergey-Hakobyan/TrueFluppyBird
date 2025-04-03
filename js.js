const genNum = (a, b) => Math.random() * (b - a) + a
const allColumns = []
const checkingCollision = (x1b, x2b, y1b, y2b, x1c, x2c, y1c, y2c) => {
    if (x1c <= x1b && x1b <= x2c && y1c <= y1b && y1b <= y2c) return true
    if (x1c <= x2b && x2b <= x2c && y1c <= y1b && y1b <= y2c) return true
    if (x1c <= x1b && x1b <= x2c && y1c <= y2b && y2b <= y2c) return true
    if (x1c <= x2b && x2b <= x2c && y1c <= y2b && y2b <= y2c) return true
    return false
}

const audio = document.getElementById("myAudio")
const firstImg = document.getElementById("img1")

class ScoreCounter {
    points = 0
    constructor() {
        const scoreBlock = document.createElement("div")
        this.scoreBlock = scoreBlock
        scoreBlock.id = "ScoreCounter"
        this.updateText()
        document.body.appendChild(scoreBlock)
    }
    updateText() {
        this.scoreBlock.textContent = `Ваш счет - ${this.points}`
    }
    stop() {
        clearInterval(this.interval3)
        this.updateText()
    }
    start() {
        this.interval3 = setInterval(() => {
            this.points += 1
            this.updateText()
        }, 1000
        )
    }
}
const score = new ScoreCounter()

class Birds {
    timeBird = 0
    acceleration = 0
    life = true
    constructor(x, y) {
        this.y = y
        this.x = x
        const birdDiv = document.createElement("img")
        this.ptichka = birdDiv
        birdDiv.src = "bird.svg"
        birdDiv.className = "Birds"
        birdDiv.style.top = y + "px"
        birdDiv.style.left = x + "px"
        document.body.appendChild(birdDiv)
    }
    die() {
        document.body.removeChild(this.ptichka)
        this.life = false
        clearInterval(this.interval2)
        score.stop()
    }
    jump() {
        this.acceleration -= 70
        this.timeBird = 0
    }
    getBirdArea() {
        const x1b = this.x
        const x2b = this.x + window.innerWidth * 0.0520833
        const y1b = this.y
        const y2b = this.y + window.innerWidth * 0.0520833
        return {
            x1b, x2b, y1b, y2b
        }
    }
    fly() {
        this.interval2 = setInterval(() => {
            this.timeBird += 0.2
            this.acceleration += (20 * (this.timeBird + 1) ** 2) / 2
            this.y += this.acceleration
            this.ptichka.style.top = this.y + "px"
            if (this.y >= window.innerHeight || this.y <= -100) {
                this.die()
            }
            allColumns.forEach((column) => {
                const { x1, x2, y1, y2, } = column.getKillingArea()
                const { x1b, x2b, y1b, y2b } = this.getBirdArea()
                const hasCollision = checkingCollision(x1b, x2b, y1b, y2b, x1, x2, y1, y2)
                if (hasCollision) {
                    bird.die()
                }
            })
        }, 200
        )

    }
}

class Column {
    width = window.innerWidth * 0.06
    accelerate = 35
    constructor(isTop, x, height) {
        const link = document.createElement("div")
        this.x = x
        this.link = link
        this.height = height
        link.className = "Column"
        link.style.cssText = `
        width:${this.width}px;
        left:${x}px;
        height:${height}px;
        `
        this.y = isTop ? 0 : window.innerHeight - height
        if (isTop === true) {
            link.style.top = 0
        }
        else {
            const bibkaRosti = window.innerHeight - height
            link.style.top = `${bibkaRosti}px`
        }
        document.body.appendChild(link)
    }
    disappear() {
        document.body.removeChild(this.link)
        allColumns.shift()
    }
    getKillingArea() {
        const x1 = this.x
        const x2 = this.x + this.width
        const y1 = this.y
        const y2 = this.y + this.height
        return {
            x1, x2, y1, y2,
        }
    }
    move() {
        const interval = setInterval(() => {
            this.x -= this.accelerate + score.points * 2
            this.link.style.left = `${this.x}px`
            if (this.x + this.width <= 0 || bird.life === false) {
                this.disappear()
                clearInterval(interval)
            }
        }, 200
        )
    }
}
const bird = new Birds(300, 300)

const catchKey = (event) => {
    switch (event.key) {
        case ' ':
            audio.play()
            bird.jump()
            firstImg.src = `backgrounds/${Math.round(genNum(1, 15))}.jpg`
            break;
    }
}

const generateColumn = () => {
    if (genNum(1, 100) < 95) {
        const nextColumn = new Column(Boolean(Math.round(genNum(0, 1))), window.innerWidth, genNum(window.innerHeight * 0.2, window.innerHeight * 0.8))
        allColumns.push(nextColumn)
        nextColumn.move()
    }
    setTimeout(generateColumn, 6000 - score.points * 65)
}

const genColumn = () => {
    generateColumn()
}

const main = () => {
    score.start()
    bird.fly()
    genColumn()
}

main()

document.addEventListener("keydown", catchKey)

