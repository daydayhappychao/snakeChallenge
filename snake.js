var snake = {
    map: '#map',
    class: 'active',
    foodClass: 'food',
    speed: 20,
    size: 60,
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
            direction = algorithms(snakeArr[snakeArr.length - 1], foodPoint, direction, snakeArr, size)
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
                alert('游戏失败')
                console.log(snakeArr)
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
                alert('游戏失败')
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



function snakeTurn(direction, snakeArr, size, snakeHeadX, snakeHeadY) {
    var hasTurn = false, turnMethod
    var directionType = [0, 2].indexOf(direction) !== -1 ? 'vetical' : 'horizontal'
    //判断snakeHead右侧是否有snakeArr
    for (var i = (directionType === 'vetical' ? snakeHeadX : snakeHeadY); i < size; i++) {
        for (var j = 0; j < snakeArr.length; j++) {
            if (snakeArr[j][1] == (directionType === 'vetical' ? i : snakeHeadX) &&
                snakeArr[j][0] == (directionType === 'vetical' ? snakeHeadY : i)) {
                hasTurn = true
                turnMethod = detectionDanger(direction, (directionType === 'vetical' ? 3 : 0), snakeArr, size)
            }
        }
    }
    //判断snakeHead左侧是否有snakeArr
    for (var i = (directionType === 'vetical' ? snakeHeadX : snakeHeadY); i > -1; i--) {
        for (var j = 0; j < snakeArr.length; j++) {
            if (snakeArr[j][1] == (directionType === 'vetical' ? i : snakeHeadX)
                && snakeArr[j][0] == (directionType === 'vetical' ? snakeHeadY : i)) {
                if (hasTurn)
                    hasTurn = false
                else
                    hasTurn = true
                turnMethod = detectionDanger(direction, (directionType === 'vetical' ? 1 : 2), snakeArr, size)
            }
        }
    }
    return [hasTurn, turnMethod]
}
/**
 * 自动化
 * 
 * @param {any} snakeHead  Array<any>
 * @param {any} food Array<any>
 * @param {any} direction number
 * @param {any} snakeArr Array<any>
 * @param {any} size number
 * @returns 
 */
function algorithms(snakeHead, food, direction, snakeArr, size) {
    var snakeHeadX = snakeHead[1]
    var snakeHeadY = snakeHead[0]

    var foodX = food[1]
    var foodY = food[0]

    //*死亡判断
    var nextSnake = snakeArr.slice()
    if (direction == 0) {
        nextSnake.push([snakeHead[0] - 1, snakeHead[1]])
        if (snakeDie(nextSnake) || nextSnake[nextSnake.length - 1][0] < 0 || nextSnake[nextSnake.length - 1][0] > (size - 1)
            || nextSnake[nextSnake.length - 1][1] < 0 || nextSnake[nextSnake.length - 1][1] > (size - 1)) {
            var left = 0
            var right = 0
            var turnInfo = snakeTurn(direction, snakeArr, size, snakeHeadX, snakeHeadY)
            if (turnInfo[0])
                return turnInfo[1]
            for (var i = 0; i < snakeArr.length; i++) {
                if (snakeArr[i][1] < snakeHead[1]) left++
                else if (snakeArr[i][1] > snakeHead[1]) right++
            }
            if (left > right) {
                return detectionDanger(direction, 1, snakeArr, size)
            }
            else if (left < right) return detectionDanger(direction, 3, snakeArr, size)
            else if (snakeHead[1] * 2 < size) return detectionDanger(direction, 1, snakeArr, size)
            else return detectionDanger(direction, 3, snakeArr, size)
        }
    } else if (direction == 1) {
        nextSnake.push([snakeHead[0], parseInt(snakeHead[1]) + 1])
        if (snakeDie(nextSnake) || nextSnake[nextSnake.length - 1][0] < 0 || nextSnake[nextSnake.length - 1][0] > (size - 1)
            || nextSnake[nextSnake.length - 1][1] < 0 || nextSnake[nextSnake.length - 1][1] > (size - 1)) {
            var top = 0
            var bottom = 0
            var turnInfo = snakeTurn(direction, snakeArr, size, snakeHeadX, snakeHeadY)
            if (turnInfo[0])
                return turnInfo[1]
            for (var i = 0; i < snakeArr.length; i++) {
                if (snakeArr[i][0] < snakeHead[0]) top++
                else if (snakeArr[i][0] > snakeHead[0]) bottom++
            }
            if (top > bottom) return detectionDanger(direction, 2, snakeArr, size)
            else if (top < bottom) return detectionDanger(direction, 0, snakeArr, size)
            else if (snakeHead[0] * 2 < size) return detectionDanger(direction, 2, snakeArr, size)
            else return detectionDanger(direction, 0, snakeArr, size)
        }
    } else if (direction == 2) {
        nextSnake.push([parseInt(snakeHead[0]) + 1, snakeHead[1]])
        if (snakeDie(nextSnake) || nextSnake[nextSnake.length - 1][0] < 0 || nextSnake[nextSnake.length - 1][0] > (size - 1)
            || nextSnake[nextSnake.length - 1][1] < 0 || nextSnake[nextSnake.length - 1][1] > (size - 1)) {
            var left = 0
            var right = 0
            var turnInfo = snakeTurn(direction, snakeArr, size, snakeHeadX, snakeHeadY)
            if (turnInfo[0])
                return turnInfo[1]
            for (var i = 0; i < snakeArr.length; i++) {
                if (snakeArr[i][1] < snakeHead[1]) left++
                else if (snakeArr[i][1] > snakeHead[1]) right++
            }
            if (left > right) return detectionDanger(direction, 1, snakeArr, size)
            else if (left < right) return detectionDanger(direction, 3, snakeArr, size)
            else if (snakeHead[1] * 2 < size) return detectionDanger(direction, 1, snakeArr, size)
            else return detectionDanger(direction, 3, snakeArr, size)
        }
    } else if (direction == 3) {
        nextSnake.push([snakeHead[0], snakeHead[1] - 1])
        if (snakeDie(nextSnake) || nextSnake[nextSnake.length - 1][0] < 0 || nextSnake[nextSnake.length - 1][0] > (size - 1)
            || nextSnake[nextSnake.length - 1][1] < 0 || nextSnake[nextSnake.length - 1][1] > (size - 1)) {
            var top = 0
            var bottom = 0
            var turnInfo = snakeTurn(direction, snakeArr, size, snakeHeadX, snakeHeadY)
            if (turnInfo[0])
                return turnInfo[1]
            for (var i = 0; i < snakeArr.length; i++) {
                if (snakeArr[i][0] < snakeHead[0]) top++
                else if (snakeArr[i][0] > snakeHead[0]) bottom++
            }
            if (top > bottom) return detectionDanger(direction, 2, snakeArr, size)
            else if (top < bottom) return detectionDanger(direction, 0, snakeArr, size)
            else if (snakeHead[0] * 2 < size) return detectionDanger(direction, 2, snakeArr, size)
            else return detectionDanger(direction, 0, snakeArr, size)
        }
    }
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

    if (foodDir === 0 && (direction == 3 || direction == 1 || direction == 0)) return detectionDanger(direction, 0, snakeArr, size)
    else if (foodDir === 0 && direction == 2) {
        var random = Math.random()
        if (random > 0.5) return detectionDanger(direction, 1, snakeArr, size)
        else return detectionDanger(direction, 3, snakeArr, size)
    } else if (foodDir === 1 && (direction == 0 || direction == 3)) return detectionDanger(direction, 0, snakeArr, size)
    else if (foodDir === 1 && (direction == 1 || direction == 2)) return detectionDanger(direction, 1, snakeArr, size)
    else if (foodDir === 2 && (direction == 0 || direction == 1 || direction == 2)) return detectionDanger(direction, 1, snakeArr, size)
    else if (foodDir === 2 && (direction == 3)) {
        var random = Math.random()
        if (random > 0.5) return detectionDanger(direction, 0, snakeArr, size)
        else return detectionDanger(direction, 2, snakeArr, size)
    } else if (foodDir == 3 && (direction == 0 || direction == 1)) return detectionDanger(direction, 1, snakeArr, size)
    else if (foodDir == 3 && (direction == 2 || direction == 3)) return detectionDanger(direction, 2, snakeArr, size)
    else if (foodDir == 4 && (direction == 1 || direction == 2 || direction == 3)) return detectionDanger(direction, 2, snakeArr, size)
    else if (foodDir == 4 && (direction == 0)) {
        var random = Math.random()
        if (random > 0.5) return detectionDanger(direction, 1, snakeArr, size)
        else return detectionDanger(direction, 3, snakeArr, size)
    } else if (foodDir == 5 && (direction == 1 || direction == 2)) return detectionDanger(direction, 2, snakeArr, size)
    else if (foodDir == 5 && (direction == 0 || direction == 3)) return detectionDanger(direction, 3, snakeArr, size)
    else if (foodDir == 6 && (direction == 3 || direction == 0 || direction == 2)) return detectionDanger(direction, 3, snakeArr, size)
    else if (foodDir == 6 && (direction == 1)) {
        var random = Math.random()
        if (random > 0.5) return detectionDanger(direction, 0, snakeArr, size)
        else return detectionDanger(direction, 2, snakeArr, size)
    } else if (foodDir == 7 && (direction == 3 || direction == 2)) return detectionDanger(direction, 3, snakeArr, size)
    else if (foodDir == 7 && (direction == 0 || direction == 1)) return detectionDanger(direction, 0, snakeArr, size)
}


/**
 * 二次处理
 * 
 * @param {any} currentDir 
 * @param {any} nextDir 
 * @param {any} snakeArr 
 * @param {any} size 
 */
function detectionDanger(currentDir, nextDir, snakeArr, size, beforDir) {
    var nextSnake = snakeArr.slice()
    if (nextDir === 0)
        nextSnake.push([snakeArr[snakeArr.length - 1][0] - 1, snakeArr[snakeArr.length - 1][1]])
    else if (nextDir === 1)
        nextSnake.push([snakeArr[snakeArr.length - 1][0], parseInt(snakeArr[snakeArr.length - 1][1]) + 1])
    else if (nextDir === 2)
        nextSnake.push([parseInt(snakeArr[snakeArr.length - 1][0]) + 1, snakeArr[snakeArr.length - 1][1]])
    else if (nextDir === 3)
        nextSnake.push([snakeArr[snakeArr.length - 1][0], snakeArr[snakeArr.length - 1][1] - 1])

    //*死了
    if (snakeDie(nextSnake) || nextSnake[nextSnake.length - 1][0] < 0 || nextSnake[nextSnake.length - 1][0] > (size - 1)
        || nextSnake[nextSnake.length - 1][1] < 0 || nextSnake[nextSnake.length - 1][1] > (size - 1)) {
        // debugger
        if (beforDir && (currentDir !== nextDir) && (currentDir !== beforDir) && (nextDir !== beforDir)) {
            return (6 - nextDir - beforDir - currentDir)
        }
        if (currentDir === nextDir) {
            if (Math.random() > 0.5) return detectionDanger(currentDir, (nextDir + 1) % 4, snakeArr, size, nextDir)
            else return detectionDanger(currentDir, (currentDir + 3) % 4, snakeArr, size, nextDir)
        } else {
            if (!beforDir) return detectionDanger(currentDir, currentDir, snakeArr, size, nextDir)
            else return detectionDanger(currentDir, (nextDir + 2) % 4, snakeArr, size, nextDir)
        }
    } else return nextDir
}