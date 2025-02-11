import React, { useEffect, useRef } from "react";

export default function SkylineAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let dt = 1;
    let skylines = [];

    function Building(config) {
      this.layer = config.layer;
      this.x = config.x;
      this.y = config.y;
      this.width = config.width;
      this.height = config.height;
      this.color = config.color;
    }

    Building.prototype.render = function () {
      ctx.fillStyle = ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    };

    function Skyline(config) {
      this.x = 0;
      this.buildings = [];
      this.layer = config.layer;
      this.width = { min: config.width.min, max: config.width.max };
      this.height = { min: config.height.min, max: config.height.max };
      this.speed = config.speed;
      this.color = config.color;
      this.populate();
    }

    Skyline.prototype.populate = function () {
      let totalWidth = 0;
      while (totalWidth <= canvas.width + this.width.max * 2) {
        const newWidth = Math.round(
          Math.random() * (this.width.max - this.width.min) + this.width.min
        );

        const maxHeight = canvas.height * (0.7 - this.layer * 0.1);
        const newHeight = Math.min(
          Math.round(
            Math.random() * (this.height.max - this.height.min) +
              this.height.min
          ),
          maxHeight
        );

        this.buildings.push(
          new Building({
            layer: this.layer,
            x:
              this.buildings.length === 0
                ? 0
                : this.buildings[this.buildings.length - 1].x +
                  this.buildings[this.buildings.length - 1].width,
            y: canvas.height - newHeight,
            width: newWidth,
            height: newHeight,
            color: this.color,
          })
        );
        totalWidth += newWidth;
      }
    };

    Skyline.prototype.update = function () {
      this.x -= (canvas.width / 10) * this.speed * dt;

      const firstBuilding = this.buildings[0];
      if (firstBuilding.width + firstBuilding.x + this.x < 0) {
        const newWidth = Math.round(
          Math.random() * (this.width.max - this.width.min) + this.width.min
        );

        const maxHeight = canvas.height * (0.7 - this.layer * 0.1);
        const newHeight = Math.min(
          Math.round(
            Math.random() * (this.height.max - this.height.min) +
              this.height.min
          ),
          maxHeight
        );

        const lastBuilding = this.buildings[this.buildings.length - 1];
        firstBuilding.x = lastBuilding.x + lastBuilding.width;
        firstBuilding.y = canvas.height - newHeight;
        firstBuilding.width = newWidth;
        firstBuilding.height = newHeight;
        this.buildings.push(this.buildings.shift());
      }
    };

    Skyline.prototype.render = function () {
      ctx.save();
      ctx.translate(this.x, ((canvas.height - 0) / 20) * this.layer);
      this.buildings.forEach((building) => building.render());
      ctx.restore();
    };

    for (let i = 0; i < 5; i++) {
      skylines.push(
        new Skyline({
          layer: i, // Foreground has lower layer number
          width: { min: (i + 1) * 30, max: (i + 1) * 40 },
          height: { min: 100, max: 300 },
          speed: (i + 1) * 0.02,
          color: `hsl(200, ${80 - i * 15}%, ${(i + 1) * 5 + 20}%)`,
        })
      );
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function clear() {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#ff5e62");
      gradient.addColorStop(1, "#fff");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
      dt = Math.max(0.1, Math.min(5, 1 / 16));
      skylines.forEach((skyline) => skyline.update());
    }

    function draw() {
      clear();
      skylines.forEach((skyline) => skyline.render());
      drawText();
    }

    function drawText() {
      ctx.fillStyle = "white";
      ctx.font = "bold 50px Arial";
      ctx.textAlign = "center";
      ctx.fillText("🚀 Launching Soon 🚀", canvas.width / 2, canvas.height / 3);
      ctx.font = "bold 80px Arial";
      ctx.fillText("Propscanly", canvas.width / 2, canvas.height / 3 - 70);
    }

    function animate() {
      update();
      draw();
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2,
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
      }}
    />
  );
}
