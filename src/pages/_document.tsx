import Document, { Html, Head, Main, NextScript } from 'next/document'

import { Instance } from '@/fetcher/graphql-types/operations'
import { colors } from '@/helper/colors'
import { getInstanceDataByLang } from '@/helper/feature-i18n'
import { htmlEscapeStringForJson } from '@/helper/html-escape'

const bodyStyles = {
  fontFamily: 'Karmilla, sans-serif',
  backgroundColor: '#fff',
}

export default class MyDocument extends Document {
  render() {
    const langData = this.props.__NEXT_DATA__.locale
      ? getInstanceDataByLang(this.props.__NEXT_DATA__.locale as Instance)
      : undefined
    return (
      <Html className="bg-brand-100 print:serlo-print-style">
        {/* background on html for overscroll area */}
        <Head>
          <meta property="og:site_name" content="Seto" />
          <meta property="og:type" content="website" />
          <meta name="theme-color" content={colors.brand}></meta>
          <link
            rel="preload"
            href="/_assets/fonts/karmilla/karmilla-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/_assets/fonts/karmilla/karmilla-bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/_assets/fonts/karmilla/karmilla-bolder.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/_assets/fonts/caveat/caveat-bold.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
        </Head>
        <body style={bodyStyles}>
          <Main />
          {langData && (
            <script
              type="application/json"
              id="__FRONTEND_CLIENT_INSTANCE_DATA__"
              dangerouslySetInnerHTML={{
                __html: htmlEscapeStringForJson(JSON.stringify(langData)),
              }}
            />
          )}
          <NextScript />
        </body>
      </Html>
    )
  }
}
