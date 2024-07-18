(function(root){
  var Rainbows = root.Rainbows = (root.Rainbows || {});
  var Droplet = Rainbows.Droplet;
  var Light = Rainbows.Light;
  var Slider = Rainbows.Slider;
  const sliderLength = 500;
  
  var Game = Rainbows.Game = function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.best = 100000;
    this.reset();
  };

  Game.prototype.reset = function() {
    
    this.light = new Light([300, 300], [0, 0], this.canvas)

    this.droplets = Droplet.mistArray(10, 10, this.light);


    this.titleFade = 1;
    this.textFade = 0.6;

    this.startTime;
    this.time = 0;

    const canvasPosition = {
      x: this.canvas.offsetLeft,
      y: this.canvas.offsetTop
    };

    this.held = false;
    this.slider = new Slider(200, 10, 100, sliderLength)

    let that = this;
    this.canvas.addEventListener('mousedown', function(e) {

      // mouse position relative to the browser window
      const mouse = { 
          x: e.pageX - canvasPosition.x,
          y: e.pageY - canvasPosition.y
      }
      
      const x = that.slider.getPlace();

      const between = (a, b, c) => { return (a >= b && a <= c) };

      if (!that.held && between(mouse.x, x - 5, x + 5) && between(mouse.y, that.slider.y, that.slider.y + 30)) {
        that.held = true;
      }
    });

    this.canvas.addEventListener('mouseup', function(e) {
      that.held = false;
    });

    this.canvas.addEventListener('mousemove', function(e) {
      if (that.held) {
        const mouse = {
          x: e.pageX - canvasPosition.x,
          y: e.pageY - canvasPosition.y
        }
        that.slider.leftWidth = mouse.x - that.slider.x;

        if (that.slider.x > 200 + sliderLength) {
          that.slider.x = 200 + sliderLength;
        }
      }
    });

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

    this.drawSlider();

    
    // this.ctx.font = "60px Comfortaa, sans-serif";
    this.ctx.fillStyle = "grey";
    // this.ctx.fillText("Rainbows :)", 320, 250);
    this.ctx.font = "20px Comfortaa, sans-serif";
    this.ctx.fillText("use 'W A S D' keys to move and Space to fire", 250, 400);
    this.ctx.fillText("press Space to start", 360, 450);

    this.ctx.font = "20px Comfortaa, sans-serif";
    this.ctx.fillStyle = "rgba(53, 143, 90, 0.6)";
    
  };

  Game.prototype.drawSlider = function() {
    var x = 200;
    var y = 10;
    var height = 30;

    var widthL = this.slider.leftWidth;
    var widthR = sliderLength - widthL;
    //Left side
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(20, 20, 90, 0.4)';
    this.ctx.fillRect(x, y, widthL, height);

    //Slider
    this.ctx.beginPath();
    this.ctx.moveTo(x + widthL, y - 2);
    this.ctx.lineTo(x + widthL, y + height + 2);
    this.ctx.strokeStyle = '#00CC00';
    this.ctx.stroke();

    //Right Side
    this.ctx.beginPath();
    this.ctx.fillStyle = 'rgba(20, 20, 90, 0.4)';
    this.ctx.fillRect(x + widthL + 1, y, widthR, height);
  }

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