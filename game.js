(function(root){
  var Rainbows = root.Rainbows = (root.Rainbows || {});
  var Droplet = Rainbows.Droplet;
  var Light = Rainbows.Light;
  var Slider = Rainbows.Slider;

  const sliderLength = 500;
  const sliderHeight = 20;
  const canvasHeight = 600;
  const canvasWidth = 1200;
  const initialVel = 3.5;
  const initialSizeSlider = 80;

  const centerX = Math.floor(canvasWidth / 2);
  const centerY = Math.floor(canvasHeight / 2);
  const sliderStart = centerX - Math.floor(sliderLength / 2);
  
  var Game = Rainbows.Game = function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reset();
  };

  Game.prototype.reset = function() {

    
    this.light = new Light([centerX, centerY], [0, 0], this.canvas)
    this.slider = new Slider(sliderStart, 0, 0, sliderLength)
    this.shiftSlider = new Slider(sliderStart, canvasHeight - sliderHeight, 0, sliderLength)
    this.sizeSlider = new Slider(sliderStart, sliderHeight + 10, initialSizeSlider, sliderLength)

    this.sliders = [this.slider, this.shiftSlider, this.sizeSlider];

    this.droplets = Droplet.mistArray(30, 20, this.light, this.slider, this.shiftSlider);


    this.titleFade = 1;
    this.textFade = 0.6;

    this.startTime;
    this.time = 0;
    this.rotationValue = 0;

    const canvasPosition = {
      x: this.canvas.offsetLeft,
      y: this.canvas.offsetTop
    };

    const addSliderEventsFor = function(that, slidersArray) {
      that.canvas.addEventListener('mousedown', function(e) {

        // mouse position relative to the browser window
        const mouse = { 
            x: e.pageX - canvasPosition.x,
            y: e.pageY - canvasPosition.y
        }
    

        const between = (a, b, c) => { return (a >= b && a <= c) };

        slidersArray.forEach( function(slider) {
          let x = slider.getPlace();
          if (!slider.held
              && between(mouse.x, x - 5, x + 5)
              && between(mouse.y, slider.y, slider.y + sliderHeight)
          ) {
            slider.hodl();
          }
        })
      });

      that.canvas.addEventListener('mouseup', function(e) {
        slidersArray.forEach( function(slider) {
          slider.letgo();
        });
      });

      that.canvas.addEventListener('mousemove', function(e) {
        slidersArray.forEach( function(slider) {
          if (slider.held) {
            const mouse = {
              x: e.pageX - canvasPosition.x,
              y: e.pageY - canvasPosition.y
            }
            slider.leftWidth = mouse.x - slider.x;

            if (slider.x > sliderStart + sliderLength) {
              slider.x = sliderStart + sliderLength;
            }
          }
        });
      });
    }

    
    let that = this;
    addSliderEventsFor(that, this.sliders)

    window.clearInterval(this.endID);
  };
 
  Game.DIM_X = canvasWidth;
  Game.DIM_Y = canvasHeight;
  
  
  Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.droplets.length; i++) {
      this.droplets[i].draw(this.ctx);
    }

    this.light.draw(this.ctx);

    let that = this;
    this.sliders.forEach(function(slider) {
      that.drawSlider(slider)
    })
  };

  Game.prototype.drawSlider = function(slider) {

    let widthL = slider.leftWidth;
    let widthR = sliderLength - widthL;
    //Left side
    this.ctx.beginPath();
    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(slider.x, slider.y, widthL, sliderHeight);

    //Slider
    this.ctx.beginPath();
    this.ctx.moveTo(slider.x + widthL, slider.y - 2);
    this.ctx.lineTo(slider.x + widthL, slider.y + sliderHeight + 2);
    this.ctx.strokeStyle = 'yellow';
    this.ctx.stroke();

    //Right Side
    this.ctx.beginPath();
    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(slider.x + widthL + 1, slider.y, widthR, sliderHeight);
  }

  Game.prototype.move = function() {
    for (let i = 0; i < this.droplets.length; i++) {
      this.droplets[i].move();
      this.droplets[i].subDroplet.move();
    }
  }

  const adjustDroplet = function(droplet, that=null) {
    droplet.pos[0] = droplet.pos[0] % canvasWidth;
    droplet.pos[1] = droplet.pos[1] % canvasHeight;
    if (droplet.pos[0] < 0) {
      droplet.pos[0] += canvasWidth;
    }
    if (droplet.pos[1] < 0) {
      droplet.pos[1] += canvasHeight;
    }

    // Rotate trajection of all droplets by slider value
    if (that && that.slider.held) {
      let angle = that.slider.getRatio() * Math.PI * 2;
      let compX = Math.cos(angle) * initialVel;
      let compY = Math.sin(angle) * initialVel;
      
      droplet.setVelocity([compX, compY])
    }

    // Increase droplet size
    if (that && that.sizeSlider.held) {
      let scaleFactor = that.sizeSlider.leftWidth / initialSizeSlider;
      droplet.radius = Math.abs(Rainbows.Droplet.RADIUS * scaleFactor);
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