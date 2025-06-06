/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["maps.googleapis.com", "res.cloudinary.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        async_hooks: false,
        fs: false,
        net: false,
        tls: false,
        cypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
        url: false,
        dns: false,
        dgram: false,
        child_process: false,
        cluster: false,
        process: false,
        querystring: false,
        readline: false,
        repl: false,
        string_decoder: false,
        tty: false,
        vm: false,
      };
    }

    // Handle node: protocol imports
    config.resolve.alias = {
      ...config.resolve.alias,
      "node:async_hooks": "async_hooks",
      "node:fs": "fs",
      "node:net": "net",
      "node:tls": "tls",
      "node:crypto": "crypto",
      "node:stream": "stream",
      "node:http": "http",
      "node:https": "https",
      "node:zlib": "zlib",
      "node:path": "path",
      "node:os": "os",
      "node:util": "util",
      "node:url": "url",
      "node:dns": "dns",
      "node:dgram": "dgram",
      "node:child_process": "child_process",
      "node:cluster": "cluster",
      "node:process": "process",
      "node:querystring": "querystring",
      "node:readline": "readline",
      "node:repl": "repl",
      "node:string_decoder": "string_decoder",
      "node:tty": "tty",
      "node:vm": "vm",
    };

    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com blob:; style-src 'self' 'unsafe-inline' https://maps.googleapis.com; img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com; connect-src 'self' https://*.googleapis.com; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
