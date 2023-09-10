import Head from 'next/head'
import Link from 'next/link'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Datenschutzerklärung</title>
      </Head>
      <div className="mx-auto max-w-[600px]">
        <h1 className="serlo-h1">Datenschutzerklärung</h1>
        <div className="mx-side mb-4">
          Diese Webseite wird durch https://vercel.com gehostet. Die Webseite
          setzt Web Analytics und Speed Insights von Vercel ein. Es werden durch
          die Nutzung keine personenbezogenen Daten wie z.B. die IP-Adresse
          gespeichert. Die Auswertung findet vollständig anonym statt.
        </div>
        <div className="mx-side mb-4">
          Durch die Nutzung der Highscore wird der Nutzername, die gelösten
          Aufgaben und der Zeitpunkt der letzten Aktivität übermittelt und
          gespeichert. Achte bei der Wahl des Nutzernamen, dass sich dieser
          nicht auf deine Person zurückführen lässt.
        </div>
        <div className="mx-side mb-4">
          Beim Speichern des Fortschritts werden Informationen in deinem Browser
          hinterlegt. Du kannst diesen Fortschritt jederzeit über die Startseite
          zurücksetzen.
        </div>
        <Link href="/" className="serlo-link mx-side">
          zurück
        </Link>
      </div>
    </>
  )
}
