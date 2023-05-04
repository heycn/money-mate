import { useState } from "react"
import { AddItemFloatButton } from "../components/AddItemFloatButton"
import { TimeRangePicker, TimeRange } from "../components/TimeRangePicker"
import { Time, time } from '../lib/time'
import { TopNav } from "../components/X"
import { ItemsList } from "./ItemsPage/ItemsList"
import { ItemsSummary } from "./ItemsPage/ItemsSummary"
import { useTitle } from "../hooks/useTitle"
import { useMenuStore } from "../stores/useMenuStore"
import { TopMenu } from "../components/TopMenu"
import { Gradient } from "../components/Gradient"

interface Props {
  title?: string
}

export const ItemsPage: React.FC<Props> = ({ title }) => {
  const [currentTimeRange, _setCurrentTimeRange] = useState<TimeRange>({
    name: 'thisMonth',
    start: time().firstDayOfMonth,
    end: time().lastDayOfMonth.add(1, 'day')
  })
  const [outOfRange, setOutOfRange] = useState(false)
  const setCurrentTimeRange = (t: TimeRange) => {
    if (t.start.timestamp > t.end.timestamp) {
      [t.start, t.end] = [t.end, t.start]
    }
    if (t.end.timestamp - t.start.timestamp > Time.DAY * 365) {
      setOutOfRange(true)
    } else {
      setOutOfRange(false)
    }
    _setCurrentTimeRange(t)
  }
  const { visible, setVisible } = useMenuStore()
  const { start, end } = currentTimeRange
  useTitle(title)

  return (
    <div h-screen>
      <Gradient>
        <TopNav title={title} icon="menu" />
        <TimeRangePicker currentTimeRange={currentTimeRange} onChange={setCurrentTimeRange} />
      </Gradient>
      {outOfRange
        ? <div text-center p-32px>
          自定义时间跨度不能超过 365 天
        </div>
        : <>
          <ItemsSummary start={start} end={end} />
          <ItemsList start={start} end={end} />
        </>
      }
      <AddItemFloatButton />
      <TopMenu visible={visible} onClickMask={() => setVisible(false)} />
    </div>
  )
}
