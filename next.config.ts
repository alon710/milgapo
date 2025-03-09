import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            "lh3.googleusercontent.com", // Google user images
            "avatars.githubusercontent.com", // GitHub avatars
            "platform-lookaside.fbsbx.com", // Facebook avatars
            "s.gravatar.com", // Gravatar
            "graph.facebook.com", // Facebook graph API
            "pbs.twimg.com", // Twitter
            "fjojdwojbxpjyhhgqdad.supabase.co" // Project-specific Supabase URL
        ]
    }
};

export default nextConfig;
