var snake = {
    map: '#map',
    class: 'active',
    foodClass: 'food',
    size: 30,
    speed: 200,
    start: function () {
        var activeClass = this.class
        var nowFoodClass = this.foodClass
        var size = this.size
        /**init table */
        for (var i = 0; i < this.size; i++) {
            $(this.map).append('<tr></tr>')
        }
        for (var i = 0; i < $(this.map).children('tr').length; i++) {
            for (var j = 0; j < this.size; j++) {
                $($(this.map).children('tr')[i]).append('<td></td>')
            }
        }
        /**end */
        var direction = 0 //方向, the same as css border's param
        var snakeArr = []
        var $center_tr = $(this.map).children('tr')[Math.floor(this.size / 2)]

        for (var i = -1; i < 2; i++) {
            $($($center_tr).children('td')[Math.floor(this.size / 2 + i)]).addClass('active')
            snakeArr.push([Math.floor(this.size / 2), Math.floor(this.size / 2 + i)])
        }

        var foodPoint = getFoodPoint(size,snakeArr)

        $($($(this.map).children('tr')[foodPoint[0]]).children('td')[foodPoint[1]]).addClass(this.foodClass)

        function keyUp(e) {
            var currKey = 0, e = e || event;
            currKey = e.keyCode || e.which || e.charCode;
            var keyName = String.fromCharCode(currKey);
            // alert(currKey)
            if (currKey === 37 && direction !== 3 && direction !== 1) {
                direction = 3
            } else if (currKey === 38 && direction !== 0 && direction !== 2) {
                direction = 0
            } else if (currKey === 39 && direction !== 1 && direction !== 3) {
                direction = 1
            } else if (currKey === 40 && direction !== 2 && direction !== 0) {
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
                // debugger
                $($($(this.map).children('tr')[foodPoint[0]]).children('td')[foodPoint[1]]).removeClass(nowFoodClass)
                
                foodPoint = getFoodPoint(size,snakeArr)
                
                $($($(this.map).children('tr')[foodPoint[0]]).children('td')[foodPoint[1]]).addClass(nowFoodClass)
            }else if(snakeDie(snakeArr)){
                alert('sile')
            }else {
                $($($(this.map).children('tr')[snakeArr[0][0]]).children('td')[snakeArr[0][1]])
                    .removeClass(activeClass)
                snakeArr.splice(0, 1)
            }
            newTd.addClass(activeClass)
        }, 100)
    }
}

function getFoodPoint(size,snakeArr){
    foodY = Math.floor(Math.random() * size)
    foodX = Math.floor(Math.random() * size)
    snakeArr.forEach(v=>{
        if(v[0] == foodY && v[1] == foodX){
            getFoodPoint(snakeArr)
            return false
        }
    })
    return [foodY,foodX]
}
function snakeDie(snakeArr){
    snakeArr.slice(snakeArr.length-2).forEach(v=>{
        debugger
        if(v[0] == snakeArr[snakeArr.length-1][0] && v[1] == snakeArr[snakeArr.length-1][1]){
            return true
        }
    })
    return false
}