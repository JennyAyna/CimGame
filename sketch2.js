var ghost;
var dots = [];
var ghosts = [];
var pacmans = [];
var pacmanTouched = 0;
var score, bestScore;
var buttonPlay;

var ghostRed, ghostGreen, ghostBlue, ghostOrange;
var pacmanLeft1, pacmanLeft2, pacmanLeft3, pacmanRight1, pacmanRight2, pacmanRight3;
var heart;

function preload()
{
  // load in ghost images
  ghostRed = loadImage('ghost_red.png');
  ghostGreen = loadImage('ghost_green.png');
  ghostOrange = loadImage('ghost_orange.png');
  ghostBlue = loadImage('ghost_blue.png');

  // load in pacman images
  pacmanLeft1 = loadImage('pacman_left_1.png');
  pacmanLeft2 = loadImage('pacman_left_2.png');
  pacmanLeft3 = loadImage('pacman_left_3.png');
  pacmanRight1 = loadImage('pacman_right_1.png');
  pacmanRight2 = loadImage('pacman_right_2.png');
  pacmanRight3 = loadImage('pacman_right_3.png');

  // load in heart image
  heart = loadImage('heart.png');

  nomnomSound = loadSound('CimGameMusic.mp3');
  ouchSound = loadSound('OUCH.wav');
  tictoc = loadSound('ticktoc.wav');

}

function setup() {

  // default lives and score values
  lives = 3;
  score = 0;
  bestScore = 0;

  createCanvas(windowWidth,windowHeight);
  perspective(60 / 180 * PI, width/height, 0.1, 100);

  //create a sprite and add the 3 animations
  ghost = createSprite(300, (windowHeight / 2.5), 50, 100);

  //label, first frame, last frame
  //the addAnimation method returns the added animation
  //that can be store in a temporary variable to change parameters
  var myAnimation = ghost.addAnimation("floating", "assets/ghost_standing0008.png", "assets/ghost_standing0009.png");
  //offX and offY is the distance of animation from the center of the sprite
  //in this case since the animations have different heights i want to adjust
  //the vertical offset to make the transition between floating and moving look better
  myAnimation.offY = 18;
  ghost.addAnimation("moving", "assets/ghost_walk0005.png", "assets/ghost_walk0008.png");
  ghost.addAnimation("spinning", "assets/ghost_spin0004.png", "assets/ghost_spin0006.png");

  

  setTimeout(function(){ 
// play starting sound
  nomnomSound.setVolume(0.2);
  nomnomSound.play();

   }, 3000);


  startGame();

}

function keyTyped() {
  if (key == 'p') {
    nomnomSound.pause();
  }
}

