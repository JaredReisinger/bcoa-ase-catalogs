import type { EleventyConfig } from "11ty.ts";

interface PluginOptions {}

export function prettyQuotes(str: string) {
  return str.replaceAll("'", "’");
}

export default function (
  eleventyConfig: EleventyConfig,
  options: PluginOptions = {},
) {
  eleventyConfig.addFilter("prettyQuotes", prettyQuotes);
}
