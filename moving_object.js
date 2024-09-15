((root) => {
  var Rainbows = root.Rainbows = (root.Rainbows || {});

  class MovingObject {
    constructor(pos, vel, radius, color='rgb(255,0,255)') {
      this.pos = pos;
      this.vel = vel;
      this.radius = radius;
      this.mass = radius;
      this.color = color;
    }

    move() {
      this.pos = [(this.pos[0] + this.vel[0]), (this.pos[1] + this.vel[1])];
    };

    draw(ctx) {
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

    distanceTo(otherObject) {
      var x1 = this.pos[0];
      var y1 = this.pos[1];
      var x2 = otherObject.pos[0];
      var y2 = otherObject.pos[1];
      var distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      return distance;
    }

    angleTo(otherObject) {
      var x1 = this.pos[0];
      var y1 = this.pos[1];
      var x2 = otherObject.pos[0];
      var y2 = otherObject.pos[1];
      var angle = MovingObject.atanBetter(y2 - y1, x2 - x1);
      return angle;
    }

    setVelocity(newVel) {
      if (newVel && newVel.length === 2) {
        this.vel = newVel
      }
    }

    static atanBetter(y, x) {
      
      let atan = Math.atan(y / x)

      if (y >= 0 && x === 0) {
        atan = Math.PI / 2;

      } else if ( y < 0 && x === 0) {
        atan = 3 * Math.PI / 2;

      } else if (y !== 0 && x < 0) {
        atan += Math.PI;

      } else if (y < 0 && x > 0) {
        atan += 2 * Math.PI;

      } else if (y === 0 && x < 0) {
        atan = Math.PI;

      }
      
      return atan;
    }
  }
  Rainbows.MovingObject = MovingObject;
 
})(this);