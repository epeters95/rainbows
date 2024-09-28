((root) => {
  var Rainbows = root.Rainbows = (root.Rainbows || {});

  class Droplet extends Rainbows.MovingObject {    

    constructor(pos, vel, light, slider, shiftSlider, parent=true, isSuper=false) {
      
      let radius = 5;
      let subDropletVelocity   = 1.5;
      let superDropletVelocity = 2.9;

      if (parent) {
        radius = 15;
      } else if (isSuper) {
        radius = 28;
      }
      super(pos, vel, radius);

      if (parent) {
        this.subDroplet = this.setSubDroplet(pos, [subDropletVelocity, 0], light, slider, shiftSlider);
        this.superDroplet = this.setSubDroplet(pos, [superDropletVelocity, 0], light, slider, shiftSlider, true)
      }
      
      this.light = light;
      this.minAngle = 1000;
      this.maxAngle = 0;
      this.slider = slider;
      this.shiftSlider = shiftSlider;
      this.parent = parent;
      this.isSuper = isSuper;
    }

    static mistArray(startX, startY, light, slider, shiftSlider) {
     
      let width           = 30;
      let height          = 15;
      let separationPx    = 5;
      let dropletVelocity = 2.2;
      let velocity        = [dropletVelocity, 0];
      let defaultRadius   = 15;

      // 2D array of the moving droplets
      let mists = []

      let iterSize = 2 * (defaultRadius + separationPx);
      let totalWidth = width * iterSize;
      let totalHeight = height * iterSize;

      for (let i = startX; i < (startX + totalWidth); i += iterSize) {

        for (let j = startY; j < (startY + totalHeight); j += iterSize) {

          mists.push(new Droplet([i, j], velocity, light, slider, shiftSlider))

        }
      }
      return mists;
    }

    setSubDroplet(pos, vel, light, slider, shiftSlider, isSuper=false) {
      return new Droplet(pos, vel, light, slider, shiftSlider, false, isSuper);
    }

    draw(ctx, curved=false) {
      this.color = this.getColor();
      ctx.beginPath()

      if (curved) {
        ctx.arc(
          this.pos[0] * (0.75 + this.getPositionOffsetX()),
          this.pos[1] * (0.75 + this.getPositionOffsetY()),
          this.radius,
          0,
          2 * Math.PI
        );
      }
      else {
        ctx.arc(
          this.pos[0],
          this.pos[1],
          this.radius,
          0,
          2 * Math.PI
        );
      }
      ctx.strokeStyle = this.color;
      ctx.stroke();
      if (this.parent) {
        this.subDroplet.draw(ctx, curved)
        this.superDroplet.draw(ctx, curved)
      }
    }

    drawCurved(ctx) {
      this.draw(ctx, true);
    }

    getDistanceToLight() {
      let xDist = this.pos[0] - this.light.pos[0];
      let yDist = this.pos[1] - this.light.pos[1];

      return Math.sqrt(Math.pow(xDist, 2), Math.pow(yDist, 2));
    }

    getPositionOffsetX() {
      let dist = this.getDistanceToLight();
      let offset = 1 / Math.cos(dist / 700);
      if (offset > 5) {
        offset -= (offset - 5)
      }
      return offset
    }

    getPositionOffsetY() {
      let dist = this.getDistanceToLight();
      let offset = 1 / Math.cos(dist / 500);
      if (offset > 5) {
        offset -= (offset - 5)
      } else if (offset < -5) {
        offset += (offset + 5)
      }
      return offset
    }

    getColor() {

      let r = '255';
      let g = '255';
      let b = '0';

      // Parametrized Hue function
      let maxIterations = Math.PI * 12
      let maxHue = 255;
      let interval = maxIterations / 6.0;
      
      // Period indicates the starting rotation at which the hue function beings
      let period = this.light.rotationValue * maxIterations

      // Shift will shift the end rgb components over sine and cosine functions
      let shift = this.distanceTo(this.light) / 2

      let maxF = (t) => maxHue + 0.5 * Math.sin(t);
      let minF = (t) => 0.5 * Math.sin(t);
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

          if (this.parent) {

            resultHue -= deltas[idx](x) / 2

          } else if (this.isSuper) {

            resultHue += deltas[idx](x) / 2
          }
          return resultHue;
        })
      }

      let theta = this.angleTo(this.light)
      let x = this.pos[0];
      let y = this.pos[1];
      let shiftScale = this.shiftSlider.getRatio()
      let deltas = [
        (t) => Math.cos((t + shift) * Math.PI  / 200) * maxIterations * (10 + 20 * shiftScale),
        (t) => Math.sin((t + shift) * Math.PI / 200) * maxIterations * (10 + 10 * shiftScale),
        (t) => -Math.cos((t + shift) * Math.PI / 200) * maxIterations * (10 + 20 * shiftScale)
      ]

      //let hues = hue(shift, deltas, x);
      let hues = hue(theta * x * 8 / y, deltas, x);
      let maxOverflow = 555;
      let overflow = 0;
      
      let getOverflow = (h) => Math.max(h - maxHue, 0);


      if (hues) {

        r = hues[0]
        g = hues[1]
        b = hues[2]

        overflow = getOverflow(r) + getOverflow(g) + getOverflow(b) 
      }

      let color = 'rgba(' + Math.abs(r) + ',' + Math.abs(g) + ',' + Math.abs(b) + ',' + (1 - (overflow / maxOverflow )) + ')';
      return color;
    }
  }

  Rainbows.Droplet = Droplet;


})(this);