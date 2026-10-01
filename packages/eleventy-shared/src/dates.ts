import type { EleventyConfig } from "11ty.ts";
import { DateTime } from "luxon";

interface PluginOptions {
  showDate: Dateable;
}

export default function (
  eleventyConfig: EleventyConfig,
  options: PluginOptions,
) {
  const showDate = luxonify(options.showDate);

  eleventyConfig.addGlobalData("showDate", showDate);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "LLLL d, yyyy",
    );
  });

  eleventyConfig.addFilter("readableAge", (dateObj) => {
    const birthdate = DateTime.fromJSDate(dateObj, { zone: "utc" });
    const age = showDate.diff(birthdate, ["years", "months"]).toHuman({
      maximumFractionDigits: 0,
    });

    return age;
  });
}

export type Dateable = string | DateTime | Date;

export function luxonify(d: Dateable): DateTime {
  if (DateTime.isDateTime(d)) {
    return d.toUTC();
  }

  if (d instanceof Date) {
    return DateTime.fromJSDate(d).toUTC();
  }

  return DateTime.fromISO(d, { zone: "utc" });
}
