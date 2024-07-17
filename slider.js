(function(root) {
  var Rainbows = root.Rainbows = (root.Rainbows || {});

  var Slider = Rainbows.Slider = function(x, y, leftWidth, length) {
    this.x = x;
    this.y = y;
    this.leftWidth = leftWidth;
    this.length = length;
  }

  Slider.prototype.getPlace = function() {
    return this.x + this.leftWidth;
  }

  Slider.prototype.getRatio = function() {
    return this.leftWidth / (this.length);
  }

}(this));
