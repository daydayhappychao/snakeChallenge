var snake = {
    map: '#map',
    class: 'active',
    foodClass: 'food',
    size: 10,
    speed: 500,
    start: function () {
        var activeClass = this.class
        var nowFoodClass = this.foodClass
        var size = this.size
        var point = 0
        /**init table */
        for (var i = 0; i < this.size; i++) {
            $(this.map).append('<tr></tr>')
        }
        for (var i = 0; i < $(this.map).children('tr').length; i++) {
            for (var j = 0; j < this.size; j++) {
                $($(this.map).children('tr')[i]).append('<td></td>')
            }
        }
        $('body').append(`<div style="text-align:center">已获得积分<span id="point">0</span></div>`)
        /**end */
        var direction = 0 //方向, the same as css border's param
        var snakeArr = []
        var $center_tr = $(this.map).children('tr')[Math.floor(this.size / 2)]

        for (var i = -1; i < 2; i++) {
            $($($center_tr).children('td')[Math.floor(this.size / 2 + i)]).addClass('active')
            snakeArr.push([Math.floor(this.size / 2), Math.floor(this.size / 2 + i)])
        }

        var foodPoint = getFoodPoint(size, snakeArr)

        $($($(this.map).children('tr')[foodPoint[0]]).children('td')[foodPoint[1]]).addClass(this.foodClass)

        function keyUp(e) {
            var currKey = 0, e = e || event;
            currKey = e.keyCode || e.which || e.charCode;
            var keyName = String.fromCharCode(currKey);
            // alert(currKey)
            if (currKey === 37 && direction !== 3 && direction !== 1
                && (snakeArr[snakeArr.length - 1][1] - snakeArr[snakeArr.length - 2][1]) !== 1) {
                direction = 3
            } else if (currKey === 38 && direction !== 0 && direction !== 2
                && (snakeArr[snakeArr.length - 1][0] - snakeArr[snakeArr.length - 2][0]) !== 1) {
                direction = 0
            } else if (currKey === 39 && direction !== 1 && direction !== 3
                && (snakeArr[snakeArr.length - 1][1] - snakeArr[snakeArr.length - 2][1]) !== -1) {
                direction = 1
            } else if (currKey === 40 && direction !== 2 && direction !== 0
                && (snakeArr[snakeArr.length - 1][0] - snakeArr[snakeArr.length - 2][0]) !== -1) {
                direction = 2
            }

        }
        document.onkeyup = keyUp;
        var run = setInterval(function () {
            direction = algorithms(direction, foodPoint, snakeArr, size, this.map, activeClass)
            if (direction === 0) {
                var newY = parseInt(snakeArr[snakeArr.length - 1][0]) - 1
                var newX = parseInt(snakeArr[snakeArr.length - 1][1])
                snakeArr.push([newY, newX])
            } else if (direction === 1) {
                var newY = parseInt(snakeArr[snakeArr.length - 1][0])
                var newX = parseInt(snakeArr[snakeArr.length - 1][1]) + 1
                snakeArr.push([newY, newX])
            } else if (direction === 2) {
                var newY = parseInt(snakeArr[snakeArr.length - 1][0]) + 1
                var newX = parseInt(snakeArr[snakeArr.length - 1][1])
                snakeArr.push([newY, newX])
            } else if (direction === 3) {
                var newY = parseInt(snakeArr[snakeArr.length - 1][0])
                var newX = parseInt(snakeArr[snakeArr.length - 1][1]) - 1
                snakeArr.push([newY, newX])
            }

            var newTd = $($($(this.map).children('tr')[snakeArr[snakeArr.length - 1][0]]).children('td')[snakeArr[snakeArr.length - 1][1]])
            if (newTd.length === 0) {
                // alert('游戏失败')
                clearInterval(run)
                return
            }
            if (snakeArr[snakeArr.length - 1][0] === foodPoint[0] && snakeArr[snakeArr.length - 1][1] === foodPoint[1]) {
                $($($(this.map).children('tr')[foodPoint[0]]).children('td')[foodPoint[1]]).removeClass(nowFoodClass)

                foodPoint = getFoodPoint(size, snakeArr)

                $($($(this.map).children('tr')[foodPoint[0]]).children('td')[foodPoint[1]]).addClass(nowFoodClass)
                point++
                $('#point').text(point)
            } else if (snakeDie(snakeArr)) {
                console.log(snakeArr)
                clearInterval(run)
                return
            } else {
                $($($(this.map).children('tr')[snakeArr[0][0]]).children('td')[snakeArr[0][1]])
                    .removeClass(activeClass)
                snakeArr.splice(0, 1)
            }
            newTd.addClass(activeClass)
        }, this.speed)
    }
}

