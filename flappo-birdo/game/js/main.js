var heroBird;
var myScore;
var obstacle1 = [];
var badDragon;
var myBackground;
var poundBill = [];
var currentScore = 0;
var collectBill;
var gameOverSound;

function startGame() {
    // component creations
    heroBird = new component(30, 30, "assets/hero/PNG/Frame-1.png", 375, 250 - 15, "image");
    badDragon = new component(50, 50, "assets/evilDragon/PNG/frame-1.png", 10, 250, "image");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myBackground = new component(750, 600, "assets/background.jpg", 0, 0, "background");
    //poundBill = new component(30, 30, "assets/collectible.png", 600, 250 - 15, "image");
    collectBill = new sound("assets/collect.mp3");
    gameOverSound = new sound("assets/game_over.mp3");
    myGameArea.start();

}

// the game area
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 750;
        this.canvas.height = 600;

        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.frameNo = 0;
        window.addEventListener('keydown', function(e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e) {
            myGameArea.keys[e.keyCode] = false;
        })

    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

// componenet constructor
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;


    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }

        if (type == "image" || type == "background") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    // the function that is called to
    //change the movement properties for components
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBottom();
        this.hitTop();
        if (this.type == "background") {
          if (this.x == -(this.width)) {
            this.x = 0;
          }
        }
    }

    this.hitTop = function() {
        if (this.y < 0) {
          this.y = 0;
        }
    }

    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
          this.y = rockbottom;
        }
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width - 5);
        var mytop = this.y;
        var mybottom = this.y + (this.height - 5);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width - 3);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height - 3);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

}






var countFrame = 1;

// where the game area gets updated
function updateGameArea() {

    var x, y;
    for (i = 0; i < obstacle1.length; i += 1) {
        if (heroBird.crashWith(obstacle1[i])) {
            myGameArea.stop();
            gameOverSound.play();
            gameOver();
            return;
        }
    }



    myGameArea.clear();

    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();

    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        x = myGameArea.canvas.width;
        minHeight = 150;
        maxHeight = 300;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 100;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        var imageHeight = 0;
        for (var i = 0; i < height/32; i++) {
            obstacle1.push(new component(32, 32, "assets/obstacle/spike.png", x, imageHeight, "image"));
            imageHeight = imageHeight + 32;
        }
        for (var i = 0; i < height/32; i++) {
            obstacle1.push(new component(32, 32, "assets/obstacle/spike.png", x, imageHeight + gap, "image"));
            imageHeight = imageHeight + 32;
        }


    }

    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        x = myGameArea.canvas.width;
        minHeight = 100;
        maxHeight = 450;
        height = Math.floor(Math.random() * maxHeight) + minHeight;
        poundBill.push(new component(32, 32, "assets/collectible.png", x + 150, height, "image"));
    }
    for (i = 0; i < obstacle1.length; i += 1) {
        obstacle1[i].x += -3;

        if(obstacle1.length % 4 == 0) {
            obstacle1[i].y -= 1;
        } else {
            obstacle1[i].y += 1;
        }

        obstacle1[i].update();
    }

    for (i = 0; i < poundBill.length; i += 1) {
        poundBill[i].x += -3;
        poundBill[i].update();
    }

    //clears game area. must go first


    // movement for heroBird
    heroBird.speedX = 0;
    heroBird.speedY = 0;


    // if (myGameArea.keys && myGameArea.keys[37]) { heroBird.speedX = -3; }
    // if (myGameArea.keys && myGameArea.keys[39]) { heroBird.speedX = 3; }
    if (myGameArea.keys && myGameArea.keys[38]) { heroBird.speedY = -3; setTimeout(function(){badDragon.speedY = -2;}, 400)  }
    if (myGameArea.keys && myGameArea.keys[40]) { heroBird.speedY = 3; setTimeout(function(){badDragon.speedY = 2;}, 400)}



    // every component must update to properly appear
    if(countFrame === 4) {
        countFrame = 1;
    } else {
        countFrame++;
    }

    if (myGameArea.frameNo == 1 || everyinterval(15)) {
        heroBird = new component(40, 40, "assets/hero/PNG/Frame-" + countFrame + ".png", heroBird.x, heroBird.y + heroBird.speedY, "image");
    }

    if (myGameArea.frameNo == 1 || everyinterval(15)) {
        badDragon = new component(70, 70, "assets/evilDragon/PNG/frame-" + countFrame + ".png", badDragon.x, badDragon.y + badDragon.speedY, "image");
    }


    for (i = 0; i < poundBill.length; i += 1) {
        if (heroBird.crashWith(poundBill[i])) {
            poundBill[i].y = -500;
            collectBill.play();
            poundBill.slice(i,1);
            badDragon.x -= 20;
            currentScore += 2000;
        }
    }
    myScore.text = "SCORE: £" + currentScore;
    myScore.update();

    if (heroBird.crashWith(badDragon)) {
        myGameArea.stop();
        gameOver();
        return;
    }

    heroBird.newPos();
    heroBird.update();

    badDragon.speedX += 0.03;
    badDragon.newPos();
    badDragon.update();





}

function gameOver() {
    var canvas = document.getElementsByTagName("canvas")[0];
    var gameOverDisplay = canvas.getContext("2d");
    gameOverDisplay.fillStyle = "black"
    gameOverDisplay.fillRect(0, 0, 750, 600);
    gameOverDisplay.fillStyle = "white"
    gameOverDisplay.textAlign = "center";
    gameOverDisplay.font = "50px Consolas";
    gameOverDisplay.fillText("EARNED: £" + currentScore, canvas.width/2, canvas.height/2 - 60);
    gameOverDisplay.font = "30px Consolas";
    gameOverDisplay.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    gameOverDisplay.fillText("Refresh browser to start again", canvas.width/2, canvas.height/2 + 40);


}
