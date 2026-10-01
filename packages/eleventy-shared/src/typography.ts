import type { EleventyConfig } from "11ty.ts";

interface PluginOptions {}

export default function (
  eleventyConfig: EleventyConfig,
  options: PluginOptions = {},
) {
  eleventyConfig.addFilter("prettyQuotes", (str) => {
    return str.replaceAll("'", "’");
  });
}
