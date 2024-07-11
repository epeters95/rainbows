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
  };
  
  Droplet.RADIUS = 10;
  Droplet.COLOR = "rgb(136, 180, 255)";

  Droplet.mistArray = function(startX, startY, light, width=30, height=5, separationPx=5, velocity=[8, 0]) {

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

  Droplet.draw = function(ctx) {
    this.color = this.getColor();
    this.prototype.draw(ctx)
  }

  Droplet.getColor = function() {

    let colVals = Droplet.COLOR.substring( Droplet.COLOR.indexOf('(') + 1,
                                           Droplet.COLOR.indexOf(')') - 1);
    let r = parseInt(colVals[0]);
    let g = parseInt(colVals[1]);
    let b = parseInt(colVals[2]);

    // // Parametrized Hue function
    // let maxIterations = 1000;
    // let interval = maxIterations / 6.0;

    // let fArray = [
    //   [],
    //   [],
    //   [],
    //   [],
    //   [],
    //   []
    // ];

    // const hueFunction = (t) => {

    // }

    let color = 'rgb(' + r + ',' + g + ',' + b + ')';
    return color;
  }

  Droplet.inherits(Rainbows.MovingObject);


})(this);