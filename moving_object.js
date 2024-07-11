(function (root) {
  var Rainbows = root.Rainbows = (root.Rainbows || {});
  
  var MovingObject = Rainbows.MovingObject = function(pos, vel, radius, color){
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.mass = radius;
    this.color = color;
  };

  MovingObject.prototype.move = function(){
    this.pos = [(this.pos[0] + this.vel[0]), (this.pos[1] + this.vel[1])];
  };

  MovingObject.prototype.draw = function(ctx) {
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
  };

  MovingObject.prototype.distanceTo = function(otherObject) {
    var x1 = this.pos[0];
    var y1 = this.pos[1];
    var x2 = otherObject.pos[0];
    var y2 = otherObject.pos[1];
    var distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    return distance;
  }

  MovingObject.prototype.angleTo = function(otherObject) {
    var x1 = this.pos[0];
    var y1 = this.pos[1];
    var x2 = otherObject.pos[0];
    var y2 = otherObject.pos[1];
    var angle = Math.atanBetter(y2 - y1, x2 - x1);
    return angle;
  }

  Math.atanBetter = function(y, x) {
    var value = 0;
    if (y >= 0 && x === 0) {
      value = Math.PI / 2;
    } else if ( y < 0 && x === 0) {
      value = 3 * Math.PI / 2;
    } else if (y < 0 && x < 0) {
      value = Math.atan(y / x) + Math.PI;
    } else if (y > 0 && x < 0) {
      value = Math.atan(y / x) + Math.PI;
    } else if (y < 0 && x > 0) {
      value = Math.atan(y / x) + 2 * Math.PI;
    } else if (y === 0 && x < 0) {
      value = Math.PI;
    } else {
      value = Math.atan(y / x);
    }
    return value;
  };
 
 
})(this);