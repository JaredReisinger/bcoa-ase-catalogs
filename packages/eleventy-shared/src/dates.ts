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
  eleventyConfig.addFilter("readableDate", (date: Dateable) => {
    return luxonify(date).toFormat("LLLL d, yyyy");
  });

  eleventyConfig.addFilter("readableAge", (date: Dateable) => {
    const birthdate = luxonify(date);
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
