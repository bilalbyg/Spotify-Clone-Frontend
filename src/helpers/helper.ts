/* eslint-disable @typescript-eslint/no-explicit-any */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
export const getLibraryItemRoute = (item: any) => `/playlist/${item.id}`;
export const getRecentSearchItemRoute = (item: any) => `/search/${item.id}`;
export const readStoredWidth = (_key: string, defaultValue: number) => defaultValue;
