import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { ReactNode, useState, useEffect } from 'react'

import { ExerciseNumbering } from './exercise-numbering'
import { useAuthentication } from '@/auth/use-authentication'
import type { MoreAuthorToolsProps } from '@/components/user-tools/foldout-author-menus/more-author-tools'
import { ExerciseInlineType } from '@/data-types'
import { FrontendExerciseGroupNode } from '@/frontend-node-types'
import { useStorageData } from '@/seto/storage-context'

export interface ExerciseGroupProps {
  children: ReactNode
  license: ReactNode
  groupIntro: ReactNode
  positionOnPage?: number
  id: number
  href?: string
  unrevisedRevisions?: number
  data: FrontendExerciseGroupNode
}

const AuthorToolsExercises = dynamic<MoreAuthorToolsProps>(() =>
  import(
    '@/components/user-tools/foldout-author-menus/author-tools-exercises'
  ).then((mod) => mod.AuthorToolsExercises)
)

export function ExerciseGroup({
  children,
  license,
  groupIntro,
  positionOnPage,
  id,
  href,
  unrevisedRevisions,
  data,
}: ExerciseGroupProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const storage = useStorageData()

  const solved = data.children!.every((child) =>
    storage.data.solved.includes(child.context.id)
  )

  const auth = useAuthentication()

  return (
    <div className={clsx('pt-1', solved && 'bg-brandgreen-100')}>
      <div className="mb-3 pt-2">
        {positionOnPage !== undefined && (
          <ExerciseNumbering
            index={positionOnPage}
            href={href ? href : `/${id}`}
            solved={solved}
          />
        )}
        <div className="mb-0.5 flex">
          {/* explicitly set flex element width to 100% to pass it down to children */}
          <div className="w-full grow">{groupIntro}</div>
          <div>{license}</div>
          {loaded && auth && (
            <AuthorToolsExercises
              data={{
                type: ExerciseInlineType.ExerciseGroup,
                id,
                unrevisedRevisions,
              }}
            />
          )}
        </div>
      </div>
      <ol className="mb-2.5 ml-2  pb-3.5 [counter-reset:exercises] sm:pl-12">
        {children}
      </ol>
    </div>
  )
}
