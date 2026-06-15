/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@corsair-dev/mcp", "express"],
  // ...rest of your config
};

export default nextConfig;
