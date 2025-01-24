module.exports = {
  docs: [
    {
      type: "html",
      value: "<b>Core Concepts</b>",
    },
    {
      type: "doc",
      id: "overview",
      label: "Overview",
    },
    {
      type: "html",
      value: '<div class="sidebar-spacer"></div>',
    },
    {
      type: "html",
      value: "<b>Protocol Releases</b>",
    },
    {
      type: "autogenerated",
      dirName: "releases",
    },
    {
      type: "html",
      value: '<div class="sidebar-spacer"></div>',
    },
    {
      type: "html",
      value: "<b>Node Operators</b>",
    },
    {
      type: "autogenerated",
      dirName: "operator-guides",
    },
    {
      type: "html",
      value: '<div class="sidebar-spacer"></div>',
    },
    {
      type: "html",
      value: "<b>Integrations Guides</b>",
    },
    {
      type: "autogenerated",
      dirName: "integrations-guides",
    },
    {
      type: "html",
      value: '<div class="sidebar-spacer"></div>',
    },
    {
      type: "html",
      value: "<b>Network Information</b>",
    },
    {
      type: "autogenerated",
      dirName: "networks",
    },
  ],
  api: [
    {
      type: "html",
      value: "V1",
    },
    {
      type: "autogenerated",
      dirName: "api/v1/disperser",
    },
  ],
};
