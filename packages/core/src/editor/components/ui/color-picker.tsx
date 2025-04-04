'use client';

import { HexAlphaColorPicker, HexColorInput } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { BaseButton } from '../base-button';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn } from '@/editor/utils/classname';
import { ReactNode } from 'react';

type ColorPickerProps = {
  color: string;
  onColorChange: (color: string) => void;

  borderColor?: string;
  backgroundColor?: string;
  tooltip?: string;
  className?: string;

  children?: ReactNode;
};

export function ColorPicker(props: ColorPickerProps) {
  const {
    color,
    onColorChange,
    borderColor,
    backgroundColor,
    tooltip,
    className,

    children,
  } = props;

  const handleColorChange = (color: string) => {
    // HACK: This is a workaround for a bug in tiptap
    // https://github.com/ueberdosis/tiptap/issues/3580
    //
    //     ERROR: flushSync was called from inside a lifecycle
    //
    // To fix this, we need to make sure that the onChange
    // callback is run after the current execution context.
    queueMicrotask(() => {
      onColorChange(color);
    });
  };

  const popoverButton = (
    <PopoverTrigger asChild>
      {children || (
        <BaseButton
          variant="ghost"
          className="!mly-size-7 mly-shrink-0"
          size="sm"
          type="button"
        >
          <div
            className={cn(
              'mly-h-4 mly-w-4 mly-shrink-0 mly-rounded mly-border-2 mly-border-gray-700',
              className
            )}
            style={{
              ...(borderColor ? { borderColor } : {}),
              backgroundColor: backgroundColor || 'transparent',
            }}
          />
        </BaseButton>
      )}
    </PopoverTrigger>
  );

  return (
    <Popover>
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>{popoverButton}</TooltipTrigger>
          <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
        </Tooltip>
      ) : (
        popoverButton
      )}

      <PopoverContent className="mly-w-full mly-rounded-none mly-border-0 !mly-bg-transparent !mly-p-0 mly-shadow-none mly-drop-shadow-md">
        <div className="mly-min-w-[260px] mly-rounded-xl mly-border mly-bg-white mly-p-4">
          <HexAlphaColorPicker
            color={color}
            onChange={handleColorChange}
            className="mly-flex !mly-w-full mly-flex-col mly-gap-4"
          />
          <HexColorInput
            alpha={true}
            color={color}
            onChange={handleColorChange}
            className="mly-mt-4 mly-w-full mly-min-w-0 mly-rounded-lg mly-border mly-px-2 mly-py-1.5 mly-text-sm mly-uppercase focus-visible:mly-border-gray-400 focus-visible:mly-outline-none"
            prefixed
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
