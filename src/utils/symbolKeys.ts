import { ComputedRef, InjectionKey, Ref } from "vue";

export const containerHeightKey = Symbol() as InjectionKey<
  ComputedRef<number> | Ref<number>
>;
export const aspectRatioSupportedKey = Symbol() as InjectionKey<Ref<boolean>>;
