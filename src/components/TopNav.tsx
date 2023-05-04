import { useMenuStore } from "../stores/useMenuStore"
import { Icon } from "./Icon"
import { useNavigate } from 'react-router-dom'

type Props = {
  title?: string
  icon: string
} & (
    | { back: boolean; path: string }
    | { back?: never; path?: never }
  )

export const TopNav: React.FC<Props> = ({ title = 'MoneyMate', icon, back = false, path }) => {
  const { setVisible } = useMenuStore()
  const nav = useNavigate()
  const onClick = () => {
    (back && path) ? nav(path, { replace: true }) : setVisible(true)
  }
  return (
    <div text='#73b19f' flex items-center py-16px>
      <Icon name={icon} className="color-#73b19f h-28px w-28px"
        onClick={onClick} />
      <h1 text-18px font-700 w='100%' mr-24px text-center>{title}</h1>
    </div>
  )
}