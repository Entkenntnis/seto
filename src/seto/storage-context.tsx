import { createContext, useContext } from 'react'

import { StorageData } from './storage'

interface StorageContextData {
  data: StorageData
  update: () => void
  triggerUsed: boolean
}

export const StorageContext = createContext<StorageContextData | null>(null)

export const StorageContextProvider = StorageContext.Provider

export function useStorageData() {
  const ctx = useContext(StorageContext)
  if (!ctx) {
    return { data: { solved: [] }, update: () => {}, triggerUsed: false }
  }
  return ctx
}
