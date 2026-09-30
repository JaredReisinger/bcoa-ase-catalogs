const isProduction = process.env.NODE_ENV === 'production';

export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-nested': {},
    ...(isProduction ? { cssnano: {} } : {}),
  },
};
