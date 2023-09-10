import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/helper/prisma'

export interface ResponseData {
  data: {
    name: string
    solved: number[]
    lastActive: number
  }[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const data = await prisma.eventLog.findMany()

  const sessions = data.reduce((res, obj) => {
    const key = obj.sessionId
    const entry = (res[key] = res[key] || { solved: new Set(), ts: -1 })
    try {
      if (obj.event.startsWith('setname_')) {
        const name = obj.event.substring(8)
        entry.name = name
      } else if (obj.event.startsWith('solved_')) {
        const id = parseInt(obj.event.substring(7))
        entry.solved.add(id)
      }
      const ts = obj.timestamp.getTime()
      if (ts > entry.ts) {
        entry.ts = ts
      }
    } catch (e) {
      //
    }
    return res
  }, {} as { [key: string]: { name?: string; solved: Set<number>; ts: number } })

  const values = Object.values(sessions).filter(
    (val) => val.name && val.ts > 0 && val.solved.size > 0
  )

  values.sort((a, b) => {
    if (a.solved.size === b.solved.size) {
      return b.ts - a.ts
    } else {
      return b.solved.size - a.solved.size
    }
  })

  res.status(200).json({
    data: values.map((v) => ({
      name: v.name!,
      solved: Array.from(v.solved),
      lastActive: v.ts,
    })),
  })
}
