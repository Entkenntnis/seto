import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/helper/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { event, sessionId } = req.body

    if (
      typeof event === 'string' &&
      typeof sessionId === 'string' &&
      sessionId.length < 64 &&
      event.length < 64
    ) {
      await prisma.eventLog.create({
        data: { event, sessionId },
      })
      res.send('ok')
      return
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    // console.log(e)
  }
  res.send('bad')
}
