import type { NextConfig } from "next";
const nextConfig: NextConfig = { poweredByHeader:false, images:{remotePatterns:[{protocol:"https",hostname:"res.cloudinary.com"},{protocol:"https",hostname:"drive.google.com"},{protocol:"https",hostname:"lh3.googleusercontent.com"}]} };
export default nextConfig;
