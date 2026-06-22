import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/',
    component: ComponentCreator('/', '0d3'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '764'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '758'),
            routes: [
              {
                path: '/api/menu',
                component: ComponentCreator('/api/menu', '52d'),
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
