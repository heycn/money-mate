import { Outlet, createHashRouter } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { Root } from '../components/Root'
import { WelcomeLayout } from '../layouts/WelcomeLayout'
import { Welcome1 } from '../pages/Welcome1'
import { Welcome2 } from '../pages/Welcome2'
import { Welcome3 } from '../pages/Welcome3'
import { Welcome4 } from '../pages/Welcome4'
import { ItemsPageError } from '../pages/ItemsPageError'
import { ErrorUnauthorized } from '../errors'
import { ErrorPage } from '../pages/ErrorPage'
import { ajax } from '../lib/ajax'
import { Suspense, lazy } from 'react'
import { Loading } from '../components/Loading'

const Home = lazy(() => import('../pages/Home'))
const SignInPage = lazy(() => import('../pages/SignInPage'))
const ItemsPage = lazy(() => import('../pages/ItemsPage'))
const ItemsNewPage = lazy(() => import('../pages/ItemsNewPage'))
const TagsNewPage = lazy(() => import('../pages/TagsNewPage'))
const TagsEditPage = lazy(() => import('../pages/TagsEditPage'))
const StatisticsPage = lazy(() => import('../pages/StatisticsPage'))

type S = {
  children: React.ReactNode
}
const S: React.FC<S> = ({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>

export const router = createHashRouter([
  { path: '/', element: <Root /> },
  { path: '/home', element: <S><Home title='首页' /></S> },
  {
    path: '/welcome',
    element: <WelcomeLayout />,
    children: [
      { path: '1', element: <Welcome1 /> },
      { path: '2', element: <Welcome2 /> },
      { path: '3', element: <Welcome3 /> },
      { path: '4', element: <Welcome4 /> }
    ]
  },
  { path: '/sign_in', element: <S><SignInPage title='登录' /></S> },
  {
    // 放在这里的路由全部都需要登录
    path: '/',
    element: <Outlet />,
    errorElement: <ErrorPage />,
    loader: async () => {
      return await ajax.get<Resource<User>>('/api/v1/me').catch(e => {
        if (e.response?.status === 401) { throw new ErrorUnauthorized }
        throw e
      })
    },
    children: [
      {
        path: '/items',
        element: <S><ItemsPage /></S>,
        errorElement: <ItemsPageError />,
        loader: async () => {
          const onError = (error: AxiosError) => {
            if (error.response?.status === 401) { throw new ErrorUnauthorized() }
            throw error
          }
          await ajax.get<Resources<Item>>('/api/v1/items?page=1').catch(onError)
        }
      },
      { path: '/items/new', element: <S><ItemsNewPage /></S> },
      { path: '/tags', element: <div>标签</div> },
      { path: '/tags/new', element: <S><TagsNewPage /></S> },
      { path: '/tags/:id', element: <S><TagsEditPage /></S> },
      { path: '/statistics', element: <S><StatisticsPage title='统计' /></S> },
      { path: '/export', element: <div>敬请期待</div> },
      { path: '/noty', element: <div>敬请期待</div> },
    ]
  }
])
