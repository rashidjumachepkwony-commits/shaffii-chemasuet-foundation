import { useState, useCallback } from "react";
import type { ZodSchema } from "zod";

export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(
    async (vals: T): Promise<Record<string, string>> => {
      try {
        validationSchema.parse(vals);
        return {};
      } catch (e: any) {
        if (e.errors) {
          const fieldErrors: Record<string, string> = {};
          e.errors.forEach((err: any) => {
            const path = err.path?.join(".") || "root";
            fieldErrors[path] = err.message;
          });
          return fieldErrors;
        }
        return { root: "Validation failed" };
      }
    },
    [validationSchema]
  );

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setIsSubmitting(true);
      setErrors({});

      const validationErrors = await validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      try {
        await onSubmit(values);
      } catch (e: any) {
        setErrors({ root: e.message || "An error occurred" });
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback((newValues: T = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, message: string) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    isValid: Object.keys(errors).length === 0,
  };
}
