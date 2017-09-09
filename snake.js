var snake = {
    map: '#map',
    class: 'active',
    foodClass: 'food',
    size: 49,
    speed: 200,
    start: function () {
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
        var direction = 0 //方向, the same as border's param
        var snakeArr = []
        var $center_tr = $(this.map).children('tr')[Math.floor(this.size / 2)]

        for (var i = -1; i < 2; i++) {
            $($($center_tr).children('td')[Math.floor(this.size / 2 + i)]).addClass('active')
            snakeArr.push([[Math.floor(this.size / 2)], [Math.floor(this.size / 2 + i)]])
        }

        var foodX = Math.floor(Math.random() * this.size)
        var foodY = Math.floor(Math.random() * this.size)

        $($($(this.map).children('tr')[foodX]).children('td')[foodY]).addClass(this.foodClass)

        var run = setInterval(function () {
            snakeArr.splice(0, 1)
            // $snake =
            if (direction === 0) {

            }
        })
    }
}