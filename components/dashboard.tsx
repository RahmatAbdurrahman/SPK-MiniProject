"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, Award, DollarSign, Star, Eye } from "lucide-react"
import { PieChart } from "@/components/charts/pie-chart"
import { BarChart } from "@/components/charts/bar-chart"

const stats = [
  {
    title: "Total Influencer",
    value: "24",
    change: "+12%",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Rata-rata Engagement",
    value: "4.2%",
    change: "+0.8%",
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Budget Tersedia",
    value: "Rp 50M",
    change: "-15%",
    icon: DollarSign,
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Skor Tertinggi",
    value: "0.89",
    change: "+5%",
    icon: Award,
    color: "from-orange-500 to-orange-600",
  },
]

const topInfluencers = [
  { name: "Sarah Fashion", score: 0.89, followers: "2.1M", engagement: "5.2%" },
  { name: "Maya Style", score: 0.85, followers: "1.8M", engagement: "4.8%" },
  { name: "Rina Boutique", score: 0.82, followers: "1.5M", engagement: "4.5%" },
  { name: "Lisa Trend", score: 0.78, followers: "1.2M", engagement: "4.1%" },
  { name: "Nina Fashion", score: 0.75, followers: "980K", engagement: "3.9%" },
]

export function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div
                className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
                dari bulan lalu
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Criteria Distribution */}
        <Card className="animate-in slide-in-from-left duration-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Distribusi Bobot Kriteria
            </CardTitle>
            <CardDescription>Persentase bobot setiap kriteria dalam penilaian</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart />
          </CardContent>
        </Card>

        {/* Top Influencers */}
        <Card className="animate-in slide-in-from-right duration-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Top 5 Influencer
            </CardTitle>
            <CardDescription>Ranking berdasarkan skor SAW tertinggi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topInfluencers.map((influencer, index) => (
              <div
                key={influencer.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                        : index === 1
                          ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                          : index === 2
                            ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                            : "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{influencer.name}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {influencer.followers}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {influencer.engagement}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {influencer.score}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution Chart */}
      <Card className="animate-in slide-in-from-bottom duration-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Distribusi Skor Influencer
          </CardTitle>
          <CardDescription>Perbandingan skor akhir semua influencer</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart />
        </CardContent>
      </Card>

      {/* Criteria Weights */}
      <Card className="animate-in slide-in-from-bottom duration-700" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle>Bobot Kriteria SAW</CardTitle>
          <CardDescription>Konfigurasi bobot untuk setiap kriteria penilaian</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">C1 - Jumlah Followers</span>
              <span className="text-sm text-muted-foreground">20%</span>
            </div>
            <Progress value={20} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">C2 - Engagement Rate</span>
              <span className="text-sm text-muted-foreground">30%</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">C3 - Kesesuaian Brand</span>
              <span className="text-sm text-muted-foreground">25%</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">C4 - Biaya Endorse</span>
              <span className="text-sm text-muted-foreground">15%</span>
            </div>
            <Progress value={15} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">C5 - Pengalaman Endorse</span>
              <span className="text-sm text-muted-foreground">10%</span>
            </div>
            <Progress value={10} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
