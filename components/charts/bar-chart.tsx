"use client"

import { useEffect, useRef } from "react"

export function BarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 600
    canvas.height = 300

    const data = [
      { name: "Sarah Fashion", score: 0.89 },
      { name: "Maya Style", score: 0.85 },
      { name: "Rina Boutique", score: 0.82 },
      { name: "Lisa Trend", score: 0.78 },
      { name: "Nina Fashion", score: 0.75 },
    ]

    const padding = 60
    const chartWidth = canvas.width - 2 * padding
    const chartHeight = canvas.height - 2 * padding
    const barWidth = (chartWidth / data.length) * 0.8
    const barSpacing = (chartWidth / data.length) * 0.2

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.score / 1.0) * chartHeight
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
      const y = canvas.height - padding - barHeight

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
      gradient.addColorStop(0, "#3b82f6")
      gradient.addColorStop(1, "#1d4ed8")

      // Draw bar
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw score on top of bar
      ctx.fillStyle = "#374151"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(item.score.toFixed(2), x + barWidth / 2, y - 5)

      // Draw name below bar
      ctx.fillStyle = "#6b7280"
      ctx.font = "10px sans-serif"
      ctx.save()
      ctx.translate(x + barWidth / 2, canvas.height - padding + 15)
      ctx.rotate(-Math.PI / 4)
      ctx.textAlign = "right"
      ctx.fillText(item.name, 0, 0)
      ctx.restore()
    })

    // Draw axes
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 1

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.stroke()

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Y-axis labels
    ctx.fillStyle = "#6b7280"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 10; i++) {
      const y = canvas.height - padding - (i / 10) * chartHeight
      ctx.fillText((i / 10).toFixed(1), padding - 10, y + 3)
    }
  }, [])

  return (
    <div className="w-full overflow-x-auto">
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  )
}
