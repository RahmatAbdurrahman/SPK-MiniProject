"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, Trophy, TrendingUp, Users, Star, DollarSign, Award, RefreshCw, CheckCircle } from "lucide-react"

// Sample data for calculation
const influencersData = [
  { id: 1, name: "Sarah Fashion", followers: 2100000, engagement: 5.2, brandFit: 9, cost: 15000000, experience: 8 },
  { id: 2, name: "Maya Style", followers: 1800000, engagement: 4.8, brandFit: 8, cost: 12000000, experience: 7 },
  { id: 3, name: "Rina Boutique", followers: 1500000, engagement: 4.5, brandFit: 9, cost: 10000000, experience: 6 },
  { id: 4, name: "Lisa Trend", followers: 1200000, engagement: 4.1, brandFit: 7, cost: 8000000, experience: 5 },
  { id: 5, name: "Nina Fashion", followers: 980000, engagement: 3.9, brandFit: 6, cost: 7000000, experience: 4 },
]

const criteria = {
  followers: { weight: 0.2, type: "benefit" },
  engagement: { weight: 0.3, type: "benefit" },
  brandFit: { weight: 0.25, type: "benefit" },
  cost: { weight: 0.15, type: "cost" },
  experience: { weight: 0.1, type: "benefit" },
}

