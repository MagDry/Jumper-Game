const GRAVITY = -0.5;

// Parametry wstępne

setup = () =>{

    var canvas = createCanvas(450, 550);
    canvas.parent('gameContainer')

    hero = new Hero(width/2, height/2, 10, color("white"));
    // console.log(hero);
    // console.log(Hero);

    platforms = generatePlatforms();

    frameRate(70); //klatki na sekundę
};

//Bieżąco aktualizowane

draw = () => {

    background(30);
    heroCondition();
    handlePlatforms();
    score();
    handleKeys();
};

//Warunek gry

heroCondition = () => {

    hero.update();
    hero.draw();

    if (hero.maxAltitude + hero.location.y < -height) {
        gameOver()
    }
};

//Dane nt 'hero' i aktualizacja

function Hero(x, altitude, size, color) {

    this.location = createVector(x, altitude);
    this.velocity = createVector(0, 0);
    this.maxAltitude = altitude;
    this.size = size;
    this.color = color;
};

//Zmiany kierunku

Hero.prototype.update = function () {

    this.location.add(this.velocity);
    this.velocity.x *= 0.8;

    hero.applyForce(createVector(0, GRAVITY));

    this.maxAltitude = (this.location.y > this.maxAltitude) ? this.location.y : this.maxAltitude;
};


//Skok 'hero'

Hero.prototype.jump = function () {

    this.velocity.y *= 0;
    this.force = 14;

    this.applyForce(createVector(0, this.force));
};


//Prędkość

Hero.prototype.applyForce = function (force) {

    this.velocity.add(force);
};


//Postać - kształt i widok

Hero.prototype.draw = function (altitude) {

    stroke("white");
    strokeWeight(1);
    fill(this.color);

    ellipse(this.location.x, height / 2, this.size);
    // console.log(this.location.x)
    // console.log(this.size)

};


//PLATFORMY


//Platformy początkowe

generatePlatforms = () => {

    var arr = [];

    for (var y = 0; y < height * 1.5; y += 28) {

        for (var i = 0; i < 3; i++) {

            var x = width * noise(i, y); //szum Perlina

            if (noise(y, i) > 0.4) //prawdopodobieństwo z jakim pojawi się nowa platforma w jednej linii -> 40%
                arr.push(new Platform(x, y, 75, color('#2F7F8F')));
        }
    }
        return arr;
};


//Sprawdzenie kolizji, powstawanie platform

handlePlatforms = () => {

    for (var i = platforms.length - 1; i >= 0; i--) {

        if (platforms[i].onScreen) {

            platforms[i].draw(hero.location.y);

                if (platforms[i].collidesWith(hero)) {

                    hero.jump();

                    if (platforms[i] instanceof Hero) {

                        points += 1;
                        platforms.splice(i, 1);
                    }
                }

        } else {

            platforms.splice(i, 1);

            var x = noise(hero.maxAltitude, frameCount) * width;
            var y = hero.maxAltitude + height;

            if (random() < 0.95) {
                // 95% szans na pojawienie się platformy (głównej, nie dodatkowej)

                platforms.push(new Platform(x, y, 75, color("#2F7F8F")));
            }
        }
    }
};

function Platform(x, altitude, size, color) {

    this.x = x;
    this.altitude = altitude;
    this.size = size;
    this.color = color;
    this.onScreen = true;
};


//Dalsze platformy

 Platform.prototype.draw = function (altitude) {

    stroke("#2F4F4F");
     strokeWeight(1);
     fill(this.color);

     if (altitude - this.altitude < height / 2) {

         rect(this.x, (altitude - this.altitude + height / 2), this.size, 12);

     } else {

         this.onScreen = false;
     }
 };

// Kolizje

Platform.prototype.collidesWith = function (Hero) {

    var platformTop = this.altitude;
    // console.log(platformTop);
    var heroBottom = Hero.location.y - Hero.size +5;
    // console.log(collides.location.y);
    // console.log(doodler)

    if (Math.abs(platformTop - heroBottom) < -Hero.velocity.y && platformTop < heroBottom) {

        var heroLeftX = Hero.location.x + Hero.size/2;
        var heroRightX = Hero.location.x + Hero.size/2;

        var platformLeftX = this.x;
        var platformRightX = this.x + this.size;

        return ((heroLeftX >= platformLeftX && heroLeftX <= platformRightX) || (heroRightX >= platformLeftX && heroRightX <= platformRightX));
    }
    return false;
};

//Sterowanie

handleKeys = () => {

    if (keyIsDown(37)) { //lewy
        hero.applyForce(-1, 0);

    } else if (keyIsDown(39)) { //prawy
        hero.applyForce(1, 0);
    }
}

//Wynik

score = () => {

    textSize(20);
    fill("yellow");
    text((hero.maxAltitude - (height / 2)).toFixed(0), 30, 50);

    var score = (hero.maxAltitude - (height / 2)).toFixed(0)
    // var strScore = str(score);
    // console.log(strScore)

    localStorage.setItem('score', score);
    text((localStorage.getItem('score')), 30, 20)


    //podejście pierwsze - do nadpisania

    // var scoreList = split(strScore, '');
    // saveStrings(strScore, 'highScore.txt');


    //podejście drugie - d.nadp

    // var highscoreList = [];
    // // var gameResult = {};
    //
    // function toHighScoreList() {
    //
    //     var score = (hero.maxAltitude - (height / 2)).toFixed(0)
    //
    //     // gameResult = {score: score};
    //     highscoreList.push(score);
    //     console.log(highscoreList)
    //     highscoreList.sort(function(a,b) {return (b.score - a.score)});
    //
    //     text(highscoreList[0], 30, 20);
    //
    // };
    //
    // toHighScoreList()

    // localStorage.setItem('highScore', highscoreList[0]);
    // text((localStorage.getItem('highScore')), 30, 20)

};



//GAME OVER!

gameOver = () => {

    textSize(50);

    //color('yellow')
    from = color(251, 270, 4);
    to = color(248, 197, 1);
    interA = lerpColor(from, to, .8);
    fill(interA);

    textAlign(CENTER);
    text("GAME OVER!", width/2, height/2);
};



