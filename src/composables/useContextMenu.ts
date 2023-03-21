import { useMouse } from "@vueuse/core";
import { computed, ref } from "vue";

export default function useContextMenu() {
  const showContextMenu = ref(false);
  const img_url = ref("");
  const { x, y } = useMouse();
  const internalX = ref(0);
  const internalY = ref(0);

  const setImgUrl = (val: string) => {
    img_url.value = val;
  };

  const setShow = (val: boolean) => {
    console.log(x, y);
    showContextMenu.value = val;
  };

  const handler = (val: string) => {
    internalX.value = x.value;
    internalY.value = y.value;
    setShow(true);
    setImgUrl(val);
    console.log(val);
  };

  const status = computed(() => {
    return showContextMenu.value;
  });

  return {
    showContextMenu,
    img_url,
    setImgUrl,
    setShow,
    handler,
    status,
    x,
    y,
    internalX,
    internalY,
  };
}
