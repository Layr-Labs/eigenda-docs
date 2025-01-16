module.exports = {
    docs: [
        {
            type: 'html',
            value: 'CORE CONCEPTS',
        },
        {
            type: 'doc',
            id: 'overview',
            label: 'Overview',
        },
        {
            type: 'html',
            value: '<div class="sidebar-separator"></div>',
        },
        {
            type: 'html',
            value: 'Protocol Releases',
        },
        {
            type: 'autogenerated',
            dirName: 'releases',
        },
        {
            type: 'html',
            value: '<div class="sidebar-separator"></div>',
        },
        {
            type: 'html',
            value: 'NODE OPERATORS',
        },
        {
            type: 'autogenerated',
            dirName: 'operator-guides',
        },
        {
            type: 'html',
            value: '<div class="sidebar-separator"></div>',
        },
        {
            type: 'html',
            value: 'INTEGRATIONS GUIDES',
        },
        {
            type: 'autogenerated',
            dirName: 'integrations-guides',
        },
        {
            type: 'html',
            value: '<div class="sidebar-separator"></div>',
        },
        {
            type: 'html',
            value: 'NETWORK INFORMATION',
        },
        {
            type: 'autogenerated',
            dirName: 'networks',
        },
    ],
    api: [
        {
            type: 'html',
            value: 'V1',
        },
        {
            type: 'autogenerated',
            dirName: 'api/v1/disperser',
        },
    ],
};