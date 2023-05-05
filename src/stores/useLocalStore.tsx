import create from 'zustand'

interface LocalStore {
  hasReadFeatures: boolean
  setReadFeatures: (read: boolean) => void
}

const init = localStorage.getItem('hasReadFeatures')

export const useLocalStore = create<LocalStore>((set, get) => ({
  hasReadFeatures: init === 'read',
  setReadFeatures: read => {
    const result = read ? 'read' : 'not-read'
    localStorage.setItem('hasReadFeatures', result)
    set({ hasReadFeatures: result === 'read' })
  }
}))
