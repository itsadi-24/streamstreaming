/** @type {import('next').NextConfig} */
const nextConfig = {
  // the meaning behind these code is whoever goes to localhost:3000 will be redirected to destination
  redirects() {
    return [
      {
        source: '/',
        destination: '/discover/now_playing',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
