import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { data } from '@/data/seto'

export default function Index() {
  return (
    <>
      <Head>
        <title>Seto</title>
      </Head>
      <div className="mx-auto max-w-[900px]">
        <Image
          src="/header.jpg"
          alt="Bild von einem Kloster in Nepal"
          width={1101}
          height={263}
        />
        <h1 className="mt-4 border-b-2 border-brand pb-2 text-center text-4xl">
          Seto
        </h1>
        {data.map((entry, i) => (
          <div key={i} className="mx-auto mt-12">
            <h2 className="ml-4 text-xl font-bold">{entry.title}</h2>
            <div className="flex flex-wrap">
              {entry.content.map((folder) => (
                <Link
                  key={folder.id}
                  href={`/${folder.id}`}
                  className="mr-5 mt-8 block h-[100px] w-[280px] cursor-pointer select-none rounded-xl bg-gray-100 p-4 hover:bg-gray-200 hover:no-underline"
                >
                  <h3>{folder.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-[300px]">
          Footer: Impressum - Datenschutzerklärung. Alle Inhalte CC BY SA von
          Serlo.org
        </div>
      </div>
    </>
  )
}
