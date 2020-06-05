function Player(x, y){
    Entity(this, x, y, 7);
    this.color = "blue";
    this.attackColor = "#3000c3";
    this.attackColor2 = "#0077ff";
    this.size = 0.01;
    this.speed = -0.01;
    this.blinkSpeed = 17.5;
    this.attackStep = 0;
    this.attackSpeed = 0.05;
    this.attackLength = 0.05;
    this.attackWidth = 0.5 * Math.PI;
    this.attackAngle = 0;
    this.money = 0;
    this.killedEnemy = false;
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
            if(this.attackStep < this.attackWidth){
                this.attackStep = 2 * Math.sqrt(((this.attackStep / 2) ** 2) + this.attackSpeed);
            } else {
                this.attackStep = 0;
                if(!this.killedEnemy){
                    p.die();
                }
                this.killedEnemy = false;
            }
        }

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(sToReal(camera.getX() - this.x), sToReal(camera.getY() - this.y), sToReal(this.size), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    this.move = () => {
        var xComp = 0;
        var yComp = 0;

        if(keyDown["A"]){
            xComp -= 1;
        }
        if(keyDown["D"]){
            xComp += 1;
        }
        if(keyDown["S"]){
            yComp += 1;
        }
        if(keyDown["W"]){
            yComp -= 1;
        }

        if(yComp == 0 && xComp == 0){
            return;
        }

        var ang = Math.atan2(yComp, xComp);

        if(keyPressed[" "]){

            this.x += this.blinkSpeed * this.speed * Math.cos(ang);

            this.y += this.blinkSpeed * this.speed * Math.sin(ang);

            for(var i = 0; i < Math.abs(this.blinkSpeed * this.speed); i += Math.abs(this.blinkSpeed * this.speed)/5){
                new Particle(p.x + i * Math.cos(ang), p.y + i * Math.sin(ang), 5 * Math.PI / 6 + ang + Math.random() * Math.PI / 3, 0.001 * ((i + 0.3) / (2 * Math.abs(this.blinkSpeed * this.speed))), "blue", 500, 0.02);
            }
        } else {
            this.x += this.speed * Math.cos(ang);

            this.y += this.speed * Math.sin(ang);
        }

        while(!inRoom(this.x, this.y, this.size, this.size)){
            this.x -= -0.0001 * Math.cos(ang);

            this.y -= -0.0001 * Math.sin(ang);
        }
    }

    this.moveCamera = () => {
        var camSpeed = 1/10;
        camera.x += camSpeed * (this.x - camera.x);
        camera.y += camSpeed * (this.y - camera.y);
    }

    this.attack = () => {
        if(mouseClicked && this.attackStep == 0){
            this.attackStep = this.attackSpeed;
            this.attackAngle = Math.atan2(mousePos[1] - (sToReal(camera.getY() - this.y) / 3), mousePos[0] - (sToReal(camera.getX() - this.x) / 3));
        }

        if(this.attackStep > 0){
            for(i of enemies){
                var angle = Math.atan2(this.y - i.y, this.x - i.x);
                while(angle < this.attackAngle - this.attackWidth / 2){
                    angle += 2 * Math.PI;
                }

                if(angle < this.attackAngle + this.attackWidth / 2 && dist(this, i) < this.attackLength){
                    i.die();
                    this.killedEnemy = true;
                }
            }
        }
    }

    this.die = () => {
        drawables[7].splice(drawables[7].indexOf(this), 1);
        updatables.splice(updatables.indexOf(this), 1);
    }

    this.update = () => {
        this.move();
        this.moveCamera();
        this.attack();
    }
}