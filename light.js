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
    var radius = 10;
    Rainbows.MovingObject.call(this, pos, vel, radius,
       Light.COLOR);

    var isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    let that = this;
    
    // Click events
    canvas.addEventListener('mousedown', (event) => {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - canvas.getBoundingClientRect().top;

      const dist = Math.sqrt((mouseX - that.pos[0]) ** 2 + (mouseY - this.pos[1]) ** 2);

      if (dist <= that.radius) {
        isDragging = true;

        this.offsetX = that.pos[0]- mouseX;
        this.offsetY = that.pos[1] - mouseY;
      }
    });

    canvas.addEventListener('mousemove', (event) => {
      if (isDragging) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        this.pos = [mouseX + this.offsetX, mouseY + this.offsetY];
      }
    })

    let dragOff = (event) => {
      isDragging = false;
    }
    canvas.addEventListener('mouseup', dragOff)
    canvas.addEventListener('mouseexit', dragOff)
  };
  
  Light.RADIUS = 16;
  Light.COLOR = "#FFFFFF";

  Light.inherits(Rainbows.MovingObject);




})(this);