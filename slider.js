((root) => {
  var Rainbows = root.Rainbows = (root.Rainbows || {});

  class Slider {

    constructor(x, y, leftWidth, length) {
      this.x = x;
      this.y = y;
      this.leftWidth = leftWidth;
      this.length = length;
      this.held = false;
    }  

    getPlace() {
      return this.x + this.leftWidth;
    }

    getRatio() {
      return this.leftWidth / (this.length);
    }

    hodl() {
      this.held = true;
    }

    letgo() {
      this.held = false;
    }

  }

  Rainbows.Slider = Slider;

})(this);
