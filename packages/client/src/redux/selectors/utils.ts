import { Selector } from '@reduxjs/toolkit';

export const undefinedResultSelector = () => ({ data: undefined });

// Allows passing options object, instead of a few distinct params
// https://cutt.ly/hE5Xe98
export const createParameterSelector =
  <T, P = Record<string, T>>(selector: Selector<P, T>) =>
  (_: unknown, params: P): T =>
    selector(params);
