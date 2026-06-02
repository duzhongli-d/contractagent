import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// import fs from 'fs';
// import pdfParse from 'pdf-parse';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts text from a PDF file.
 * @param filePath - The path to the PDF file.
 * @returns A promise that resolves to the extracted text.
 */
// export async function extractTextFromPDF(filePath: string): Promise<string> {
// 	try {
// 		const dataBuffer = fs.readFileSync(filePath);
// 		const pdfData = await pdfParse(dataBuffer);
// 		return pdfData.text;
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			throw new Error(`Failed to extract text from PDF: ${error.message}`);
// 		} else {
// 			throw new Error('Failed to extract text from PDF: Unknown error');
// 		}
// 	}
// }