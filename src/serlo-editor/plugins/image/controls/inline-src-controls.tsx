import type { ImageProps } from '..'
import { useEditorStrings } from '@/contexts/logged-in-data-context'
import { tw } from '@/helper/tw'
import { isTempFile } from '@/serlo-editor/plugin'

export function InlineSrcControls({ state }: ImageProps) {
  const imageStrings = useEditorStrings().plugins.image
  const { src } = state

  const placeholder = !isTempFile(src.value)
    ? imageStrings.placeholderEmpty
    : !src.value.failed
    ? imageStrings.placeholderUploading
    : imageStrings.placeholderFailed

  return (
    <p className="mx-side flex flex-wrap text-base">
      <label>
        <b>{imageStrings.imageUrl}</b>
        <input
          placeholder={placeholder}
          value={!isTempFile(src.value) ? src.value : ''}
          disabled={isTempFile(src.value) && !src.value.failed}
          onChange={(e) => state.src.set(e.target.value)}
          className={tw`
            mb-side mr-2 block w-60 rounded-xl border-2 border-editor-primary-100 bg-editor-primary-100
            px-2.5 py-[3px] text-almost-black focus:border-editor-primary focus:outline-none
          `}
          data-qa="plugin-image-src"
        />
      </label>
    </p>
  )
}
