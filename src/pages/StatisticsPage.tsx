import { useEffect, useState } from "react"
import useSWR from 'swr'
import { Gradient } from "../components/Gradient"
import { TimeRangePicker, TimeRange } from "../components/TimeRangePicker.tsx"
import { TopNav } from "../components/TopNav"
import { useTitle } from "../hooks/useTitle"
import { LineChart } from "../components/LineChart"
import { PieChart } from "../components/PieChart"
import { RankChart } from "../components/RankChart"
import { Input } from "../components/Input"
import { useAjax } from '../lib/ajax'
import { time } from '../lib/time'

type Props = {
  title?: string
}

type Groups = { happen_at: string; amount: number }[]

export const StatisticsPage: React.FC<Props> = ({ title }) => {
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeRange>('thisMonth')
  useTitle(title)
  const [kind, setKind] = useState('expenses')
  const { get } = useAjax({ showLoading: false, handleError: true })

  const generateStartAndEnd = () => {
    if (currentTimeRange === 'thisMonth') {
      const start = time().firstDayOfMonth.format('yyyy-MM-dd')
      const end = time().lastDayOfMonth.add(1, 'day').format('yyyy-MM-dd')
      return { start, end }
    } else {
      return { start: '', end: '' }
    }
  }
  const { start, end } = generateStartAndEnd()
  const { data: items } = useSWR(`/api/v1/items/summary?happened_after=${start}&happened_before=${end}&kind=${kind}&group_by=happen_at`,
    async (path) =>
      (await get<{ groups: Groups; total: number }>(path)).data.groups
        .map(({ happen_at, amount }) => ({ x: happen_at, y: amount }))
  )
  useEffect(() => {
    console.log(items)
  }, [items])

  const items2 = [
    { tag: { name: '吃饭', sign: '😨' }, amount: 10000 },
    { tag: { name: '打车', sign: '🥱' }, amount: 20000 },
    { tag: { name: '买皮肤', sign: '💖' }, amount: 68800 },
  ].map(item => ({ x: item.tag.name, y: item.amount / 100 }))
  const items3 = [
    { tag: { name: '吃饭', sign: '😨' }, amount: 10000 },
    { tag: { name: '打车', sign: '🥱' }, amount: 20000 },
    { tag: { name: '买皮肤', sign: '💖' }, amount: 68800 },
  ].map(item => ({ name: item.tag.name, value: item.amount, sign: item.tag.sign }))

  return (
    <div>
      <Gradient>
        <TopNav title={title} icon="back" />
        <TimeRangePicker
          currentTimeRange={currentTimeRange}
          onChange={setCurrentTimeRange}
          timeRanges={[
            { key: 'thisMonth', text: '本月' },
            { key: 'lastMonth', text: '上月' },
            { key: 'twoMonthsAgo', text: '两个月前' },
            { key: 'threeMonthsAgo', text: '三个月前' },
          ]}
        />
      </Gradient>
      <div flex p-16px items-center gap-x-16px>
        <span grow-0 shrink-0>类型</span>
        <div grow-1 shrink-1>
          <Input
            type="select"
            options={[
              { text: '支出', value: 'expenses' },
              { text: '收入', value: 'income' }
            ]}
            value={kind} onChange={value => setKind(value)}
          />
        </div>
      </div>
      <div>{currentTimeRange}</div>
      <LineChart className="h-120px" items={items} />
      <PieChart className="h-260px m-t-16px" items={items2} />
      <RankChart className="m-t-8px" items={items3} />
    </div>
  )
}
