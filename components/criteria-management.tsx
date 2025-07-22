"use client"



import { useState, useEffect } from "react" // useEffect ditambahkan

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"

import { Slider } from "@/components/ui/slider"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertDescription } from "@/components/ui/alert"

import { Settings, Save, RotateCcw, AlertTriangle, CheckCircle } from "lucide-react"



const API_URL = "http://localhost:3001/api";





export function CriteriaManagement() {

  const [criteria, setCriteria] = useState<any[]>([])

  const [initialCriteria, setInitialCriteria] = useState<any[]>([]); // Untuk menyimpan state awal

  const [hasChanges, setHasChanges] = useState(false)



  // Fungsi untuk mengambil data kriteria dari API

  const fetchCriteria = async () => {

    try {

      const response = await fetch(`${API_URL}/criteria`);

      const data = await response.json();

      setCriteria(data);

      setInitialCriteria(JSON.parse(JSON.stringify(data))); // Simpan state awal

    } catch (error) {

      console.error("Gagal mengambil data kriteria:", error);

    }

  };



  // Ambil data saat komponen dimuat

  useEffect(() => {

    fetchCriteria();

  }, []);





  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0)

  const isValidWeight = Math.abs(totalWeight - 1.0) < 0.001



  const handleWeightChange = (id: string, newWeight: number) => {

    setCriteria(

      criteria.map((criterion) => (criterion.id === id ? { ...criterion, weight: newWeight / 100 } : criterion)),

    )

    setHasChanges(true)

  }



  const handleSave = async () => {

    if (isValidWeight) {

      // Kirim data yang diperbarui ke backend

      const dataToUpdate = criteria.map(({ id, weight }) => ({ id, weight }));

      try {

        await fetch(`${API_URL}/criteria`, {

          method: 'PUT',

          headers: { 'Content-Type': 'application/json' },

          body: JSON.stringify(dataToUpdate),

        });

        setHasChanges(false);

        setInitialCriteria(JSON.parse(JSON.stringify(criteria))); // Perbarui state awal

        alert("Bobot kriteria berhasil disimpan!");

      } catch (error) {

        console.error("Gagal menyimpan bobot:", error);

        alert("Gagal menyimpan bobot. Silakan coba lagi.");

      }

    }

  }



  const handleReset = () => {

    setCriteria(JSON.parse(JSON.stringify(initialCriteria))); // Kembalikan ke state awal

    setHasChanges(false)

  }



  const normalizeWeights = () => {

    const currentTotal = criteria.reduce((sum, criterion) => sum + criterion.weight, 0)

    if (currentTotal > 0) {

      setCriteria(

        criteria.map((criterion) => ({

          ...criterion,

          weight: criterion.weight / currentTotal,

        })),

      )

      setHasChanges(true)

    }

  }



  return (

    <div className="space-y-6 animate-in fade-in duration-700">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold">Manajemen Kriteria</h2>

          <p className="text-muted-foreground">Kelola bobot kriteria untuk metode SAW</p>

        </div>

        <div className="flex space-x-2">

          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>

            <RotateCcw className="w-4 h-4 mr-2" />

            Reset

          </Button>

          <Button

            onClick={handleSave}

            disabled={!hasChanges || !isValidWeight}

            className="bg-gradient-to-r from-primary to-primary/90"

          >

            <Save className="w-4 h-4 mr-2" />

            Simpan

          </Button>

        </div>

      </div>



      {/* Weight Validation Alert */}

      <Alert

        className={`animate-in slide-in-from-top duration-500 ${isValidWeight ? "border-green-200 bg-green-50 dark:bg-green-950" : "border-orange-200 bg-orange-50 dark:bg-orange-950"}`}

      >

        <div className="flex items-center gap-2">

          {isValidWeight ? (

            <CheckCircle className="w-4 h-4 text-green-600" />

          ) : (

            <AlertTriangle className="w-4 h-4 text-orange-600" />

          )}

          <AlertDescription

            className={isValidWeight ? "text-green-800 dark:text-green-200" : "text-orange-800 dark:text-orange-200"}

          >

            {isValidWeight

              ? `Total bobot valid: ${(totalWeight * 100).toFixed(1)}%`

              : `Total bobot: ${(totalWeight * 100).toFixed(1)}% (harus 100%)`}

            {!isValidWeight && (

              <Button

                variant="link"

                size="sm"

                onClick={normalizeWeights}

                className="ml-2 p-0 h-auto text-orange-600 hover:text-orange-800"

              >

                Normalisasi otomatis

              </Button>

            )}

          </AlertDescription>

        </div>

      </Alert>



      {/* Criteria Cards */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {criteria.map((criterion, index) => (

          <Card

            key={criterion.id}

            className="animate-in slide-in-from-bottom duration-700 hover:shadow-lg transition-all duration-300"

            style={{ animationDelay: `${index * 100}ms` }}

          >

            <CardHeader>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">

                    <span className="text-primary-foreground font-bold text-sm">{criterion.id}</span>

                  </div>

                  <div>

                    <CardTitle className="text-lg">{criterion.name}</CardTitle>

                    <CardDescription>{criterion.description}</CardDescription>

                  </div>

                </div>

                <Badge variant={criterion.type === "benefit" ? "default" : "secondary"}>

                  {criterion.type === "benefit" ? "Benefit" : "Cost"}

                </Badge>

              </div>

            </CardHeader>

            <CardContent className="space-y-4">

              <div className="space-y-3">

                <div className="flex justify-between items-center">

                  <Label htmlFor={`weight-${criterion.id}`}>Bobot Kriteria</Label>

                  <div className="flex items-center gap-2">

                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">

                      {(criterion.weight * 100).toFixed(0)}%

                    </span>

                  </div>

                </div>

                <Slider

                  id={`weight-${criterion.id}`}

                  min={0}

                  max={100}

                  step={1}

                  value={[criterion.weight * 100]}

                  onValueChange={(value) => handleWeightChange(criterion.id, value[0])}

                  className="w-full"

                />

                <div className="flex justify-between text-xs text-muted-foreground">

                  <span>0%</span>

                  <span>50%</span>

                  <span>100%</span>

                </div>

              </div>



              <div className="pt-2 border-t">

                <div className="flex justify-between items-center text-sm">

                  <span className="text-muted-foreground">Satuan:</span>

                  <Badge variant="outline">{criterion.unit}</Badge>

                </div>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>



      {/* Summary Card */}

      <Card className="animate-in slide-in-from-bottom duration-700" style={{ animationDelay: "500ms" }}>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <Settings className="w-5 h-5" />

            Ringkasan Konfigurasi

          </CardTitle>

          <CardDescription>Ringkasan bobot kriteria yang akan digunakan dalam perhitungan SAW</CardDescription>

        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

            {criteria.map((criterion) => (

              <div

                key={criterion.id}

                className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"

              >

                <div className="text-sm font-medium text-muted-foreground mb-1">{criterion.id}</div>

                <div className="text-2xl font-bold mb-1">{(criterion.weight * 100).toFixed(0)}%</div>

                <div className="text-xs text-muted-foreground">{criterion.name}</div>

              </div>

            ))}

          </div>



          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">

            <div className="flex items-center justify-between">

              <span className="font-medium">Total Bobot:</span>

              <span className={`text-xl font-bold ${isValidWeight ? "text-green-600" : "text-orange-600"}`}>

                {(totalWeight * 100).toFixed(1)}%

              </span>

            </div>

          </div>

        </CardContent>

      </Card>

    </div>

  )

}