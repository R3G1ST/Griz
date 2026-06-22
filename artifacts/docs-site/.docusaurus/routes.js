import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/',
    component: ComponentCreator('/', '74a'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'b92'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'ab5'),
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
