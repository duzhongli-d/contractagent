import { Client, Databases, Account, Storage } from 'node-appwrite';

const createAdminClient = async () => {
	console.log(
		`Creating admin client with endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}, project ID: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
	);

	const client = new Client()
		.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
		.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
		.setKey(process.env.APPWRITE_SECRET_KEY || '');

	return {
		get account() {
			return new Account(client);
		},
		get databases() {
			return new Databases(client);
		},
		get storage() {
			return new Storage(client);
		},
	};
};

const createSessionClient = async (session: any) => {
	const client = new Client()
		.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
		.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

	if (session) {
		client.setSession(session);
	}

	return {
		get account() {
			return new Account(client);
		},
		get databases() {
			return new Databases(client);
		},
		get storage() {
			return new Storage(client);
		},
		get client() {
			return client;
		},
	};
};

export { createAdminClient, createSessionClient };
