"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, Trophy, TrendingUp, Users, Star, DollarSign, Award, RefreshCw, CheckCircle } from "lucide-react"

const API_URL = "http://localhost:3001/api";

// Hapus data dummy yang ada sebelumnya

export function SAWResults() {
  const [results, setResults] = useState<any[]>([])
  const [normalizedMatrix, setNormalizedMatrix] = useState<any[]>([])
  const [criteria, setCriteria] = useState<any>({});
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateSAW = async () => {
    setIsCalculating(true)
    
    try {
        // 1. Ambil data influencer dan kriteria dari API secara bersamaan
        const [influencersRes, criteriaRes] = await Promise.all([
            fetch(`${API_URL}/influencers`),
            fetch(`${API_URL}/criteria`)
        ]);

        const influencersData = await influencersRes.json();
        const criteriaData = await criteriaRes.json();
        
        // Ubah format kriteria agar lebih mudah diakses
        const criteriaFormatted: any = {};
        criteriaData.forEach((c: any) => {
            // Menggunakan nama kriteria sebagai key, sesuaikan jika perlu
            const key = c.name.toLowerCase().replace(/ /g, '_'); 
            criteriaFormatted[key] = { weight: c.weight, type: c.type };
        });

        // Pastikan nama key sesuai dengan yang digunakan di perhitungan
        // Contoh key: 'jumlah_followers', 'engagement_rate', 'kesesuaian_brand', 'biaya_endorse', 'pengalaman_endorse'
        // Anda mungkin perlu menyesuaikan ini
        const criteriaForCalc = {
          followers: criteriaFormatted['jumlah_followers'],
          engagement: criteriaFormatted['engagement_rate'],
          brandFit: criteriaFormatted['kesesuaian_brand'],
          cost: criteriaFormatted['biaya_endorse'],
          experience: criteriaFormatted['pengalaman_endorse'],
        };
        setCriteria(criteriaForCalc);


        // 2. Lanjutkan perhitungan SAW seperti sebelumnya
        const decisionMatrix = influencersData.map((inf: any) => ({
            ...inf
        }));

        const maxValues: any = {};
        const minValues: any = {};

        for (const key in criteriaForCalc) {
            if (criteriaForCalc[key].type === 'benefit') {
                maxValues[key] = Math.max(...decisionMatrix.map((d: any) => d[key]));
            } else {
                minValues[key] = Math.min(...decisionMatrix.map((d: any) => d[key]));
            }
        }

        const normalized = decisionMatrix.map((inf: any) => {
            const normalizedValues: any = { id: inf.id, name: inf.name };
            for (const key in criteriaForCalc) {
                if (criteriaForCalc[key].type === 'benefit') {
                    normalizedValues[key] = inf[key] / maxValues[key];
                } else {
                    normalizedValues[key] = minValues[key] / inf[key];
                }
            }
            return normalizedValues;
        });

        setNormalizedMatrix(normalized);

        const finalResults = normalized.map((inf: any) => {
            let score = 0;
            for (const key in criteriaForCalc) {
                score += inf[key] * criteriaForCalc[key].weight;
            }
            return {
                id: inf.id,
                name: inf.name,
                score,
            }
        });

        finalResults.sort((a, b) => b.score - a.score);
        setResults(finalResults);

    } catch (error) {
      console.error("Gagal melakukan perhitungan SAW:", error);
    } finally {
      setIsCalculating(false);
    }
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
    // ... sisa dari JSX Anda tidak berubah, salin dari sini ke bawah
    // dari <div className="space-y-6 animate-in fade-in duration-700">
    // hingga penutupnya
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
      {isCalculating && (
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
      )}

      {results.length > 0 && !isCalculating &&(
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950 animate-in slide-in-from-top duration-500">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Perhitungan SAW berhasil diselesaikan untuk {results.length} influencer
          </AlertDescription>
        </Alert>
      )}

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

    </div>
  )
}