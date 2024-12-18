// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require("dotenv").config();

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;
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
    mermaid: true
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/eigenda-guides/eigenda-overview/",
            to: "/overview/",
          },
          {
            from: "/eigenda/overview/",
            to: "/overview/",
          },
          {
            from: "/eigenda/overview/payments/",
            to: "/payments/",
          },
          {
            from: "/eigenda-guides/eigenda-rollup-user-guides/",
            to: "/integrations-guides/rollup-guides/",
          },
          {
            from: "/eigenda/integrations-guides/rollup-guides/",
            to: "/integrations-guides/rollup-guides/",
          },
          {
            from: "/eigenda-guides/eigenda-rollup-user-guides/building-on-top-of-eigenda",
            to: "/integrations-guides/rollup-guides/",
          },
          {
            from: "/eigenda/rollup-guides/tutorial",
            to: "/integrations-guides/rollup-guides/",
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
            to: "/networks/",
          },
          {
            from: "/eigenda/networks/",
            to: "/networks/",
          },
          {
            from: "/eigenda/blob-explorer",
            to: "/networks/",
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
            to: "/integrations-guides/rollup-guides/",
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
            to: "/integrations-guides/dispersal/clients/golang-client",
          },
          {
            from: "/eigenda/integrations-guides/dispersal/clients/golang-client",
            to: "/integrations-guides/dispersal/clients/golang-client",
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
          sidebarPath: require.resolve('./sidebars.js'),
          breadcrumbs: true,
          routeBasePath: "/",
          remarkPlugins: [math],
          rehypePlugins: [katex],
          showLastUpdateTime: false
        },
        blog: {
          blogTitle: "EigenDA Status",
          postsPerPage: "ALL",
          routeBasePath: "/status",
        },

        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },

        gtag: {
          trackingID: 'G-Z1L4DWRVCZ',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/eigenda-logo.png',

      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "EigenDA Docs",
        logo: {
          alt: "EigenDA Logo",
          src: "img/eigenda-logo.png",
        },
        items: [
          {
            to: "overview",
            label: "Docs",
            position: "left",
          },
          {
            to: "api/v1/disperser/overview",
            label: "API Docs",
            position: "left",
          },
          {
            href: "https://github.com/Layr-Labs",
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
        copyright: `Copyright © ${new Date().getFullYear()} Layr Labs`,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["bash"],
      },
    }),
  scripts: [
    // Object format.
    {
      src: '/js/intercom.js',
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
    '@docusaurus/theme-mermaid'
  ],
};

module.exports = config;
