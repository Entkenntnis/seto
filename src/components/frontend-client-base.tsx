import type { AuthorizationPayload } from '@serlo/authorization'
import { Router } from 'next/router'
import NProgress from 'nprogress'
import { PropsWithChildren, useState, useEffect } from 'react'
import { default as ToastNotice } from 'react-notify-toast'
import { getInstanceDataByLang } from 'src/helper/feature-i18n'

import { ConditionalWrap } from './conditional-wrap'
import { HeaderFooter } from './header-footer'
import { MaxWidthDiv } from './navigation/max-width-div'
import { AuthProvider } from '@/auth/auth-provider'
import { PrintMode } from '@/components/print-mode'
import { EntityIdProvider } from '@/contexts/entity-id-context'
import { InstanceDataProvider } from '@/contexts/instance-context'
import { LoggedInDataProvider } from '@/contexts/logged-in-data-context'
import { InstanceData, LoggedInData } from '@/data-types'
import { Instance } from '@/fetcher/graphql-types/operations'
import { triggerSentry } from '@/helper/trigger-sentry'
import {
  StorageData,
  getData,
  isPersisted,
  persist,
  persistLater,
} from '@/seto/storage'
import { StorageContextProvider } from '@/seto/storage-context'

export type FrontendClientBaseProps = PropsWithChildren<{
  noHeaderFooter?: boolean
  noContainers?: boolean
  showNav?: boolean
  entityId?: number
  authorization?: AuthorizationPayload
  loadLoggedInData?: boolean
}>

Router.events.on('routeChangeStart', () => {
  //NProgress.start()
})
Router.events.on('routeChangeComplete', (url, { shallow }) => {
  //NProgress.done()
  // when using csr and running into an error, try without csr once
  if (!shallow && document.getElementById('error-page-description') !== null) {
    triggerSentry({ message: 'trying again without csr' })
    setTimeout(() => {
      window.location.reload()
    }, 300)
  }
})
Router.events.on('routeChangeError', () => NProgress.done())

// assumes that the lang-strings in the i18n files are actually valid Instance strings
type FixedInstanceData = ReturnType<typeof getInstanceDataByLang> & {
  lang: Instance
}

export function FrontendClientBase({
  children,
  noHeaderFooter,
  noContainers,
  showNav,
  entityId,
  authorization,
}: FrontendClientBaseProps) {
  const locale = 'de'
  const [instanceData] = useState<InstanceData>(() => {
    if (typeof window === 'undefined') {
      // load instance data for server side rendering
      // Note: using require to avoid webpack bundling it
      return getInstanceDataByLang(
        (locale as Instance) ?? Instance.De
      ) as FixedInstanceData
    } else {
      // load instance data from client from document tag
      return JSON.parse(
        document.getElementById('__FRONTEND_CLIENT_INSTANCE_DATA__')
          ?.textContent ?? '{}'
      ) as FixedInstanceData
    }
  })

  const [storageData, setStorageData] = useState<StorageData | null>(null)
  const [isTriggerUsed, setTriggerUsed] = useState(false)

  useEffect(() => {
    const data = getData()
    setStorageData(data)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ;(window as any).__triggerRender = () => {
      setTriggerUsed(true)
      setStorageData(getData())
    }
  }, [])

  useEffect(() => {
    //tiny history
    sessionStorage.setItem(
      'previousPathname',
      sessionStorage.getItem('currentPathname') || ''
    )
    sessionStorage.setItem('currentPathname', window.location.href)
  })

  useEffect(() => {
    // scroll to comment area to start lazy loading
    if (window.location.hash.startsWith('#comment-')) {
      setTimeout(() => {
        document
          .querySelector('#comment-area-begin-scrollpoint')
          ?.scrollIntoView()
      }, 800)
    }
  })

  const [loggedInData] = useState<LoggedInData | null>(null)

  // dev
  //console.dir(initialProps)

  return (
    <InstanceDataProvider value={instanceData}>
      <StorageContextProvider
        value={
          storageData
            ? {
                data: storageData,
                update() {
                  setStorageData(getData())
                },
                triggerUsed: isTriggerUsed,
              }
            : null
        }
      >
        <PrintMode />
        <AuthProvider unauthenticatedAuthorizationPayload={authorization}>
          <LoggedInDataProvider value={loggedInData}>
            <EntityIdProvider value={entityId}>
              <ConditionalWrap
                condition={!noHeaderFooter}
                wrapper={(kids) => <HeaderFooter>{kids}</HeaderFooter>}
              >
                <ConditionalWrap
                  condition={!noContainers}
                  wrapper={(kids) => (
                    <div className="relative">
                      <MaxWidthDiv showNav={showNav}>
                        <main id="content">{kids}</main>
                      </MaxWidthDiv>
                    </div>
                  )}
                >
                  {/* should not be necessary…?*/}
                  {children as JSX.Element}
                </ConditionalWrap>
              </ConditionalWrap>
              {storageData &&
                !isPersisted() &&
                storageData.solved.length > 0 &&
                (!storageData.persistLater ||
                  storageData.solved.length > storageData.persistLater + 2) && (
                  <div className="fixed bottom-2 left-2 right-2 bg-yellow-200 py-4 text-center">
                    Möchtest du deinen Fortschritt auf diesem Gerät speichern?{' '}
                    <button
                      className="mx-8 inline-block rounded bg-yellow-400 px-4 py-2 hover:bg-yellow-500"
                      onClick={() => {
                        persist()
                        setStorageData(getData())
                      }}
                    >
                      Speichern
                    </button>{' '}
                    <span
                      className="cursor-pointer text-gray-600 hover:underline"
                      onClick={() => {
                        persistLater()
                        setStorageData(getData())
                      }}
                    >
                      später
                    </span>
                  </div>
                )}
              <ToastNotice />
            </EntityIdProvider>
          </LoggedInDataProvider>
        </AuthProvider>
      </StorageContextProvider>
    </InstanceDataProvider>
  )
}
