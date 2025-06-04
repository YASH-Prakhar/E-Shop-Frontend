"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ProductFiltersProps {
  category: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { value: "", label: "All Categories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Sports", label: "Sports" },
  { value: "Home", label: "Home" },
  { value: "Fashion", label: "Fashion" },
  { value: "Books", label: "Books" },
]

export function ProductFilters({ category, onCategoryChange }: ProductFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Category</h3>
          <RadioGroup value={category} onValueChange={onCategoryChange}>
            {categories.map((cat) => (
              <div key={cat.value} className="flex items-center space-x-2">
                <RadioGroupItem value={cat.value} id={cat.value} />
                <Label htmlFor={cat.value} className="text-sm">
                  {cat.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
