"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Users, TrendingUp, DollarSign, Star, Award } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const initialInfluencers = [
  {
    id: 1,
    name: "Sarah Fashion",
    followers: 2100000,
    engagement: 5.2,
    brandFit: 9,
    cost: 15000000,
    experience: 8,
    category: "Fashion",
    description: "Fashion influencer dengan fokus pada style casual dan formal",
  },
  {
    id: 2,
    name: "Maya Style",
    followers: 1800000,
    engagement: 4.8,
    brandFit: 8,
    cost: 12000000,
    experience: 7,
    category: "Lifestyle",
    description: "Lifestyle blogger dengan audience yang loyal",
  },
  {
    id: 3,
    name: "Rina Boutique",
    followers: 1500000,
    engagement: 4.5,
    brandFit: 9,
    cost: 10000000,
    experience: 6,
    category: "Fashion",
    description: "Spesialis fashion wanita dan aksesoris",
  },
]

export function InfluencerForm() {
  const [influencers, setInfluencers] = useState(initialInfluencers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInfluencer, setEditingInfluencer] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    followers: "",
    engagement: "",
    brandFit: "",
    cost: "",
    experience: "",
    category: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newInfluencer = {
      id: editingInfluencer ? editingInfluencer.id : Date.now(),
      name: formData.name,
      followers: Number.parseInt(formData.followers),
      engagement: Number.parseFloat(formData.engagement),
      brandFit: Number.parseInt(formData.brandFit),
      cost: Number.parseInt(formData.cost),
      experience: Number.parseInt(formData.experience),
      category: formData.category,
      description: formData.description,
    }

    if (editingInfluencer) {
      setInfluencers(influencers.map((inf) => (inf.id === editingInfluencer.id ? newInfluencer : inf)))
    } else {
      setInfluencers([...influencers, newInfluencer])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      followers: "",
      engagement: "",
      brandFit: "",
      cost: "",
      experience: "",
      category: "",
      description: "",
    })
    setEditingInfluencer(null)
  }

  const handleEdit = (influencer: any) => {
    setEditingInfluencer(influencer)
    setFormData({
      name: influencer.name,
      followers: influencer.followers.toString(),
      engagement: influencer.engagement.toString(),
      brandFit: influencer.brandFit.toString(),
      cost: influencer.cost.toString(),
      experience: influencer.experience.toString(),
      category: influencer.category,
      description: influencer.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setInfluencers(influencers.filter((inf) => inf.id !== id))
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Influencer</h2>
          <p className="text-muted-foreground">Kelola data influencer untuk analisis SAW</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Influencer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingInfluencer ? "Edit Influencer" : "Tambah Influencer Baru"}</DialogTitle>
              <DialogDescription>Masukkan data lengkap influencer untuk analisis SAW</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Influencer</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama influencer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="Beauty">Beauty</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followers">Jumlah Followers</Label>
                  <Input
                    id="followers"
                    type="number"
                    value={formData.followers}
                    onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                    placeholder="Contoh: 1000000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engagement">Engagement Rate (%)</Label>
                  <Input
                    id="engagement"
                    type="number"
                    step="0.1"
                    value={formData.engagement}
                    onChange={(e) => setFormData({ ...formData, engagement: e.target.value })}
                    placeholder="Contoh: 4.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brandFit">Kesesuaian Brand (1-10)</Label>
                  <Input
                    id="brandFit"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.brandFit}
                    onChange={(e) => setFormData({ ...formData, brandFit: e.target.value })}
                    placeholder="Contoh: 8"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Biaya Endorse (IDR)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="Contoh: 10000000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Pengalaman Endorse (1-10)</Label>
                <Input
                  id="experience"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Contoh: 7"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat tentang influencer"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(false)
                  }}
                >
                  Batal
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-primary/90">
                  {editingInfluencer ? "Update" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Influencer Table */}
      <Card className="animate-in slide-in-from-bottom duration-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Daftar Influencer ({influencers.length})
          </CardTitle>
          <CardDescription>Data lengkap influencer untuk analisis pemilihan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" />
                      Followers
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Engagement
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4" />
                      Brand Fit
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Biaya
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Award className="w-4 h-4" />
                      Pengalaman
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {influencers.map((influencer, index) => (
                  <TableRow
                    key={influencer.id}
                    className="hover:bg-muted/50 transition-colors duration-200 animate-in slide-in-from-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{influencer.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{influencer.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{influencer.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono">{formatNumber(influencer.followers)}</TableCell>
                    <TableCell className="text-center font-mono">{influencer.engagement}%</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge
                          variant={
                            influencer.brandFit >= 8
                              ? "default"
                              : influencer.brandFit >= 6
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {influencer.brandFit}/10
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">{formatCurrency(influencer.cost)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge
                          variant={
                            influencer.experience >= 8
                              ? "default"
                              : influencer.experience >= 6
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {influencer.experience}/10
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(influencer)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(influencer.id)}
                          className="hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
