const menu = (workspaceId) => [
  {
    name: 'Workspace',
    menuItems: [
      {
        name: 'Domain Health',
        path: `/account/${workspaceId}`,
        icon: '🍊',
      },
      {
        name: 'Domain Settings',
        path: `/account/${workspaceId}/settings/domain`,
        icon: '⚙️',
      },
    ],
  },
  {
    name: 'Team',
    menuItems: [
      {
        name: 'Team Members',
        path: `/account/${workspaceId}/settings/team`,
        icon: '👥',
      },
      {
        name: 'Workspace Settings',
        path: `/account/${workspaceId}/settings/general`,
        icon: '🏢',
      },
    ],
  },
];

export default menu;
