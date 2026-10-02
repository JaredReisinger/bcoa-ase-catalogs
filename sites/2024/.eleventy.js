import aseSharedPlugin, { defaultConfig } from "@ase/eleventy-shared";

export const config = defaultConfig;

export default function (eleventyConfig) {
  // use our common utilities
  eleventyConfig.addPlugin(aseSharedPlugin, {
    // We can't use data from _data files inside this config, sadly, so we need
    // some things defined here:
    showDate: "2024-10-08",
  });
}
