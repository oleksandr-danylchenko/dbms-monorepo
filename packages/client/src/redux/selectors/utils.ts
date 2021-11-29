import { Selector } from '@reduxjs/toolkit';

// Allows to pass options object, instead of a few distinct params
// https://cutt.ly/hE5Xe98
export const createParameterSelector =
  <T, P = Record<string, T>>(selector: Selector<P, T>) =>
  (_: unknown, params: P): T =>
    selector(params);
