// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require("dotenv").config();

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const math = require("remark-math");
const katex = require("rehype-katex");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "EigenDA",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.eigenda.xyz/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "layr-labs", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  markdown: {
    mermaid: true,
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/png",
        href: "/img/favicon-96x96.png",
        sizes: "96x96",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/svg+xml",
        href: "/img/favicon.svg",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital@0;1&display=swap&subset=latin-ext",
      },
    },
  ],

  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/eigenda-guides/eigenda-overview/",
            to: "/core-concepts/overview/",
          },
          {
            from: "/eigenda/overview/",
            to: "/core-concepts/overview/",
          },
          {
            from: "/overview/",
            to: '/core-concepts/overview/',
          },
          {
            from: "/eigenda-guides/eigenda-rollup-user-guides/",
            to: "/integrations-guides/eigenda-proxy/",
          },
          {
            from: "/eigenda/integrations-guides/rollup-guides/",
            to: "/integrations-guides/eigenda-proxy/",
          },
          {
            from: "/eigenda-guides/eigenda-rollup-user-guides/building-on-top-of-eigenda",
            to: "/integrations-guides/eigenda-proxy/",
          },
          {
            from: "/eigenda/rollup-guides/tutorial",
            to: "/integrations-guides/eigenda-proxy/",
          },
          {
            from: "/eigenda-guides/eigenda-rollup-user-guides/system-performance-and-customization",
            to: "/api/v1/disperser/metering-and-rate-limits",
          },
          {
            from: "/eigenda/integrations-guides/dispersal/api-documentation/metering-and-rate-limits",
            to: "/api/v1/disperser/metering-and-rate-limits",
          },
          {
            from: "/eigenda/system-performance-and-customization",
            to: "/api/v1/disperser/metering-and-rate-limits",
          },
          {
            from: "/eigenda/performance-metrics",
            to: "/api/v1/disperser/metering-and-rate-limits",
          },
          {
            from: "/eigenda-guides/eigenda-rollup-user-guides/blob-explorer",
            to: "/networks/mainnet",
          },
          {
            from: "/eigenda/networks/",
            to: "/networks/mainnet",
          },
          {
            from: "/eigenda/blob-explorer",
            to: "/networks/mainnet",
          },
          {
            from: "/eigenda-guides/eigenda-rollup-user-guides/op-stack-+-eigenda-user-guide",
            to: "/integrations-guides/rollup-guides/op-stack",
          },
          {
            from: "/eigenda/integrations-guides/rollup-guides/op-stack",
            to: "/integrations-guides/rollup-guides/op-stack",
          },
          {
            from: "/eigenda/rollup-guides/op-stack",
            to: "/integrations-guides/rollup-guides/op-stack",
          },
          {
            from: "/eigenda/integrations-guides/rollup-guides/op-stack/overview",
            to: "/integrations-guides/rollup-guides/op-stack",
          },
          {
            from: "/eigenda-guides/eigenda-rollup-user-guides/op-stack-+-eigenda-user-guide/deploying-op-stack",
            to: "/integrations-guides/rollup-guides/op-stack",
          },
          {
            from: "/eigenda/integrations-guides/rollup-guides/op-stack/deployment",
            to: "/integrations-guides/rollup-guides/op-stack",
          },
          {
            from: "/eigenda-guides/integrations-overview",
            to: "/integrations-guides/rollup-guides/integrations-overview",
          },
          {
            from: "/eigenda/integrations-guides/rollup-guides/integrations-overview",
            to: "/integrations-guides/rollup-guides/integrations-overview",
          },
          {
            from: "/eigenda/integrations-overview",
            to: "/integrations-guides/rollup-guides/integrations-overview",
          },
          {
            from: "/eigenda/rollup-guides/integrations-overview",
            to: "/integrations-guides/rollup-guides/integrations-overview",
          },
          {
            from: "/operator-guides/avs-installation-and-registration/eigenda-operator-guide/",
            to: "/operator-guides/overview",
          },
          {
            from: "/eigenda/operator-guides/overview",
            to: "/operator-guides/overview",
          },
          {
            from: "/operator-guides/avs-installation-and-registration/eigenda-operator-guide/troubleshooting",
            to: "/operator-guides/troubleshooting",
          },
          {
            from: "/eigenda/operator-guides/troubleshooting",
            to: "/operator-guides/troubleshooting",
          },
          {
            from: "/faqs/eigenda-operator-faq",
            to: "/operator-guides/operator-faq",
          },
          {
            from: "/eigenda/operator-guides/operator-faq",
            to: "/operator-guides/operator-faq",
          },
          {
            from: "/eigenda/rollup-guides/",
            to: "/integrations-guides/rollup-guides/integrations-overview",
          },
          {
            from: "/eigenda/rollup-guides/api-error-codes",
            to: "/api/v1/disperser/error-codes",
          },
          {
            from: "/eigenda/integrations-guides/dispersal/api-documentation/error-codes",
            to: "/api/v1/disperser/error-codes",
          },
          {
            from: "/eigenda/rollup-guides/blob-encoding",
            to: "/api/v1/disperser/blob-serialization-requirements",
          },
          {
            from: "/eigenda/integrations-guides/dispersal/api-documentation/blob-serialization-requirements",
            to: "/api/v1/disperser/blob-serialization-requirements",
          },
          {
            from: "/eigenda/integrations-guides/dispersal/disperser-golang-grpc-client",
            to: "/integrations-guides/clients/golang-client-v1",
          },
          {
            from: "/eigenda/integrations-guides/dispersal/clients/golang-client",
            to: "/integrations-guides/clients/golang-client-v1",
          },
          {
            from: "/releases/v2",
            to: "/releases/blazar",
          },
        ],
        createRedirects(existingPath) {
          return undefined; // Return a falsy value: no redirect created
        },
      },
    ],
  ],

  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          breadcrumbs: true,
          routeBasePath: "/",
          remarkPlugins: [math.default],
          rehypePlugins: [katex.default],
          showLastUpdateTime: false,
        },
        blog: {
          blogTitle: "EigenDA Status",
          postsPerPage: "ALL",
          routeBasePath: "/status",
        },

        theme: {
          customCss: [
            "./src/css/custom.css",
            "./src/css/fonts.css",
            "./src/css/headerGithubLink.css",
          ],
        },

        gtag: {
          trackingID: "G-Z1L4DWRVCZ",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/eigenda-logo.svg",

      colorMode: {
        disableSwitch: true,
        defaultMode: "light",
      },
      navbar: {
        logo: {
          alt: "EigenDA Logo",
          src: "img/eigenda-logo.svg",
          style: {
            marginLeft: 32,
          },
        },
        items: [
          {
            to: "core-concepts/overview",
            label: "Docs",
            position: "left",
          },
          {
            to: "api/v1/disperser/overview",
            label: "API Docs",
            position: "left",
          },
          {
            href: "https://github.com/Layr-Labs/eigenda-docs",
            className: "header--github-link",
            "aria-label": "GitHub repository",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "EigenLayer",
            items: [
              {
                label: "About",
                href: "https://www.eigenlayer.xyz/",
              },
              {
                label: "Privacy Policy",
                href: "https://docs.eigenlayer.xyz/eigenlayer/legal/eigenlayer-privacy-policy",
              },
              {
                label: "Terms of Service",
                href: "https://docs.eigenlayer.xyz/eigenlayer/legal/terms-of-service",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.com/invite/eigenlayer",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/eigenlayer",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/Layr-Labs",
              },
              {
                label: "Discourse",
                href: "http://forum.eigenlayer.xyz/",
              },
              {
                label: "Youtube",
                href: "https://www.youtube.com/@EigenLayer",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} <a href="https://www.eigenlabs.org">Layr Labs</a>`,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: false,
        },
      },
      prism: {
        theme: lightCodeTheme,
        additionalLanguages: ["bash", "protobuf", "solidity"],
      },
    }),
  scripts: [
    // Object format.
    {
      src: "/js/intercom.js",
      async: true,
    },
  ],
  themes: [
    [
      // @ts-ignore
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      // @ts-ignore
      ({
        // `hashed` is recommended as long-term-cache of index file is possible
        language: ["en"],
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: "/",
      }),
    ],
    "@docusaurus/theme-mermaid",
  ],
};

module.exports = config;
