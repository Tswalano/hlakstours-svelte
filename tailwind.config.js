import adapter from 'amplify-adapter';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#52299f',     // Vibrant Purple
        secondary: '#0a7ec9',   // Cool Blue
        accent: '#10b981',      // Vibrant Green
        'accent-bg': '#facc15', // Warm Yellow
        'gray-dark': '#1f2937', // Dark Gray
        'gray-light': '#d1d5db',// Soft Gray
        'bg-gray-light': '#f9fafb', // Off-White
      },
    },
  },
  plugins: [],
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter()
  }
}
