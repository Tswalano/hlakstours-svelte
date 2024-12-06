<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { CheckCircle2 } from 'lucide-svelte';
	import BoardingPass from '$lib/components/BoardingPass.svelte';
	import type { BookingWithPayment } from '$lib/types/trip';

	let loading = true;
	let error: string | null = null;
	let bookingDetails: BookingWithPayment | null = null;

	$: referenceId = $page.params.referanceId;

	onMount(async () => {
		if (!referenceId) {
			error = 'Booking not found!';
			loading = false;
			return;
		}

		try {
			const response = await fetch(`/api/bookings?referance=${referenceId}`);
			if (!response.ok) throw new Error('Booking not found');

			bookingDetails = await response.json();
		} catch (err: any) {
			error = err.message || 'Failed to fetch booking details';
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div
			class="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
		></div>
	</div>
{:else if error}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
		<div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
			<div class="text-red-500 mb-4">
				<svg class="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<h2 class="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
			<p class="text-gray-600 mb-6">{error}</p>
			<a
				href="/"
				class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
			>
				Return Home
			</a>
		</div>
	</div>
{:else if bookingDetails}
	<div class="min-h-screen bg-gray-50 px-6 sm:px-8 py-28 lg:py-36">
		<div class="max-w-4xl mx-auto">
			<div class="text-center mb-12">
				<div
					class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4"
				>
					<CheckCircle2 class="w-8 h-8 text-amber-600" />
				</div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Adventure Awaits!</h1>
				<p class="text-lg text-gray-600">Your booking is confirmed. Here's your adventure pass. we have also sent it to your email. We will send you updates on your trip</p>
			</div>

			<div class="boarding-pass">
				<BoardingPass {bookingDetails} />
			</div>
		</div>
	</div>
{/if}
