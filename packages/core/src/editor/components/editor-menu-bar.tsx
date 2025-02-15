import { useMemo, useEffect, useState, useCallback } from 'react';
import { Editor as EditorType } from '@tiptap/core';
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  List,
  ListOrdered,
  StrikethroughIcon,
  UnderlineIcon,
  Link2,
  Unlink2,
  Heading,
  Image as ImageIcon,
} from 'lucide-react';

import { EditorProps } from '@/editor';
import { BubbleMenuButton } from './bubble-menu-button';

interface EditorMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  group: string;
  icon: any;
}

type EditorMenuBarProps = {
  config: EditorProps['config'];
  editor: EditorType;
};

export const EditorMenuBar = (props: EditorMenuBarProps) => {
  const { editor } = props;
  const [isLinkActive, setIsLinkActive] = useState(false);

  const updateLinkState = useCallback(() => {
    setIsLinkActive(editor.isActive('link'));
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.on('transaction', updateLinkState);
    return () => {
      editor.off('transaction', updateLinkState);
    };
  }, [editor, updateLinkState]);

  const setLink = () => {
    const { state } = editor;
    const { from, to } = state.selection;
    if (from === to) {
      return;
    }
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const imageMenuItem: EditorMenuItem = {
    name: 'image',
    command: async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (input.files && input.files[0]) {
          const file = input.files[0];
          try {
            const url =
              //@ts-ignore
              window.MT && typeof window.MT.uploadImage === 'function'
                ? //@ts-ignore
                  await window.MT.uploadImage(file)
                : await new Promise<string>((resolve) =>
                    setTimeout(() => resolve(URL.createObjectURL(file)), 1000)
                  );
            editor.chain().focus().setImage({ src: url }).run();
          } catch (error) {
            console.error('Image upload failed', error);
          }
        }
      };
      input.click();
    },
    isActive: () => false,
    group: 'insert',
    icon: ImageIcon,
  };

  const items: EditorMenuItem[] = useMemo(
    () => [
      {
        name: 'bold',
        command: () => editor.chain().focus().toggleBold().run(),
        isActive: () => editor.isActive('bold'),
        group: 'mark',
        icon: BoldIcon,
      },
      {
        name: 'italic',
        command: () => editor.chain().focus().toggleItalic().run(),
        isActive: () => editor.isActive('italic'),
        group: 'mark',
        icon: ItalicIcon,
      },
      {
        name: 'underline',
        command: () => editor.chain().focus().toggleUnderline().run(),
        isActive: () => editor.isActive('underline'),
        group: 'mark',
        icon: UnderlineIcon,
      },
      {
        name: 'strike',
        command: () => editor.chain().focus().toggleStrike().run(),
        isActive: () => editor.isActive('strike'),
        group: 'mark',
        icon: StrikethroughIcon,
      },
      {
        name: 'code',
        command: () => editor.chain().focus().toggleCode().run(),
        isActive: () => editor.isActive('code'),
        group: 'mark',
        icon: CodeIcon,
      },
      {
        name: 'heading',
        command: () => {
          if (editor.isActive('heading', { level: 3 })) {
            editor.chain().focus().setNode('paragraph').run();
          } else {
            editor.chain().focus().setNode('heading', { level: 3 }).run();
          }
        },
        isActive: () => editor.isActive('heading', { level: 3 }),
        group: 'block',
        icon: Heading,
      },
      {
        name: 'bullet-list',
        command: () => editor.chain().focus().toggleBulletList().run(),
        isActive: () => editor.isActive('bulletList'),
        group: 'list',
        icon: List,
      },
      {
        name: 'ordered-list',
        command: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.isActive('orderedList'),
        group: 'list',
        icon: ListOrdered,
      },
      {
        name: 'link',
        command: setLink,
        isActive: () => isLinkActive,
        group: 'mark',
        icon: Link2,
      },
      ...(isLinkActive
        ? [
            {
              name: 'unlink',
              command: () =>
                editor
                  .chain()
                  .focus()
                  .extendMarkRange('link')
                  .unsetLink()
                  .run(),
              isActive: () => false,
              group: 'mark',
              icon: Unlink2,
            },
          ]
        : []),
      imageMenuItem,
    ],
    [editor, isLinkActive]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="mly-flex mly-w-fit mly-items-center mly-gap-1 mly-p-1">
      {items.map((item, index) => (
        <BubbleMenuButton
          key={index}
          {...item}
          className={`transition-all duration-100 ease-in mly-flex mly-h-8 mly-w-8 mly-items-center mly-justify-center mly-rounded-lg ${
            item.isActive()
              ? 'mly-border mly-border-[#D0D5DD] mly-bg-white'
              : 'mly-border-transparent mly-bg-transparent'
          }`}
          iconClassName={`
            mly-h-4 mly-w-4 mly-stroke-[2.7] transition-all duration-100 ease-in
            ${item.isActive() ? 'mly-text-[#155EEF] mly-stroke-[#155EEF]' : 'mly-text-[#98A2B3] mly-stroke-[#98A2B3]'}
          `}
        />
      ))}
    </div>
  );
};
