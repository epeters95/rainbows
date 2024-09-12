((root) => {
  var Rainbows = root.Rainbows = (root.Rainbows || {});
  var Droplet = Rainbows.Droplet;
  var Light = Rainbows.Light;
  var Slider = Rainbows.Slider;

  const sliderLength       = 500;
  const sliderHeight       = 20;
  const canvasHeight       = 600;
  const canvasWidth        = 1200;
  const initialVel         = 3.5;
  const initialShiftSlider = -300;
  const initialSizeSlider  = 124;
  const sliderColor        = 'rgba(200,200,200,0.4)';

  // Light starting points
  const centerX = Math.floor(canvasWidth / 2);

  const lightPos = [0, 90];
  const lightVel = [7, 4];

  const sliderX = centerX - Math.floor(sliderLength / 2);
  const sliderY = 0;
  const sliderStart = 97;
  
  var Game = Rainbows.Game = function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reset();
  };

  Game.prototype.reset = function() {

    
    this.light = new Light(lightPos, lightVel, this.canvas)
    this.slider = new Slider(sliderX, sliderY, sliderStart, sliderLength)
    this.shiftSlider = new Slider(sliderX, canvasHeight - sliderHeight, initialShiftSlider, sliderLength)
    this.sizeSlider = new Slider(sliderX, sliderHeight + 10, initialSizeSlider, sliderLength)

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


    const addSliderEventsFor = (that, slidersArray) => {

      // Mouse down / Touch start

      const mouseDownCallback = (e) => {
        
        // mouse position relative to the browser window
        const mouse = { 
            x: e.pageX - canvasPosition.x,
            y: e.pageY - canvasPosition.y
        }

        const between = (a, b, c) => { return (a >= b && a <= c) };

        slidersArray.forEach( (slider) => {
          let x = slider.getPlace();
          if (!slider.held
              && between(mouse.x, x - 5, x + 5)
              && between(mouse.y, slider.y, slider.y + sliderHeight)
          ) {
            slider.hodl();
          }
        })
      }

      that.canvas.addEventListener('mousedown', mouseDownCallback);
      that.canvas.addEventListener('touchstart', (e) => {

        that.canvas.dispatchEvent(new MouseEvent('mousedown', {
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        }));

      });

      
      // Mouse Up / Touch end

      const mouseUpCallback = () => {
        slidersArray.forEach( (slider) => {
          slider.letgo();
        });
      }
      that.canvas.addEventListener('mouseup', mouseUpCallback);
      that.canvas.addEventListener('touchend', mouseUpCallback);


      // Mouse Move / Touch move

      const mouseMoveCallback = (e) => {
        slidersArray.forEach( (slider) => {
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
      }
      that.canvas.addEventListener('mousemove', mouseMoveCallback);
      that.canvas.addEventListener('touchmove', (e) => {
  
        that.canvas.dispatchEvent(new MouseEvent('mousemove', {
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        }));

      });
    }

    
    let that = this;
    addSliderEventsFor(that, this.sliders)

    window.clearInterval(this.endID);
  };
  
  Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
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
    this.ctx.fillStyle = sliderColor;
    this.ctx.fillRect(slider.x, slider.y, widthL, sliderHeight);

    //Slider
    this.ctx.beginPath();
    this.ctx.moveTo(slider.x + widthL, slider.y - 2);
    this.ctx.lineTo(slider.x + widthL, slider.y + sliderHeight + 2);
    this.ctx.strokeStyle = 'yellow';
    this.ctx.stroke();

    //Right Side
    this.ctx.beginPath();
    this.ctx.fillStyle = sliderColor;
    this.ctx.fillRect(slider.x + widthL + 1, slider.y, widthR, sliderHeight);
  }

  Game.prototype.move = function() {
    for (let i = 0; i < this.droplets.length; i++) {
      this.droplets[i].move();
      this.droplets[i].subDroplet.move();
      this.droplets[i].superDroplet.move();
    }
    this.light.move()
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

    if (this.light.pos[0] < 0) {
      this.light.pos[0] = 0;
      this.light.vel = [-1 * this.light.vel[0], this.light.vel[1]]
    }
    if (this.light.pos[1] < 0) {
      this.light.pos[1] = 0;
      this.light.vel = [this.light.vel[0],-1 * this.light.vel[1]]
    }
    if (this.light.pos[0] > canvasWidth) {
      this.light.pos[0] = canvasWidth;
      this.light.vel = [-1 * this.light.vel[0], this.light.vel[1]]
    }
    if (this.light.pos[1] > canvasHeight) {
      this.light.pos[1] = canvasHeight;
      this.light.vel = [this.light.vel[0],-1 * this.light.vel[1]]
    }

    for (let i = 0; i < this.droplets.length; i++) {
      adjustDroplet(this.droplets[i], this);
      adjustDroplet(this.droplets[i].subDroplet);
      adjustDroplet(this.droplets[i].superDroplet);
    }
  };

  Game.prototype.start = function() {
    this.windowID = window.setInterval(this.step.bind(this), 30);
  };
  
})(this);