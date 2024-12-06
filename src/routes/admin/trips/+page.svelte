<script lang="ts">
	import { onMount } from 'svelte';
	import type { Trip } from '$lib/types/trip';
	import { Plus, Edit2, Trash2 } from 'lucide-svelte';
	import { formatDate } from '$lib/utils/format';
	import { tripStore } from '$lib/stores/tripStore';
	// import { tripsStore } from '$lib/stores/tripStore';

	// let trips: Trip[] = [];
	let loading = true;
	let error: string | null = null;
	let searchQuery = '';
	let statusFilter: string = 'all';
	let showDeleteModal = false;
	let tripToDelete: Trip | null = null;

	onMount(async () => {
		console.log('Fetching trips...');

		try {
			const res = await fetch('/api/trips');
			const trips = await res.json();

			let fetchTrips = trips || [];
			console.log('Fetched trips:', fetchTrips);
			// updateTrips(() => Promise.resolve(fetchTrips));
			tripStore.setTrips(fetchTrips);
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load trips';
			loading = false;
		}
	});

	async function handleDelete(trip: Trip) {
		if (!confirm('Are you sure you want to delete this trip?')) return;

		// Uncomment the code below to perform delete operation.
		// try {
		//   await convex.mutation(api.trips.deleteTrip, { id: trip._id });
		//   trips = trips.filter((t) => t._id !== trip._id);
		// } catch (err) {
		//   error = err instanceof Error ? err.message : 'Failed to delete trip';
		// }
	}

	$: filteredTrips = $tripStore.trips.filter((trip: Trip) => {
		const matchesSearch =
			trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			trip.location.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;

		return matchesSearch && matchesStatus;
	});
</script>

<!-- Main Content -->
<div class="min-h-screen bg-gray-50 py-6">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="flex justify-between items-center">
			<div class="mb-8">
				<h1 class="text-2xl font-bold text-gray-900">Trips Management</h1>
				<p class="mt-1 text-sm text-gray-500">Manage and organize your travel packages</p>
			</div>
			<a
				href="/admin/trips/create"
				class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
			>
				<Plus class="w-5 h-5 mr-2" />
				Add New Trip
			</a>
		</div>

		<!-- Filters -->
		<div class="bg-white rounded-lg shadow-md p-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Search Input Section -->
				<div class="relative">
					<svg
						class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 18a8 8 0 110-16 8 8 0 010 16zm0 0l5 5m-5-5h5"
						/>
					</svg>
					<input
						type="text"
						placeholder="Search trips..."
						bind:value={searchQuery}
						class="pl-10 py-2 px-4 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
					/>
				</div>

				<!-- Filter Section -->
				<div class="relative">
					<svg
						class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 8l7-7 7 7"
						/>
					</svg>
					<select
						bind:value={statusFilter}
						class="pl-10 py-2 px-4 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
					>
						<option value="all">All Status</option>
						<option value="UPCOMING">Upcoming</option>
						<option value="COMPLETED">Completed</option>
						<option value="CANCELLED">Cancelled</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Trips Table -->
		<div class="bg-white rounded-lg shadow overflow-hidden">
			{#if loading}
				<div class="flex justify-center items-center p-8">
					<div
						class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"
					></div>
				</div>
			{:else if error}
				<div class="p-8 text-center text-red-500">{error}</div>
			{:else if filteredTrips.length === 0}
				<div class="p-8 text-center text-gray-500">No trips found</div>
			{:else}
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Trip
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Dates
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Status
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Capacity
							</th>
							<th class="relative px-6 py-3">
								<span class="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each filteredTrips as trip}
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<img
											src={trip.imageUrl}
											alt={trip.name}
											class="h-10 w-10 rounded-full object-cover"
										/>
										<div class="ml-4">
											<div class="text-sm font-medium text-gray-900">{trip.name}</div>
											<div class="text-sm text-gray-500">{trip.location}</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{formatDate(trip.date[0])} - {formatDate(trip.date[1])}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{trip.status}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{trip.capacity}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<a
										href={`/admin/trips/${trip.id}`}
										class="text-emerald-600 hover:text-emerald-900"
									>
										<Edit2 class="inline-block w-5 h-5" />
									</a>
									<button
										class="text-red-600 hover:text-red-900 ml-2"
										on:click={() => {
											tripToDelete = trip;
											showDeleteModal = true;
										}}
									>
										<Trash2 class="inline-block w-5 h-5" />
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
</div>
