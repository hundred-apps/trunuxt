// composables/useImageUrl.ts
// Wrapper tipis atas utils/imageUrl supaya bisa dipakai di komponen
// dengan gaya yang konsisten:
//
//   const { imgSrc, imgSrcset, imgAttrs } = useImageUrl();
//   <img :src="imgSrc('product', p.img)" v-bind="imgAttrs('product', p.img)" />

import {
  imageSrc,
  imageSrcset,
  imageDataAttrs,
  imageSources,
  imageThumbUrl,
  localImageUrl,
  remoteImageUrl,
  NO_IMAGE,
  NO_IMAGE_SMALL,
  type ImageKind,
} from "~/utils/imageUrl";

export function useImageUrl() {
  return {
    imgSrc: imageSrc,
    imgSrcset: imageSrcset,
    imgAttrs: imageDataAttrs,
    imgSources: imageSources,
    imgThumb: imageThumbUrl,
    imgLocal: localImageUrl,
    imgRemote: remoteImageUrl,
    NO_IMAGE,
    NO_IMAGE_SMALL,
  };
}

export type { ImageKind };
