// src/routes/api/generate-ticket/+server.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import type { RequestHandler } from './$types';
import { sendTicketEmail } from '$lib/server/email';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
    try {
        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);

        // Embed fonts
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Add a page
        const page = pdfDoc.addPage([600, 250]); // Width: 600, Height: 250 for a ticket-like shape

        // Colors
        const orangeColor = rgb(1, 0.6, 0);
        const grayColor = rgb(0.5, 0.5, 0.5);

        // Draw the orange header strip
        page.drawRectangle({
            x: 0,
            y: 200,
            width: 600,
            height: 50,
            color: orangeColor,
        });

        // Draw "ADVENTURE PASS" text
        page.drawText('ADVENTURE PASS', {
            x: 20,
            y: 220,
            size: 20,
            font: helveticaBold,
            color: rgb(1, 1, 1)
        });

        page.drawText('Boarding pass', {
            x: 250,
            y: 220,
            size: 16,
            font: helveticaFont,
            color: rgb(1, 1, 1)
        });

        // Draw route information
        page.drawText('HOME', {
            x: 20,
            y: 160,
            size: 36,
            font: helveticaBold,
            color: rgb(0, 0, 0)
        });

        // Draw airplane symbol (simple representation)
        page.drawLine({
            start: { x: 150, y: 160 },
            end: { x: 250, y: 160 },
            thickness: 1,
            color: rgb(0, 0, 0)
        });

        page.drawText('CPT', {
            x: 280,
            y: 160,
            size: 36,
            font: helveticaBold,
            color: rgb(0, 0, 0)
        });

        // Draw passenger information
        const drawField = (label: string, value: string, x: number, y: number) => {
            page.drawText(label, {
                x,
                y: y + 15,
                size: 8,
                font: helveticaFont,
                color: grayColor
            });
            page.drawText(value, {
                x,
                y,
                size: 12,
                font: helveticaBold,
                color: rgb(0, 0, 0)
            });
        };

        // Get data from URL parameters
        const passengerName = url.searchParams.get('name') || 'JOHN DOE';
        const flightNumber = url.searchParams.get('flight') || 'ADV-123456';
        const date = url.searchParams.get('date') || '2024-03-15';
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).toUpperCase();

        // Draw passenger details
        drawField('PASSENGER NAME', passengerName, 20, 100);
        drawField('FLIGHT', flightNumber, 200, 100);
        drawField('DATE', formattedDate, 380, 100);

        // Draw barcode (simple representation)
        page.drawRectangle({
            x: 20,
            y: 20,
            width: 560,
            height: 30,
            color: orangeColor
        });

        // Generate PDF
        const pdfBytes = await pdfDoc.save();

        // Return the PDF
        return new Response(pdfBytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="boarding-pass.pdf"',
                'Content-Length': pdfBytes.length.toString()
            }
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return new Response('Error generating PDF', { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const bookingDetails = await request.json();
        const result = await sendTicketEmail(bookingDetails);
        return json({ success: true, messageId: result.messageId });
    } catch (error) {
        console.error('Error in send-ticket endpoint:', error);
        return json({ success: false, error: 'Failed to send ticket email' }, { status: 500 });
    }
};