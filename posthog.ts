import { PostHog } from 'posthog-node';

const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    flushAt: 20,
    flushInterval: 10000,
});

const PostHogClient = () => client;

export default PostHogClient;
