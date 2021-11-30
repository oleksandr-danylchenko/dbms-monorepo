import { Selector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// https://stackoverflow.com/a/69943586/10963661
export const stateSelector = (state: RootState) => () => state;

export const undefinedResultSelector = () => ({ data: undefined });

// Allows passing options object, instead of a few distinct params
// https://cutt.ly/hE5Xe98
export const createParameterSelector =
  <T, P = Record<string, T>>(selector: Selector<P, T>) =>
  (_: unknown, params: P): T =>
    selector(params);
