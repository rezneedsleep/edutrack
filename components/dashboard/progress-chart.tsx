'use client'

import * as React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProgressChartProps {
  data: Array<{
    name: string
    matematika: number
    fisika: number
    kimia: number
    [key: string]: string | number
  }>
  className?: string
}

const timeFilters = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '1Y', value: '1y' },
]

const chartColors = {
  matematika: 'hsl(var(--chart-1))',
  fisika: 'hsl(var(--chart-2))',
  kimia: 'hsl(var(--chart-3))',
}

export function ProgressChart({ data, className }: ProgressChartProps) {
  const [activeFilter, setActiveFilter] = React.useState('1m')

  return (
    <div
      className={cn(
        'rounded-3xl bg-card border border-border p-6',
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-heading-3 text-foreground">Progress Belajar</h3>
          <p className="text-caption text-muted-foreground">
            Perkembangan belajar per minggu
          </p>
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
          {timeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-3 rounded-lg',
                activeFilter === filter.value &&
                  'bg-background shadow-sm'
              )}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: 16 }}
            />
            <Line
              type="monotone"
              dataKey="matematika"
              name="Matematika"
              stroke={chartColors.matematika}
              strokeWidth={2}
              dot={{ fill: chartColors.matematika, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="fisika"
              name="Fisika"
              stroke={chartColors.fisika}
              strokeWidth={2}
              dot={{ fill: chartColors.fisika, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="kimia"
              name="Kimia"
              stroke={chartColors.kimia}
              strokeWidth={2}
              dot={{ fill: chartColors.kimia, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
