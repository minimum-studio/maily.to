import { useState, useEffect } from 'react';
import { Editor as EditorType } from '@tiptap/react';
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
  Link2Icon,
  List,
  ListOrdered,
  XIcon,
} from 'lucide-react';

import { TooltipProvider } from '@radix-ui/react-tooltip';

type EditorMenuBarProps = {
  editor: EditorType;
};

export const EditorMenuBar = ({ editor }: EditorMenuBarProps) => {
  const [currentLink, setCurrentLink] = useState<string | null>(null);
  const [linkInputVisible, setLinkInputVisible] = useState(false);
  const [linkInputValue, setLinkInputValue] = useState('');

  useEffect(() => {
    const updateToolbarState = () => {
      const link = editor.getAttributes('link');
      setCurrentLink(link?.href || null);
      setLinkInputValue(link?.href || '');
    };

    editor.on('selectionUpdate', updateToolbarState);
    return () => {
      editor.off('selectionUpdate', updateToolbarState);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const formatButtons = [
    {
      name: 'bold',
      icon: BoldIcon,
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      name: 'italic',
      icon: ItalicIcon,
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      name: 'underline',
      icon: UnderlineIcon,
      command: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    {
      name: 'strike',
      icon: StrikethroughIcon,
      command: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    {
      name: 'code',
      icon: CodeIcon,
      command: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
    },
    {
      name: 'bulletList',
      icon: List,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      name: 'orderedList',
      icon: ListOrdered,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
  ];

  const handleLinkInputSubmit = () => {
    const sanitizedLink = linkInputValue.startsWith('https://')
      ? linkInputValue
      : `https://${linkInputValue}`;

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: sanitizedLink })
      .run();
    setCurrentLink(sanitizedLink);
    setLinkInputVisible(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setCurrentLink(null);
    setLinkInputValue('');
    setLinkInputVisible(false);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 p-2 bg-white border rounded-md">
        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2">
          {formatButtons.map((item, index) => (
            <button
              key={index}
              onClick={item.command}
              className={`p-2 rounded ${
                item.isActive ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              <item.icon size={16} />
            </button>
          ))}

          {/* Link Buttons */}
          <button
            onClick={() => setLinkInputVisible(true)}
            className="p-2 rounded bg-gray-200"
          >
            <Link2Icon size={16} />
          </button>
          <button
            onClick={handleRemoveLink}
            className={`p-2 rounded ${
              currentLink ? 'bg-red-500 text-white' : 'bg-gray-200'
            }`}
            disabled={!currentLink}
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Link Input Popover */}
        {linkInputVisible && (
          <div className="flex items-center gap-2 p-2 border rounded">
            <input
              type="text"
              value={linkInputValue}
              onChange={(e) => setLinkInputValue(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleLinkInputSubmit}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Add Link
            </button>
            <button
              onClick={() => setLinkInputVisible(false)}
              className="p-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
