(function (root) {
  var Rainbows = root.Rainbows = (root.Rainbows || {});

  // 2014-era subclassing implementation
  // TODO: replace with modernity
  Function.prototype.inherits = function(SuperClass) {
    function Surrogate() {}
    Surrogate.prototype = SuperClass.prototype;
    this.prototype = new Surrogate();
  };

  var Light = Rainbows.Light = function(pos, vel, canvas) {

    this.rotationValue = 0;

    var radius = 10;
    Rainbows.MovingObject.call(this, pos, vel, radius,
       Light.COLOR);

    var isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    let that = this;
    

    // Click events
    
    const mouseDownCallback = (event) => {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - canvas.getBoundingClientRect().top;

      const dist = Math.sqrt((mouseX - that.pos[0]) ** 2 + (mouseY - this.pos[1]) ** 2);

      if (dist <= that.radius) {
        isDragging = true;

        this.offsetX = that.pos[0]- mouseX;
        this.offsetY = that.pos[1] - mouseY;
      }
    }
    canvas.addEventListener('mousedown', mouseDownCallback);
    canvas.addEventListener('touchstart', (e) => {

      canvas.dispatchEvent(new MouseEvent('mousedown', {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
      }));

    });


    const mouseMoveCallback = (event) => {
      if (isDragging) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        this.pos = [mouseX + this.offsetX, mouseY + this.offsetY];
      }
    }
    canvas.addEventListener('mousemove', mouseMoveCallback)
    canvas.addEventListener('touchmove', (e) => {
      canvas.dispatchEvent(new MouseEvent('mousemove', {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
      }));
    });


    let dragOff = () => {
      isDragging = false;
    }
    canvas.addEventListener('mouseup', dragOff)
    canvas.addEventListener('mouseexit', dragOff)
    canvas.addEventListener('touchend', dragOff)
    canvas.addEventListener('touchcancel', dragOff)
  };

  
  Light.RADIUS = 16;
  Light.COLOR = "#FFFFFF";

  Light.inherits(Rainbows.MovingObject);

  Light.prototype.rotate = function() {

    let rotationRate = 0.001;
    let maxRotation = 1.0;

    this.rotationValue += rotationRate;
    
    if (this.rotationValue > maxRotation) {
      this.rotationValue -= maxRotation;
    }
  }



})(this);