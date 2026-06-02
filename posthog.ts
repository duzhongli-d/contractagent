import PostHog from 'posthog-js';

const PostHogClient = () => {
	return PostHog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
	});
};

export default PostHogClient;