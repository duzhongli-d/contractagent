import * as React from 'react';

interface EmailTemplateProps {
	firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    inqType: string;
    message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ firstName, lastName,email,phone,inqType,message }) => (
	<div>
		<h1>Welcome, {firstName}!</h1>
        <p>A new contact form submission has been received with the following details:</p>
        <ul>
            <li><strong>First Name:</strong> {firstName}</li>
            <li><strong>Last Name:</strong> {lastName}</li>
            <li><strong>Email:</strong> {email}</li>
            {phone && <li><strong>Phone:</strong> {phone}</li>}
            <li><strong>Inquiry Type:</strong> {inqType}</li>
            <li><strong>Message:</strong> {message}</li>
        </ul>
        <p>Please review and respond as necessary.</p>
	</div>
);