function getFoodPoint(size, snakeArr) {
    foodY = Math.floor(Math.random() * size)
    foodX = Math.floor(Math.random() * size)
    snakeArr.forEach(v => {
        if (v[0] == foodY && v[1] == foodX) {
            getFoodPoint(size, snakeArr)
            return false
        }
    })
    return [foodY, foodX]
}
function snakeDie(snakeArr) {
    var _snakeArr = snakeArr.slice(1, snakeArr.length - 1)
    for (var i = 0; i < _snakeArr.length; i++) {
        if (_snakeArr[i][0] == snakeArr[snakeArr.length - 1][0] && _snakeArr[i][1] == snakeArr[snakeArr.length - 1][1]) {
            return true
        }
    }
    return false
}



function algorithms(direction, food, snakeArr, size, map, active) {
    // debugger
    var snakeHead = snakeArr[snakeArr.length - 1]
    var snakeHeadX = snakeHead[1]
    var snakeHeadY = snakeHead[0]
    var foodX = food[1]
    var foodY = food[0]

    var nextDir = direction //*默认下一个方向等同于前面的方向
    //*判断food和snakehead位置
    var foodDir = 0
    if (foodX == snakeHeadX && foodY < snakeHeadY) foodDir = 0
    else if (foodX > snakeHeadX && foodY < snakeHeadY) foodDir = 1
    else if (foodX > snakeHeadX && foodY == snakeHeadY) foodDir = 2
    else if (foodX > snakeHeadX && foodY > snakeHeadY) foodDir = 3
    else if (foodX == snakeHeadX && foodY > snakeHeadY) foodDir = 4
    else if (foodX < snakeHeadX && foodY > snakeHeadY) foodDir = 5
    else if (foodX < snakeHeadX && foodY == snakeHeadY) foodDir = 6
    else if (foodX < snakeHeadX && foodY < snakeHeadY) foodDir = 7

    if (foodDir === 0 && (direction == 3 || direction == 1 || direction == 0)) nextDir = 0
    else if (foodDir === 0 && direction == 2) {
        var random = Math.random()
        if (random > 0.5) nextDir = 1
        else nextDir = 3
    } else if (foodDir === 1 && (direction == 0 || direction == 3)) nextDir = 0
    else if (foodDir === 1 && (direction == 1 || direction == 2)) nextDir = 1
    else if (foodDir === 2 && (direction == 0 || direction == 1 || direction == 2)) nextDir = 1
    else if (foodDir === 2 && (direction == 3)) {
        var random = Math.random()
        if (random > 0.5) nextDir = 0
        else nextDir = 2
    } else if (foodDir == 3 && (direction == 0 || direction == 1)) nextDir = 1
    else if (foodDir == 3 && (direction == 2 || direction == 3)) nextDir = 2
    else if (foodDir == 4 && (direction == 1 || direction == 2 || direction == 3)) nextDir = 2
    else if (foodDir == 4 && (direction == 0)) {
        var random = Math.random()
        if (random > 0.5) nextDir = 1
        else nextDir = 3
    } else if (foodDir == 5 && (direction == 1 || direction == 2)) nextDir = 2
    else if (foodDir == 5 && (direction == 0 || direction == 3)) nextDir = 3
    else if (foodDir == 6 && (direction == 3 || direction == 0 || direction == 2)) nextDir = 3
    else if (foodDir == 6 && (direction == 1)) {
        var random = Math.random()
        if (random > 0.5) nextDir = 0
        else nextDir = 2
    } else if (foodDir == 7 && (direction == 3 || direction == 2)) nextDir = 3
    else if (foodDir == 7 && (direction == 0 || direction == 1)) nextDir = 0

    return checkOutWay(direction, nextDir, snakeArr, size, map, active)

}

