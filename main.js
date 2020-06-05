var c = document.createElement("canvas");

var scale = 3;

document.body.append(c);

c.style.height = window.innerHeight + "px";
c.style.width = window.innerWidth + "px";

c.width = window.innerWidth * scale;
c.height = window.innerHeight * scale;

var ctx = c.getContext("2d");

var s = c.height; //size of one tile, equal to screen height.

var keyDown = [];

var keyPressed = [];

var drawables = [];
for(var i = 0; i < 10; i++){
    drawables.push([]);
}

var updatables = [];

var enemies = [];

var mouseClicked = false;

var mousePos = [];

var mode = "normal";

onmousedown = (e) => {
    if(e.which == 1){
        mouseClicked = true;
    }
}

onmousemove = (e) => {
    mousePos = [e.clientX, e.clientY];
}

onkeydown = (e) => {
    if(!keyDown[String.fromCharCode(e.which)])
        keyPressed[String.fromCharCode(e.which)] = true;
    keyDown[String.fromCharCode(e.which)] = true;
}

onkeyup = (e) => {
    keyDown[String.fromCharCode(e.which)] = false;
}

var camera = {
    x:0,
    y:0,
    getX: () => {return camera.x + (window.innerWidth / window.innerHeight)/2},
    getY: () => {return camera.y + 1/2}
}

function Entity(obj, x, y, layer){
    drawables[layer].push(obj);
    updatables.push(obj);
    obj.x = x;
    obj.y = y;
    obj.update = () => {

    }
    obj.draw = () => {

    }
}

function sToReal(n){
    return n * s;
}

function getPlayer(){
    return p;
}

function dist(obj1, obj2){
    return Math.sqrt(((obj2.y - obj1.y)**2) + ((obj2.x - obj1.x)**2));
}

function update(){
    ctx.clearRect(0, 0, c.width, c.height);
    changeWallColor();
    for(i of updatables){
        i.update();
    }

    updateWalls();

    for(i of drawables){
        for(j of i){
            j.draw();
        }
    }
    
    keyPressed = [];
    mouseClicked = false;
}

function Particle(x, y, angle, speed, color, duration, size){
    Entity(this, x, y, 2);
    this.angle = angle;
    this.speed = speed;
    this.color = color;
    this.duration = duration;
    this.size = size;
    this.draw = () => {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(sToReal(camera.getX() - this.x), sToReal(camera.getY() - this.y), sToReal(this.size), (angle + Math.PI) - 1/4 * Math.PI, (angle + Math.PI) + 1/4 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    this.delete = () => {
        drawables[2].splice(drawables[2].indexOf(this), 1);
        updatables.splice(updatables.indexOf(this), 1);
    }
    this.update = () => {
        this.x += speed * Math.cos(this.angle);
        this.y += speed * Math.sin(this.angle);
        duration -= 1000/60;
        if(duration < 0){
            this.delete();
        }
    }
}

var p = new Player(0, 0);

setInterval(update, 1000/60);