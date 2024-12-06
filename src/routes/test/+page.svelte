<script lang="ts">
	import type { BookingWithPayment } from '$lib/types/trip';
	import { formatAmount, formatDate, formatReferenceCode, formatTime } from '$lib/utils/format';
	import { Mail, Plane } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let bookingDetails: BookingWithPayment | null = null;
	let loading = true;

	// Add this to your booking confirmation page script section

	onMount(async () => {
		try {
			const response = await fetch(`/api/bookings?referance=T879351958957462`);
			if (!response.ok) throw new Error('Booking not found');

			bookingDetails = await response.json();
		} catch (err: any) {
			console.error(err);
		} finally {
			loading = false;
		}
	});

	async function downloadTicket() {
		if (!bookingDetails) return;

		const response = await fetch(`/api/generate-ticket?${bookingDetails}`);

		if (response.ok) {
			// Convert the response to a blob
			const blob = await response.blob();

			// Create a URL for the blob
			const url = window.URL.createObjectURL(blob);

			// Create a temporary link and click it
			const a = document.createElement('a');
			a.href = url;
			a.download = 'adventure-pass.pdf';
			document.body.appendChild(a);
			a.click();

			// Clean up
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} else {
			console.error('Failed to generate ticket');
			// Handle error - maybe show a toast notification
		}
	}

	async function sendTicket() {
		if (!bookingDetails) return;

		try {
			const response = await fetch('/api/generate-ticket', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(bookingDetails)
			});

			const result = await response.json();

			if (result.success) {
				// Show success message
				alert('Ticket has been sent to your email!');
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			console.error('Error sending ticket:', error);
			alert('Failed to send ticket. Please try again.');
		}
	}

	// Update your download button to use this function
</script>