export function SAWResults() {
  const [results, setResults] = useState<any[]>([])
  const [normalizedMatrix, setNormalizedMatrix] = useState<any[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateSAW = () => {
    setIsCalculating(true)

    // Simulate calculation delay
    setTimeout(() => {
      // Step 1: Create decision matrix
      const decisionMatrix = influencersData.map((inf) => ({
        id: inf.id,
        name: inf.name,
        followers: inf.followers,
        engagement: inf.engagement,
        brandFit: inf.brandFit,
        cost: inf.cost,
        experience: inf.experience,
      }))

      // Step 2: Find max and min values for normalization
      const maxFollowers = Math.max(...decisionMatrix.map((d) => d.followers))
      const maxEngagement = Math.max(...decisionMatrix.map((d) => d.engagement))
      const maxBrandFit = Math.max(...decisionMatrix.map((d) => d.brandFit))
      const minCost = Math.min(...decisionMatrix.map((d) => d.cost))
      const maxExperience = Math.max(...decisionMatrix.map((d) => d.experience))

      // Step 3: Normalize the matrix
      const normalized = decisionMatrix.map((inf) => ({
        id: inf.id,
        name: inf.name,
        followers: inf.followers / maxFollowers,
        engagement: inf.engagement / maxEngagement,
        brandFit: inf.brandFit / maxBrandFit,
        cost: minCost / inf.cost, // Cost is minimized
        experience: inf.experience / maxExperience,
      }))

      setNormalizedMatrix(normalized)

      // Step 4: Calculate weighted scores
      const finalResults = normalized.map((inf) => {
        const score =
          inf.followers * criteria.followers.weight +
          inf.engagement * criteria.engagement.weight +
          inf.brandFit * criteria.brandFit.weight +
          inf.cost * criteria.cost.weight +
          inf.experience * criteria.experience.weight

        return {
          id: inf.id,
          name: inf.name,
          score: score,
          normalizedValues: {
            followers: inf.followers,
            engagement: inf.engagement,
            brandFit: inf.brandFit,
            cost: inf.cost,
            experience: inf.experience,
          },
        }
      })

      // Step 5: Sort by score (descending)
      finalResults.sort((a, b) => b.score - a.score)

      setResults(finalResults)
      setIsCalculating(false)
    }, 2000)
  }

  useEffect(() => {
    calculateSAW()
  }, [])

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">🥇 Rank {rank}</Badge>
    if (rank === 2)
      return <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">🥈 Rank {rank}</Badge>
    if (rank === 3)
      return <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white">🥉 Rank {rank}</Badge>
    return <Badge variant="secondary">Rank {rank}</Badge>
  }

  const getRecommendation = (rank: number, score: number) => {
    if (rank === 1) return { text: "Sangat Direkomendasikan", color: "text-green-600" }
    if (rank <= 3) return { text: "Direkomendasikan", color: "text-blue-600" }
    if (score >= 0.6) return { text: "Cukup Direkomendasikan", color: "text-yellow-600" }
    return { text: "Kurang Direkomendasikan", color: "text-red-600" }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hasil Perhitungan SAW</h2>
          <p className="text-muted-foreground">Ranking influencer berdasarkan metode Simple Additive Weighting</p>
        </div>
        <Button onClick={calculateSAW} disabled={isCalculating} className="bg-gradient-to-r from-primary to-primary/90">
          {isCalculating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Menghitung...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              Hitung Ulang
            </>
          )}
        </Button>
      </div>

      {/* Calculation Status */}
      {isCalculating ? (
        <Card className="animate-in slide-in-from-top duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <div>
                <p className="font-medium">Sedang menghitung...</p>
                <p className="text-sm text-muted-foreground">Memproses normalisasi dan perhitungan skor SAW</p>
              </div>
            </div>
            <Progress value={75} className="mt-4" />
          </CardContent>
        </Card>
      ) : (
        results.length > 0 && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950 animate-in slide-in-from-top duration-500">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Perhitungan SAW berhasil diselesaikan untuk {results.length} influencer
            </AlertDescription>
          </Alert>
        )
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <Card className="animate-in slide-in-from-bottom duration-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Ranking Influencer
            </CardTitle>
            <CardDescription>Hasil akhir perhitungan SAW dengan rekomendasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Ranking</TableHead>
                    <TableHead>Nama Influencer</TableHead>
                    <TableHead className="text-center">Skor SAW</TableHead>
                    <TableHead className="text-center">Skor Visual</TableHead>
                    <TableHead className="text-center">Rekomendasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => {
                    const rank = index + 1
                    const recommendation = getRecommendation(rank, result.score)

                    return (
                      <TableRow
                        key={result.id}
                        className="hover:bg-muted/50 transition-colors duration-200 animate-in slide-in-from-left"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <TableCell className="text-center">{getRankBadge(rank)}</TableCell>
                        <TableCell>
                          <div className="font-medium">{result.name}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-mono text-lg font-bold">{result.score.toFixed(4)}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="w-full max-w-[200px] mx-auto">
                            <Progress value={result.score * 100} className="h-3" />
                            <span className="text-xs text-muted-foreground mt-1 block">
                              {(result.score * 100).toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-medium ${recommendation.color}`}>{recommendation.text}</span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 3 Influencers */}
          <Card className="animate-in slide-in-from-left duration-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top 3 Influencer
              </CardTitle>
              <CardDescription>Influencer dengan skor tertinggi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.slice(0, 3).map((result, index) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                          : index === 1
                            ? "bg-gradient-to-r from-gray-400 to-gray-500"
                            : "bg-gradient-to-r from-orange-400 to-orange-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-muted-foreground">Skor: {result.score.toFixed(4)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Progress value={result.score * 100} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground">{(result.score * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Criteria Contribution */}
          <Card className="animate-in slide-in-from-right duration-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Kontribusi Kriteria
              </CardTitle>
              <CardDescription>Bobot setiap kriteria dalam penilaian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Followers</span>
                  </div>
                  <span className="font-mono">{criteria.followers.weight * 100}%</span>
                </div>
                <Progress value={criteria.followers.weight * 100} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Engagement</span>
                  </div>
                  <span className="font-mono">{criteria.engagement.weight * 100}%</span>
                </div>
                <Progress value={criteria.engagement.weight * 100} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">Brand Fit</span>
                  </div>
                  <span className="font-mono">{criteria.brandFit.weight * 100}%</span>
                </div>
                <Progress value={criteria.brandFit.weight * 100} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Biaya</span>
                  </div>
                  <span className="font-mono">{criteria.cost.weight * 100}%</span>
                </div>
                <Progress value={criteria.cost.weight * 100} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Pengalaman</span>
                  </div>
                  <span className="font-mono">{criteria.experience.weight * 100}%</span>
                </div>
                <Progress value={criteria.experience.weight * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Normalized Matrix */}
      {normalizedMatrix.length > 0 && (
        <Card className="animate-in slide-in-from-bottom duration-700" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Matriks Ternormalisasi
            </CardTitle>
            <CardDescription>Nilai yang telah dinormalisasi untuk setiap kriteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead className="text-center">Followers</TableHead>
                    <TableHead className="text-center">Engagement</TableHead>
                    <TableHead className="text-center">Brand Fit</TableHead>
                    <TableHead className="text-center">Biaya</TableHead>
                    <TableHead className="text-center">Pengalaman</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {normalizedMatrix.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors duration-200">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center font-mono">{item.followers.toFixed(4)}</TableCell>
                      <TableCell className="text-center font-mono">{item.engagement.toFixed(4)}</TableCell>
                      <TableCell className="text-center font-mono">{item.brandFit.toFixed(4)}</TableCell>
                      <TableCell className="text-center font-mono">{item.cost.toFixed(4)}</TableCell>
                      <TableCell className="text-center font-mono">{item.experience.toFixed(4)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
