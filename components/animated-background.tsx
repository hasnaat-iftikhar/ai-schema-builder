"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Line properties
    const lines: Line[] = []
    const lineCount = 15

    class Line {
      x: number
      y: number
      length: number
      opacity: number
      direction: number
      speed: number
      width: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.length = Math.random() * 150 + 50
        this.opacity = Math.random() * 0.15 + 0.05
        this.direction = Math.random() * Math.PI * 2
        this.speed = Math.random() * 0.5 + 0.1
        this.width = Math.random() * 1 + 0.5
      }

      draw() {
        if (!ctx) return

        const endX = this.x + Math.cos(this.direction) * this.length
        const endY = this.y + Math.sin(this.direction) * this.length

        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = `rgba(197, 252, 112, ${this.opacity})`
        ctx.lineWidth = this.width
        ctx.stroke()
      }

      update() {
        this.x += Math.cos(this.direction) * this.speed
        this.y += Math.sin(this.direction) * this.speed

        // Wrap around edges
        if (this.x < -this.length) this.x = canvas.width + this.length
        if (this.x > canvas.width + this.length) this.x = -this.length
        if (this.y < -this.length) this.y = canvas.height + this.length
        if (this.y > canvas.height + this.length) this.y = -this.length
      }
    }

    // Create lines
    for (let i = 0; i < lineCount; i++) {
      lines.push(new Line())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update lines
      lines.forEach((line) => {
        line.draw()
        line.update()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 bg-cryptic-background" />
}