{#if loading}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div
			class="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
		></div>
	</div>
{:else if bookingDetails}
	<div class="flex justify-center flex-col items-center h-screen">
		<div class="boarding-pass print-only bg-white rounded-lg shadow-lg overflow-hidden">
			<div class="relative flex flex-row h-80">
				<!-- Increased height from h-72 to h-80 -->
				<!-- Watermark Background -->
				<div class="absolute inset-0 overflow-hidden">
					<div
						class="absolute inset-0 flex items-center justify-center opacity-[0.03] rotate-[-35deg] scale-[2]"
					>
						<div class="flex flex-col items-center">
							<Plane class="w-40 h-40" />
							<div class="text-4xl font-bold tracking-wider">
								{bookingDetails.booking.fullNames.toUpperCase()}
							</div>
						</div>
					</div>
				</div>

				<!-- Main Ticket -->
				<div class="flex-grow border-r border-dashed relative">
					<!-- Header -->
					<div class="bg-orange-400 h-12 flex items-center justify-between px-6">
						<!-- Changed from amber to orange -->
						<div class="font-bold text-lg">HLAKS TOURS</div>
						<div class="text-center text-base tracking-wide">
							{bookingDetails.trip.location}
						</div>
						<div class="font-bold text-lg">ADVENTURE PASS</div>
					</div>

					<!-- Content -->
					<div class="p-6 flex flex-col justify-between h-[calc(100%-2rem)]">
						<!-- Top Section -->
						<div>
							<!-- Route Info -->
							<div class="flex items-center justify-center gap-20 mb-8">
								<!-- Increased gap -->
								<div class="text-center">
									<div class="text-3xl font-bold">PICKUP</div>
									<div class="text-xs text-gray-500 mt-1">FROM</div>
								</div>
								<div class="flex flex-col items-center">
									<div class="w-32 h-px bg-orange-400 mb-2"></div>
									<!-- Horizontal line -->
									<Plane class="w-8 h-8 text-orange-400" />
								</div>
								<div class="text-center">
									<div class="text-3xl font-bold">
										{bookingDetails.trip.location.toUpperCase()}
									</div>
									<div class="text-xs text-gray-500 mt-1">TO</div>
								</div>
							</div>

							<!-- Details Grid -->
							<div class="grid grid-cols-3 gap-8 mt-6">
								<!-- Increased gap -->
								<div>
									<div class="text-xs text-gray-500 mb-1">PASSENGER NAME</div>
									<div class="font-medium truncate">
										{bookingDetails.booking.fullNames.toUpperCase()}
									</div>
								</div>
								<div>
									<div class="text-xs text-gray-500 mb-1">REFERENCE NUMBER</div>
									<div class="font-medium">
										{formatReferenceCode(bookingDetails.payment.paymentReference)}
									</div>
								</div>
								<div>
									<div class="text-xs text-gray-500 mb-1">DATE</div>
									<div class="font-medium">{formatDate(bookingDetails.booking.tripDate)}</div>
								</div>
								<!-- <div>
									<div class="text-xs text-gray-500 mb-1">BOARDING TIME</div>
									<div class="font-medium">{formatTime(bookingDetails.booking.tripDate)}</div>
								</div> -->
							</div>
						</div>

						<!-- Barcode Section -->
						<div class="flex flex-col items-center mt-8">
							<div class="text-sm font-bold mb-1">
								{formatAmount(bookingDetails.payment.amount)}
							</div>
							<div class="text-xs tracking-widest font-mono mb-2">
								{bookingDetails.payment.paymentReference}
							</div>
							<div class="barcode-lines h-14 w-full"></div>
						</div>
					</div>
				</div>

				<!-- Stub -->
				<div class="w-1/4 bg-gray-50 p-6 flex flex-col justify-between relative">
					<!-- Circular cuts -->
					<div class="absolute -left-1.5 top-0 bottom-0 flex flex-col justify-between py-8">
						<div class="w-3 h-3 bg-gray-200 rounded-full"></div>
						<div class="w-3 h-3 bg-gray-200 rounded-full"></div>
						<div class="w-3 h-3 bg-gray-200 rounded-full"></div>
					</div>

					<!-- Stub Content -->
					<div>
						<div class="text-xl font-bold mb-6">
							{bookingDetails.trip.location.toUpperCase()}
						</div>

						<div class="space-y-4">
							<div>
								<div class="text-xs text-gray-500 mb-1">PASSENGER</div>
								<div class="font-medium text-sm truncate">
									{bookingDetails.booking.fullNames.toUpperCase()}
								</div>
							</div>
							<div>
								<div class="text-xs text-gray-500 mb-1">REFERENCE NUMBER</div>
								<div class="font-medium text-sm">
									{formatReferenceCode(bookingDetails.payment.paymentReference)}
								</div>
							</div>
							<div>
								<div class="text-xs text-gray-500 mb-1">AMOUNT</div>
								<div class="font-medium text-sm">
									{formatAmount(bookingDetails.payment.amount)}
								</div>
							</div>
						</div>
					</div>

					<!-- Stub Barcode -->
					<div class="flex flex-col items-center mt-4">
						<div class="barcode-lines h-10 w-full"></div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-8 flex space-x-4">
			<button on:click={downloadTicket} class="bg-primary text-white font-bold py-2 px-4 rounded">
				Download Ticket
			</button>
			<button on:click={sendTicket} class="bg-emerald-200 text-white font-bold py-2 px-4 rounded">
				Send Ticket
			</button>
		</div>
	</div>
{/if}

<style>
	.barcode-lines {
		background-image: linear-gradient(
			90deg,
			#000 0%,
			#000 2%,
			transparent 2%,
			transparent 4%,
			#000 4%,
			#000 6%,
			transparent 6%,
			transparent 8%,
			#000 8%,
			#000 10%,
			transparent 10%,
			transparent 12%,
			#000 12%,
			#000 14%,
			transparent 14%,
			transparent 16%,
			#000 16%,
			#000 18%,
			transparent 18%,
			transparent 20%,
			#000 35%,
			#000 22%,
			transparent 22%,
			transparent 24%,
			#000 34%,
			#000 26%,
			transparent 26%,
			transparent 38%,
			#000 38%,
			#000 30%,
			transparent 30%,
			transparent 10%
		);
		background-size: 50px 100%;
		background-repeat: repeat-x;
	}

	@media print {
		@page {
			size: landscape;
			margin: 0;
		}

		.boarding-pass {
			width: 100%;
			height: 100%;
			box-shadow: none;
			border-radius: 0;
		}
	}
</style>
