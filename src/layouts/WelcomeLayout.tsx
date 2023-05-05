import { animated, useTransition } from '@react-spring/web'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Pathname, useNavigate } from 'react-router-dom'
import { Link, useLocation, useOutlet } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import { useSwipe } from '../hooks/useSwipe'
import { useLocalStore } from '../stores/useLocalStore'

const nextLinkMap: Record<Pathname, Pathname> = {
  '/welcome/1': '/welcome/2',
  '/welcome/2': '/welcome/3',
  '/welcome/3': '/welcome/4',
  '/welcome/4': '/items'
}
const prevLinkMap: Record<Pathname, Pathname> = {
  '/welcome/2': '/welcome/1',
  '/welcome/3': '/welcome/2',
  '/welcome/4': '/welcome/3'
}

export const WelcomeLayout: React.FC = () => {
  const animating = useRef(false)
  const map = useRef<Record<string, ReactNode>>({})
  const { pathname } = useLocation()
  const outlet = useOutlet()
  map.current[pathname] = outlet
  const [extraStyle, setExtraStyle] = useState<{ position: 'relative' | 'absolute' }>({ position: 'relative' })

  const swipeDiv = useRef<HTMLDivElement>(null)
  const direction = useSwipe(swipeDiv, { onTouchStart: e => e.preventDefault() })
  const transitionRef = useRef({})
  const transitionConfig = useMemo(() => {
    const translateX = direction === 'right' ? -100 : 100
    const first = pathname === '/welcome/1' && direction === ''
    transitionRef.current = {
      from: { opacity: first ? 1 : 0, transform: `translateX(${first ? 0 : translateX}%)` },
      enter: { opacity: 1, transform: 'translateX(0%)' },
      leave: { opacity: 0, transform: `translateX(${-translateX / 2}%)`, },
      config: { duration: 350 },
      onStart: () => setExtraStyle({ position: 'absolute' }),
      onRest: () => {
        animating.current = false
        setExtraStyle({ position: 'relative' })
      }
    }
    return transitionRef.current
  }, [direction, pathname])
  const transitions = useTransition(pathname, { ...transitionConfig })
  const { setReadFeatures } = useLocalStore()
  const onSkip = () => { setReadFeatures(true) }

  const nav = useNavigate()
  useEffect(() => {
    if (direction === 'left') {
      if (animating.current) { return }
      animating.current = true
      nav(nextLinkMap[pathname], { replace: true })
    }
    if (direction === 'right') {
      if (animating.current) { return }
      if (pathname === '/welcome/1') return
      animating.current = true
      nav(prevLinkMap[pathname], { replace: true })
    }
  }, [direction])

  return (
    <div h-screen flex flex-col items-stretch bg='#ebf5f6' bg-gradient='to-br from-#addcd4'>
      <header shrink-0 mb-32px>
        <p align-revert flex justify-end p-32px>
          <Link to="/items" replace onClick={onSkip} rounded-18px b-1 px-8px py-4px text='#0000003a' b-solid>
            跳过并不再显示
          </Link>
        </p>
        <div text-center>
          <img src={logo} h-40px />
          <h1 text='#5db29e' >Money Mate</h1>
        </div>
      </header>
      <main shrink-1 grow-1 relative w-full mb-164px overflow-hidden ref={swipeDiv}>
        {transitions((style, pathName) =>
          <animated.div key={pathName} style={{ ...style, ...extraStyle }}
            flex justify-center items-center w="100%" h="100%">
            {map.current[pathName]}
          </animated.div>
        )}
      </main>
      <footer fixed bottom-0 left-0 h="1/7" w-screen text-center text-24px>
        <Link to={nextLinkMap[pathname]} replace rounded-32px text='#73b19f'>
          {((pathname !== '/welcome/4') && '下一页') || '去记账'}
        </Link>
      </footer>
    </div>
  )
}
