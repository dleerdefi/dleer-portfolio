import React, { useState, useId } from 'react';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Accessible form field component with WCAG 2.2 compliance
 * Features:
 * - Required field indicators
 * - Field-level error messages with aria-describedby
 * - aria-invalid for error states
 * - Visual error icons (not just color)
 * - Character counter for long text
 * - Enhanced focus indicators
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  rows = 5,
  maxLength,
  showCharCount = false,
  disabled = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const charCountId = `${fieldId}-charcount`;

  const hasError = !!error;
  const charCount = value.length;
  const isNearLimit = maxLength && charCount >= maxLength * 0.9;

  const baseInputStyles = {
    backgroundColor: 'var(--theme-surface)',
    color: 'var(--theme-text)',
    borderWidth: '1px',
    borderColor: hasError
      ? 'var(--theme-error)'
      : isFocused
      ? 'var(--accent-color)'
      : 'rgba(var(--accent-color-rgb), 0.3)',
    outline: 'none',
    boxShadow: isFocused ? '0 0 0 1px var(--accent-color)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const ariaDescribedBy = [
    error ? errorId : null,
    showCharCount && maxLength ? charCountId : null
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={`${className} mt-6 first:mt-0`}>
      {/* Label with required indicator */}
      <label
        htmlFor={fieldId}
        className="block font-medium mb-1"
        style={{ color: 'var(--theme-text)', fontSize: 'clamp(11px, 2cqw, 18px)' }}
      >
        {label}
        {required && (
          <span
            className="ml-1"
            style={{ color: 'var(--theme-error)' }}
            aria-label="required"
          >
            *
          </span>
        )}
      </label>

      {/* Input or Textarea */}
      {type === 'textarea' ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          className="w-full rounded px-3 py-2 resize-none transition-all"
          style={{ ...baseInputStyles, fontSize: 'clamp(11px, 2cqw, 18px)' }}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          inputMode={type === 'email' ? 'email' : undefined}
          autoComplete={
            type === 'text' ? 'name' : type === 'email' ? 'email' : undefined
          }
          className="w-full rounded px-3 py-2 transition-all"
          style={{ ...baseInputStyles, fontSize: 'clamp(11px, 2cqw, 18px)' }}
        />
      )}

      {/* Character counter */}
      {showCharCount && maxLength && (
        <div
          id={charCountId}
          className="mt-1"
          style={{
            color: isNearLimit ? 'var(--theme-warning)' : 'var(--theme-text-dimmed)',
            fontSize: 'clamp(11px, 2cqw, 18px)'
          }}
          aria-live="polite"
        >
          {charCount} / {maxLength} characters
        </div>
      )}

      {/* Error message with icon */}
      {error && (
        <div
          id={errorId}
          className="flex items-start gap-2 mt-2"
          style={{ color: 'var(--theme-error)', fontSize: 'clamp(11px, 2cqw, 18px)' }}
          role="alert"
          aria-live="polite"
        >
          {/* Error icon (not just color, for colorblind users) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
