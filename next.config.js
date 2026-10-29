/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // The API accepts product images up to 5 MB; the default 1 MB would reject them.
      bodySizeLimit: '6mb',
    },
  },
};

export default nextConfig;
