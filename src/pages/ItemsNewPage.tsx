import { ReactNode, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Gradient } from "../components/Gradient"
import { Tabs } from "../components/Tabs"
import { TopNav } from "../components/TopNav"
import { useAjax } from '../lib/ajax'
import { hasError, validate } from '../lib/validate'
import { useCreateItemStore } from '../stores/useCreateItemStore'
import { Tags } from "./ItemsNewPage/Tags"
import { ItemAmount } from "./ItemsNewPage/ItemAmount"
import { ItemDate } from "./ItemsNewPage/ItemDate"
import { time } from "../lib/time"

export const ItemsNewPage: React.FC = () => {
  const { data, setData, setError } = useCreateItemStore()
  const tabItems: { key: Item['kind']; text: string; element?: ReactNode }[] = [
    {
      key: 'expenses', text: '支出',
      element: <Tags kind={data.kind!} value={data.tag_ids} onChange={(ids) => setData({ tag_ids: ids })} />
    },
    {
      key: 'income', text: '收入',
      element: <Tags kind={data.kind!} value={data.tag_ids} onChange={(ids) => setData({ tag_ids: ids })} />
    }
  ]
  const [currentItemKind] = useState<Item['kind']>('expenses')
  const { post } = useAjax({ showLoading: true, handleError: true })
  const nav = useNavigate()
  const onSubmit = async () => {
    const error = validate(data, [
      { key: 'kind', type: 'required', message: '请选择类型：收入或支出' },
      { key: 'tag_ids', type: 'required', message: '请选择一个标签' },
      { key: 'happen_at', type: 'required', message: '请选择一个时间' },
      { key: 'amount', type: 'required', message: '请输入金额' },
      { key: 'amount', type: 'notEqual', value: 0, message: '金额不能为0' },
    ])
    setError(error)
    if (hasError(error)) {
      const message = Object.values(error).flat().join('\n')
      window.alert(message)
    } else {
      await post<Resource<Item>>('/api/v1/items', data)
      setData({ amount: 0, happen_at: time().isoString })
      nav('/items', { replace: true })
    }
  }

  return (
    <div h-screen flex flex-col onSubmit={onSubmit}>
      <Gradient grow-0 shrink-0>
        <TopNav title="记一笔" icon='back' back path='/items' />
        <Tabs
          tabItems={tabItems}
          value={data.kind!}
          onChange={(tabItem) => { setData({ kind: tabItem }) }}
          className="children-flex-1 text-center"
        />
      </Gradient>
      <div grow-1 shrink-1 overflow-auto>
        {tabItems.find(item => item.key === currentItemKind)?.element}
      </div>
      <ItemAmount grow-0 shrink-0
        itemDate={<ItemDate value={data.happen_at} onChange={(happen_at) => setData({ happen_at })} />}
        value={data.amount} onChange={amount => setData({ amount })}
        onSubmit={onSubmit}
      />
    </div>
  )
}
