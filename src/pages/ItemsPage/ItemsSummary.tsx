import useSWR from 'swr'
import { useAjax } from '../../lib/ajax'
import type { Time } from '../../lib/time'
type Props = {
  start: Time
  end: Time
}
export const ItemsSummary: React.FC<Props> = (props) => {
  const { start, end } = props
  const { get } = useAjax({ showLoading: false, handleError: false })
  const { data } = useSWR(start && end && `/api/v1/items/balance?happened_after=${start.isoString}&happened_before=${end.isoString}`, async (path) =>
    (await get<{ balance: number; expenses: number; income: number }>(path)).data
  )
  const { balance, expenses, income } = data ?? { balance: 0, expenses: 0, income: 0 }
  return (
    <ol bg-white flex justify-between items-center mx-16px my-24px rounded-10px py-5 px-8
      text-center color='#999' shadow-lg shadow-light-7>
      <li>
        <div color-blue font-500 text-22px>
          <span text-12px pr-2px font-mono>¥</span>
          {income / 100}
        </div>
        <div>收入</div>
      </li>
      <span font-300>|</span>
      <li>
        <div color-red font-500 text-22px>
          <span text-12px pr-2px font-mono>¥</span>
          {expenses / 100}
        </div>
        <div>支出</div>
      </li>
      <span font-300>|</span>
      <li>
        <div color='#666' font-500 text-22px>
          <span text-12px pr-2px font-mono>¥</span>
          {balance / 100}
        </div>
        <div>结余</div>
      </li>
    </ol>
  )
}