function checkOutWay(direction, nextDir, snakeArr, size, map, active, historyDirectionArr) {
    var openList = []
    var nextSnake = snakeArr.slice()
    //*初始化nextSnake
    if (nextDir === 0)
        nextSnake.push([snakeArr[snakeArr.length - 1][0] - 1, snakeArr[snakeArr.length - 1][1]])
    else if (nextDir === 1)
        nextSnake.push([snakeArr[snakeArr.length - 1][0], parseInt(snakeArr[snakeArr.length - 1][1]) + 1])
    else if (nextDir === 2)
        nextSnake.push([parseInt(snakeArr[snakeArr.length - 1][0]) + 1, snakeArr[snakeArr.length - 1]])
    else if (nextDir === 3)
        nextSnake.push([snakeArr[snakeArr.length - 1][0], snakeArr[snakeArr.length - 1][1] - 1])

    var newTd = $($($(this.map).children('tr')[snakeArr[snakeArr.length - 1][0]]).children('td')[snakeArr[snakeArr.length - 1][1]])

    //* 蛇在下一步执行了之后就会死，要赶紧掉头
    if (snakeDie(nextSnake) || newTd.length === 0) {
        //* 转了弯才死的
        if (direction !== nextDir) {
            var otherTurnDir = nextDir % 2 ? (4 - nextSnake) : (2 - nextSnake)
            //*不是第一次执行checkOutWay方法了
            if (historyDirectionArr) {
                //*historyDirectionArr长度为3，总共就3个方向，全不行，那去死吧
                if (historyDirectionArr.length > 2) {
                    alert('握草，老子选择死亡')
                    return nextDir
                } else {
                    if (historyDirectionArr.includes(direction)) {
                        if (historyDirectionArr.includes(otherTurnDir)) {
                            alert('握草，老子选择死亡')
                            return nextDir
                        } else {
                            historyDirectionArr.push(nextDir)
                            return checkOutWay(direction, otherTurnDir, snakeArr, size, map, active, historyDirectionArr)
                        }
                    } else {
                        historyDirectionArr.push(nextDir)
                        return checkOutWay(direction, direction, snakeArr, size, map, active, historyDirectionArr)
                    }
                }
            }
            //* 若是爱已不可为  
            else {
                return checkOutWay(direction, direction, snakeArr, size, map, active, [nextDir])
            }

        }
        //*直走撞死的
        else {
            var dirType = direction % 2
            var otherTurnDir = 0
            if (dirType) {
                otherTurnDir = Math.random() > 0.5 ? 0 : 2
                if (historyDirectionArr && historyDirectionArr.includes(otherTurnDir))
                    otherTurnDir = 2 - otherTurnDir
                if (!historyDirectionArr)
                    historyDirectionArr = []
                historyDirectionArr.push(nextDir)
                return checkOutWay(direction, otherTurnDir, snakeArr, size, map, active, historyDirectionArr)
            } else {
                otherTurnDir = Math.random() > 0.5 ? 1 : 3
                if (historyDirectionArr && historyDirectionArr.includes(otherTurnDir))
                    otherTurnDir = 4 - otherTurnDir
                if (!historyDirectionArr)
                    historyDirectionArr = []
                historyDirectionArr.push(nextDir)
                return checkOutWay(direction, otherTurnDir, snakeArr, size, map, active, historyDirectionArr)
            }
        }
    }
    //*蛇下一步看似走的很安全，进行A*判断
    else {
        //* 这就说明他是真的安全的，去吧皮卡丘
        if (checkHeadTail(nextSnake, size, map, active)) {
            return nextDir
        }
        //*看似很安全，实则进入了自己创造的牢笼
        else {
            var directions = []
            if (direction == 0) directions = [0, 1, 3]
            if (direction == 1) directions = [0, 1, 2]
            if (direction == 2) directions = [2, 1, 3]
            if (direction == 3) directions = [2, 0, 3]

            if (!historyDirectionArr)
                historyDirectionArr = []
            historyDirectionArr.push(nextDir)


            directions.forEach((v, k) => {
                historyDirectionArr.forEach((vv, kk) => {
                    if (v == vv) directions.splice(k, 1)
                })
            })


            if (directions.length === 0) {
                alert('shabi')
                return direction
            }

            return checkOutWay(direction, directions[0], snakeArr, size, map, active, historyDirectionArr)
        }
    }

}

function checkHeadTail(snakeArr, size, map, active) {
    var snakeHead = snakeArr[snakeArr.length - 1]
    var snakeHeadX = snakeHead[1], snakeHeadY = snakeHead[0]
    var snakeTail = snakeArr[0]
    var snakeTailX = snakeTail[1], snakeTailY = snakeTail[0]
    var openList = [], closeList = []
    var snakeDead = true
    openList.push({ x: snakeHeadX, y: snakeHeadY })


    do {
        if (openList.length == 0) {
            break
        }
        var curP = openList.pop()
        closeList.push(curP)

        var surCurP = surroundPoint(curP)
        surCurP.forEach((v, k) => {
            //* 在地图内
            if (v.x > -1 && v.x < size && v.y > -1 && v.y < size) {
                //* 不在openlist和closelist内
                if ((!existList(v, closeList)) && (!existList(v, openList))) {
                    //*不在snakeArr内
                    if (!existArr(v, snakeArr)) {
                        openList.push(v)
                    }
                }
            }
        })
    } while (!(snakeDead = existList({ x: snakeTailX, y: snakeTailY }, openList)))

    return !snakeDead
}
function existArr(point, arr) {
    for (var i in arr) {
        if (point.x == arr[i][1] && point.y == arr[i][0]) {
            return i
        }
    }
    return false
}
function existList(point, list) {
    for (var i in list) {
        if (point.x == list[i].x && point.y == list[i].y) {
            return i;
        }
    }
    return false;
}


function surroundPoint(curPoint) {
    var x = parseInt(curPoint.x), y = parseInt(curPoint.y);
    return [
        { x: x, y: y - 1 },
        { x: x + 1, y: y },
        { x: x, y: y + 1 },
        { x: x - 1, y: y }
    ]
}