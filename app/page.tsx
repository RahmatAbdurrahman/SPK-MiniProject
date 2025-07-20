"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, Award, BarChart3, Moon, Sun, Download } from "lucide-react"
import { InfluencerForm } from "@/components/influencer-form"
import { CriteriaManagement } from "@/components/criteria-management"
import { SAWResults } from "@/components/saw-results"
import { Dashboard } from "@/components/dashboard"
import { ExportReports } from "@/components/export-reports"
import { useTheme } from "@/components/theme-provider"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 transition-all duration-500">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50 animate-in slide-in-from-top duration-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Sistem Pendukung Keputusan
                </h1>
                <p className="text-sm text-muted-foreground">Pemilihan Influencer - Metode SAW</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="transition-all duration-300 hover:scale-105 bg-transparent"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="animate-in fade-in duration-700">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
              Penerapan Metode Simple Additive Weighting (SAW)
            </h2>
            <p className="text-muted-foreground text-lg">
              dalam Pemilihan Influencer untuk Meningkatkan Pendapatan Toko Fashion
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="dashboard" className="transition-all duration-300">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="influencers" className="transition-all duration-300">
                <Users className="w-4 h-4 mr-2" />
                Influencer
              </TabsTrigger>
              <TabsTrigger value="criteria" className="transition-all duration-300">
                <Award className="w-4 h-4 mr-2" />
                Kriteria
              </TabsTrigger>
              <TabsTrigger value="results" className="transition-all duration-300">
                <TrendingUp className="w-4 h-4 mr-2" />
                Hasil SAW
              </TabsTrigger>
              <TabsTrigger value="export" className="transition-all duration-300">
                <Download className="w-4 h-4 mr-2" />
                Export
              </TabsTrigger>
            </TabsList>

            <div className="animate-in fade-in duration-500">
              <TabsContent value="dashboard">
                <Dashboard />
              </TabsContent>

              <TabsContent value="influencers">
                <InfluencerForm />
              </TabsContent>

              <TabsContent value="criteria">
                <CriteriaManagement />
              </TabsContent>

              <TabsContent value="results">
                <SAWResults />
              </TabsContent>

              <TabsContent value="export">
                <ExportReports />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Sistem Pendukung Keputusan Pemilihan Influencer</p>
            <p className="mt-1">Menggunakan Metode Simple Additive Weighting (SAW)</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
