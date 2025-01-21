import { createWriteStream } from "fs";
import { SitemapStream } from "sitemap";

// Creates a sitemap object given the input configuration with URLs
const sitemap = new SitemapStream({
    hostname: "https://tides-of-tyria.chuggs.net",
});

const writeStream = createWriteStream("./public/sitemap.xml");
sitemap.pipe(writeStream);

sitemap.write({ url: "/", changefreq: "weekly", priority: 1 });
sitemap.end();
