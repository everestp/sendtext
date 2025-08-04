export type AppConfig = {
  nextAuthSecret: string;
  googleClientId: string;
  googleClientSecret: string;
  upstashRedisRestUrl: string;
  upstashRedisRestToken: string;
};

const config: AppConfig = {
  nextAuthSecret: process.env.NEXTAUTH_SECRET!,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL!,
  upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
};

export default config;
