import type { CookieJar } from '@yaakapp-internal/models';
import { atom, useAtomValue } from 'jotai';

export const cookieJarsAtom = atom<CookieJar[] | undefined>();

export function useCookieJars() {
  return useAtomValue(cookieJarsAtom);
}
