import useSWRInfinite from 'swr/infinite'
import { useAjax } from '../../lib/ajax'
import { Loading } from '../../components/Loading'
import { Time, time } from '../../lib/time'

interface Props {
  start: Time
  end: Time
}

const Tips: React.FC<{ text: string }> = ({ text }) => {
  return <p text-center font-300 color='#999'>
    -
    <span px-16px>{text}</span>
    -
  </p>
}

export const ItemsList: React.FC<Props> = (props) => {
  const { start, end } = props
  const { get } = useAjax()
  const getKey = (pageIndex: number, prev: Resources<Item>) => {
    if (prev) {
      const sendCount = (prev.pager.page - 1) * prev.pager.per_page + prev.resources.length
      const count = prev.pager.count
      if (sendCount >= count) { return null }
    }
    return `/api/v1/items?page=${pageIndex + 1}&`
      + `happened_after=${start.removeTime().isoString}&`
      + `happened_before=${end.removeTime().isoString}`
  }
  const { data, error, size, setSize } = useSWRInfinite(
    getKey,
    async path => (await get<Resources<Item>>(path)).data,
    { revalidateAll: true }
  )

  const onLoadMore = () => setSize(size + 1)
  const isLoadingInitialData = !data && !error
  const isLoadingMore = data?.[size - 1] === undefined && !error
  const isLoading = isLoadingInitialData || isLoadingMore

  if (!data) {
    return <div>
      {error && <Tips text='加载失败 请刷新页面' />}
      {isLoading && <Loading />}
    </div>
  } else {
    const last = data[data.length - 1]
    const { page, per_page, count } = last.pager
    const hasMore = (page - 1) * per_page + last.resources.length < count
    return <>
      <ol px-16px>
        {data.map(({ resources }) => {
          return resources.map(item => (
            <li key={item.id} flex px-4 justify-between py-1 bg-white rounded-6px mb-8px items-center>
              <div flex>
                <div text-36px mr-8px>😘</div>
                <div flex flex-col justify-center py-8px>
                  <div text='#333'>
                    {item.tags?.[0].name}
                  </div>
                  <div text='#999' text-12px font-300 pt-1>
                    {time(item.happen_at).format('yyyy-MM-dd HH:mm')}
                  </div>
                </div>
              </div>
              <div style={{ color: item.kind === 'expenses' ? '#e77975' : '##70a3f3' }} text-18px font-500>
                {item.kind === 'expenses' ? '-' : '+'}{item.amount / 100}
              </div>
            </li>
          ))
        })}
      </ol>
      <div px-16px pt-24px pb-64px>
        {error && <Tips text='加载失败 请刷新页面' />}
        {!hasMore
          ? <Tips text={data[0].pager.count === 0 ? '所选范围 暂无记录' : 'The End'} />
          : isLoading
            ? <Loading />
            : <button m-btn onClick={onLoadMore}>加载更多</button>
        }
      </div>
    </>
  }
}
