import { BoxEditor } from './editor'
import {
  type EditorPlugin,
  type EditorPluginProps,
  child,
  object,
  string,
} from '@/serlo-editor/plugin'
import { EditorPluginType } from '@/serlo-editor-integration/types/editor-plugin-type'

function createBoxState(allowedPlugins: (EditorPluginType | string)[]) {
  return object({
    type: string(''),
    title: child({
      plugin: EditorPluginType.Text,
      config: {
        noLinebreaks: true,
      },
    }),
    anchorId: string(''),
    content: child({
      plugin: EditorPluginType.Rows,
      config: { allowedPlugins },
    }),
  })
}

export type BoxPluginState = ReturnType<typeof createBoxState>
export type BoxProps = EditorPluginProps<BoxPluginState>
export interface BoxConfig {
  allowedPlugins?: (EditorPluginType | string)[]
}

const defaultAllowedPlugins: (EditorPluginType | string)[] = [
  EditorPluginType.Text,
  EditorPluginType.Image,
  EditorPluginType.Equations,
  EditorPluginType.Multimedia,
  EditorPluginType.SerloTable,
  EditorPluginType.Highlight,
]

export function createBoxPlugin({
  allowedPlugins = defaultAllowedPlugins,
}): EditorPlugin<BoxPluginState> {
  return {
    Component: BoxEditor,
    state: createBoxState(allowedPlugins),
    config: {},
  }
}
