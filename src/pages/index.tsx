import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { FrontendClientBase } from '@/components/frontend-client-base'
import { data } from '@/data/seto'
import { reset } from '@/seto/storage'
import { useStorageData } from '@/seto/storage-context'

export default function Index() {
  return (
    <>
      <FrontendClientBase noContainers noHeaderFooter>
        <Head>
          <title>Seto</title>
        </Head>
        <Content />
      </FrontendClientBase>
    </>
  )
}

function Content() {
  const storage = useStorageData()

  return (
    <div className="mx-auto max-w-[800px]">
      <Image
        src="/header.jpg"
        alt="Bild von einem Kloster in Nepal"
        width={1101}
        height={263}
      />
      <h1 className="mt-4 border-b-2 border-brand pb-2 text-center text-4xl">
        Seto
      </h1>

      <div className="mx-4 mt-8 flex justify-between">
        {storage.data?.name ? (
          <span>
            Hallo <strong>{storage.data.name}</strong>, du hast bisher{' '}
            <strong>{storage.data.solved.length}</strong>{' '}
            {storage.data.solved.length === 1 ? 'Aufgabe' : 'Aufgaben'} gelöst.
          </span>
        ) : (
          <span></span>
        )}

        <span>
          <button
            className="font-bold hover:underline"
            onClick={() => {
              alert('Die Funktion kommt bald.')
            }}
          >
            Highscore
          </button>
          <button
            className="ml-12 font-bold hover:underline"
            onClick={() => {
              alert('Die Funktion kommt bald.')
            }}
          >
            neuste Aktivität
          </button>
        </span>
      </div>
      {data.map((entry, i) => (
        <div key={i} className="mx-auto mt-24">
          <h2 className="ml-4 text-xl font-bold">{entry.title}</h2>
          <div className="flex flex-wrap">
            {entry.content.map((folder) => (
              <Link
                key={folder.id}
                href={`/${folder.id}`}
                className="mr-5 mt-8 block flex h-[100px] w-[280px] cursor-pointer select-none flex-col justify-between rounded-xl bg-gray-100 p-4 hover:bg-gray-200 hover:no-underline"
              >
                <h3>{folder.title}</h3>
                {storage.data.percentage[folder.id] ? (
                  <div className="text-right text-brandgreen">
                    {storage.data.percentage[folder.id]}% Fortschritt
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      ))}
      <div className="mb-4 ml-4 mt-[300px]">
        <a
          href="https://hack.arrrg.de/contact"
          target="_blank"
          rel="noreferrer"
          className="serlo-link"
        >
          Impressum
        </a>{' '}
        -{' '}
        <Link href="/privacy" className="serlo-link">
          Datenschutzerklärung
        </Link>{' '}
        - Alle Inhalte{' '}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          className="hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          CC BY-SA 4.0
        </a>{' '}
        @{' '}
        <a
          href="https://de.serlo.org/mathe"
          className="hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          de.serlo.org
        </a>{' '}
        -{' '}
        <button
          className="transition-colors hover:text-red-500 hover:underline"
          onClick={() => {
            const res = confirm('Fortschritt jetzt zurücksetzen?')
            if (res) {
              reset()
              storage.update()
            }
          }}
        >
          Fortschritt zurücksetzen
        </button>
      </div>
    </div>
  )
}
