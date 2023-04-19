import logo from '../assets/images/logo.svg'
import { useTitle } from '../hooks/useTitle'
import bottom from '../assets/images/bottom.svg'
import { Icon } from '../components/Icon'
import { useSignInStore } from '../stores/useSignInStore'
import { FormEventHandler } from 'react'

interface Props {
  title?: string
}
const emailConfig = { placeholder: '请输入邮箱', type: 'email', autoComplete: "off" }
const codeConfig = { type: 'text', maxLength: 6, autoComplete: "off", placeholder: '输入验证码' }

export const SignInPage: React.FC<Props> = props => {
  const { data, setData } = useSignInStore()
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log(data)
  }

  useTitle(props?.title)

  return (
    <div fixed left-0 top-0 w-screen h-screen flex flex-col justify-between bg='#f6f6f6'>
      <div px-26px z="[calc(var(--z-menu))]">
        <div my='1/7' text-center>
          <img h-48px src={logo} />
          <h2 pt-16px text-22px text='#5eb39e'>登陆 MoneyMate</h2>
        </div>
        <form flex flex-col onSubmit={onSubmit}>
          <div form-item-sing-in>
            <Icon className='w-24px h-24px' name='menu' />
            <input {...emailConfig} w-full input-sign-in
              value={data.email} onChange={e => setData({ email: e.target.value })}
            />
          </div>
          <div pt-16px form-item-sing-in>
            <Icon className='w-24px h-24px' name='menu' />
            <input {...codeConfig} input-sign-in
              value={data.code} onChange={e => setData({ code: e.target.value })}
            />
            <button send-code>发送验证码</button>
          </div>
          <button mt-64px m-btn type='submit'>登录</button>
        </form>
      </div>
      <img className='fixed bottom--32px left-0 w-100%' src={bottom} z="[calc(var(--z-menu)-1)]" />
    </div>
  )
}
