import Head from 'next/head'
import Image from 'next/image'

interface Klasse {
  title: string
  content: { id: number; title: string }[]
}

const data: Klasse[] = [
  {
    title: '8. Klasse',
    content: [
      { id: 66809, title: 'Aufgaben zum Dreisatz' },
      { id: 66810, title: 'Aufgaben zum Dreisatz' },
      { id: 66811, title: 'Aufgaben zum Dreisatz' },
    ],
  },
]

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
        <h1 className="mt-4 border-b-2 border-blue-300 pb-2 text-center text-4xl">
          Seto
        </h1>
        <div className="mt-2 text-center text-lg italic">
          Gemeinsam Üben zum Erfolg
        </div>
        {data.map((entry, i) => (
          <div key={i} className="mx-auto mt-12">
            <h2 className="text-xl font-bold">{entry.title}</h2>
            <div className="flex flex-wrap">
              {entry.content.map((folder) => (
                <div
                  className="mr-5 mt-8 h-[100px] w-[280px] cursor-pointer rounded border border-blue-300 p-4 hover:bg-gray-100"
                  key={folder.id}
                >
                  <h3>{folder.title}</h3>
                </div>
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
