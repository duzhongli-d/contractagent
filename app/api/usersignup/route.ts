import { NextResponse } from "next/server";
import { setUpTokensForFirstTimeUser } from "@/app/actions/tokens";
import { Webhook } from 'svix';

// This endpoint receives webhook events from Clerk on user signup, and sets up tokens for the user in PostgreSQL
interface ClerkWebhookBody {
    data: {
        id: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export async function POST(req: Request) {
    const whSecret: string = process.env.CLERK_WEBHOOK_SECRET || "";

    const svix_id = req.headers.get('svix-id') ?? '';
	const svix_timestamp = req.headers.get('svix-timestamp') ?? '';
	const svix_signature = req.headers.get('svix-signature') ?? '';

    const body = await req.text();

    const sivx = new Webhook(whSecret);

	let msg: ClerkWebhookBody;

	try {
		msg = sivx.verify(body, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature,
		}) as ClerkWebhookBody;
	} catch (err) {
		return new Response('Bad Request', { status: 400 });
	}

	console.log(`Clerk Webhook verified:`, msg);
	
	const clerk_user_id = msg.data.id;

    // const bodyObj: ClerkWebhookBody = await req.json(); // ! This wont work because we already read the body as text
    // const clerk_user_id: string = bodyObj.data.id;

    // Add tokens to user
    await setUpTokensForFirstTimeUser(clerk_user_id);

    return NextResponse.json({ message: "Tokens added" }, { status: 200 });
}

const examplePayload = {
	data: {
		birthday: '',
		created_at: 1654012591514,
		email_addresses: [
			{
				email_address: 'example@example.org',
				id: 'idn_29w83yL7CwVlJXylYLxcslromF1',
				linked_to: [],
				object: 'email_address',
				verification: {
					status: 'verified',
					strategy: 'ticket',
				},
			},
		],
		external_accounts: [],
		external_id: '567772',
		first_name: 'Example',
		gender: '',
		id: 'user_29w83sxmDNGwOuEthce5gg56FcC',
		image_url: 'https://img.clerk.com/xxxxxx',
		last_name: 'Example',
		last_sign_in_at: 1654012591514,
		object: 'user',
		password_enabled: true,
		phone_numbers: [],
		primary_email_address_id: 'idn_29w83yL7CwVlJXylYLxcslromF1',
		primary_phone_number_id: null,
		primary_web3_wallet_id: null,
		private_metadata: {},
		profile_image_url: 'https://www.gravatar.com/avatar?d=mp',
		public_metadata: {},
		two_factor_enabled: false,
		unsafe_metadata: {},
		updated_at: 1654012591835,
		username: null,
		web3_wallets: [],
	},
	event_attributes: {
		http_request: {
			client_ip: '0.0.0.0',
			user_agent:
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
		},
	},
	object: 'event',
	timestamp: 1654012591835,
	type: 'user.created',
};