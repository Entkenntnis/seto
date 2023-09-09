import { Analytics } from '@vercel/analytics/react'
import { GetStaticPaths, GetStaticProps } from 'next'

import { EntityBase } from '@/components/entity-base'
import { FrontendClientBase } from '@/components/frontend-client-base'
import { Topic } from '@/components/taxonomy/topic'
import { data } from '@/data/seto'
import { SlugProps } from '@/data-types'
import { Instance } from '@/fetcher/graphql-types/operations'
import { requestPage } from '@/fetcher/request-page'
import { renderedPageNoHooks } from '@/helper/rendered-page'

export default renderedPageNoHooks<SlugProps>(({ pageData }) => {
  if (pageData.kind !== 'taxonomy') return <>bad</>

  return (
    <>
      <FrontendClientBase
        noContainers
        noHeaderFooter
        entityId={pageData.taxonomyData.id}
        authorization={pageData.authorization}
      >
        <EntityBase page={pageData} entityId={pageData.taxonomyData.id}>
          <Topic data={pageData.taxonomyData} />
        </EntityBase>
      </FrontendClientBase>
      <Analytics />
    </>
  )
})

export const getStaticProps: GetStaticProps<SlugProps> = async (context) => {
  const alias = context.params?.id as string
  // quite stupid to use fetchPageData here, why not calling requestPage directly?
  const pageData = await requestPage('/' + alias, Instance.De)

  // we only support theses three kinds - 404 for everything else
  if (pageData.kind !== 'taxonomy') {
    return { notFound: true }
  }

  //await prettifyLinks(pageData)

  return {
    props: {
      pageData: JSON.parse(JSON.stringify(pageData)) as SlugProps['pageData'], // remove undefined values
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: data.flatMap((cl) =>
      cl.content.map((el) => ({
        params: { id: el.id.toString() },
      }))
    ),
    fallback: false,
  }
}
