export default function (eleventyConfig) {
  const analyticsEnabled = process.env.ANALYTICS_ENABLED === "true";
  const gtmContainerId = process.env.GTM_CONTAINER_ID?.trim();

  if (analyticsEnabled && !gtmContainerId) {
    throw new Error("ANALYTICS_ENABLED=true の場合は GTM_CONTAINER_ID が必要です。");
  }

  if (gtmContainerId && !/^GTM-[A-Z0-9]+$/.test(gtmContainerId)) {
    throw new Error("GTM_CONTAINER_ID は GTM- で始まるコンテナIDを指定してください。");
  }

  eleventyConfig.addGlobalData("analytics", {
    enabled: analyticsEnabled,
    gtmContainerId
  });

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
