import { Datepicker } from "../../components/Datepicker";
import { Icon } from "../../components/Icon"
import { time } from "../../lib/time";
import { usePopup } from "../../hooks/usePopup";

type Props = {
  value?: string | Date
  onChange?: (date: string) => void
}

export const ItemDate: React.FC<Props> = props => {
  const { value, onChange } = props
  const { toggle, popup, hide } = usePopup({
    children: <Datepicker
      onConfirm={d => { onChange?.(time(d).isoString); hide() }}
      onCancel={() => hide()} />
  })

  return (
    <>
      {popup}
      <span flex items-center gap-x-8px onClick={toggle} >
        <Icon name="calendar" className="w-20px h-20px grow-0 shrink-0" />
        <span grow-0 shrink-0>{time(value).format('yyyy-MM-dd HH:mm')}</span>
      </span>
    </>
  )
}
