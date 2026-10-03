import { fileURLToPath } from "node:url";
import { DateTime } from "luxon";

import { prettyQuotes } from "./typography.js";

export abstract class SharedPage<TData> {
  abstract data(): Record<string, unknown>;
  abstract render(data: TData): string | Promise<string>;
}

export interface AseSiteData {
  // settings: {
  //   name: string;
  //   logo: string;
  // };

  showDate: DateTime;
  showNameLong: string;
  showNameShort: string;

  dogs: DogEntry[];
  dog?: DogEntry; // when paginating

  // standard Eleventy data...

  eleventy: {
    version: string;
    generator: string;
    env: {
      source: string;
      runMode: string;
      config: string;
      root: string;
      [index: string]: string;
    };
    directories: {
      input: string;
      data: string;
      includes: string;
      output: string;
    };
  };

  pkg: {
    // package.json info?
    name: string;
    private?: boolean;
    type?: string;
    scripts?: Record<string, string>;
    devDependencies?: Record<string, string>;
    dependencies?: Record<string, string>;
  };

  permalink: string;
  layout: string;

  eleventyComputed: Record<string, string | Function>;

  page: {
    inputPath: string;
    fileSlug: string;
    filePathStem: string;
    outputFileExtension: string;
    templateSyntax: string;
    date: string;
    rawInput: unknown;
    url: string;
    outputPath: string;
  };

  collections: unknown;
  title: string;
}

export interface Dog {
  name: string;
  prefix?: string;
  suffix?: string;
}

export interface DogEntry extends Dog {
  ase?: boolean;
  parade?: boolean;
  armband: number;
  ofaNum?: string | number;
  classPlace?: number;
  award?: "bob" | "bos";
  id: string;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  userId: string;
  quotient: string;
  ageClass: string;
  sex: string;
  birthdate: string;
  imageId: string;
  breeder: string;
  owner: string;
  city: string;
  state: string;
  registration: string;
  ancestors: {
    sireSire?: Dog;
    sire?: Dog;
    sireDamSire?: Dog;
    sireDam?: Dog;
    sireDamDam?: Dog;
    damSire?: Dog;
    dam?: Dog;
    damDamSire?: Dog;
    damDam?: Dog;
    damDamDam?: Dog;
  };
}

type Generator = (data: AseSiteData) => string;

export type PageName = "index" | "dogs" | "catalog";

// It's not clear if a factory like this is better/worse that separate
// hard-coded page classes.  The data might be better as separate classes.
export function Page(pageName: PageName): typeof SharedPage<AseSiteData> {
  return class PageImpl implements SharedPage<AseSiteData> {
    constructor() {
      // console.log(
      //   `SHARED PAGE CONSTRUCTOR ${Object.keys(this)} -- [${pageName}]`,
      // );
    }

    data() {
      // console.log(`PAGE ${pageName} DATA: ${Object.keys(this)}`);

      // each page has a slightly different permalink, title, etc.
      let permalink: Generator = () => `/${pageName}/`;
      let extraData = {};
      let extraComputed = {};

      const urlHost = (data: AseSiteData) =>
        `https://ase${data.showDate.year}.jaredreisinger.com`;

      const siteName = (data: AseSiteData) => data.showNameLong;
      let pageTitle: Generator | undefined;

      let ogImage = (data: AseSiteData) =>
        `${urlHost(data)}/static/media/logo.png`;
      let ogImageType = (data: AseSiteData) => "image/png";
      let ogImageAlt = siteName;

      switch (pageName) {
        case "index":
          permalink = () => "/";
          break;

        case "dogs":
          permalink = (data: AseSiteData) => `/dogs/${data.dog!.id}/`;
          const dogNameFn = (data: AseSiteData) => prettyQuotes(data.dog!.name);
          pageTitle = dogNameFn;

          const ogImageOrig = ogImage;
          const ogImageTypeOrig = ogImageType;
          ogImage = (data: AseSiteData) =>
            data.dog!.imageId
              ? `${urlHost(data)}/static/media/dogs/${data.dog!.imageId}.jpg`
              : ogImageOrig(data);
          ogImageType = (data: AseSiteData) =>
            data.dog!.imageId ? "image/jpeg" : ogImageTypeOrig(data);
          ogImageAlt = dogNameFn;

          // need to define the additional frontmatter info...
          extraData = {
            pagination: {
              data: "dogs",
              size: 1,
              alias: "dog",
            },

            ancestorKeys: [
              ["sireSireSire", 3],
              ["sireSire", 2],
              ["sireSireDam", 3],
              ["sire", 1],
              ["sireDamSire", 3],
              ["sireDam", 2],
              ["sireDamDam", 3],
              ["SELF", 0],
              ["damSireSire", 3],
              ["damSire", 2],
              ["damSireDam", 3],
              ["dam", 1],
              ["damDamSire", 3],
              ["damDam", 2],
              ["damDamDam", 3],
            ],
          };

          extraComputed = {
            // open graph specific to dogs..
            ogType: "profile",
            customMeta: (data: AseSiteData) =>
              [
                {
                  property: "profile:first_name",
                  content: dogNameFn(data),
                },
                {
                  property: "profile:gender",
                  content: data.dog!.sex == "M" ? "male" : "female",
                },
              ].map((attrs) => ({ tag: "meta", attrs })),
          };
          break;

        case "catalog":
          pageTitle = (data: AseSiteData) => "Catalog";
          break;
      }

      return {
        permalink,
        layout: "default",
        ...extraData,
        eleventyComputed: {
          title: pageTitle
            ? (data: AseSiteData) => `${pageTitle(data)} — ${siteName(data)}`
            : siteName,
          siteName,
          ogTitle: pageTitle,
          ogUrl: (data: AseSiteData) => `${urlHost(data)}${data.page.url}`,
          ogImage,
          ogImageType,
          ogImageAlt,
          ...extraComputed,
        },
      };
    }

    render(this: any, data: AseSiteData) {
      // console.log(`PAGE ${pageName} RENDER: ${Object.keys(this)}`);
      // `this` is the object configured by adding plugins and the like, so we
      // have access to all the filters and shortcodes, including renderFile.
      return this.renderFile(
        fileURLToPath(
          import.meta.resolve(
            `@ase/eleventy-shared/templates/pages/${pageName}.html`,
          ),
        ),
        data,
      );
    }
  };
}
