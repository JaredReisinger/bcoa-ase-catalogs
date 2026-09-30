import * as yaml from 'js-yaml';
import { DateTime } from 'luxon';
// import navigation from '@11ty/eleventy-navigation';
import htmlmin from 'html-minifier';
import  inflection from 'inflection';

// We can't use data from _data files inside this config, sadly, so we need
// some things defined here:
const showDate = DateTime.fromISO('2024-10-08T00:00:00Z', { zone: 'utc' });


export default function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addGlobalData("showDate", showDate);

  // human readable date
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'LLLL d, yyyy'
    );
  });

  eleventyConfig.addFilter('readableAge', (dateObj) => {
    const birthdate = DateTime.fromJSDate(dateObj, { zone: 'utc' });
    const age = showDate.diff(birthdate, ['years', 'months']).toHuman({
      maximumFractionDigits: 0,
    });

    return age;
  });

  eleventyConfig.addFilter('prettyQuotes', (str) => {
    return str.replaceAll("'", '’');
  });

  eleventyConfig.addFilter('classPlace', (place) => {
    const ordinal = inflection.ordinalize(String(place));
    // superscript the last two letters ('st', 'nd', 'rd', 'th'...)
    const ordStart = ordinal.length - 2;
    const ordFmt = `${ordinal.substring(0, ordStart)}<sup>${ordinal.substring(ordStart)}</sup>`;
    return `${ordFmt} place in class`;
  });

  eleventyConfig.addFilter('ordinalize', (place) => {
    const ordinal = inflection.ordinalize(String(place));
    // superscript the last two letters ('st', 'nd', 'rd', 'th'...)
    const ordStart = ordinal.length - 2;
    return `${ordinal.substring(0, ordStart)}<sup>${ordinal.substring(ordStart)}</sup>`;
  });

  eleventyConfig.addFilter('fromEntries', (entries) => {
    return Object.fromEntries(entries);
  });

  eleventyConfig.addFilter('match', (list, selector) => {
    const kvs = Object.entries(selector);
    return list.filter((item) => kvs.every(([k, v]) => item[k] === v));
  });

  eleventyConfig.addFilter('pluralize', (word, count) => {
    if (count !== undefined && count === 1) {
      return word;
    }

    return inflection.pluralize(word);
  });

  // eleventyConfig.addPlugin(navigation);

  // eleventyConfig.addShortcode('year', function () {
  //   console.log("CALLING YEAR");
  //   return new Date().getFullYear();
  // });
  // eleventyConfig.addNunjucksGlobal('year', new Date().getFullYear().toString());

  // Allow YAML everywhere that JSON is supported.
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents));

  // Copy Static Files to /_Site

  eleventyConfig.addPassthroughCopy({
    'node_modules/alpinejs/dist/cdn.min.js': 'static/js/alpine.js',
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy('src/static/media');

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy({
    'src/static/favicon/favicon.ico': 'favicon.ico',
  });
  eleventyConfig.addPassthroughCopy('src/static/favicon');

  // Minify HTML
  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: 'src',
    },
    // dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
