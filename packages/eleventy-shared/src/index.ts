import { fileURLToPath } from "node:url";

//@ts-expect-error -- no module file
import { RenderPlugin } from "@11ty/eleventy";

import type { EleventyConfig } from "11ty.ts";
import htmlmin from "html-minifier";
import * as yaml from "js-yaml";
import nunjucks from "nunjucks";

import dates, { type Dateable } from "./dates.js";
import numbers from "./numbers.js";
import objects from "./objects.js";
import typography from "./typography.js";

// export pages for site consumption
export { Page } from "./page.js";

// Maybe merge the options from each?
interface PluginOptions {
  showDate: Dateable;
}

// class MyLoader extends nunjucks.FileSystemLoader {
//   constructor(
//     searchPaths?: string | string[],
//     opts?: nunjucks.FileSystemLoaderOptions,
//   ) {
//     super(searchPaths, opts);
//     console.log("NUNJUCKS FILE LOADER SEARCH PATHS:");
//     // console.dir(this.searchPaths);
//     console.dir(this);
//   }

//   getSource(name: string): nunjucks.LoaderSource {
//     console.log(`NUNJUCKS FILE LOADER ASKING FOR '${name}'`);
//     const source = super.getSource(name);
//     console.log(`NUNJUCKS FILE LOADER ASKING FOR '${name}'.. got ${source}`);
//     return source;
//   }
// }

export default function aseSharedPlugin(
  eleventyConfig: EleventyConfig,
  options: PluginOptions,
) {
  // before anything else, we need to rejigger nunjucks...
  const njkEnv = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(
      // MyLoader(
      [fileURLToPath(import.meta.resolve("../templates"))],
    ),
  );
  eleventyConfig.setLibrary("njk", njkEnv);

  eleventyConfig.addPlugin(RenderPlugin);

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Allow YAML everywhere that JSON is supported.
  //@ts-expect-error -- sigh
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  eleventyConfig.addPlugin(dates, options);
  eleventyConfig.addPlugin(numbers);
  eleventyConfig.addPlugin(objects);
  eleventyConfig.addPlugin(typography);

  eleventyConfig.addPassthroughCopy({
    [fileURLToPath(import.meta.resolve("alpinejs/dist/cdn.min.js"))]:
      "static/js/alpine.js",
  });

  // we used to run postcss to dump the CSS directly in _site, but now we need
  // to passthrough copy from dist (can we consolidate these copies?)
  eleventyConfig.addPassthroughCopy({
    [fileURLToPath(import.meta.resolve("@ase/eleventy-shared/dist/style.css"))]:
      "static/css/style.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("src/static/media");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy({
    "src/static/favicon/favicon.ico": "favicon.ico",
  });
  eleventyConfig.addPassthroughCopy("src/static/favicon");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });
}

// Let Eleventy transform HTML files as nunjucks so that we can use .html
// instead of .njk
export const defaultConfig = {
  dir: {
    input: "src",
  },
  // dataTemplateEngine: 'njk',
  htmlTemplateEngine: "njk",
  markdownTemplateEngine: "njk",
};
