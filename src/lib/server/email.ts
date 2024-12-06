// # src / lib / server / email.ts
import nodemailer from 'nodemailer';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import type { BookingWithPayment } from '$lib/types/trip';
import { formatAmount, formatDate, formatReferenceCode, formatTime } from '$lib/utils/format';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: 'mail.hlakstours.co.za',
    port: parseInt('465'),
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'info@hlakstours.co.za',
        pass: '5IGcm2)6(6og',
    },
});

async function generateTicketPDF(bookingDetails: BookingWithPayment) {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Embed fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

    // Add a page with landscape orientation - adjusted width since we removed the stub
    const page = pdfDoc.addPage([600, 350]); // Reduced width, same height

    // Colors
    const orangeColor = rgb(0.98, 0.47, 0.12); // orange-400
    const grayColor = rgb(0.65, 0.65, 0.65);

    // Draw watermark text (passenger name)
    const watermarkText = bookingDetails.booking.fullNames.toUpperCase();
    const watermarkSize = 48;
    page.drawText(watermarkText, {
        x: page.getWidth() / 2 - helveticaBold.widthOfTextAtSize(watermarkText, watermarkSize) / 2,
        y: page.getHeight() / 2,
        size: watermarkSize,
        font: helveticaBold,
        color: rgb(0, 0, 0),
        opacity: 0.03,
        rotate: degrees(-35)
    });

    // Header bar
    page.drawRectangle({
        x: 0,
        y: page.getHeight() - 48,
        width: page.getWidth(),
        height: 48,
        color: orangeColor
    });

    // Header text
    const headerY = page.getHeight() - 33;
    page.drawText('HLAKS TOURS', {
        x: 24,
        y: headerY,
        size: 18,
        font: helveticaBold,
        color: rgb(0, 0, 0)
    });

    page.drawText(bookingDetails.trip.location, {
        x: page.getWidth() / 2 - helveticaFont.widthOfTextAtSize(bookingDetails.trip.location, 16) / 2,
        y: headerY,
        size: 16,
        font: helveticaFont,
        color: rgb(0, 0, 0)
    });

    page.drawText('ADVENTURE PASS', {
        x: page.getWidth() - 170,
        y: headerY,
        size: 18,
        font: helveticaBold,
        color: rgb(0, 0, 0)
    });

    // Route information
    const routeY = page.getHeight() - 120;
    const pickupX = 80;
    const destinationX = page.getWidth() - 200;

    page.drawText('PICKUP POINT', {
        x: pickupX,
        y: routeY,
        size: 28,
        font: helveticaBold,
        color: rgb(0, 0, 0)
    });

    // Route line
    const lineStartX = pickupX + 180;
    const lineEndX = destinationX - 30;
    const routeLineY = routeY - 10;

    page.drawLine({
        start: { x: lineStartX, y: routeLineY },
        end: { x: lineEndX, y: routeLineY },
        thickness: 1,
        color: orangeColor
    });

    page.drawText(bookingDetails.trip.location.toUpperCase(), {
        x: destinationX,
        y: routeY,
        size: 28,
        font: helveticaBold,
        color: rgb(0, 0, 0)
    });

    // Details section
    const gridY = routeY - 80;
    const drawField = (label: string, value: string, x: number, y: number) => {
        page.drawText(label, {
            x,
            y: y + 20,
            size: 10,
            font: helveticaFont,
            color: grayColor
        });
        page.drawText(value, {
            x,
            y,
            size: 14,
            font: helveticaBold,
            color: rgb(0, 0, 0)
        });
    };

    // Adjusted column positions for better spacing
    const colWidth = page.getWidth() / 4;
    const col1X = 40;
    const col2X = col1X + colWidth;
    const col3X = col2X + colWidth;
    const col4X = col3X + colWidth - 40; // Adjusted to prevent overflow

    drawField('PASSENGER NAME', bookingDetails.booking.fullNames.toUpperCase(), col1X, gridY);
    drawField('REFERENCE NUMBER', formatReferenceCode(bookingDetails.payment.paymentReference), col2X, gridY);
    drawField('DATE', formatDate(bookingDetails.booking.tripDate), col3X, gridY);
    drawField('BOARDING TIME', formatTime(bookingDetails.booking.tripDate), col4X, gridY);

    // Barcode section
    const barcodeY = 60;
    const amount = formatAmount(bookingDetails.payment.amount);
    const reference = bookingDetails.payment.paymentReference;

    // Amount and reference above barcode
    const amountX = page.getWidth() / 2 - courierFont.widthOfTextAtSize(amount, 14) / 2;
    page.drawText(amount, {
        x: amountX,
        y: barcodeY + 60,
        size: 14,
        font: courierFont,
        color: rgb(0, 0, 0)
    });

    page.drawText(reference, {
        x: page.getWidth() / 2 - courierFont.widthOfTextAtSize(reference, 12) / 2,
        y: barcodeY + 40,
        size: 12,
        font: courierFont,
        color: rgb(0, 0, 0)
    });

    // Main barcode
    page.drawRectangle({
        x: 40,
        y: barcodeY,
        width: page.getWidth() - 80,
        height: 25,
        color: rgb(0, 0, 0)
    });

    return await pdfDoc.save();
}

