import React from 'react'
import { usePopup } from '../../hooks/usePopup'
import { time } from '../../lib/time'
import { Datepicker } from '../Datepicker'

type Props = {
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
}
export const DateInput: React.FC<Props> = (props) => {
  const { value, onChange, placeholder } = props
  const { toggle, popup, hide } = usePopup({
    children: <Datepicker
      onConfirm={d => { onChange?.(time(d).isoString); hide() }}
      onCancel={() => hide()}
    />
  })

  return (
    <>
      {popup}
      <input className=" focus:bg-#00000004 focus:b-1 focus:b-solid focus:b-#73b19f placeholder-color-#0003"
        bg="#00000009" text-center b-1 b-transparent p-y-4px p-x-12px min-h-48px leading-24px text-16px font-bold
        type="text" readOnly data-xxxx w-full rounded-8px color="#303133"
        placeholder={placeholder} value={time(value).format()} onClick={toggle}
      />
    </>
  )
}