function draw() {

  var r = random(77);
  background(203, 81, 64);

  if(gameStarted == true)
  {

    // //if mouse is to the left

    ghost.position.x = mouseX-10;

    // display score
    fill(255);
    noStroke();
    textSize(24);
    text("Score: " + score, 30, 50);

    // display number of lives
    switch(lives)
    {
     case 3:
       image(heart, 1100, 30);
       image(heart, 1140, 30);
       image(heart, 1180, 30);
     break;
     case 2:
       image(heart, 1140, 30);
       image(heart, 1180, 30);
     break;
     case 1:
      image(heart, 1180, 30);
     break;
    }

    if(mouseX < (windowWidth/2) - 10) {
     ghost.changeAnimation("moving");
     //flip horizontally
     ghost.mirrorX(-1);
     //negative x velocity: move left
     // ghost.velocity.x = - 2;
    }
    else if(mouseX > (windowWidth/2) + 10) {
     ghost.changeAnimation("moving");
     //unflip
     ghost.mirrorX(1);
     // ghost.velocity.x = 2;
    }
    else {
     //if close to the mouse, don't move
     ghost.changeAnimation("floating");
     ghost.velocity.x = 0;
    }

    if(mouseIsPressed) {
     //the rotation is not part of the spinning animation
     ghost.rotation -= 10;
     ghost.position.y = ghost.position.y - 10;
     ghost.changeAnimation("spinning");
    }
    else{
     ghost.rotation = 0;
     ghost.changeAnimation("moving");
     ghost.position.y = mouseY;
    }

    //draw the sprite
    drawSprites();

    // random ghost hatching
    var ghostHatch = Math.ceil(random(50));
    if(ghostHatch == 1)
    {
     ghosts.push(new Ghost());
    }

    // random dot hatching
    var dotHatch = Math.ceil(random(25));
    if(dotHatch == 1)
    {
     dots.push(new Dot());
    }

    // random pacman hatching
    var pacmanHatch = Math.ceil(random(350));
    if(pacmanHatch == 1)
    {
     pacmans.push(new Pacman());
    }

    // loop through each ghost
    for (var i=0; i<ghosts.length; i++)
    {
     // display ghost
     ghosts[i].display();

     // check if ghost reaches bottom of the screen
     if(ghosts[i].ypos > 500)
     {
       // remove ghost
       ghosts.splice(i, 1);

     } else {
         // check if pacman is touching ghost
         var d1 = dist(ghosts[i].xpos, ghosts[i].ypos, ghost.position.x, ghost.position.y);
         if(d1 < 60)
         {
           ouchSound.play();

           // decrease lives by one
          lives --;

           // remove ghost
           ghosts.splice(i, 1);
           ghost.scale += 1;
           if(ghost.scale < 0){
             ghost.scale = 0.5;
           } else {
             ghost.scale += 1;
           }
         }
       }
    }

    // loop through each dot
    for (var j=0; j<dots.length; j++)
    {
     // display dots
     dots[j].display();

     if(pacmanTouched > 0){
       dots[j].ypos = dots[j].ypos - 2;

       // setTimeout(
       //   function(){
       //     dots[j].ypos = 4;
       //     pacmanTouched = 0;
       //   }, 3500);
     }

     // check if dot reaches bottom of screen
     if(dots[j].ypos > windowHeight)
     {
       // remove dot
       dots.splice(j, 1);

     } else {

       console.log(pacmanTouched);

       //if cim touched dot
       var d2 = dist(dots[j].xpos, dots[j].ypos, ghost.position.x, ghost.position.y);
       if(d2 < 60)
       {
         // remove dot
         dots.splice(j, 1);

         // increase score by one or 2

         if(pacmanTouched > 0){
           // increase score by 2
           score += 5;
         } else if (pacmanTouched === 0) {
           score++;
         }
       }
     }
    }

    // loop through each pacman
    for (var k=0; k<pacmans.length; k++)
    {
     // display ghost
     pacmans[k].display();

     // check if ghost reaches bottom of the screen
     if(pacmans[k].ypos > 500)
     {
       // remove ghost
       pacmans.splice(k, 1);

     } else {
       // check if pacman is touching ghost
       var d3 = dist(pacmans[k].xpos, pacmans[k].ypos, ghost.position.x, ghost.position.y);
       if(d3 < 60)
       {
         tictoc.play();
         // remove ghost
         pacmans.splice(k, 1);
         pacmanTouched += 1;

         ghost.scale -= 1;
         if(ghost.scale === 0 || ghost.scale < 0){
           ghost.scale = 1;
         } else {
           ghost.scale -= 1;
         }

       }
     }
    }
    // check for game over
    if(lives <= 0)
    {
      // reset lives and score
      lives = 3;
      //score = 0;


      // reset all
      ghosts = [];
      dots = [];
      pacmans = [];
      pacmanTouched = 0;
      ghost.scale = 0.5;

      // set gameStarted to false
      gameStarted = false;


      nomnomSound.stop();

    }

  } else {
    //startGame();
    //nomnomSound.play();

    youFail();

  }

}

function startGame(){
  // change gameStarted variable
  gameStarted = true;
  score = 0;
}

function youFail(){
  // display score
  fill(255);
  noStroke();
  textSize(24);
  text("Score: " + score, 30, 50);

  if(bestScore <= score){
    bestScore = score;
  }

  // display bestScore
  fill(255);
  noStroke();
  textSize(24);
  text("Best Score: " + bestScore, 30, 90);

  buttonPlay = createButton('Play Again');
  buttonPlay.position(0, 0);
  buttonPlay.mousePressed(startGame);

}

function Pacman()
{
  // set default properties
  this.xpos = random(0, windowWidth);
  this.ypos = 0;
  this.speed = 4;
  // mouthCounter will determine which pacman sprite to display (1, 2 or 3)
  this.mouthCounter = 1;
  this.type = Math.ceil(random(4));
}

Pacman.prototype.display = function()
{
  imageMode(CENTER);

  image(pacmanRight3, this.xpos, this.ypos, 42, 44);


  this.ypos = this.ypos + this.speed;
}



///////////////////////////////////////////
// GHOST CLASS
///////////////////////////////////////////

function Ghost()
{
  // set default properties
  this.xpos = random(0, width);
  this.ypos = 0;
  this.speed = random(1, 4);
  this.type = Math.ceil(random(4));
}

Ghost.prototype.display = function()
{
  imageMode(CENTER);

  // show different color ghost based on it's random 'type' value
  switch(this.type)
  {
    case 1: image(ghostRed, this.xpos, this.ypos, 42, 44); break;
    case 2: image(ghostGreen, this.xpos, this.ypos, 42, 44); break;
    case 3: image(ghostOrange, this.xpos, this.ypos, 42, 44); break;
    case 4: image(ghostBlue, this.xpos, this.ypos, 42, 44); break;
  }
  this.ypos = this.ypos + this.speed;
}


///////////////////////////////////////////
// DOT CLASS
///////////////////////////////////////////

function Dot()
{
  // set default properties
  this.xpos = random(0, windowWidth);
  this.ypos = 0;
  this.speed = 4;
}


Dot.prototype.display = function()
{
  ellipseMode(CENTER);
  noStroke();
  ellipse(this.xpos, this.ypos, 25, 25);
  this.ypos = this.ypos + this.speed;
}
