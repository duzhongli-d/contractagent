'use server';
import { EmailTemplate } from '@/components/email/default-template';
import { Resend } from 'resend';
import PostHogClient from '@/posthog';
import { auth } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (prevState: any, formData: any) => {
    const { userId } = await auth();
    const posthog = PostHogClient();
    try {
		const bodyData = Object.fromEntries(formData);
        const { firstName, lastName, email, phone, inqType, message } = bodyData;    

		const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'duzhongli@gmail.com',
			subject: 'Contract Agent LegalEdge',
			react: await EmailTemplate({ firstName, lastName, email, phone, inqType, message }),
		});

        posthog.capture({
            distinctId: userId!,
            event: 'contact_form_submitted',
            properties: { 
                email,
                inqType,
                message,
            }
        });

		if (error) {
			console.log(`Error sending email in the api route:`, error);
            return { success: false, error };
		}

        return { success: true, data };
	} catch (error) {
		console.log(`Error sending email in the api route in the catch block:`, error);
        return { success: false, error };
	}
}