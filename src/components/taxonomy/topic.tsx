import { faTrash } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { RatingProps } from 'react-simple-star-rating'

import { NewFolderPrototypeProps } from './new-folder-prototype'
import { SubTopic } from './sub-topic'
import { TopicCategories } from './topic-categories'
import { StaticInfoPanel } from '../static-info-panel'
import { LicenseNotice } from '@/components/content/license/license-notice'
import { useAB } from '@/contexts/ab'
import { useInstanceData } from '@/contexts/instance-context'
import { TaxonomyData, TopicCategoryType } from '@/data-types'
import { TaxonomyTermType } from '@/fetcher/graphql-types/operations'
import { abSubmission } from '@/helper/ab-submission'
import { isProduction } from '@/helper/is-production'
import { renderArticle } from '@/schema/article-renderer'
import { StorageData, getData, setUserName } from '@/seto/storage'
import { StorageContextProvider } from '@/seto/storage-context'

export interface TopicProps {
  data: TaxonomyData
}

const headingsDataTemp: { [key: number]: string } = {
  29637: 'Baumdiagramm zeichnen',
  29581: 'Abzählen mit Baumdiagramm',
  5011: 'Passende Zahlen bauen',
  5007: 'Kombinationen finden',
}

const Rating = dynamic<RatingProps>(() =>
  import('react-simple-star-rating').then((mod) => mod.Rating)
)

const NewFolderPrototype = dynamic<NewFolderPrototypeProps>(() =>
  import('./new-folder-prototype').then((mod) => mod.NewFolderPrototype)
)

