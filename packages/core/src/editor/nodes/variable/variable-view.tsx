import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/editor/components/popover';
import { Divider } from '@/editor/components/ui/divider';
import { TooltipProvider } from '@/editor/components/ui/tooltip';
import { useMailyContext } from '@/editor/provider';
import { cn } from '@/editor/utils/classname';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import { AlertTriangle, Pencil } from 'lucide-react';

export function VariableView(props: NodeViewProps) {
  const { node, selected, updateAttributes } = props;
  const { id, fallback } = node.attrs;

  const { variables = [] } = useMailyContext();
  const isRequired =
    variables.find((variable) => variable.name === id)?.required ?? true;

  return (
    <NodeViewWrapper
      className={cn(
        'react-component',
        selected && 'ProseMirror-selectednode',
        'mly-inline-block mly-leading-none'
      )}
      draggable="false"
    >
      <Popover>
        <PopoverTrigger>
          <span
            tabIndex={-1}
            className="mly-inline-flex mly-items-center mly-gap-1 mly-rounded-md mly-border mly-border-rose-200 mly-bg-rose-50 mly-px-2 mly-py-1 mly-leading-none mly-text-rose-800"
          >
            {id}
            {isRequired && !fallback && (
              <AlertTriangle className="mly-h-3 mly-w-3 mly-shrink-0 mly-stroke-[2.5]" />
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          className="mly-w-max mly-rounded-lg !mly-p-0.5"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <TooltipProvider>
            <div className="mly-flex mly-items-stretch mly-text-midnight-gray">
              <label className="mly-relative">
                <span className="mly-inline-block mly-px-2 mly-text-xs mly-text-midnight-gray">
                  Variable
                </span>
                <input
                  value={id}
                  onChange={(e) => {
                    updateAttributes({
                      id: e.target.value,
                    });
                  }}
                  placeholder="ie. name..."
                  className="mly-h-7 mly-w-36 mly-rounded-md mly-bg-soft-gray mly-px-2 mly-text-sm mly-text-midnight-gray focus:mly-bg-soft-gray focus:mly-outline-none"
                />
              </label>

              <Divider className="mly-mx-1.5" />

              <label className="mly-relative">
                <span className="mly-inline-block mly-px-2 mly-pl-1 mly-text-xs mly-text-midnight-gray">
                  Default
                </span>
                <input
                  value={fallback}
                  onChange={(e) => {
                    updateAttributes({
                      fallback: e.target.value,
                    });
                  }}
                  placeholder="ie. John Doe..."
                  className="mly-h-7 mly-w-32 mly-rounded-md mly-bg-soft-gray mly-px-2 mly-pr-6 mly-text-sm mly-text-midnight-gray focus:mly-bg-soft-gray focus:mly-outline-none"
                />
                <div className="mly-absolute mly-inset-y-0 mly-right-1 mly-flex mly-items-center">
                  <Pencil className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-midnight-gray" />
                </div>
              </label>
            </div>
          </TooltipProvider>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
