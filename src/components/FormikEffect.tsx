import React from 'react';
import { FormikContextType, useFormikContext } from 'formik';
import { useEffect } from 'react';
import usePrevious from '../hooks/usePrevious';

type Values = {
  [key in string]: string;
};

type Params<T> = {
  prevValues: T;
  nextValues: T;
  changes: Partial<T>;
  formik: FormikContextType<T>;
};

type Props<T> = {
  onChange: (params: T) => void;
};

const FormikEffect = <T extends Values>({ onChange }: Props<Params<T>>) => {
  const formik = useFormikContext<T>(); 
  const { values } = formik;
  const prevValues = usePrevious<T>(values);

  let changes: Partial<T> = {};

  for (let key in values) {
    if (prevValues && values[key] !== prevValues[key]) {
      changes[key] = values[key] 
    }
  }

  useEffect(() => {
    if (prevValues) {
      onChange({ prevValues: prevValues, changes, nextValues: values, formik });
    }
   }, [values]);

  return null;
};

export default FormikEffect;