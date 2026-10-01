import type { EleventyConfig } from "11ty.ts";
import inflection from "inflection";

interface PluginOptions {}

export default function (
  eleventyConfig: EleventyConfig,
  options: PluginOptions,
) {
  eleventyConfig.addFilter("classPlace", (place) => {
    const ordinal = inflection.ordinalize(String(place));
    // superscript the last two letters ('st', 'nd', 'rd', 'th'...)
    const ordStart = ordinal.length - 2;
    const ordFmt = `${ordinal.substring(0, ordStart)}<sup>${ordinal.substring(ordStart)}</sup>`;
    return `${ordFmt} place in class`;
  });

  eleventyConfig.addFilter("ordinalize", (place) => {
    const ordinal = inflection.ordinalize(String(place));
    // superscript the last two letters ('st', 'nd', 'rd', 'th'...)
    const ordStart = ordinal.length - 2;
    return `${ordinal.substring(0, ordStart)}<sup>${ordinal.substring(ordStart)}</sup>`;
  });

  eleventyConfig.addFilter("pluralize", (word, count) => {
    if (count !== undefined && count === 1) {
      return word;
    }

    return inflection.pluralize(word);
  });
}
