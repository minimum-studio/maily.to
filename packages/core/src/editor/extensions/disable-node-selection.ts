import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const DisableNodeSelectionExtension = Extension.create({
  name: 'disableNodeSelection',

  addProseMirrorPlugins() {
    const key = new PluginKey('disableNodeSelection');

    return [
      new Plugin({
        key,
        props: {
          handleClick(view, pos, event) {
            // If the editor is not editable, prevent node selection
            if (!view.editable) {
              event.preventDefault();
              return true;
            }
            return false;
          },
          // This prevents selecting nodes via keyboard navigation when editor is not editable
          handleKeyDown(view, event) {
            if (!view.editable && ['Enter', 'Space'].includes(event.key)) {
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});
