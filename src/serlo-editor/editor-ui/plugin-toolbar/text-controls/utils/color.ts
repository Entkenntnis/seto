import { Editor as SlateEditor, Transforms } from 'slate'

import { trimSelection } from './selection'

export const isAnyColorActive = (editor: SlateEditor) =>
  typeof SlateEditor.marks(editor)?.color === 'number'

export const isColorActive = (colorIndex: number) => (editor: SlateEditor) =>
  SlateEditor.marks(editor)?.color === colorIndex

export const resetColor = (editor: SlateEditor) => {
  SlateEditor.removeMark(editor, 'color')
}

export const toggleColor = (colorIndex: number) => (editor: SlateEditor) => {
  trimSelection(editor)
  if (isColorActive(colorIndex)(editor)) {
    SlateEditor.removeMark(editor, 'color')
  } else {
    SlateEditor.addMark(editor, 'color', colorIndex)
  }
  Transforms.collapse(editor, { edge: 'end' })
}

export const getColorIndex = (editor: SlateEditor) => {
  return SlateEditor.marks(editor)?.color
}
