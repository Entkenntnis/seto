import Head from 'next/head'

import { useInstanceData } from '@/contexts/instance-context'
import { BreadcrumbsData, HeadData } from '@/data-types'
import { testAreaId } from '@/fetcher/testArea'

interface HeadTagsProps {
  data: HeadData
  breadcrumbsData?: BreadcrumbsData
  noindex?: boolean
}

export function HeadTags({ data, breadcrumbsData, noindex }: HeadTagsProps) {
  const { title, contentType, metaDescription } = data
  const { strings } = useInstanceData()

  return (
    <Head>
      <title>{title}</title>
      {contentType && <meta name="content_type" content={contentType} />}
      {metaDescription && <meta name="description" content={metaDescription} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={metaDescription ?? strings.header.slogan}
      />
      {renderNoIndexMeta()}
    </Head>
  )

  function renderNoIndexMeta() {
    // hide search, trashed and content of the "Testbereich" in instance de
    const filteredBreadcrumbs = breadcrumbsData?.filter(
      (entry) => entry.id === testAreaId
    )
    if (
      noindex ||
      (filteredBreadcrumbs && filteredBreadcrumbs.length > 0) ||
      data.title.startsWith('Testbereich')
    ) {
      return <meta name="robots" content="noindex" />
    }

    return null
  }
}
