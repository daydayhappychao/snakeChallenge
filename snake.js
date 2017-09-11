var snake = {
    map: '#map',
    class: 'active',
    foodClass: 'food',
    size: 50,
    speed: 50,
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

        for (var i = -1; i < 3; i++) {
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
                clearInterval(run)
                return
            } else {
                $($($(this.map).children('tr')[snakeArr[0][0]]).children('td')[snakeArr[0][1]])
                    .removeClass(activeClass)
                snakeArr.splice(0, 1)
            }
            newTd.addClass(activeClass)
            direction = algorithms(snakeArr[snakeArr.length - 1], foodPoint, direction, snakeArr, size)
        }, this.speed)
    }
}

function getFoodPoint(size, snakeArr) {
    foodY = Math.floor(Math.random() * size)
    foodX = Math.floor(Math.random() * size)
    snakeArr.forEach(v => {
        if (v[0] == foodY && v[1] == foodX) {
            getFoodPoint(snakeArr)
            return false
        }
    })
    return [foodY, foodX]
}
function snakeDie(snakeArr) {
    var _snakeArr = snakeArr.slice(0, snakeArr.length - 1)
    for (var i = 0; i < _snakeArr.length; i++) {
        if (_snakeArr[i][0] == snakeArr[snakeArr.length - 1][0] && _snakeArr[i][1] == snakeArr[snakeArr.length - 1][1]) {
            return true
        }
    }
    return false
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
        // nextSnake.push([snakeHead[0] - 1, snakeHead[1]])
        if (snakeDie(nextSnake) || snakeHead[0] - 1 < 0) {
            var left = 0
            var right = 0
            for (var i = 0; i < snakeArr.length; i++) {
                if (snakeArr[i][1] < snakeHead[1]) left++
                else if (snakeArr[i][1] < snakeHead[1]) right++
            }
            if (left > right) return 1
            else if (left < right) return 3
            else if (snakeHead[1] * 2 < size) return 1
            else return 3
        }
    } else if (direction == 1) {
        // nextSnake.push([snakeHead[0], snakeHead[1] + 1])
        if (snakeDie(nextSnake) || snakeHead[1] + 1 > (size - 1)) {
            var top = 0
            var bottom = 0
            for (var i = 0; i < snakeArr.length; i++) {
                if (snakeArr[i][0] < snakeHead[0]) top++
                else if (snakeArr[i][0] < snakeHead[0]) bottom++
            }
            if (top > bottom) return 2
            else if (top < bottom) return 0
            else if (snakeHead[0] * 2 < size) return 2
            else return 0
        }
    } else if (direction == 2) {
        // nextSnake.push([snakeHead[0] + 1, snakeHead[1]])
        if (snakeDie(nextSnake) || snakeHead[0] + 1 > (size - 1)) {
            var left = 0
            var right = 0
            for (var i = 0; i < snakeArr.length; i++) {
                if (snakeArr[i][1] < snakeHead[1]) left++
                else if (snakeArr[i][1] < snakeHead[1]) right++
            }
            if (left > right) return 1
            else if (left < right) return 3
            else if (snakeHead[1] * 2 < size) return 1
            else return 3
        }
    } else if (direction == 3) {
        // nextSnake.push([snakeHead[0], snakeHead[1] - 1])
        if (snakeDie(nextSnake) || snakeHead[1] - 1 < 0) {
            var top = 0
            var bottom = 0
            for (var i = 0; i < snakeArr.length; i++) {
                if (snakeArr[i][0] < snakeHead[0]) top++
                else if (snakeArr[i][0] < snakeHead[0]) bottom++
            }
            if (top > bottom) return 2
            else if (top < bottom) return 0
            else if (snakeHead[0] * 2 < size) return 2
            else return 0
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

    if (foodDir === 0 && (direction == 3 || direction == 1 || direction == 0)) return 0
    else if (foodDir === 0 && direction == 2) {
        var random = Math.random()
        if (random > 0.5) return 1
        else return 3
    } else if (foodDir === 1 && (direction == 0 || direction == 3)) return 0
    else if (foodDir === 1 && (direction == 1 || direction == 2)) return 1
    else if (foodDir === 2 && (direction == 0 || direction == 1 || direction == 2)) return 1
    else if (foodDir === 2 && (direction == 3)) {
        var random = Math.random()
        if (random > 0.5) return 0
        else return 2
    } else if (foodDir == 3 && (direction == 0 || direction == 1)) return 1
    else if (foodDir == 3 && (direction == 2 || direction == 3)) return 2
    else if (foodDir == 4 && (direction == 1 || direction == 2 || direction == 3)) return 2
    else if (foodDir == 4 && (direction == 0)) {
        var random = Math.random()
        if (random > 0.5) return 1
        else return 3
    } else if (foodDir == 5 && (direction == 1 || direction == 2)) return 2
    else if (foodDir == 5 && (direction == 0 || direction == 3)) return 3
    else if (foodDir == 6 && (direction == 3 || direction == 0 || direction == 2)) return 3
    else if (foodDir == 6 && (direction == 1)) {
        var random = Math.random()
        if (random > 0.5) return 0
        else return 2
    } else if (foodDir == 7 && (direction == 3 || direction == 2)) return 3
    else if (foodDir == 7 && (direction == 0 || direction == 1)) return 0
}