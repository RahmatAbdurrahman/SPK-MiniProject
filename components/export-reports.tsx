"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, FileText, Table, BarChart3, CheckCircle, Calendar } from "lucide-react"

const exportOptions = [
  {
    id: "ranking",
    name: "Ranking Influencer",
    description: "Tabel ranking lengkap dengan skor SAW",
    icon: Table,
    formats: ["PDF", "Excel"],
  },
  {
    id: "analysis",
    name: "Analisis Lengkap",
    description: "Laporan analisis dengan grafik dan rekomendasi",
    icon: BarChart3,
    formats: ["PDF"],
  },
  {
    id: "summary",
    name: "Ringkasan Eksekutif",
    description: "Ringkasan hasil untuk manajemen",
    icon: FileText,
    formats: ["PDF", "Word"],
  },
  {
    id: "criteria",
    name: "Konfigurasi Kriteria",
    description: "Detail bobot dan kriteria yang digunakan",
    icon: CheckCircle,
    formats: ["PDF", "Excel"],
  },
]

export function ExportReports() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["ranking"])
  const [selectedFormat, setSelectedFormat] = useState("PDF")
  const [isExporting, setIsExporting] = useState(false)
  const [exportHistory, setExportHistory] = useState([
    {
      id: 1,
      name: "Ranking Influencer - Januari 2024",
      format: "PDF",
      date: "2024-01-15",
      size: "2.3 MB",
    },
    {
      id: 2,
      name: "Analisis Lengkap - Desember 2023",
      format: "PDF",
      date: "2023-12-28",
      size: "5.7 MB",
    },
    {
      id: 3,
      name: "Ringkasan Eksekutif - Desember 2023",
      format: "Excel",
      date: "2023-12-20",
      size: "1.8 MB",
    },
  ])

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId])
    } else {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId))
    }
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      const newExport = {
        id: Date.now(),
        name: `Export ${new Date().toLocaleDateString("id-ID")}`,
        format: selectedFormat,
        date: new Date().toISOString().split("T")[0],
        size: "3.2 MB",
      }

      setExportHistory([newExport, ...exportHistory])
      setIsExporting(false)

      // In a real application, this would trigger the actual download
      console.log("Exporting:", { selectedOptions, selectedFormat })
    }, 3000)
  }

  const getAvailableFormats = () => {
    if (selectedOptions.length === 0) return []

    const selectedExportOptions = exportOptions.filter((option) => selectedOptions.includes(option.id))

    // Find common formats across all selected options
    return selectedExportOptions.reduce((commonFormats, option) => {
      if (commonFormats.length === 0) return option.formats
      return commonFormats.filter((format) => option.formats.includes(format))
    }, [] as string[])
  }

  const availableFormats = getAvailableFormats()

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Export Laporan</h2>
        <p className="text-muted-foreground">Download hasil analisis dalam berbagai format</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card className="animate-in slide-in-from-left duration-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Konfigurasi Export
            </CardTitle>
            <CardDescription>Pilih data yang ingin diekspor dan format file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Export Options */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Pilih Data untuk Diekspor</Label>
              <div className="space-y-3">
                {exportOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors duration-200"
                  >
                    <Checkbox
                      id={option.id}
                      checked={selectedOptions.includes(option.id)}
                      onCheckedChange={(checked) => handleOptionChange(option.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <option.icon className="w-4 h-4" />
                        <Label htmlFor={option.id} className="font-medium cursor-pointer">
                          {option.name}
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      <div className="flex gap-1 mt-2">
                        {option.formats.map((format) => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            {selectedOptions.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">Format File</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih format" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFormats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={selectedOptions.length === 0 || isExporting}
              className="w-full bg-gradient-to-r from-primary to-primary/90"
            >
              {isExporting ? (
                <>
                  <Download className="w-4 h-4 mr-2 animate-pulse" />
                  Mengekspor...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Laporan
                </>
              )}
            </Button>

            {selectedOptions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">Pilih minimal satu data untuk diekspor</p>
            )}
          </CardContent>
        </Card>

        {/* Export History */}
        <Card className="animate-in slide-in-from-right duration-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Riwayat Export
            </CardTitle>
            <CardDescription>File yang telah diekspor sebelumnya</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportHistory.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200 animate-in slide-in-from-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString("id-ID")}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {item.format}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.size}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200 bg-transparent"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Preview */}
      {selectedOptions.length > 0 && (
        <Card className="animate-in slide-in-from-bottom duration-700">
          <CardHeader>
            <CardTitle>Preview Export</CardTitle>
            <CardDescription>Pratinjau data yang akan diekspor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedOptions.map((optionId) => {
                const option = exportOptions.find((opt) => opt.id === optionId)
                if (!option) return null

                return (
                  <div key={optionId} className="p-4 rounded-lg border bg-gradient-to-br from-muted/50 to-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <option.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{option.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{option.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {selectedFormat}
                    </Badge>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Total Export</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOptions.length} item(s) dalam format {selectedFormat}
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-primary to-primary/90">Siap Export</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
