import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
  },
  features: {
    buildStoriesJson: true,
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;