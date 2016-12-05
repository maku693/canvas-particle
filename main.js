(() => {
  'use strict';

  const TWO_PI = Math.PI * 2

  const rgbaToCssColorString = color => {
    return `rgba(${
      parseInt(color.r)
    },${
      parseInt(color.g)
    },${
      parseInt(color.b)
    },${
      color.a
    })`
  }

  class Emitter {

    constructor(canvas) {
      this.context = canvas.getContext('2d')

      this.clearColor = { r: 0, g: 0, b: 0, a: 1 }
      this.birthRate = 4
      this.maxCount = 2000
      this.lifeTime = 1000
      this.lifeTimeRange = 100
      this.size = 4
      this.sizeRange = 2
      this.position = {
        x: canvas.width / 2,
        y: canvas.height / 2,
      }
      this.positionRange = {
        x: 10,
        y: 10,
      }
      this.angle = 0
      this.angleRange = 360
      this.speed = 100
      this.speedRange = 10
      this.startColor = { r: 0, g: 255, b: 255, a: 1 }
      this.endColor = { r: 0, g: 0, b: 255, a: 0.6 }

      this.lastTimestamp = 0

      this.particles = []

      this.context.strokeStyle = 'transparent'
      this.context.strokeWidth = 0
      this.context.save()
    }

    update() {
      const timestamp = Date.now()
      const elapsedTime = this.lastTimestamp ?
        timestamp - this.lastTimestamp : 0

      for(let i = 0; i < this.particles.length; i++) {
        const particle = this.particles[i]
        if (particle.age > this.lifeTime) {
          this.particles.splice(i, 1)
        }
      }

      for(let i = 0; i < this.birthRate; i++) {
        if (this.particles.length < this.maxCount) {
          const particle = new Particle(this)
          this.particles.push(particle)
        }
      }

      for(const particle of this.particles) {
        particle.update(elapsedTime)
      }

      this.lastTimestamp = timestamp
    }

    render() {
      this.context.fillStyle = rgbaToCssColorString(this.clearColor)
      this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height)

      for(const particle of this.particles) {
        particle.render()
      }
    }

  }

  class Particle {

    constructor(emitter) {
      this.context = emitter.context

      this.lifeTime = emitter.lifeTime + emitter.lifeTimeRange * (Math.random() - 0.5)
      this.age = 0
      this.color = Object.assign({}, emitter.startColor)
      this.startColor = Object.assign({}, emitter.startColor)
      this.endColor = Object.assign({}, emitter.endColor)
      this.size = emitter.size + emitter.sizeRange * (Math.random() - 0.5)
      this.position = {
        x: emitter.position.x + emitter.positionRange.x * (Math.random() - 0.5),
        y: emitter.position.y + emitter.positionRange.y * (Math.random() - 0.5)
      }
      this.rad = (emitter.angle + emitter.angleRange * (Math.random() - 0.5)) * Math.PI / 180
      this.speed = emitter.speed + emitter.speedRange * (Math.random() - 0.5)
    }

    update(elapsedTime) {
      const distance = this.speed * elapsedTime / 1000
      this.position = {
        x: this.position.x + Math.cos(this.rad) * distance,
        y: this.position.y + Math.sin(this.rad) * distance
      }

      const colorPosition = this.age / this.lifeTime
      this.color = {
        r: this.startColor.r + (this.endColor.r - this.startColor.r) * colorPosition,
        g: this.startColor.g + (this.endColor.g - this.startColor.g) * colorPosition,
        b: this.startColor.b + (this.endColor.b - this.startColor.b) * colorPosition,
        a: this.startColor.a + (this.endColor.a - this.startColor.a) * colorPosition
      }

      this.age += elapsedTime
    }

    render() {
      this.context.beginPath()
      this.context.arc(this.position.x, this.position.y, this.size, 0, TWO_PI)
      this.context.closePath()
      this.context.fillStyle = rgbaToCssColorString(this.color)
      this.context.fill()
    }

  }

  window.addEventListener('DOMContentLoaded', () => {
    const emitter = new Emitter(canvas)

    const render = () => {
      emitter.update()
      emitter.render()
      window.requestAnimationFrame(render)
    }

    render()
  })

})()
