import { ChangeEvent, useState } from 'react';

export type FormChangeHandler = <T>(
  _: ChangeEvent<HTMLInputElement>,
  { name, value }: { name: keyof T; value: any }
) => void;

export const useFormState = <T extends Record<string, any>>(
  initialState: T
): [formState: T, handleFormChange: FormChangeHandler] => {
  const [formState, setFormState] = useState<T>(initialState);

  const handleFormChange: FormChangeHandler = (_, { name, value }) => {
    setFormState((previousState) => ({ ...previousState, [name]: value }));
  };

  return [formState, handleFormChange];
};
