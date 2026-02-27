'use client';

import { TextareaHTMLAttributes, forwardRef, KeyboardEvent } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  onEnterSubmit?: () => void;
  onEscapeSubmit?: () => void;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', onEnterSubmit, onEscapeSubmit, onKeyDown, ...props }, ref) => {
    const classes = ['form-textarea', error && 'form-textarea-error', className]
      .filter(Boolean)
      .join(' ');

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (onEnterSubmit && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onEnterSubmit();
      }
      if (onEscapeSubmit && e.key === 'Escape') {
        e.preventDefault();
        onEscapeSubmit();
      }
      onKeyDown?.(e);
    };

    return <textarea ref={ref} className={classes} onKeyDown={handleKeyDown} {...props} />;
  }
);

Textarea.displayName = 'Textarea';
