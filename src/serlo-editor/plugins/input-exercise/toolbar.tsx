import type { InputExerciseProps } from '.'
import { InputExerciseType } from './input-exercise-type'
import { useEditorStrings } from '@/contexts/logged-in-data-context'
import { tw } from '@/helper/tw'
import { EditorTooltip } from '@/serlo-editor/editor-ui/editor-tooltip'
import { PluginToolbar } from '@/serlo-editor/editor-ui/plugin-toolbar'
import { EditorPluginType } from '@/serlo-editor-integration/types/editor-plugin-type'

export const InputExerciseToolbar = ({ state }: InputExerciseProps) => {
  const inputExStrings = useEditorStrings().templatePlugins.inputExercise

  return (
    <PluginToolbar
      pluginType={EditorPluginType.InputExercise}
      pluginSettings={
        <>
          <label className="serlo-tooltip-trigger mr-2">
            <EditorTooltip text={inputExStrings.chooseType} />
            <select
              value={state.type.value}
              onChange={(event) => state.type.set(event.target.value)}
              className={tw`
                bg-editor-primary-10 mr-2 max-w-[13rem] cursor-pointer rounded-md !border
                border-gray-500 bg-transparent px-1 py-[1px] text-sm transition-all
                hover:bg-editor-primary-200 focus:bg-editor-primary-200 focus:outline-none
              `}
            >
              {Object.values(InputExerciseType).map((exerciseType) => (
                <option key={exerciseType} value={exerciseType}>
                  {inputExStrings.types[exerciseType]}
                </option>
              ))}
            </select>
          </label>
          <label className="serlo-tooltip-trigger">
            <EditorTooltip text={inputExStrings.unit} />
            <input
              placeholder={inputExStrings.unit}
              value={state.unit.value}
              onChange={({ target }) => {
                state.unit.set(target.value)
              }}
              className={tw`
              mr-2 w-20 cursor-pointer rounded-md !border border-gray-500
            bg-editor-primary-100 px-1 py-[1px] text-sm transition-all
            hover:bg-editor-primary-200 focus:bg-editor-primary-200 focus:outline-none
            `}
            />
          </label>
        </>
      }
    />
  )
}
