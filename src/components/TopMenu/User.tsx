import { Link, useLocation } from 'react-router-dom'
import useSWR from 'swr'
import { useAjax } from '../../lib/ajax'
import logo from '../../assets/images/logo.svg'

interface Props {
  className?: string
}

export const User: React.FC<Props> = ({ className }) => {
  const { get } = useAjax({ showLoading: false, handleError: false })
  const { data: me, error } = useSWR('/api/v1/me', async (path) =>
    (await get<Resource<User>>(path)).data.resource
  )
  const name = me?.name ?? me?.email
  const loc = useLocation()
  const from = encodeURIComponent(`${loc.pathname}${loc.search}`)

  return (
    error
      ? <Link to={`/sign_in?from=${from}`} replace w="100%" className={className} mt-24px flex mb-32px>
        <img src={logo} w-48px ml-4px mr-16px />
        <div flex flex-col justify-between>
          <h1 text-22px text='#181818' font-500 mb-4px>MoneyMate</h1>
          <p text-15px text="#666" font-300>触手可得的记账伴侣</p>
        </div>
      </Link>
      : <div block w="100%" className={className} mt-24px flex mb-32px>
        <img src={logo} w-48px ml-4px mr-16px />
        <div flex flex-col justify-between>
          <h1 text-20px text='#181818' font-500 mb-4px title={name} overflow-hidden text-ellipsis max-w-180px>{name}</h1>
          <p text-15px text="#666" font-300>触手可得的记账伴侣</p>
        </div>
      </div>
  )
}
