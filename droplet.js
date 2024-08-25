(function (root) {
  var Rainbows = root.Rainbows = (root.Rainbows || {});
  var Light = Rainbows.Light;

  const subDropletVelocity   = 1.5;
  const dropletVelocity      = 2.2;
  const superDropletVelocity = 2.9;

  Function.prototype.inherits = function(SuperClass) {
    function Surrogate() {}
    Surrogate.prototype = SuperClass.prototype;
    this.prototype = new Surrogate();
  };

  var Droplet = Rainbows.Droplet = function(pos, vel, light, slider, shiftSlider, parent=true, isSuper=false) {
    
    var radius = 5;

    if (parent) {
      this.subDroplet = setSubDroplet(pos, [subDropletVelocity, 0], light, slider, shiftSlider);
      this.superDroplet = setSubDroplet(pos, [superDropletVelocity, 0], light, slider, shiftSlider, true)
      radius = 15;
    } else if (isSuper) {
      radius = 28;
    }

    Rainbows.MovingObject.call(this, pos, vel, radius);
    
    this.light = light;
    this.minAngle = 1000;
    this.maxAngle = 0;
    this.slider = slider;
    this.shiftSlider = shiftSlider;
    this.parent = parent;
    this.super = isSuper;
  };


  const setSubDroplet = function(pos, vel, light, slider, shiftSlider, isSuper=false) {
    return new Droplet(pos, vel, light, slider, shiftSlider, false, isSuper);
  }

  
  Droplet.RADIUS = 15;
  Droplet.COLOR = "rgb(136, 180, 255)";

  Droplet.inherits(Rainbows.MovingObject);
  
  Droplet.mistArray = function(startX, startY, light, slider, shiftSlider) {
 
    let width        = 30;
    let height       = 15;
    let separationPx = 5;
    let velocity     = [dropletVelocity, 0];

    // 2D array of the moving droplets
    let mists = []

    let iterSize = 2 * (Droplet.RADIUS + separationPx);
    let totalWidth = width * iterSize;
    let totalHeight = height * iterSize;

    for (let i = startX; i < (startX + totalWidth); i += iterSize) {

      for (let j = startY; j < (startY + totalHeight); j += iterSize) {

        mists.push(new Droplet([i, j], velocity, light, slider, shiftSlider))

      }
    }
    return mists;
  }

  Droplet.prototype.draw = function(ctx) {
    this.color = this.getColor();
    ctx.beginPath()
    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.strokeStyle = this.color;
    ctx.stroke();
    if (this.parent) {
      this.subDroplet.draw(ctx)
      this.superDroplet.draw(ctx)
    }
  }

  Droplet.prototype.getColor = function() {

    let r = '255';
    let g = '255';
    let b = '0';

    // Parametrized Hue function
    let maxIterations = Math.PI * 2;
    let maxHue = 255;
    let interval = maxIterations / 6.0;
    
    // Period indicates the starting rotation at which the hue function beings
    let period = this.light.rotationValue * maxIterations

    let that = this;

    // Shift will shift the end rgb components over sine and cosine functions
    let shift = this.distanceTo(this.light) / 2

    let maxF = () => maxHue;
    let minF = () => 0;
    let incF = (t) => (maxHue / interval) * ((t + period) % interval);
    let decF = (t) => (maxHue / interval) * (interval - ((t + period) % interval));

    let fArray = [
      [ maxF, incF, minF ],
      [ decF, maxF, minF ],
      [ minF, maxF, incF ],
      [ minF, decF, maxF ],
      [ incF, minF, maxF ],
      [ maxF, minF, decF ]
    ];

    const hue = (t, deltas, x) => {
      let i = Math.floor( (t + period) / interval) % 6
      if (fArray[i] === undefined) {
        return null;
      }
      return fArray[i].map( (f, idx) => {
        let resultHue = Math.round(f(t))

        if (that.parent) {

          resultHue -= deltas[idx](x);

        } else if (that.super) {

          resultHue += deltas[idx](x);
        }
        return Math.abs(resultHue);
      })
    }

    let theta = this.angleTo(this.light)
    let x = this.pos[0];
    let shiftScale = this.shiftSlider.getRatio()
    let deltas = [
      (t) => Math.cos((t + shift) * Math.PI  / 200) * maxIterations * (10 + 20 * shiftScale),
      (t) => Math.sin((t + shift) * Math.PI / 200) * maxIterations * (10 + 10 * shiftScale),
      (t) => -Math.cos((t + shift) * Math.PI / 200) * maxIterations * (10 + 20 * shiftScale)
    ]

    let hues = hue(theta, deltas, x);

    if (hues) {

      r = hues[0]
      g = hues[1]
      b = hues[2]

    }

    let color = 'rgb(' + r + ',' + g + ',' + b + ')';
    return color;
  }


})(this);