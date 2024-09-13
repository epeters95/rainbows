((root) => {
  var Rainbows = root.Rainbows = (root.Rainbows || {});

  const radius = 10;
  const color  = "#FFFFFF";


  class Light extends Rainbows.MovingObject {


    constructor(pos, vel, canvas) {

      super(pos, vel, radius, color);
      this.rotationValue = 0;      

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
    }


    rotate() {
      let rotationRate = 0.001;
      let maxRotation = 1.0;

      this.rotationValue += rotationRate;
      
      if (this.rotationValue > maxRotation) {
        this.rotationValue -= maxRotation;
      }
    }
  }



  Rainbows.Light = Light;


})(this);