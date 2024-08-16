(function(root){
  var Rainbows = root.Rainbows = (root.Rainbows || {});
  var Droplet = Rainbows.Droplet;
  var Light = Rainbows.Light;
  var Slider = Rainbows.Slider;

  const sliderLength = 500;
  const canvasHeight = 900;
  const canvasWidth = 1200;
  const initialVel = 3.5;
  const sliderStart = 200;
  
  var Game = Rainbows.Game = function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reset();
  };

  Game.prototype.reset = function() {
    
    this.light = new Light([450, 450], [0, 0], this.canvas)
    this.slider = new Slider(sliderStart, 10, 0, sliderLength)
    this.shiftSlider = new Slider(sliderStart, 850, 0, sliderLength)

    this.droplets = Droplet.mistArray(30, 180, this.light, this.slider, this.shiftSlider);


    this.titleFade = 1;
    this.textFade = 0.6;

    this.startTime;
    this.time = 0;
    this.rotationValue = 0;

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

        if (that.slider.x > sliderStart + sliderLength) {
          that.slider.x = sliderStart + sliderLength;
        }
      }
      if (that.heldShift) {
        const mouse = {
          x: e.pageX - canvasPosition.x,
          y: e.pageY - canvasPosition.y
        }
        that.shiftSlider.leftWidth = mouse.x - that.shiftSlider.x;

        if (that.shiftSlider.x > sliderStart + sliderLength) {
          that.shiftSlider.x = sliderStart + sliderLength;
        }
      }
    });

    window.clearInterval(this.endID);
  };
 
  Game.DIM_X = canvasWidth;
  Game.DIM_Y = canvasHeight;
  
  
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
  };

  Game.prototype.drawSlider = function(slider, y) {
    var x = sliderStart;
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

  const adjustDroplet = function(droplet, that=null) {
    droplet.pos[0] = droplet.pos[0] % canvasWidth;
    droplet.pos[1] = droplet.pos[1] % canvasWidth;
    if (droplet.pos[0] < 0) {
      droplet.pos[0] += canvasWidth;
    }
    if (droplet.pos[1] < 0) {
      droplet.pos[1] += canvasWidth;
    }

    // Rotate trajection of all droplets by slider value
    if (that && that.held) {
      let angle = that.slider.getRatio() * Math.PI * 2;
      let compX = Math.cos(angle) * initialVel;
      let compY = Math.sin(angle) * initialVel;
      
      droplet.setVelocity([compX, compY])
    }
  }
  
  Game.prototype.step = function() {
    
    this.move();
    this.draw();
    this.light.rotate();

    for (let i = 0; i < this.droplets.length; i++) {
      adjustDroplet(this.droplets[i], this);
      adjustDroplet(this.droplets[i].subDroplet);
    }
  };
  
  Game.prototype.isOutOfBounds = function(object) {
    if ((object.pos[0] < 0 || object.pos[0] > canvasWidth) || 
      (object.pos[1] < 0 || object.pos[1] > canvasHeight) ) {
      return true;
    }
    return false
  };

  Game.prototype.start = function() {
    this.windowID = window.setInterval(this.step.bind(this), 25);
  };
  
}(this));