(function (root) {
  var Rainbows = root.Rainbows = (root.Rainbows || {});

  // 2014-era subclassing implementation
  // TODO: replace with modernity
  Function.prototype.inherits = function(SuperClass) {
    function Surrogate() {}
    Surrogate.prototype = SuperClass.prototype;
    this.prototype = new Surrogate();
  };

  var Light = Rainbows.Light = function(pos, vel) {
    // var radius = 5 + Math.random() * 6;
    var radius = 10;
    Rainbows.MovingObject.call(this, pos, vel, radius,
       Light.COLOR);
  };
  
  Light.RADIUS = 10;
  Light.COLOR = "rgb(255, 255, 40)";

  Light.inherits(Rainbows.MovingObject);


})(this);