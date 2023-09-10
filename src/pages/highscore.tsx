import Head from 'next/head'
import Link from 'next/link'

export default function Highscore() {
  return (
    <>
      <Head>
        <title>Highscore</title>
      </Head>
      <div className="mx-auto max-w-[600px]">
        <h1 className="serlo-h1">Highscore</h1>

        <Link href="/" className="serlo-link mx-side">
          zurück
        </Link>
      </div>
    </>
  )
}
