import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import TiptapLink from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Heading from '@tiptap/extension-heading';
import Underline from '@tiptap/extension-underline';
import Document from '@tiptap/extension-document';
import Focus from '@tiptap/extension-focus';
import Dropcursor from '@tiptap/extension-dropcursor';

import { HorizontalRule } from './horizontal-rule';
import { Footer } from '../nodes/footer';
import { TiptapLogoExtension } from '../nodes/logo';
import { Spacer } from '../nodes/spacer';
import { getSlashCommandSuggestions, SlashCommand } from './slash-command';
import { ResizableImageExtension } from './image-resize';
import { MailyContextType } from '../provider';
import { LinkCardExtension } from './link-card';
import { Columns } from '../nodes/columns/columns';
import { Column } from '../nodes/columns/column';
import { SectionExtension } from '../nodes/section/section';
import { ForExtension } from '../nodes/for/for';
import { PayloadValueExtension } from '../nodes/for/payload-value';
import { getPlayloadValueSuggestions } from '../nodes/for/payload-value-view';
import { ShowExtension } from '../nodes/show/show';
import { ButtonExtension } from '../nodes/button/button';
import { VariableExtension } from '../nodes/variable/variable';
import { getVariableSuggestions } from '../nodes/variable/variable-suggestions';

type ExtensionsProps = Partial<MailyContextType> & {};

export function extensions(props: ExtensionsProps) {
  const {
    variables,
    slashCommands,
    variableSuggestionChar,
    payloadValueSuggestionChar,
  } = props;

  return [
    Document.extend({
      content: '(block|columns)+',
    }),
    Columns,
    Column,
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      code: {
        HTMLAttributes: {
          class:
            'mly-px-1 mly-py-0.5 mly-bg-[#efefef] mly-text-sm mly-rounded-md mly-tracking-normal mly-font-normal',
        },
      },
      blockquote: {
        HTMLAttributes: {
          class:
            'mly-not-prose mly-border-l-4 mly-border-gray-300 mly-pl-4 mly-mt-4 mly-mb-4',
        },
      },
      horizontalRule: false,
      dropcursor: false,
      document: false,
      codeBlock: false,
    }),
    Underline,
    TiptapLogoExtension,
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure(),
    TextAlign.configure({ types: [Paragraph.name, Heading.name, Footer.name] }),
    HorizontalRule,
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return `Heading ${node.attrs.level}`;
        } else if (
          ['columns', 'column', 'section', 'for', 'show'].includes(
            node.type.name
          )
        ) {
          return '';
        }

        return 'Write something or / to see commands';
      },
      includeChildren: true,
    }),
    Spacer,
    Footer,
    SlashCommand.configure({
      suggestion: getSlashCommandSuggestions(slashCommands),
    }),
    TiptapLink.configure({
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      },
      openOnClick: false,
    }),
    ResizableImageExtension,
    LinkCardExtension,
    Focus,
    SectionExtension,
    ForExtension,
    PayloadValueExtension.configure({
      suggestion: getPlayloadValueSuggestions([], payloadValueSuggestionChar),
    }),
    ShowExtension,
    Dropcursor.configure({
      color: '#555',
      width: 3,
      class: 'ProseMirror-dropcursor',
    }),
    ButtonExtension,
    VariableExtension.configure({
      suggestion: getVariableSuggestions(variables, variableSuggestionChar),
    }),
  ];
}
