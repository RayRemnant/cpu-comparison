import { atom } from 'jotai';
import { CPU } from '../types';

export const selectedCPUsAtom = atom<CPU[]>([]);