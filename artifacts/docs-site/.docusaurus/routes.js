import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/',
    component: ComponentCreator('/', '17b'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '681'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'b76'),
            routes: [
              {
                path: '/api/menu',
                component: ComponentCreator('/api/menu', '52d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/auth',
                component: ComponentCreator('/auth', 'd3f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/websocket',
                component: ComponentCreator('/websocket', '026'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'fc9'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
