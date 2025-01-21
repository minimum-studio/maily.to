import { useMemo } from 'react';
import { Editor as EditorType } from '@tiptap/core';
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  List,
  ListOrdered,
  StrikethroughIcon,
  UnderlineIcon,
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
  const { editor, config } = props;

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
    ],
    [editor]
  );

  const groups = useMemo(
    () =>
      items.reduce((acc, item) => {
        if (!acc.includes(item.group)) {
          acc.push(item.group);
        }
        return acc;
      }, [] as string[]),
    [items]
  );

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`mly-flex mly-items-center mly-gap-3 ${config?.toolbarClassName}`}
    >
      <div className="mly-flex mly-items-center mly-gap-1 mly-rounded-md mly-border mly-bg-white mly-p-1">
        {items.map((item, index) => (
          <BubbleMenuButton key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
