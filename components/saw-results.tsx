"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, Trophy, TrendingUp, Users, Star, DollarSign, Award, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function SAWResults() {
  const [results, setResults] = useState<any[]>([])
  const [normalizedMatrix, setNormalizedMatrix] = useState<any[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const calculateSAW = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
        const [influencersRes, criteriaRes] = await Promise.all([
            fetch(`${API_URL}/influencers`),
            fetch(`${API_URL}/criteria`)
        ]);

        if (!influencersRes.ok || !criteriaRes.ok) {
            throw new Error("Gagal memuat data dari server. Pastikan data influencer dan kriteria sudah diisi.");
        }

        const influencersData = await influencersRes.json();
        const criteriaData = await criteriaRes.json();
        
        if (!Array.isArray(influencersData) || !Array.isArray(criteriaData) || influencersData.length === 0 || criteriaData.length === 0) {
            throw new Error("Data influencer atau kriteria kosong. Silakan isi data terlebih dahulu.");
        }

        const criteriaForCalc: any = {};
        criteriaData.forEach((c: any) => {
            const key = c.name.toLowerCase().replace(/ /g, '_').replace('rate', '').replace(/%/g, '').trim();
            criteriaForCalc[key] = { weight: c.weight, type: c.type };
        });

        const keyMap = {
            'jumlah_followers': 'followers',
            'engagement_': 'engagement',
            'kesesuaian_brand': 'brandFit',
            'biaya_endorse': 'cost',
            'pengalaman_endorse': 'experience'
        };

        const decisionMatrix = influencersData;

        const maxValues: any = {};
        const minValues: any = {};

        Object.keys(keyMap).forEach(originalKey => {
            const newKey = (keyMap as any)[originalKey];
            if (criteriaForCalc[originalKey]?.type === 'benefit') {
                maxValues[newKey] = Math.max(...decisionMatrix.map((d: any) => d[newKey]));
            } else if (criteriaForCalc[originalKey]?.type === 'cost') {
                minValues[newKey] = Math.min(...decisionMatrix.map((d: any) => d[newKey]));
            }
        });

        const normalized = decisionMatrix.map((inf: any) => {
            const normalizedValues: any = { id: inf.id, name: inf.name };
            Object.keys(keyMap).forEach(originalKey => {
                const newKey = (keyMap as any)[originalKey];
                if (criteriaForCalc[originalKey]?.type === 'benefit') {
                    normalizedValues[newKey] = inf[newKey] / maxValues[newKey];
                } else {
                    normalizedValues[newKey] = minValues[newKey] / inf[newKey];
                }
            });
            return normalizedValues;
        });

        setNormalizedMatrix(normalized);

        const finalResults = normalized.map((inf: any) => {
            let score = 0;
            Object.keys(keyMap).forEach(originalKey => {
                const newKey = (keyMap as any)[originalKey];
                score += (inf[newKey] || 0) * (criteriaForCalc[originalKey]?.weight || 0);
            });
            return { id: inf.id, name: inf.name, score };
        });

        finalResults.sort((a, b) => b.score - a.score);
        setResults(finalResults);

    } catch (err: any) {
      console.error("Gagal melakukan perhitungan SAW:", err);
      setError(err.message || "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setIsCalculating(false);
    }
  }

  useEffect(() => {
    calculateSAW();
  }, []);

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hasil Perhitungan SAW</h2>
          <p className="text-muted-foreground">Ranking influencer berdasarkan metode Simple Additive Weighting</p>
        </div>
        <Button onClick={calculateSAW} disabled={isCalculating} className="bg-gradient-to-r from-primary to-primary/90">
          {isCalculating ? (
            <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Menghitung...</>
          ) : (
            <><Calculator className="w-4 h-4 mr-2" />Hitung Ulang</>
          )}
        </Button>
      </div>

      {isCalculating && (
        <Card><CardContent className="p-6"><div className="flex items-center justify-center space-x-4"><RefreshCw className="w-6 h-6 animate-spin text-primary" /><div><p className="font-medium">Sedang menghitung...</p><p className="text-sm text-muted-foreground">Memproses data dari server</p></div></div></CardContent></Card>
      )}

      {error && !isCalculating && (
         <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>
      )}

      {results.length > 0 && !error && !isCalculating && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950"><CheckCircle className="w-4 h-4 text-green-600" /><AlertDescription className="text-green-800 dark:text-green-200">Perhitungan SAW berhasil diselesaikan untuk {results.length} influencer</AlertDescription></Alert>
      )}

      {results.length > 0 && !error && !isCalculating && (
        <Card className="animate-in slide-in-from-bottom duration-700">
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" />Ranking Influencer</CardTitle><CardDescription>Hasil akhir perhitungan SAW dengan rekomendasi</CardDescription></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead className="text-center">Ranking</TableHead><TableHead>Nama Influencer</TableHead><TableHead className="text-center">Skor SAW</TableHead><TableHead className="text-center">Skor Visual</TableHead><TableHead className="text-center">Rekomendasi</TableHead></TableRow></TableHeader>
                <TableBody>
                  {results.map((result, index) => {
                    const rank = index + 1
                    const recommendation = getRecommendation(rank, result.score)
                    return (
                      <TableRow key={result.id} className="hover:bg-muted/50 transition-colors duration-200"><TableCell className="text-center">{getRankBadge(rank)}</TableCell><TableCell><div className="font-medium">{result.name}</div></TableCell><TableCell className="text-center"><span className="font-mono text-lg font-bold">{result.score.toFixed(4)}</span></TableCell><TableCell className="text-center"><div className="w-full max-w-[200px] mx-auto"><Progress value={result.score * 100} className="h-3" /><span className="text-xs text-muted-foreground mt-1 block">{(result.score * 100).toFixed(1)}%</span></div></TableCell><TableCell className="text-center"><span className={`font-medium ${recommendation.color}`}>{recommendation.text}</span></TableCell></TableRow>
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