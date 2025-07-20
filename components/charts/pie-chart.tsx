"use client"

import { useEffect, useRef } from "react"

export function PieChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 300
    canvas.height = 300

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 100

    const data = [
      { label: "Followers", value: 20, color: "#3b82f6" },
      { label: "Engagement", value: 30, color: "#10b981" },
      { label: "Brand Fit", value: 25, color: "#f59e0b" },
      { label: "Biaya", value: 15, color: "#ef4444" },
      { label: "Pengalaman", value: 10, color: "#8b5cf6" },
    ]

    let currentAngle = -Math.PI / 2

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw pie slices
    data.forEach((item) => {
      const sliceAngle = (item.value / 100) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = item.color
      ctx.fill()

      // Draw labels
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)

      ctx.fillStyle = "white"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${item.value}%`, labelX, labelY)

      currentAngle += sliceAngle
    })
  }, [])

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} className="max-w-full h-auto" />
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Followers (20%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Engagement (30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Brand Fit (25%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Biaya (15%)</span>
        </div>
        <div className="flex items-center gap-2 col-span-2 justify-center">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>Pengalaman (10%)</span>
        </div>
      </div>
    </div>
  )
}
