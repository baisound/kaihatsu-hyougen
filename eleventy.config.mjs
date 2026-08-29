export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("site/css");
  eleventyConfig.addPassthroughCopy("site/images");
  eleventyConfig.addPassthroughCopy("site/scripts");

  eleventyConfig.addWatchTarget("site/css");
  eleventyConfig.addWatchTarget("site/scripts");

  return {
    dir: {
      input: "site",
      includes: "_includes",
      output: "_site"
    },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk"
  };
}
