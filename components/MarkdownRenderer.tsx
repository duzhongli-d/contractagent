import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
	return (
		<div className='prose max-w-none'>
			<ReactMarkdown>{markdown}</ReactMarkdown>
		</div>
	);
};

export default MarkdownRenderer;
