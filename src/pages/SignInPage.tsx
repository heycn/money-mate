import logo from '../assets/images/logo.svg'
import { useTitle } from '../hooks/useTitle'
import bottom from '../assets/images/bottom.svg'
import type { FormError } from '../lib/validate'
import { hasError, validate } from '../lib/validate'
import { useSignInStore } from '../stores/useSignInStore'
import { FormEventHandler } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAjax } from '../lib/ajax'
import { Input } from '../components/Input'
import type { AxiosError } from 'axios'
import { Icon } from '../components/Icon'

interface Props {
  title?: string
}

export const SignInPage: React.FC<Props> = props => {
  useTitle(props?.title)
  const { data, error, setData, setError } = useSignInStore()
  const nav = useNavigate()
  const { post } = useAjax({ showLoading: true })

  const onSubmitError = (err: AxiosError<{ errors: FormError<typeof data> }>) => {
    setError(err.response?.data?.errors ?? {})
    throw error
  }
  const [search] = useSearchParams()
  const from = search.get('from') || '/items'
  const onSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    const newError = validate(data, [
      { key: 'email', type: 'required', message: '没输入邮箱地址!' },
      { key: 'email', type: 'pattern', regex: /^.+@.+$/, message: '邮箱格式不正确!' },
      { key: 'code', type: 'required', message: '没输入验证码!' },
      { key: 'code', type: 'length', min: 6, max: 6, message: '验证码必须是6位!' }
    ])
    setError(newError)
    if (!hasError(newError)) {
      const response = await post<{ jwt: string }>('/api/v1/session', data).catch(onSubmitError)
      const jwt = response.data.jwt
      localStorage.setItem('jwt', jwt)
      nav(from, { replace: true })
    }
  }
  const sendSmsCode = async () => {
    const newError = validate({ email: data.email }, [
      { key: 'email', type: 'required', message: '没输入邮箱地址!' },
      { key: 'email', type: 'pattern', regex: /^.+@.+$/, message: '邮箱格式不正确!' }
    ])
    setError(newError)
    if (hasError(newError)) { throw new Error('表单出错') }
    const response = await post(
      '/api/v1/validation_codes',
      { email: data.email }
    )
    return response
  }

  return (
    <div fixed left-0 top-0 w-screen h-screen flex flex-col justify-between bg='#f6f6f6'>
      <div px-26px z="[calc(var(--z-menu))]">
        <header py-16px flex items-center text-18px color="#5eb39e">
          <Link to={from} replace>
            <Icon name='back' />
          </Link>
          <span ml-4px>返回</span>
        </header>
        <div my='1/7' text-center>
          <img h-48px src={logo} />
          <h2 pt-16px text-22px text='#5eb39e'>登录 MoneyMate</h2>
        </div>
        <form flex flex-col onSubmit={onSubmit}>
          <Input
            type="email"
            value={data.email}
            onChange={email => setData({ email })}
            error={error.email?.[0]}
          />
          <Input
            type="sms_code"
            value={data.code}
            onChange={code => setData({ code })}
            request={sendSmsCode}
            error={error.code?.[0]}
          />
          <button mt-64px m-btn type='submit'>登录</button>
        </form>
      </div>
      <img className='fixed bottom--32px left-0 w-100%' src={bottom} z="[calc(var(--z-menu)-1)]" />
    </div>
  )
}

export default SignInPage
