import { useState, useCallback } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
  website?: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface ValidationRules {
  minNameLength: number;
  minMessageLength: number;
  maxMessageLength: number;
}

const DEFAULT_RULES: ValidationRules = {
  minNameLength: 2,
  minMessageLength: 10,
  maxMessageLength: 5000
};

/**
 * Custom hook for contact form validation with inline feedback
 * Provides field-specific error messages for better UX
 */
export const useContactFormValidation = (rules: Partial<ValidationRules> = {}) => {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(new Set());

  const validationRules = { ...DEFAULT_RULES, ...rules };

  /**
   * Validate name field
   */
  const validateName = useCallback((name: string): string | undefined => {
    const trimmed = name.trim();

    if (!trimmed) {
      return 'Name is required';
    }

    if (trimmed.length < validationRules.minNameLength) {
      return `Name must be at least ${validationRules.minNameLength} characters`;
    }

    return undefined;
  }, [validationRules.minNameLength]);

  /**
   * Validate email field with specific feedback
   */
  const validateEmail = useCallback((email: string): string | undefined => {
    const trimmed = email.trim();

    if (!trimmed) {
      return 'Email is required';
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      // Specific error messages based on common mistakes
      if (!trimmed.includes('@')) {
        return 'Email must include @ symbol';
      }
      if (!trimmed.includes('.')) {
        return 'Email must include a domain (e.g., .com, .org)';
      }
      if (trimmed.startsWith('@')) {
        return 'Email cannot start with @ symbol';
      }
      if (trimmed.endsWith('@')) {
        return 'Email must include a domain after @ symbol';
      }
      return 'Please enter a valid email address';
    }

    return undefined;
  }, []);

  /**
   * Validate message field
   */
  const validateMessage = useCallback((message: string): string | undefined => {
    const trimmed = message.trim();

    if (!trimmed) {
      return 'Message is required';
    }

    if (trimmed.length < validationRules.minMessageLength) {
      return `Message must be at least ${validationRules.minMessageLength} characters`;
    }

    if (trimmed.length > validationRules.maxMessageLength) {
      return `Message must not exceed ${validationRules.maxMessageLength} characters`;
    }

    return undefined;
  }, [validationRules.minMessageLength, validationRules.maxMessageLength]);

  /**
   * Validate a single field
   */
  const validateField = useCallback((
    fieldName: keyof FormData,
    value: string
  ): string | undefined => {
    switch (fieldName) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'message':
        return validateMessage(value);
      default:
        return undefined;
    }
  }, [validateName, validateEmail, validateMessage]);

  /**
   * Validate field on blur - only shows format/length errors, not "required" errors
   * This provides better UX by not showing "required" until user attempts to submit
   */
  const validateFieldOnBlur = useCallback((
    fieldName: keyof FormData,
    value: string
  ): string | undefined => {
    const trimmed = value.trim();

    // If empty, no error on blur (only show "required" on submit)
    if (!trimmed) {
      return undefined;
    }

    // If has content, validate format/length only
    switch (fieldName) {
      case 'name':
        return trimmed.length < validationRules.minNameLength
          ? `Name must be at least ${validationRules.minNameLength} characters`
          : undefined;
      case 'email':
        // Email format validation (without "required" check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
          if (!trimmed.includes('@')) {
            return 'Email must include @ symbol';
          }
          if (!trimmed.includes('.')) {
            return 'Email must include a domain (e.g., .com, .org)';
          }
          if (trimmed.startsWith('@')) {
            return 'Email cannot start with @ symbol';
          }
          if (trimmed.endsWith('@')) {
            return 'Email must include a domain after @ symbol';
          }
          return 'Please enter a valid email address';
        }
        return undefined;
      case 'message':
        if (trimmed.length < validationRules.minMessageLength) {
          return `Message must be at least ${validationRules.minMessageLength} characters`;
        }
        if (trimmed.length > validationRules.maxMessageLength) {
          return `Message must not exceed ${validationRules.maxMessageLength} characters`;
        }
        return undefined;
      default:
        return undefined;
    }
  }, [validationRules.minNameLength, validationRules.minMessageLength, validationRules.maxMessageLength]);

  /**
   * Handle field blur - validate and show error if any
   * Only shows format/length errors, not "required" errors
   */
  const handleFieldBlur = useCallback((
    fieldName: keyof FormData,
    value: string
  ) => {
    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(fieldName));

    // Use blur-specific validation (no "required" errors)
    const error = validateFieldOnBlur(fieldName, value);
    setErrors(prev => {
      if (error) {
        return { ...prev, [fieldName]: error };
      } else {
        // Clear error if field is now valid or empty
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      }
    });
  }, [validateFieldOnBlur]);

  /**
   * Validate all fields at once (for submit)
   */
  const validateAll = useCallback((formData: FormData): { isValid: boolean; errors: FieldErrors } => {
    const newErrors: FieldErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      message: validateMessage(formData.message)
    };

    // Filter out undefined errors
    const filteredErrors: FieldErrors = {};
    Object.entries(newErrors).forEach(([key, value]) => {
      if (value) {
        filteredErrors[key as keyof FieldErrors] = value;
      }
    });

    setErrors(filteredErrors);
    setTouchedFields(new Set(['name', 'email', 'message']));

    return {
      isValid: Object.keys(filteredErrors).length === 0,
      errors: filteredErrors
    };
  }, [validateName, validateEmail, validateMessage]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
    setTouchedFields(new Set());
  }, []);

  /**
   * Clear specific field error
   */
  const clearFieldError = useCallback((fieldName: keyof FormData) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    touchedFields,
    validateField,
    validateAll,
    handleFieldBlur,
    clearErrors,
    clearFieldError
  };
};
