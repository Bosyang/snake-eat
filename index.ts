var map: any = document.getElementById('map');
var timer: number
var begin: any
var myAuto: any = document.getElementById('myaudio');
class Food {
    flag: HTMLDivElement | undefined
    x: number | undefined
    y: number | undefined
    display() {
        const f = document.createElement('div')
        f.className = 'food'
        this.flag = f
        this.x = Math.floor(Math.random() * 80)
        this.y = Math.floor(Math.random() * 40)
        f.style.left = this.x * 10 + 'px'
        f.style.top = this.y * 10 + 'px'
        map.appendChild(f)
    }
}
class Snake {
    direction: string = 'right'
    body: any[] = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }]
    display() {
        for (let i = 0; i < this.body.length; i++) {
            if (this.body[i].x != null) { // 当吃到食物时，x==null，不能新建，不然会在0，0处新建一个
                const s = document.createElement('div')
                s.className = 'snake'
                // 将节点保存到状态中，以便于后面删除
                this.body[i].flag = s
                s.style.left = this.body[i].x * 10 + 'px'
                s.style.top = this.body[i].y * 10 + 'px'
                map.appendChild(s)
            }
        }
    }
    run() {
        // 后一个元素到前一个元素的位置
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x
            this.body[i].y = this.body[i - 1].y
        }
        // 根据方向处理蛇头
        switch (this.direction) {
            case "left":
                this.body[0].x -= 1
                break
            case "right":
                this.body[0].x += 1
                break
            case "up":
                this.body[0].y -= 1
                break
            case "down":
                this.body[0].y += 1
                break
        }
        // 判断是否出界,一蛇头判断,出界的话，
        if (this.body[0].x < 0 || this.body[0].x > 79 || this.body[0].y < 0 || this.body[0].y > 39) {
            clearInterval(timer)// 清除定时器，
            myAuto.pause();
            alert("死了吧~")

            // 删除旧的
            for (let i = 0; i < this.body.length; i++) {
                if (this.body[i].flag != null) { // 如果刚吃完就死掉，会加一个值为null的
                    map.removeChild(this.body[i].flag)
                }
            }
            //初始
            this.body = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }];
            this.direction = 'right'
            this.display() // 显示初始状态
            return false // 结束
        }
        // 判断蛇头吃到食物，xy坐标重合，
        if (this.body[0].x == food.x && this.body[0].y == food.y) {
            // 蛇加一节，因为根据最后节点定，下面display时，会自动赋值的
            this.body.push({
                x: null,
                y: null,
                flag: null
            });
            // 清除食物,重新生成食物
            map.removeChild(food.flag)
            food.display();
        }
        // 吃到自己死亡，从第五个开始与头判断，因为前四个永远撞不到
        for (let i = 4; i < this.body.length; i++) {
            if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
                clearInterval(timer); // 清除定时器，
                alert("又死了")

                // 删除旧的
                for (let i = 0; i < this.body.length; i++) {
                    if (this.body[i].flag != null) { // 如果刚吃完就死掉，会加一个值为null的
                        map.removeChild(this.body[i].flag)
                    }
                }
                // 回到初始状态，
                this.body = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }]
                this.direction = 'right'
                this.display() // 显示初始状态
                return false // 结束
            }
        }
        // 先删掉初始的蛇
        for (var i = 0; i < this.body.length; i++) {
            if (this.body[i].flag != null) { // 当吃到食物时，flag是等于null，且不能删除
                map.removeChild(this.body[i].flag)
            }
        }
        // 重新显示蛇
        this.display()
    }
}
const snake = new Snake()
const food = new Food()
snake.display()
food.display()

//按键事件
document.body.onkeydown = function (e) {
    switch (e.keyCode) {
        case 38:
            if (snake.direction != 'down') { // 不允许返回，向上的时候不能向下
                snake.direction = "up"
            }
            break;
        case 40:
            if (snake.direction != "up") {
                snake.direction = "down"
            }
            break;
        case 37:
            if (snake.direction != "right") {
                snake.direction = "left"
            }
            break;
        case 39:
            if (snake.direction != "left") {
                snake.direction = "right"
            }
            break;
        case 13:
            myAuto.play()
            clearInterval(timer);
            timer = setInterval("snake.run()", 60);
    }
}
