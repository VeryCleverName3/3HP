var rooms = [];

var difficulty = 2;

function Room(x, y, w, h){
    Entity(this, x, y, 0);
    rooms.push(this);
    this.w = w;
    this.h = h;
    for(var i = 0; i < Math.log(difficulty); i++){
        if(difficulty < 7){
            new NormalEnemy(-(Math.random() * this.w) + this.x, -(Math.random() * this.h) + this.y);
        } else {
            if(Math.random() < 0.5){
                new NormalEnemy(-(Math.random() * this.w) + this.x, -(Math.random() * this.h) + this.y);
            } else {
                new RangedEnemy(-(Math.random() * this.w) + this.x, -(Math.random() * this.h) + this.y);
            }
        }
    }
    this.draw = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(sToReal(camera.getX() - this.x), sToReal(camera.getY() - this.y), sToReal(this.w), sToReal(this.h));
    }
    this.update = () => {
        if(closingRooms && this != mainRoom){
            rooms.splice(rooms.indexOf(this), 1);
            drawables[0].splice(drawables[0].indexOf(this), 1);
            updatables.splice(updatables.indexOf(this), 1);
        }
    }
}

function Hall(side, startRoom){
    closingRooms = false;
    this.closingRooms = false;
    if(side == 0){
        var x = startRoom.x - startRoom.w / 2;
        var y = startRoom.y - startRoom.h + 0.1;
        this.w = 0;
        this.h = 1.5;
        mainRoom = new Room(x + 0.5, y - this.h + 0.1, 1, 1);
    }
    if(side == 2){
        var x = startRoom.x - startRoom.w / 2;
        var y = startRoom.y + 1.4;
        this.w = 0;
        this.h = 1.5;
        mainRoom = new Room(x + 0.5, y + 0.9, 1, 1);
    }
    if(side == 1){
        var y = startRoom.y - startRoom.h / 2;
        var x = startRoom.x - startRoom.w + 0.1;
        this.h = 0;
        this.w = 1.5;
        mainRoom = new Room(x - this.w + 0.1, y + 0.5, 1, 1);
    }
    if(side == 3){
        var y = startRoom.y - startRoom.h / 2;
        var x = startRoom.x + 1.4;
        this.h = 0;
        this.w = 1.5;
        mainRoom = new Room(x + 0.9, y + 0.5, 1, 1);
    }
    this.growSpeed = 0.01;
    Entity(this, x, y, 0);
    rooms.push(this);
    this.draw = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(sToReal(camera.getX() - this.x), sToReal(camera.getY() - this.y), sToReal(this.w), sToReal(this.h));
    }
    this.update = () => {
        if(closingRooms){
            this.closingRooms = true;
        }
        if(!this.closingRooms){
            if(side == 0 || side == 2){
                if(this.w < 0.5){
                    this.w += 2 * this.growSpeed;
                    this.x += this.growSpeed;
                }
            }
            if(side == 1 || side == 3){
                if(this.h < 0.5){
                    this.h += 2 * this.growSpeed;
                    this.y += this.growSpeed;
                }
            }
        } else {
            if(side == 0 || side == 2){
                if(this.w > 0){
                    this.w -= 2 * this.growSpeed;
                    this.x -= this.growSpeed;
                } else {
                    rooms.splice(rooms.indexOf(this), 1);
                    drawables[0].splice(drawables[0].indexOf(this), 1);
                    updatables.splice(updatables.indexOf(this), 1);
                }
            }
            if(side == 1 || side == 3){
                if(this.h > 0){
                    this.h -= 2 * this.growSpeed;
                    this.y -= this.growSpeed;
                } else {
                    rooms.splice(rooms.indexOf(this), 1);
                    drawables[0].splice(drawables[0].indexOf(this), 1);
                    updatables.splice(updatables.indexOf(this), 1);
                }
            }
        }
    }
}

function inRoom(x, y, xMargin, yMargin){
    var inTheRoom = false;
    for(i of rooms){
        if(x < i.x - xMargin && x > (i.x - i.w) + xMargin && y < i.y - yMargin && y > (i.y - i.h) + yMargin){
            inTheRoom = true;
        }
    }

    return inTheRoom;
}

var wallColor = 0;

function changeWallColor(){
    wallColor += 0.1;
    if(wallColor > 360){
        wallColor -= 360;
    }
    document.body.style.backgroundColor = "hsl(" + wallColor + ", 100%, 50%)";
}

var hallSide = 0;
var hallWidth = 0;

function updateWalls(){
    var x = getPlayer().x;
    var y = getPlayer().y;
    var xMargin = getPlayer().size;
    var yMargin = xMargin;
    if(x < mainRoom.x - xMargin && x > (mainRoom.x - mainRoom.w) + xMargin && y < mainRoom.y - yMargin && y > (mainRoom.y - mainRoom.h) + yMargin && !closingRooms){
        closingRooms = true;
        for(i of enemies){
            i.aggro = true;
        }
    }
    if(enemies.length == 0){
        new Hall(Math.floor(Math.random() * 4), mainRoom);
        p.money++;
        difficulty++;
    }
}

var mainRoom = new Room(0.5, 0.5, 1, 1);

var closingRooms = false;