import type { Module } from "@nuxt/schema";

/**
 * Adds native image loading hints to every <img> tag that does not define them.
 *
 * - `loading="lazy"`  : defers off-screen images so the critical path stays fast.
 * - `decoding="async"` : lets the browser decode off the main thread.
 *
 * Tags that already declare either attribute are left untouched, so individual
 * components can still opt out (e.g. use eager + fetchpriority for LCP images).
 */
const IMG_TAG = /<img(\s[^>]*?)(\/?>)/gi;

// Match a plain attribute, a `:attr` binding or a `v-bind:attr` binding.
const ATTR = (name: string) =>
  new RegExp(`\\s(?::|v-bind:)?${name}\\s*=`, "i");

const HAS_LOADING = ATTR("loading");
const HAS_DECODING = ATTR("decoding");
const HAS_FETCHPRIORITY = ATTR("fetchpriority");

export default function imageLoadingHints(): Module {
  return {
    meta: {
      name: "image-loading-hints",
    },
    setup(_options, nuxt) {
      nuxt.hook("vite:extendConfig", (config) => {
        config.plugins = config.plugins || [];
        config.plugins.push({
          name: "trunuxt:image-loading-hints",
          enforce: "pre",
          transform(code: string, id: string) {
            if (!id.includes(".vue")) return null;

            // Inside <script>/<style> blocks there are no real <img> elements.
            const templateEnd = code.lastIndexOf("</template>");
            if (templateEnd === -1) return null;

            const template = code.slice(0, templateEnd);
            const rest = code.slice(templateEnd);

            let changed = false;
            const next = template.replace(
              IMG_TAG,
              (match, attrs: string, closing: string) => {
                let nextAttrs = attrs;

                // Images the developer explicitly prioritised stay untouched.
                if (HAS_FETCHPRIORITY.test(attrs)) return match;

                if (!HAS_LOADING.test(attrs)) {
                  nextAttrs += ' loading="lazy"';
                }
                if (!HAS_DECODING.test(attrs)) {
                  nextAttrs += ' decoding="async"';
                }

                if (nextAttrs === attrs) return match;
                changed = true;
                return `<img${nextAttrs}${closing}`;
              }
            );

            return changed ? next + rest : null;
          },
        });
      });
    },
  };
}
