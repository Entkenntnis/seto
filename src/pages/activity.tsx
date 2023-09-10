import clsx from 'clsx'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import TimeAgo from 'timeago-react'
import * as timeago from 'timeago.js'
import de from 'timeago.js/lib/lang/de'

import { ResponseData } from './api/frontend/highscore'

timeago.register('de', function (number, index, total_sec) {
  // Convert weeks to days.
  if ([8, 9].includes(index) && total_sec) {
    const days = Math.round(total_sec / (60 * 60 * 24))
    return ['vor ' + days + ' Tagen', '...']
  }
  return de(number, index)
})

export default function Activity() {
  const [data, setData] = useState<ResponseData['data']>([])

  useEffect(() => {
    void (async () => {
      const res = await fetch('/api/frontend/highscore')
      const { data } = (await res.json()) as ResponseData
      data.sort((a, b) => b.lastActive - a.lastActive)
      setData(data)
    })()
    // only on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>Neuste Aktivität</title>
      </Head>
      <div className="mx-auto max-w-[600px]">
        <h1 className="serlo-h1">Neuste Aktivität</h1>
        <Link href="/" className="serlo-link mx-side my-8 block">
          zurück
        </Link>
        {data.length === 0 ? (
          <p>Daten werden geladen ...</p>
        ) : (
          <>
            <table className="mt-8 w-full table-auto">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>gelöste Aufgaben</th>
                  <th>zuletzt aktiv</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, i) => (
                  <tr key={i} className={clsx('border-t-2')}>
                    <td className="p-2 text-center">
                      <span>{entry.name ? entry.name : '---'}</span>
                    </td>
                    <td className="p-2 text-center font-bold">
                      {entry.solved.length}
                    </td>
                    <td className="p-2 text-center">
                      <TimeAgo
                        datetime={entry.lastActive}
                        live={false}
                        locale="de"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  )
}
