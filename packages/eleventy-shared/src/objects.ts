import type { EleventyConfig } from "11ty.ts";

interface PluginOptions {}

export default function (
  eleventyConfig: EleventyConfig,
  options: PluginOptions,
) {
  // Filters don't *have* to return strings... that's a bogus type
  //@ts-expect-error -- addFilter has bad typing
  eleventyConfig.addFilter("fromEntries", (entries) => {
    return Object.fromEntries(entries);
  });

  //@ts-expect-error -- addFilter has bad typing
  eleventyConfig.addFilter("arrayFlat", (items: any[]) => {
    return items.flat();
  });


  eleventyConfig.addFilter("match", (list, selector) => {
    const kvs = Object.entries(selector);
    //@ts-expect-error -- again, bad typing on params
    return list.filter((item) => kvs.every(([k, v]) => item[k] === v));
  });
}
