let safelist = [
  'tw-btn-primary',
  'tw-btn-secondary',
  'tw-btn-xs',
  'tw-btn-sm',
  'tw-btn-m',
  'tw-btn-lg',
  'tw-btn-xl',
  'tw-btn-outline-primary',
  'tw-btn',
  'tw-bg-secondary',
  'tw-tooltip-top',
  'tw-tooltip-right',
  'tw-tooltip-bottom',
  'tw-tooltip-left',
];

// Whitelisting level options from ListItem component
for (let i = 0; i < 100; i++) {
  safelist.push(`tw-pl-[${2 + (i || 0) * 1}rem`);
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/elements/**/*.{js,jsx,ts,tsx}',
    './src/templates/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    maxHeight: {
      240: '240px',
    },
    extend: {
      screens: {
        '1300px': { min: '1300px' },
        'min-576px': { min: '576px' },
        'min-767px': { min: '767px' },
        'min-992px': { min: '992px' },
        '50rem': { max: '50rem' },
        '767px': { max: '767px' },
        '965px': { max: '965px' },
        '992px': { min: '992px' },
        '800px': { max: '800px' },
        '1240px': { max: '1240px' },
      },
      colors: {
        'light-gray': 'rgba(0,0,0,.03)',
        'border-gray': 'rgba(0,0,0,.125)',
        'disable-gray': '#dee2e6',
        'primary-blue': '#0d6efd',
        'gray-500': '#adb5bd',
        'dark-gray': '#6c757d',
        'muted-gray': '#6c757d',
        'deep-blue': '#0a58ca',
        'secondary-gray': 'rgba(108,117,125,1)',
        'text-light-gray': 'rgba(248,249,250,1)',
        'border-light-gray': '#d9deee',
        'default-gray': 'rgb(128, 128, 128)',
        danger: '#dc3545',
        'gray-900': '#212529',
        '0-0-0-055': 'rgba(0, 0, 0, 0.55)',
        'light-orange': '#ec9982',
        'list-gray': '#5c6975',
        'light-blue': 'rgb(230,236,241)',
      },
      gridTemplateColumns: {
        5: 'repeat(5, minmax(0, 1fr))',
        6: 'repeat(6, minmax(0, 1fr))',
        7: 'repeat(7, minmax(0, 1fr))',
        8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',
        '1fr-3fr': '1fr 3fr',
      },
      boxShadow: {
        card: '0 2px 5px 0px #e3e5ec',
      },
      transitionProperty: {
        btn: 'color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out',
        'bg-color-02': 'color 0.2s ease-out',
      },
      zIndex: {
        2: '2',
      },
      borderWidth: {
        1.5: '1.5px',
        2.5: '2.5px',
      },
      padding: {
        0.8: '0.8rem',
        'row-left': 'calc(1.5rem*.5)',
        'row-right': 'calc(1.5rem*.5)',
        'container-left': '.75rem',
        'container-right': '.75rem',
      },
      borderRadius: {
        '5px': '5px',
        'row-left': 'calc(var(--tw-gutter-x)*.5)',
        'row-right': 'calc(var(--tw-gutter-x)*.5)',
      },
      fontFamily: {
        karla: 'Karla, sans-serif',
      },
      fontSize: {
        '32px': '32px',
      },
      flex: {
        '0-0-auto': '0 0 auto',
      },
      transformOrigin: {
        'center-left': 'center left',
      },
    },
  },
  plugins: [],
  safelist: safelist,
};
