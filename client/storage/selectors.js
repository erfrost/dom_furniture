import { selector } from "recoil";
import { categoriesState, subcategoriesState } from "./atoms";

export const categoriesSelector = selector({
  key: "categoriesSelector",
  get: ({ get }) => get(categoriesState),
  set: ({ set }, value) =>
    set(categoriesState, (state) => ({ ...state, value: value })),
});

export const subcategoriesSelector = selector({
  key: "subcategoriesSelector",
  get: ({ get }) => get(subcategoriesState),
  set: ({ set }, value) =>
    set(subcategoriesState, (state) => ({ ...state, value: value })),
});