export function Topic({ data }: TopicProps) {
  const { strings } = useInstanceData()

  const ab = useAB()

  const [hasFeedback, setHasFeedback] = useState(false)

  const [storageData, setStorageData] = useState<StorageData | null>(null)

  const [showNameModal, setNameModal] = useState(false)

  const [name, setName] = useState('')

  useEffect(() => {
    const data = getData()
    setStorageData(data)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ;(window as any).__triggerRender = () => {
      setStorageData(getData())
    }

    if (!data.name) {
      setNameModal(true)
    }
  }, [])

  const isExerciseFolder = data.taxonomyType === TaxonomyTermType.ExerciseFolder
  const isTopic = data.taxonomyType === TaxonomyTermType.Topic

  const hasExercises = data.exercisesContent.length > 0
  const defaultLicense = hasExercises ? getDefaultLicense() : undefined

  return (
    <>
      <StorageContextProvider
        value={
          storageData
            ? {
                data: storageData,
                update() {
                  setStorageData(getData())
                },
              }
            : null
        }
      >
        {showNameModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/20">
            <div
              className="relative z-[200] h-[280px] w-[500px] rounded-xl bg-white"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {/*<button
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  //closeModal(core)
                  // switchToPage(core, 'overview')
                }}
              >
                <FaIcon icon={faTimes} />
              </button>*/}
              <div>
                <p className="mb-4 ml-4 mt-6 text-center text-lg font-bold">
                  Herzlich Willkommen!
                </p>
                <p className="mt-6 text-center">Wie lautet dein Name?</p>
                <p className="text-center">
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.code === 'Enter' && name.trim()) {
                        setUserName(name.trim())
                        setStorageData(getData())
                        setNameModal(false)
                      }
                    }}
                    className="mt-4 rounded border-2 border-blue-500 text-center text-3xl"
                    maxLength={30}
                  />
                </p>
                <p className="mt-3 text-center text-sm italic text-gray-500">
                  Dein Name wird öffentlich angzeigt.
                  <button
                    className="ml-10 underline"
                    onClick={() => {
                      const letters = 'abcdefghijklmnopqrstuvwxyz0123456789'
                      let n = ''
                      while (n.length < 6) {
                        n += letters[Math.floor(Math.random() * letters.length)]
                      }
                      setName(n)
                    }}
                  >
                    zufälliger Name
                  </button>
                </p>
              </div>
              <p className="mb-5 mt-8 px-4 text-center">
                <button
                  className="rounded bg-green-200 px-2 py-0.5 hover:bg-green-300 disabled:bg-gray-200 disabled:text-gray-700"
                  onClick={() => {
                    setUserName(name.trim())
                    setStorageData(getData())
                    setNameModal(false)
                  }}
                  disabled={!name.trim()}
                >
                  Loslegen!
                </button>
              </p>
            </div>
          </div>
        )}
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
          <div className="mb-24 mt-4 text-center">
            <Link href="/" className="serlo-link">
              zurück zur Übersicht
            </Link>
            {storageData?.name && (
              <span className="ml-12">Dein Name: {storageData.name}</span>
            )}
          </div>
        </div>
        {data.trashed && renderTrashedNotice()}
        {renderHeader()}
        <div className="min-h-1/2">
          <div className="mt-6 sm:mb-5">
            {data.description &&
              renderArticle(data.description, `taxdesc${data.id}`)}
          </div>

          {renderSubterms()}

          {renderExercises()}

          {isTopic && <TopicCategories data={data} full />}

          {isExerciseFolder && data.events && (
            <TopicCategories
              data={data}
              categories={[TopicCategoryType.events]}
              full
            />
          )}
        </div>
        {defaultLicense && <LicenseNotice data={defaultLicense} />}
      </StorageContextProvider>
    </>
  )

  function renderTrashedNotice() {
    return (
      <StaticInfoPanel icon={faTrash} doNotIndex>
        {strings.content.trashedNotice}
      </StaticInfoPanel>
    )
  }

  function renderHeader() {
    return (
      <h1 className="serlo-h1 mb-10 mt-8" itemProp="name">
        {data.title}
      </h1>
    )
  }

  function renderSubterms() {
    return (
      data.subterms &&
      data.subterms.map((child) => (
        <Fragment key={child.title}>
          <SubTopic data={child} subid={child.id} id={data.id} />
        </Fragment>
      ))
    )
  }

  function renderExercises() {
    if (
      ab?.experiment === 'dreisatzv0' &&
      (!isProduction || ab.group === 'b')
    ) {
      // here is the place for new exercise view
      return (
        <>
          <NewFolderPrototype data={data} />
          <div className="h-24"></div>
          {renderSurvey()}
        </>
      )
    }
    if (ab?.experiment === 'reorder_trig' && ab.group === 'b') {
      const a1 = data.exercisesContent[0]
      const a2 = data.exercisesContent[1]
      if (a1.context.id === 57741 && a2.context.id === 52806) {
        a1.positionOnPage = 1
        a2.positionOnPage = 0
        data.exercisesContent[0] = a2
        data.exercisesContent[1] = a1
      }
    }
    return (
      hasExercises &&
      data.exercisesContent &&
      data.exercisesContent.map((exercise, i) => {
        return (
          <Fragment key={i}>
            {ab?.experiment === 'headings' &&
              ab.group === 'b' &&
              headingsDataTemp[exercise.context.id] && (
                <div className="mx-side -mb-10 mt-16 text-xl font-bold">
                  {headingsDataTemp[exercise.context.id]}
                </div>
              )}
            {renderArticle(
              [exercise],
              `tax${data.id}`,
              `ex${exercise.context.id}`
            )}
            {i === (ab?.experiment === 'headings' ? 3 : 1) && renderSurvey()}
          </Fragment>
        )
      })
    )
  }

  function renderSurvey() {
    if (!ab) return
    if (ab.topicId !== data.id) return
    return (
      <div className=" mx-auto my-12  max-w-[420px] rounded-xl bg-brand-50 p-4 text-center ">
        <strong>Wie gut gefällt dir dieser Aufgabenordner?</strong>
        <Rating
          className="mt-4 [&_svg]:inline"
          readonly={hasFeedback}
          onClick={(rate) => {
            //submit_event(`rate_quest_${core.ws.quest.id}_${rate}`, core)
            abSubmission({
              entityId: -1,
              experiment: ab.experiment,
              group: ab.group,
              result: rate.toString(),
              topicId: ab.topicId,
              type: 'rating',
            })
            setHasFeedback(true)
          }}
        />
        <div className={clsx('mt-3', hasFeedback ? '' : 'invisible')}>
          Danke für dein Feedback! &#10084;
        </div>
      </div>
    )
  }

  function getDefaultLicense() {
    for (let i = 0; i < data.exercisesContent.length; i++) {
      const content = data.exercisesContent[i]

      if (content.type === 'exercise-group') {
        if (content.license?.isDefault) return content.license
      } else {
        if (content.task?.license?.isDefault) return content.task.license
        if (content.solution?.license?.isDefault)
          return content.solution.license
      }
    }
    //no part of collection has default license so don't show default notice.
    return undefined
  }
}
