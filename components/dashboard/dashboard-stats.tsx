"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import { ordersApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Package, Clock, CheckCircle } from "lucide-react"

export function DashboardStats() {
  const { user } = useAuth()

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => ordersApi.getOrders(user?.id),
    enabled: !!user,
  })

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Shipped",
      value: orders.filter((o) => o.status === "shipped").length,
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Delivered",
      value: orders.filter((o) => o.status === "delivered").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
