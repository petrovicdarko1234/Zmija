function gameStart() {
    let board = document.getElementById('snakeBoard')
    if (board == null) {
        return
    }
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let iDiv = document.createElement('div');
            iDiv.id = i + '_' + j;
            iDiv.className = "snakePart"

            board.appendChild(iDiv)
        }
    }
    document.onkeydown = (e) => {
        console.log("keydown:", e.code, " key:", e.key, "pressed:", keyPressed)
        if (keyPressed) {
            return
        }

        switch (e.key) {
            case "ArrowUp":
            case "w":
                keyPressed = true
                up()
                keyPressed = false
                break;

            case "ArrowDown":
            case "s":
                keyPressed = true
                down()
                keyPressed = false
                break;

            case "ArrowLeft":
            case "a":
                keyPressed = true
                left()
                keyPressed = false
                break;

            case "ArrowRight":
            case "d":
                keyPressed = true
                right()
                keyPressed = false
                break;
        }
    }
    placeFood()
    let elem = document.getElementById("score")
    if (elem != null) {
        elem.innerHTML = "Score: " + score
    }
    console.log("on load")
    right()
}

function on(i: number, j: number) {
    let tileBlack = document.getElementById(i + "_" + j)
    if (tileBlack != null) {
        tileBlack.classList.add("on")
    } else {
        throw new Error("Unkown id:" + i + "_" + j)
    }
}
function off(i: number, j: number) {
    let tileBlack = document.getElementById(i + "_" + j)
    if (tileBlack != null) {
        tileBlack.classList.remove('on')
    }
}
function onFood(i: number, j: number) {
    let tileOrange = document.getElementById(i + "_" + j)
    if (tileOrange != null) {
        tileOrange.classList.add("onFood")
    }
}
function offFood(i: number, j: number) {
    let tileOrange = document.getElementById(i + "_" + j)
    if (tileOrange != null) {
        tileOrange.classList.remove("onFood")
    }
}

class SnakePart {
    i: number
    j: number
    next: SnakePart | null
    constructor(i: number, j: number, nextElement: SnakePart | null) {
        this.i = i
        this.j = j
        this.next = nextElement
    }
}
function restart() {
    let cur: SnakePart | null = head
    while (cur != null) {
        off(cur.i, cur.j)
        cur = cur.next
    }

    last = new SnakePart(4, 1, null)
    mid = new SnakePart(4, 2, last)
    head = new SnakePart(4, 3, mid)
    score = 0

    let restratMsg = document.getElementById("snakeBoard")
    if (restratMsg != null) {
        restratMsg.innerHTML = "YOU DIED rtd"
    }
}

let last = new SnakePart(4, 1, null)
let mid = new SnakePart(4, 2, last)
let head = new SnakePart(4, 3, mid)

let intervalId = -1

let check = "0"

let score = 0

let keyPressed = false

function move(i: number, j: number) {
    head = new SnakePart(head.i + i, head.j + j, head)
    if (snakeEatsHerself() || head.j > 9 || head.i > 9 || head.j < 0 || head.i < 0) {
        clearInterval(intervalId)
        restart()
        return
    }
    on(head.i, head.j)
    if (head.i == iFood && head.j == jFood) {
        let pScore = document.getElementById("score")
        score += 10
        if (pScore != null) {
            pScore.innerHTML = "Score: " + score
        }
        offFood(iFood, jFood)
        placeFood()
        return
    }
    removeTail(head)
}
function right() {
    if (check != "left") {
        clearInterval(intervalId)
        intervalId = setInterval(move, 200, 0, 1)
        check = "right"
    }
}
function down() {
    if (check != "up") {
        clearInterval(intervalId)
        intervalId = setInterval(move, 200, 1, 0)
        check = "down"
    }
}

function left() {
    if (check != "right") {
        clearInterval(intervalId)
        intervalId = setInterval(move, 200, 0, -1)
        check = "left"
    }
}

function up() {
    if (check != "down") {
        clearInterval(intervalId)
        intervalId = setInterval(move, 200, -1, 0)
        check = "up"
    }
}

function removeTail(head: SnakePart) {
    let cur = head
    let previus = head
    while (cur.next != null) {
        previus = cur
        cur = cur.next
    }
    previus.next = null
    off(cur.i, cur.j)
}

let iFood = 0
let jFood = 0
function placeFood() {
    let foodInBody: boolean = false

    while (true) {
        iFood = Math.floor(Math.random() * 10)
        jFood = Math.floor(Math.random() * 10)

        let cur = head
        foodInBody = false
        while (cur.next != null) {
            if (cur.i == iFood && cur.j == jFood) {
                foodInBody = true
                break
            }
            cur = cur.next
        }
        if (!foodInBody) {
            onFood(iFood, jFood)
            break
        }
    }
}

function snakeEatsHerself(): boolean {
    let headI = head.i
    let headJ = head.j

    let cur = head.next
    while (cur != null) {
        if (headI == cur.i && headJ == cur.j) {
            return true
        }
        cur = cur.next
    }
    return false
}

