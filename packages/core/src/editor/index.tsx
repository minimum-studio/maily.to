'use client';

import { Editor as TiptapEditor, Extension, FocusPosition } from '@tiptap/core';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import { EditorMenuBar } from './components/editor-menu-bar';
import { ImageBubbleMenu } from './components/image-menu/image-bubble-menu';
import { SpacerBubbleMenu } from './components/spacer-bubble-menu';
import { extensions as defaultExtensions } from './extensions';
import {
  DEFAULT_PAYLOAD_VALUE_SUGGESTION_CHAR,
  DEFAULT_VARIABLE_SUGGESTION_CHAR,
  MailyContextType,
  MailyProvider,
} from './provider';
import { cn } from './utils/classname';
import { SectionBubbleMenu } from './components/section-menu/section-bubble-menu';
import { useRef } from 'react';
import { ColumnsBubbleMenu } from './components/column-menu/columns-bubble-menu';
import { ForBubbleMenu } from './components/for-menu/for-bubble-menu';

async function uploadImage(file: File): Promise<string> {
  // @ts-ignore
  if (window.MT && typeof window.MT.uploadImage === 'function') {
    // @ts-ignore
    return window.MT.uploadImage(file);
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(URL.createObjectURL(file)), 1000);
  });
}

type ParitialMailContextType = Partial<MailyContextType>;

export type EditorProps = {
  contentHtml?: string;
  contentJson?: JSONContent;
  onUpdate?: (editor?: TiptapEditor) => void;
  onCreate?: (editor?: TiptapEditor) => void;
  extensions?: Extension[];
  config?: {
    hasMenuBar?: boolean;
    spellCheck?: boolean;
    wrapClassName?: string;
    toolbarClassName?: string;
    contentClassName?: string;
    bodyClassName?: string;
    autofocus?: FocusPosition;
    immediatelyRender?: boolean;
    editable?: boolean;
  };
} & ParitialMailContextType;

export function Editor(props: EditorProps) {
  const {
    config: {
      wrapClassName = '',
      contentClassName = '',
      bodyClassName = '',
      hasMenuBar = true,
      spellCheck = false,
      autofocus = 'end',
      immediatelyRender = false,
      editable = true,
    } = {},
    onCreate,
    onUpdate,
    extensions,
    contentHtml,
    contentJson,
    variables,
    slashCommands,
    variableSuggestionChar = DEFAULT_VARIABLE_SUGGESTION_CHAR,
    payloadValueSuggestionChar = DEFAULT_PAYLOAD_VALUE_SUGGESTION_CHAR,
  } = props;

  let formattedContent: any = null;
  if (contentJson) {
    formattedContent =
      contentJson?.type === 'doc'
        ? contentJson
        : {
            type: 'doc',
            content: contentJson,
          };
  } else if (contentHtml) {
    formattedContent = contentHtml;
  } else {
    formattedContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    };
  }

  const menuContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<TiptapEditor | null>(null);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(`mly-prose mly-w-full`, contentClassName),
        spellCheck: spellCheck ? 'true' : 'false',
      },
      handleDOMEvents: {
        keydown: (_view, event) => {
          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            const slashCommand = document.querySelector('#slash-command');
            if (slashCommand) {
              return true;
            }
          }
        },
        drop: (_view, event) => {
          const files = event.dataTransfer?.files;
          if (!files || files.length === 0) {
            return false;
          }

          const imageFiles = Array.from(files).filter((file) =>
            file.type.startsWith('image/')
          );
          if (imageFiles.length === 0) {
            return false;
          }
          event.preventDefault();

          const coords = { left: event.clientX, top: event.clientY };
          const dropPos = _view.posAtCoords(coords)?.pos;

          imageFiles.forEach((file) => {
            uploadImage(file)
              .then((url: string) => {
                if (editorInstanceRef.current) {
                  if (dropPos !== null && dropPos !== undefined) {
                    editorInstanceRef.current
                      .chain()
                      .focus()
                      .setTextSelection(dropPos)
                      .run();
                  }
                  editorInstanceRef.current
                    .chain()
                    .focus()
                    .setImage({ src: url })
                    .run();
                }
              })
              .catch((err) => {
                console.error('Image upload failed:', err);
              });
          });
          return true;
        },
      },
    },
    immediatelyRender,
    onCreate: ({ editor: createdEditor }) => {
      editorInstanceRef.current = createdEditor;
      onCreate?.(createdEditor);
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor);
    },
    extensions: [
      ...defaultExtensions({
        variables,
        slashCommands,
        variableSuggestionChar,
        payloadValueSuggestionChar,
      }),
      ...(extensions || []),
    ],
    content: formattedContent,
    autofocus,
    editable,
  });

  if (!editor) {
    return null;
  }

  return (
    <MailyProvider
      variables={variables}
      slashCommands={slashCommands}
      variableSuggestionChar={variableSuggestionChar}
      payloadValueSuggestionChar={payloadValueSuggestionChar}
    >
      <div
        className={cn('mly-editor mly-antialiased', wrapClassName)}
        ref={menuContainerRef}
      >
        {hasMenuBar && <EditorMenuBar config={props.config} editor={editor} />}
        <div
          className={cn(
            'mly-mt-4 mly-rounded mly-border mly-bg-white mly-p-4',
            bodyClassName
          )}
        >
          <ImageBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <SpacerBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <EditorContent editor={editor} />
          <SectionBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <ColumnsBubbleMenu editor={editor} appendTo={menuContainerRef} />
          <ForBubbleMenu editor={editor} appendTo={menuContainerRef} />
        </div>
      </div>
    </MailyProvider>
  );
}
