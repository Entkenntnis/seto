const key = 'seto_main_storage'

export interface StorageData {
  name?: string
  solved: number[]
  percentage: { [key: number]: number }
}

export function setUserName(name: string) {
  const data = getData()
  data.name = name
  setData(data)
}

export function getUserName() {
  const data = getData()
  return data.name
}

export function setSolved(id: number) {
  const data = getData()
  if (!data.solved.includes(id)) {
    data.solved.push(id)
  }
  setData(data)
}

export function isSolved(id: number) {
  if (typeof window === 'undefined') return false
  const data = getData()
  return data.solved.includes(id)
}

export function getData() {
  const rawLoc = localStorage.getItem(key)
  const rawSes = sessionStorage.getItem(key)

  const defaultData: StorageData = { solved: [], percentage: {} }

  return JSON.parse(
    rawLoc ?? rawSes ?? JSON.stringify(defaultData)
  ) as StorageData
}

function setData(data: StorageData) {
  const rawLoc = localStorage.getItem(key)
  if (rawLoc) {
    localStorage.setItem(key, JSON.stringify(data))
  } else {
    sessionStorage.setItem(key, JSON.stringify(data))
  }
}

export function reset() {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

export function setPercentage(topic: number, percentage: number) {
  const data = getData()
  data.percentage[topic] = percentage
  setData(data)
}
