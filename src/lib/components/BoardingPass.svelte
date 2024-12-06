<script lang="ts">
	import type { BookingWithPayment } from '$lib/types/trip';
	import { formatAmount, formatDate, formatTime, formatReferenceCode } from '$lib/utils/format';
	import { Plane } from 'lucide-svelte';

	export let bookingDetails: BookingWithPayment;
</script>

<div class="boarding-pass print-only bg-white rounded-lg shadow-lg overflow-hidden">
	<div class="relative flex flex-row h-72">
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
			<div class="bg-amber-400 h-10 flex items-center justify-between px-4">
				<div class="font-bold">HLAKS TOURS</div>
				<div class="text-center text-sm tracking-wide">
					{bookingDetails.trip.location}
				</div>
				<div class="font-bold">ADVENTURE PASS</div>
			</div>

			<!-- Content -->
			<div class="p-4 flex flex-col justify-between h-[calc(100%-2.5rem)]">
				<!-- Top Section -->
				<div>
					<!-- Flight Info -->
					<div class="flex items-center justify-center gap-8 mb-4">
						<div class="text-center">
							<div class="text-3xl font-bold">PICKUP POINT</div>
							<div class="text-xs text-gray-500">FROM</div>
						</div>
						<div class="flex flex-col items-center">
							<Plane class="w-8 h-8 text-amber-500" />
							<div class="w-16 h-px bg-gray-300"></div>
						</div>
						<div class="text-center">
							<div class="text-3xl font-bold">
								{bookingDetails.trip.location.toUpperCase()}
							</div>
							<div class="text-xs text-gray-500">TO</div>
						</div>
					</div>

					<!-- Details Grid -->
					<div class="grid grid-cols-4 gap-6">
						<div>
							<div class="text-xs text-gray-500">PASSENGER NAME</div>
							<div class="font-medium truncate">
								{bookingDetails.booking.fullNames.toUpperCase()}
							</div>
						</div>
						<div>
							<div class="text-xs text-gray-500">REFERANCE NUMBER</div>
							<div class="font-medium">
								{formatReferenceCode(bookingDetails.payment.paymentReference)}
							</div>
						</div>
						<div>
							<div class="text-xs text-gray-500">DATE</div>
							<div class="font-medium">{formatDate(bookingDetails.booking.tripDate)}</div>
						</div>
						<div>
							<div class="text-xs text-gray-500">BOARDING TIME</div>
							<div class="font-medium">{formatTime(bookingDetails.booking.tripDate)}</div>
						</div>
					</div>
				</div>

				<!-- Barcode -->
				<div class="flex flex-col items-center">
					<div class="text-xs font-bold font-mono mb-1">
                         {formatAmount(
                            bookingDetails.payment.amount
                        )}
					</div>
					<div class="text-xs tracking-widest font-mono mb-1">
                        {bookingDetails.payment.paymentReference} 
					</div>
					<div class="barcode-lines h-12 w-full"></div>
				</div>
			</div>
		</div>

		<!-- Stub -->
		<div class="w-1/4 bg-gray-50 p-4 flex flex-col justify-between relative">
			<!-- Circular cuts -->
			<div class="absolute -left-1.5 top-0 bottom-0 flex flex-col justify-between py-4">
				<div class="w-3 h-3 bg-gray-200 rounded-full"></div>
				<div class="w-3 h-3 bg-gray-200 rounded-full"></div>
				<div class="w-3 h-3 bg-gray-200 rounded-full"></div>
			</div>

			<div>
				<div class="flex items-center justify-between mb-4">
					<!-- <div class="text-xl font-bold">Pick Up Point</div> -->
					<div class="text-xl font-bold">
						{bookingDetails.trip.location.toUpperCase()}
					</div>
				</div>

				<div class="space-y-2">
					<div>
						<div class="text-xs text-gray-500">PASSENGER</div>
						<div class="font-medium text-sm truncate">
							{bookingDetails.booking.fullNames.toUpperCase()}
						</div>
					</div>
					<div>
						<div class="text-xs text-gray-500">REFRANCE NUMBER</div>
						<div class="font-medium text-sm">
							{formatReferenceCode(bookingDetails.payment.paymentReference)}
						</div>
					</div>
					<div>
						<div class="text-xs text-gray-500">AMOUNT</div>
						<div class="font-medium text-sm">
							{formatAmount(bookingDetails.payment.amount)}
						</div>
					</div>
				</div>
			</div>

			<!-- Small Barcode -->
			<div class="flex flex-col items-center">
				<div class="barcode-lines h-8 w-full"></div>
			</div>
		</div>
	</div>
</div>

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

	/* Print styles */
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
