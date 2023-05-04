import { useMouse } from "@vueuse/core";
import { computed, ref } from "vue";
import { getMimeTypeFromImageUrl, getNameFromImageUrl } from "../utils/misc";

export default function useContextMenu() {
  const showContextMenu = ref(false);
  const img_url = ref("");
  const { x, y } = useMouse();
  const internalX = ref(0);
  const internalY = ref(0);
  const canvasHref = ref("");

  const setImgUrl = (val: string) => {
    img_url.value = val;
  };

  const setShow = (val: boolean) => {
    showContextMenu.value = val;
    if (!val) {
      canvasHref.value = "";
    }
  };

  const downloadImage = () => {
    var link = document.createElement("a");
    link.download = getNameFromImageUrl(img_url.value);
    link.href = canvasHref.value;
    link.click();
  };

  const handler = async (val: any) => {
    internalX.value = x.value;
    internalY.value = y.value;
    setShow(true);
    setImgUrl(val.src);

    await getImageBuffer(val.src);
  };

  const getImageBuffer = async (val: any) => {
    return new Promise(async (resolve, reject) => {
      const mimeType = getMimeTypeFromImageUrl(val);
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let img: HTMLImageElement = await new Promise((resolve) => {
        let img = new Image();
        img.src = val;
        if (img.complete) {
          resolve(img);
        } else {
          img.onload = () => resolve(img);
        }
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0);

      const imageData = ctx!.getImageData(0, 0, img.width, img.height);

      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.addEventListener("loadend", () => {
          const arrayBuffer = reader.result;

          // Dispay Blob content in an Image.
          // @ts-ignore
          const blob = new Blob([arrayBuffer], { type: mimeType });
          const src = URL.createObjectURL(blob);

          canvasHref.value = canvas.toDataURL();

          resolve(src);
        });
        // @ts-ignore
        reader.readAsArrayBuffer(blob);
      }, mimeType);
    });
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
    downloadImage,
  };
}
