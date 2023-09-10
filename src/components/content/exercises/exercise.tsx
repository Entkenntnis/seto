import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

import { ExerciseNumbering } from './exercise-numbering'
import { InputExercise } from './input-exercise'
import { ScMcExercise } from './sc-mc-exercise'
import { Solution } from './solution'
import { useAuthentication } from '@/auth/use-authentication'
import type { MoreAuthorToolsProps } from '@/components/user-tools/foldout-author-menus/more-author-tools'
import { useAB } from '@/contexts/ab'
import { ExerciseInlineType } from '@/data-types'
import type { FrontendExerciseNode } from '@/frontend-node-types'
import { exerciseSubmission } from '@/helper/exercise-submission'
import type { NodePath, RenderNestedFunction } from '@/schema/article-renderer'
import { H5pRenderer } from '@/serlo-editor/plugins/h5p/renderer'
import { EditorPluginType } from '@/serlo-editor-integration/types/editor-plugin-type'
import { useStorageData } from '@/seto/storage-context'

export interface ExerciseProps {
  node: FrontendExerciseNode
  renderNested: RenderNestedFunction
  path?: NodePath
}

const AuthorToolsExercises = dynamic<MoreAuthorToolsProps>(() =>
  import(
    '@/components/user-tools/foldout-author-menus/author-tools-exercises'
  ).then((mod) => mod.AuthorToolsExercises)
)

export function Exercise({ node, renderNested, path }: ExerciseProps) {
  const auth = useAuthentication()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])
  const { data } = useStorageData()

  const ab = useAB()

  const solved = data.solved.includes(node.context.id)

  const isRevisionView =
    path && typeof path[0] === 'string' && path[0].startsWith('revision')

  const hasInteractive = node.task.edtrState && node.task.edtrState.interactive

  if (node.grouped)
    return (
      <li
        className={clsx(
          'serlo-exercise-wrapper serlo-grouped-exercise-wrapper',
          solved && 'before:!bg-brandgreen-50 before:!text-brandgreen'
        )}
      >
        {renderExerciseContent()}
      </li>
    )

  return (
    <div className="serlo-exercise-wrapper mb-10 pt-2">
      {renderExerciseContent()}
    </div>
  )

  function renderExerciseContent() {
    return (
      <div className={clsx(solved && 'bg-brandgreen-100')}>
        {node.grouped ? null : ( // grouped ex numbering solved in css
          <ExerciseNumbering
            index={node.positionOnPage!}
            href={node.href ? node.href : `/${node.context.id}`}
            solved={solved}
          />
        )}
        <div className="flex justify-between">
          <div className="w-full">{renderExerciseTask()}</div>
          {renderToolsButton()}
        </div>
        {renderInteractive()}
        {!hasInteractive && !solved && (
          <div className="-mb-8 mt-4 text-right">
            <button
              className="text-brandgreen-400 hover:underline"
              onClick={() => {
                exerciseSubmission(
                  {
                    path: '',
                    entityId: node.context.id,
                    revisionId: node.context.revisionId,
                    result: 'correct',
                    type: 'text',
                  },
                  ab
                )
              }}
            >
              Aufgabe als fertig markieren
            </button>
          </div>
        )}
        <Solution node={node} loaded={loaded} renderNested={renderNested} />
      </div>
    )
  }

  function renderExerciseTask() {
    if (node.task.legacy) {
      return renderNested(node.task.legacy, 'task')
    } else if (node.task.edtrState) {
      return renderNested(node.task.edtrState.content, 'task')
    }
    return null
  }

  function renderInteractive() {
    if (!node.task.edtrState) return null

    const state = node.task.edtrState

    if (state.interactive) {
      if (state.interactive.plugin === EditorPluginType.ScMcExercise) {
        return (
          <ScMcExercise
            state={state.interactive.state}
            idBase={`ex-${
              node.positionOnPage ? node.positionOnPage : node.context.id
            }-${
              node.positionInGroup ? node.positionInGroup : path?.join('') ?? ''
            }-`}
            renderNested={renderNested}
            isRevisionView={isRevisionView}
            context={{
              entityId: node.context.id,
              revisionId: node.context.revisionId,
            }}
          />
        )
      }
      if (state.interactive.plugin === EditorPluginType.InputExercise) {
        return (
          <InputExercise
            data={state.interactive.state}
            renderNested={renderNested}
            isRevisionView={isRevisionView}
            context={{
              entityId: node.context.id,
              revisionId: node.context.revisionId,
            }}
          />
        )
      }
      if (state.interactive.plugin === EditorPluginType.H5p) {
        return (
          <H5pRenderer
            url={state.interactive.state}
            context={{
              entityId: node.context.id,
              revisionId: node.context.revisionId,
            }}
          />
        )
      }
    }
  }

  function renderToolsButton() {
    if (isRevisionView) return null
    return (
      <>
        {loaded && auth && (
          <AuthorToolsExercises
            data={{
              type: ExerciseInlineType.Exercise,
              trashed: node.trashed,
              id: node.context.id,
              grouped: node.grouped,
              unrevisedRevisions: node.unrevisedRevisions,
            }}
          />
        )}
      </>
    )
  }
}