export async function sendTicketEmail(bookingDetails: BookingWithPayment) {
    try {
        // Generate PDF
        const pdfBytes = await generateTicketPDF(bookingDetails);

        // Prepare email content
        const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <!-- Header -->
                <div style="background-color: #f97316; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Your Adventure Pass is Ready!</h1>
                </div>
                
                <!-- Main Content -->
                <div style="background-color: white; padding: 32px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <!-- Greeting -->
                    <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                        Dear <span style="font-weight: 600;">${bookingDetails.booking.fullNames}</span>,
                    </p>
                    
                    <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                        Your booking has been confirmed! We've attached your Adventure Pass to this email.
                    </p>
        
                    <!-- Booking Details Card -->
                    <div style="background-color: #fff7ed; border: 1px solid #fdba74; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                        <h2 style="margin: 0 0 16px 0; color: #c2410c; font-size: 18px; font-weight: 600;">Booking Details</h2>
                        
                        <div style="margin-bottom: 16px;">
                            <p style="margin: 0 0 8px 0; color: #374151;">
                                <span style="color: #9a3412; font-weight: 500;">Reference:</span>
                                <br>${bookingDetails.payment.paymentReference}
                            </p>
                        </div>
        
                        <div style="margin-bottom: 16px;">
                            <p style="margin: 0 0 8px 0; color: #374151;">
                                <span style="color: #9a3412; font-weight: 500;">Trip Date:</span>
                                <br>${new Date(bookingDetails.booking.tripDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
                            </p>
                        </div>
        
                        <div style="margin-bottom: 16px;">
                            <p style="margin: 0 0 8px 0; color: #374151;">
                                <span style="color: #9a3412; font-weight: 500;">Location:</span>
                                <br>${bookingDetails.trip.location}
                            </p>
                        </div>
                    </div>
        
                    <!-- Next Steps -->
                    <div style="margin-bottom: 24px;">
                        <h2 style="color: #374151; font-size: 18px; font-weight: 600; margin-bottom: 16px;">Next Steps</h2>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="padding-left: 24px; margin-bottom: 12px; position: relative; color: #374151;">
                                <span style="position: absolute; left: 0; color: #f97316;">•</span>
                                Save your Adventure Pass for easy access
                            </li>
                            <li style="padding-left: 24px; margin-bottom: 12px; position: relative; color: #374151;">
                                <span style="position: absolute; left: 0; color: #f97316;">•</span>
                                Review the attached trip details
                            </li>
                            <li style="padding-left: 24px; margin-bottom: 12px; position: relative; color: #374151;">
                                <span style="position: absolute; left: 0; color: #f97316;">•</span>
                                Get ready for your adventure!
                            </li>
                        </ul>
                    </div>
        
                    <!-- Contact Info -->
                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin-top: 24px;">
                        <p style="margin: 0; font-size: 14px; color: #4b5563;">
                            Need help? Contact us at:
                            <br>
                            <a href="mailto:info@hlakstours.co.za" style="color: #f97316; text-decoration: none;">info@hlakstours.co.za</a>
                            <a href="mailto:info@hlakstours.co.za" style="color: #f97316; text-decoration: none;">info@hlakstours.co.za</a>
                        </p>
                    </div>
                </div>
        
                <!-- Footer -->
                <div style="text-align: center; padding-top: 24px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        © 2024 Hlaks Tours. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Send email
        const info = await transporter.sendMail({
            from: '"Adventure Team" <bookings@hlakstours.co.za>',
            to: bookingDetails.booking.email,
            subject: 'Your Adventure Pass - Booking Confirmation',
            html: emailContent,
            attachments: [
                {
                    filename: 'adventure-pass.pdf',
                    content: Buffer.from(pdfBytes),
                    contentType: 'application/pdf'
                }
            ]
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending ticket email:', error);
        throw error;
    }
}