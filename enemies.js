function NormalEnemy(x, y){
    Entity(this, x, y, 1);
    enemies.push(this);
    this.color = "red";
    this.size = 0.01;
    this.speed = -0.01;
    this.aggro = false;
    this.attackStep = 0;
    this.attackSpeed = 0.05;
    this.attackLength = 0.05;
    this.attackWidth = 0.5 * Math.PI;
    this.attackAngle = 0;
    this.attackColor = "#a30023";
    this.attackColor2 = "#ff0055";
    this.draw = () => {
        if(this.attackStep > 0){
            ctx.lineWidth = s / 100;
            ctx.strokeStyle = this.attackColor2;
            for(var i = 0; i <= this.attackLength; i += 1/100){
                ctx.beginPath();
                ctx.arc(sToReal(camera.getX() - this.x), sToReal(camera.getY() - this.y), sToReal(i), this.attackAngle - this.attackWidth / 2, (this.attackAngle - this.attackWidth / 2) + this.attackStep);
                ctx.fillStyle = this.attackColor2;
                ctx.fill();
                ctx.closePath();
            }
            ctx.beginPath();
            ctx.strokeStyle = this.attackColor;
            ctx.moveTo(sToReal(camera.getX() - this.x), sToReal(camera.getY() - this.y));
            ctx.lineTo(sToReal(camera.getX() - this.x + (this.attackLength + 1/200) * Math.cos((this.attackAngle - this.attackWidth / 2) + this.attackStep)), sToReal(camera.getY() - this.y + (this.attackLength + 1/200) * Math.sin((this.attackAngle - this.attackWidth / 2) + this.attackStep)));
            ctx.stroke();
            ctx.closePath();
            //console.log(this.attackStep);
            if(this.attackStep < this.attackWidth){
                this.attackStep = 2 * Math.sqrt(((this.attackStep / 2) ** 2) + this.attackSpeed);
            } else {
                this.attackStep = 0;
            }
        }

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(sToReal(camera.getX() - this.x), sToReal(camera.getY() - this.y), sToReal(this.size), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    this.move = () => {
        if(this.aggro){
            var ang = Math.atan2(this.y - p.y, this.x - p.x);
            this.x += this.speed * Math.cos(ang);
            this.y += this.speed * Math.sin(ang);
        }
    }

    this.attack = () => {
        if(dist(this, p) < this.attackLength + 0.05 && this.attackStep == 0){
            this.attackStep = 0.01;
            this.attackAngle = Math.PI + Math.atan2(p.y - this.y, p.x - this.x);
        }
        if(this.attackStep > 0){
            if(dist(this, p) < this.attackLength - 0.01){
                var angle = Math.atan2(this.y - p.y, this.x - p.x);
                while(angle < this.attackAngle - this.attackWidth / 2){
                    angle += 2 * Math.PI;
                }

                if(angle < this.attackAngle + this.attackWidth / 2 && dist(this, i) < this.attackLength){
                    p.die();
                }
            }
        }
    }

    this.update = () => {
        this.move();
        this.attack();
    }
    this.die = () => {
        enemies.splice(enemies.indexOf(this), 1);
        drawables[1].splice(drawables[1].indexOf(this), 1);
        updatables.splice(updatables.indexOf(this), 1);
    }
}

function RangedEnemy(x, y){
    Entity(this, x, y, 1);
    enemies.push(this);
    this.color = "red";
    this.size = 0.015;
    this.speed = -0.01;
    this.aggro = false;
    this.bulletSpeed = 0.03;
    this.attackSpeed = 1000;
    this.attackStep = 0;
    this.attackAngle = 0;
    this.attackColor = "#a30023";
    this.attackColor2 = "#ff0055";
    this.draw = () => {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        console.log(camera.getX() - (this.x + this.size * Math.cos(this.attackAngle + 0 * (Math.PI / 3))));
        ctx.moveTo(sToReal(camera.getX() - (this.x + this.size * Math.cos(this.attackAngle + 0 * (Math.PI / 3)))), sToReal(camera.getY() - (this.y + this.size * Math.sin(this.attackAngle + 0 * (Math.PI / 3)))));
        for(var i = 1; i < 4; i++){
            ctx.lineTo(sToReal(camera.getX() - (this.x + this.size * Math.cos(this.attackAngle + 2 * i * (Math.PI / 3)))), sToReal(camera.getY() - (this.y + this.size * Math.sin(this.attackAngle + 2 * i * (Math.PI / 3)))));
        }
        ctx.fill();
        ctx.closePath();
    }
    this.move = () => {
    }

    this.attack = () => {
        if(this.aggro){
            this.attackAngle = Math.atan2(p.y - this.y, p.x - this.x);
            this.attackStep += 1000/60;
            if(this.attackStep > this.attackSpeed){
                this.attackStep = 0;
                new Bullet(this.x, this.y, this.attackAngle, 0.01);
            }
        }
    }

    this.update = () => {
        this.move();
        this.attack();
    }
    this.die = () => {
        enemies.splice(enemies.indexOf(this), 1);
        drawables[1].splice(drawables[1].indexOf(this), 1);
        updatables.splice(updatables.indexOf(this), 1);
    }
}

function Bullet(x, y, direction, speed){
    Entity(this, x, y, 1);
    this.color = "red";
    this.size = 0.005;
    this.update = () => {
        this.x += speed * Math.cos(direction);
        this.y += speed * Math.sin(direction);
        if(!inRoom(this.x, this.y, this.size, this.size)){
            this.die();
        }
        if(dist(this, p) <= p.size + this.size){
            p.die();
            this.die();
        }
    }
    this.draw = () => {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(sToReal(camera.getX() - this.x), sToReal(camera.getY() - this.y), sToReal(this.size), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    this.die = () => {
        drawables[1].splice(drawables[1].indexOf(this), 1);
        updatables.splice(updatables.indexOf(this), 1);
    }
}