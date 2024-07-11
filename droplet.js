(function (root) {
  var Rainbows = root.Rainbows = (root.Rainbows || {});
  var Light = Rainbows.Light;

  // 2014-era subclassing implementation
  // TODO: replace with modernity
  Function.prototype.inherits = function(SuperClass) {
    function Surrogate() {}
    Surrogate.prototype = SuperClass.prototype;
    this.prototype = new Surrogate();
  };

  var Droplet = Rainbows.Droplet = function(pos, vel, light) {
    // var radius = 5 + Math.random() * 6;
    var radius = 10;
    Rainbows.MovingObject.call(this, pos, vel, radius,
       Droplet.COLOR);
    this.light = light;
    this.minAngle = 1000;
    this.maxAngle = 0;
  };

  
  Droplet.RADIUS = 10;
  Droplet.COLOR = "rgb(136, 180, 255)";

  Droplet.inherits(Rainbows.MovingObject);
  
  Droplet.mistArray = function(startX, startY, light, width=23, height=10, separationPx=10, velocity=[6, 0]) {

    // 2D array of the moving droplets
    let mists = []

    let iterSize = 2 * (Droplet.RADIUS + separationPx);
    let totalWidth = width * iterSize;
    let totalHeight = height * iterSize;

    for (let i = startX; i < (startX + totalWidth); i += iterSize) {

      for (let j = startY; j < (startY + totalHeight); j += iterSize) {

        mists.push(new Droplet([i, j], velocity, light))

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
  }

  Droplet.prototype.getColor = function() {

    let colVals = Droplet.COLOR.substring( Droplet.COLOR.indexOf('(') + 1,
                                           Droplet.COLOR.indexOf(')') - 1);
    let r = parseInt(colVals[0]);
    let g = parseInt(colVals[1]);
    let b = parseInt(colVals[2]);

    // Parametrized Hue function
    let maxIterations = 2.9;
    let interval = maxIterations / 6.0;

    let maxF = () => 255;
    let minF = () => 0;
    let incF = (t) => (255 / interval) * (t % interval);
    let decF = (t) => (255 / interval) * (interval - (t % interval));

    let fArray = [
      [ maxF, incF, minF ],
      [ decF, maxF, minF ],
      [ minF, maxF, incF ],
      [ minF, decF, maxF ],
      [ incF, minF, maxF ],
      [ maxF, minF, decF ]
    ];

    const hue = (t) => {
      let i = Math.floor( t / interval)
      if (fArray[i] === undefined) {
        return null;
      }
      return fArray[i].map( (f) => Math.round(f(t)) );
    }

    let theta = this.angleTo(this.light)
    let hues = hue(theta)

    if (hues) {

      r = hues[0]
      g = hues[1]
      b = hues[2]

    }

    let color = 'rgb(' + r + ',' + g + ',' + b + ')';
    return color;
  }


})(this);