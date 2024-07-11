(function(root){
  var Rainbows = root.Rainbows = (root.Rainbows || {});
  var Droplet = Rainbows.Droplet;
  var Light = Rainbows.Light;
  
  var Game = Rainbows.Game = function(ctx) {
    this.ctx = ctx;
    this.best = 100000;
    this.reset();
  };

  Game.prototype.reset = function() {
    
    this.light = new Light([300, 300], [0, 0])

    this.droplets = Droplet.mistArray(10, 10, this.light);


    this.titleFade = 1;
    this.textFade = 0.6;

    this.startTime;
    this.time = 0;
    window.clearInterval(this.endID);
  };
 
  Game.DIM_X = 900;
  Game.DIM_Y = 500;
  
  
  Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    for (var i = 0; i < this.droplets.length; i++) {
      this.droplets[i].draw(this.ctx);
    }

    this.light.draw(this.ctx);

    
    this.ctx.font = "60px Comfortaa, sans-serif";
    this.ctx.fillStyle = "grey";
    this.ctx.fillText("Rainbows :)", 320, 250);
    this.ctx.font = "20px Comfortaa, sans-serif";
    this.ctx.fillText("use 'W A S D' keys to move and Space to fire", 250, 400);
    this.ctx.fillText("press Space to start", 360, 450);

    this.ctx.font = "20px Comfortaa, sans-serif";
    this.ctx.fillStyle = "rgba(53, 143, 90, 0.6)";
    
  };

  Game.prototype.move = function() {
    for (var i = 0; i < this.droplets.length; i++) {
      this.droplets[i].move();
    }
  }
  
  Game.prototype.step = function() {
    
    this.move();
    this.draw();

    for (var i = 0; i < this.droplets.length; i++) {
      var droplet = this.droplets[i];
      droplet.pos[0] = droplet.pos[0] % 900;
      droplet.pos[1] = droplet.pos[1] % 500;
      if (droplet.pos[0] < 0) {
        droplet.pos[0] += 900;
      }
      if (droplet.pos[1] < 0) {
        droplet.pos[1] += 500;
      }
    }
  };
  
  Game.prototype.isOutOfBounds = function(object) {
    if ((object.pos[0] < 0 || object.pos[0] > 900) || 
      (object.pos[1] < 0 || object.pos[1] > 500) ) {
      return true;
    }
    return false
  };

  Game.prototype.start = function() {
    this.windowID = window.setInterval(this.step.bind(this), 25);
  };
  
}(this));