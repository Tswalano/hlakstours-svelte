<!-- src/routes/admin/bookings/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-svelte';
	import { formatAmount, formatDate, formatReferenceCode } from '$lib/utils/format';
	import type { BookingsWithPayment } from '$lib/types/trip';

	let bookings: BookingsWithPayment[] = [];
	let loading = true;
	let error: string | null = null;
	let searchQuery = '';
	let statusFilter = 'all';

	onMount(async () => {
		try {
			const response = await fetch(`/api/bookings`);
			if (!response.ok) throw new Error('Booking not found');

			bookings = await response.json();
			console.log('bookingDetails', bookings);

			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load bookings';
			loading = false;
		}
	});

	async function updateBookingStatus(bookingId: number | undefined, status: string) {
		console.log('updateBookingStatus', bookingId, status);

		// try {
		// 	await convex.mutation(api.bookings.updateBookingStatus, {
		// 		id: bookingId,
		// 		status
		// 	});
		// 	bookings = bookings.map((booking) =>
		// 		booking._id === bookingId ? { ...booking, status } : booking
		// 	);
		// } catch (err) {
		// 	error = err instanceof Error ? err.message : 'Failed to update booking';
		// }
	}

	$: filteredBookings = bookings.filter((booking) => {
		const matchesSearch =
			booking.bookings.fullNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
			booking.trips.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			booking.payments.paymentReference.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus = statusFilter === 'all' || booking.trips.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	function getStatusColor(status: string) {
		const colors = {
			pending: 'bg-yellow-100 text-yellow-800',
			confirmed: 'bg-green-100 text-green-800',
			cancelled: 'bg-red-100 text-red-800'
		};
		return 'bg-gray-100 text-gray-800';
	}

	function getPaymentStatusColor(status: string) {
		const colors = {
			pending: 'text-yellow-500',
			partial: 'text-blue-500',
			completed: 'text-green-500'
		};
		return 'text-gray-500';
	}
</script>

<div class="min-h-screen bg-gray-50 p-6">
	<div class="max-w-7xl mx-auto space-y-6">
		<!-- Header -->
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Bookings Management</h1>
			<p class="text-gray-500 mt-1">Manage customer bookings and reservations</p>
		</div>

		<!-- Filters Card -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Search -->
				<div class="relative">
					<Search
						class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
					/>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search by name or email..."
						class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
					/>
				</div>

				<!-- Status Filter -->
				<div class="relative">
					<Filter
						class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
					/>
					<select
						bind:value={statusFilter}
						class="pl-10 w-full h-11 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none"
					>
						<option value="all">All Status</option>
						<option value="pending">Pending</option>
						<option value="confirmed">Confirmed</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Bookings Table Card -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
			{#if loading}
				<div class="flex justify-center items-center p-12">
					<div
						class="animate-spin rounded-full h-10 w-10 border-3 border-emerald-500 border-t-transparent"
					/>
				</div>
			{:else if error}
				<div class="p-12 text-center">
					<div class="text-red-500 text-lg font-medium mb-2">Error Loading Bookings</div>
					<p class="text-gray-600">{error}</p>
				</div>
			{:else if filteredBookings.length === 0}
				<div class="p-12 text-center">
					<div class="text-gray-400 text-lg font-medium mb-2">No Bookings Found</div>
					<p class="text-gray-500">Try adjusting your search or filter settings</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th
									class="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									Customer Details
								</th>
								<th
									class="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									Destination
								</th>
								<th
									class="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									Referance No.
								</th>
								<th
									class="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									Payment
								</th>
								<th
									class="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								>
									Status
								</th>
								<th class="relative px-6 py-3.5">
									<span class="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each filteredBookings as booking}
								<tr class="hover:bg-gray-50 transition-colors">
									<td class="px-6 py-4">
										<div class="text-sm font-medium text-gray-900">
											{booking.bookings.fullNames}
										</div>
										<div class="text-xs font-mono mb-1 text-gray-500">
											{booking.bookings.email}
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="text-sm text-gray-900">{booking.trips.location}</div>
										<div class="text-xs font-mono mb-1 text-gray-500">
											{formatDate(booking.bookings.tripDate)}
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="text-sm text-gray-900">
											{booking.payments.paymentReference}
										</div>
										<div class="text-xs font-mono mb-1 text-gray-500">
											{formatReferenceCode(booking.payments.paymentReference)}
										</div>
									</td>
									<td class="px-6 py-4">
										<div class="text-sm font-medium text-gray-900">
											{formatAmount(booking.payments.amount)}
										</div>
										<div class="text-xs font-mono mb-1 text-gray-500">
											{booking.payments.paymentMethod}
										</div>
									</td>
									<td class="px-6 py-4">
										<span
											class={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.bookings.paymentStatus)}`}
										>
											{booking.bookings.paymentStatus.charAt(0) +
												booking.bookings.paymentStatus.slice(1).toLowerCase()}
										</span>
									</td>
									<td class="px-6 py-4 text-right">
										<div class="flex justify-end space-x-3 items-center">
											{#if booking.bookings.paymentStatus === 'SUCCESS'}
												<button
													on:click={() => updateBookingStatus(booking.bookings.id, 'confirmed')}
													class="flex items-center px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
													title="Confirm Booking"
												>
													<CheckCircle class="w-5 h-5 mr-2" />Refund
												</button>
											{:else}
												<button
													on:click={() => updateBookingStatus(booking.bookings.id, 'pending')}
													class="flex items-center px-4 py-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"
													title="Mark as Pending"
												>
													<Clock class="w-5 h-5 mr-2" />Pending
												</button>
											{/if}
										</div>
									</td>
									
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Custom select arrow */
	select {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
	}
</style>
