"use client";

import { useState, useCallback, useMemo } from "react";

interface ValidationRule {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  custom?: (value: unknown, values: Record<string, unknown>) => string | null;
}

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule;
};

interface FormErrors {
  [key: string]: string | null;
}

interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validation?: ValidationSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validation,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => new Set(prev).add(key as string));
  }, []);

  const setMultiple = useCallback((partial: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback((newValues?: T) => {
    setValues(newValues ?? initialValues);
    setErrors({});
    setTouched(new Set());
    setIsSubmitting(false);
  }, [initialValues]);

  const validateField = useCallback(
    (key: string, value: unknown): string | null => {
      if (!validation) return null;
      const rules = validation[key as keyof T];
      if (!rules) return null;

      if (rules.required) {
        const msg = typeof rules.required === "string" ? rules.required : `${key} is required`;
        if (value === undefined || value === null || value === "") return msg;
      }

      if (typeof value === "string") {
        if (rules.minLength && value.length < rules.minLength.value) {
          return rules.minLength.message;
        }
        if (rules.maxLength && value.length > rules.maxLength.value) {
          return rules.maxLength.message;
        }
        if (rules.pattern && !rules.pattern.value.test(value)) {
          return rules.pattern.message;
        }
      }

      if (typeof value === "number") {
        if (rules.min !== undefined && value < rules.min.value) return rules.min.message;
        if (rules.max !== undefined && value > rules.max.value) return rules.max.message;
      }

      if (rules.custom) {
        return rules.custom(value, values);
      }

      return null;
    },
    [validation, values]
  );

  const validateAll = useCallback((): boolean => {
    if (!validation) return true;

    const newErrors: FormErrors = {};
    let isValid = true;

    for (const key of Object.keys(validation)) {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validation, values, validateField]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setSubmitCount((c) => c + 1);

      const allTouched = new Set<string>();
      for (const key of Object.keys(values)) {
        allTouched.add(key);
      }
      setTouched(allTouched);

      if (!validateAll()) return;
      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit]
  );

  const getFieldProps = useCallback(
    <K extends keyof T>(key: K) => ({
      name: key as string,
      value: values[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const val = e.target.type === "number" ? (parseFloat(e.target.value) as T[K]) : (e.target.value as T[K]);
        setValue(key, val);
        const error = validateField(key as string, val);
        setErrors((prev) => ({ ...prev, [key as string]: error }));
      },
      onBlur: () => {
        setTouched((prev) => new Set(prev).add(key as string));
        const error = validateField(key as string, values[key]);
        setErrors((prev) => ({ ...prev, [key as string]: error }));
      },
      error: touched.has(key as string) ? errors[key as string] : null,
    }),
    [values, touched, errors, setValue, validateField]
  );

  const isValid = useMemo(() => {
    if (!validation) return true;
    return Object.keys(validation).every((key) => !validateField(key, values[key]));
  }, [validation, values, validateField]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    isValid,
    setValue,
    setMultiple,
    setErrors,
    reset,
    handleSubmit,
    getFieldProps,
    validateAll,
    validateField,
  };
}
