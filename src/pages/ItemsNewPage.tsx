import { ReactNode, useState } from "react"
import { Gradient } from "../components/Gradient"
import { Tabs } from "../components/Tabs"
import { TopNav } from "../components/TopNav"
import { Tags } from "./ItemsNewPage/Tags"
import { DateAndAmount } from "./ItemsNewPage/DateAndAmount"

export const ItemsNewPage: React.FC = () => {
  const tabItems: { key: Item['kind']; text: string, element?: ReactNode }[] = [
    { key: 'expense', text: '支出', element: <Tags kind='expense' /> },
    { key: 'income', text: '收入', element: <Tags kind='income' /> }
  ]
  const [currentItemKind, setCurrentItemKind] = useState<Item['kind']>('expense')

  return (
    <div h-screen flex flex-col>
      <Gradient grow-0 shrink-0>
        <TopNav title="记一笔" icon='back' />
        <Tabs
          tabItems={tabItems}
          value={currentItemKind}
          onChange={setCurrentItemKind}
          className="children-flex-1 text-center"
        />
      </Gradient>
      <div grow-1 shrink-1 overflow-auto>
        {tabItems.find(item => item.key === currentItemKind)?.element}
      </div>
      <DateAndAmount grow-0 shrink-0 />
    </div>
  )
}