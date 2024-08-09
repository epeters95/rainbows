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
    
    this.light = new Light([450, 450], [0, 0], this.canvas)
    this.slider = new Slider(200, 10, 100, sliderLength)
    this.shiftSlider = new Slider(200, 850, 10, sliderLength)

    this.droplets = Droplet.mistArray(30, 180, this.light, this.slider, this.shiftSlider);


    this.titleFade = 1;
    this.textFade = 0.6;

    this.startTime;
    this.time = 0;

    const canvasPosition = {
      x: this.canvas.offsetLeft,
      y: this.canvas.offsetTop
    };

    this.held = false;
    this.heldShift = false;

    let that = this;
    this.canvas.addEventListener('mousedown', function(e) {

      // mouse position relative to the browser window
      const mouse = { 
          x: e.pageX - canvasPosition.x,
          y: e.pageY - canvasPosition.y
      }
      
      let x = that.slider.getPlace();

      const between = (a, b, c) => { return (a >= b && a <= c) };

      if (!that.held && between(mouse.x, x - 5, x + 5) && between(mouse.y, that.slider.y, that.slider.y + 30)) {
        that.held = true;
      }

      x = that.shiftSlider.getPlace();

      if (!that.heldShift && between(mouse.x, x - 5, x + 5) && between(mouse.y, that.shiftSlider.y, that.shiftSlider.y + 30)) {
        that.heldShift = true;
      }
    });

    this.canvas.addEventListener('mouseup', function(e) {
      that.held = false;
      that.heldShift = false;
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
      if (that.heldShift) {
        const mouse = {
          x: e.pageX - canvasPosition.x,
          y: e.pageY - canvasPosition.y
        }
        that.shiftSlider.leftWidth = mouse.x - that.shiftSlider.x;

        if (that.shiftSlider.x > 200 + sliderLength) {
          that.shiftSlider.x = 200 + sliderLength;
        }
      }
    });

    window.clearInterval(this.endID);
  };
 
  Game.DIM_X = 900;
  Game.DIM_Y = 500;
  
  
  Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (var i = 0; i < this.droplets.length; i++) {
      this.droplets[i].draw(this.ctx);
    }

    this.light.draw(this.ctx);

    this.drawSlider(this.slider, 10);
    this.drawSlider(this.shiftSlider, 850);

    
    this.ctx.fillStyle = "grey";
    this.ctx.font = "20px Comfortaa, sans-serif";
    this.ctx.fillText("rotation", 95, 32);
  };

  Game.prototype.drawSlider = function(slider, y) {
    var x = 200;
    var height = 30;

    var widthL = slider.leftWidth;
    var widthR = sliderLength - widthL;
    //Left side
    this.ctx.beginPath();
    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(x, y, widthL, height);

    //Slider
    this.ctx.beginPath();
    this.ctx.moveTo(x + widthL, y - 2);
    this.ctx.lineTo(x + widthL, y + height + 2);
    this.ctx.strokeStyle = 'yellow';
    this.ctx.stroke();

    //Right Side
    this.ctx.beginPath();
    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(x + widthL + 1, y, widthR, height);
  }

  Game.prototype.move = function() {
    for (var i = 0; i < this.droplets.length; i++) {
      this.droplets[i].move();
      this.droplets[i].subDroplet.move();
    }
  }

  const adjustDroplet = function(droplet) {
    droplet.pos[0] = droplet.pos[0] % 900;
    droplet.pos[1] = droplet.pos[1] % 900;
    if (droplet.pos[0] < 0) {
      droplet.pos[0] += 900;
    }
    if (droplet.pos[1] < 0) {
      droplet.pos[1] += 500;
    }
  }
  
  Game.prototype.step = function() {
    
    this.move();
    this.draw();


    for (var i = 0; i < this.droplets.length; i++) {
      adjustDroplet(this.droplets[i]);
      adjustDroplet(this.droplets[i].subDroplet);
    }
  };
  
  Game.prototype.isOutOfBounds = function(object) {
    if ((object.pos[0] < 0 || object.pos[0] > 900) || 
      (object.pos[1] < 0 || object.pos[1] > 900) ) {
      return true;
    }
    return false
  };

  Game.prototype.start = function() {
    this.windowID = window.setInterval(this.step.bind(this), 25);
  };
  
}(this));