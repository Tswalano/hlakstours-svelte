<script lang="ts">
	import type { Trip } from '$lib/types/trip';

	const tripDetails: Trip = {
		name: '',
		description: '',
		duration: {
			days: 0,
			nights: 0
		},
		price: 0,
		deposit: 0,
		date: [],
		includes: [],
		location: '',
		imageUrl: '',
		galleryImages: [],
		active: false,
		status: 'UPCOMING',
		availableSlots: 0,
		capacity: 0
	};

	// Handle form submission
	const handleSubmit = () => {
		// Handle form submission logic here
		console.log('Trip Name:', tripDetails);
	};
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white rounded-lg shadow-md p-6 space-y-6">
	<h2 class="text-2xl font-bold text-gray-900">Create New Trip</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Trip Name -->
		<div class="space-y-2">
			<label for="tripName" class="text-sm font-medium text-gray-700">Trip Name</label>
			<input
				id="tripName"
				type="text"
				bind:value={tripDetails.name}
				placeholder="Enter trip name"
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>

		<!-- Destination -->
		<div class="space-y-2">
			<label for="destination" class="text-sm font-medium text-gray-700">Destination</label>
			<input
				id="destination"
				type="text"
				bind:value={tripDetails.location}
				placeholder="Enter destination"
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>

		<!-- Start Date -->
		<div class="space-y-2">
			<label for="startDate" class="text-sm font-medium text-gray-700">Start Date</label>
			<input
				id="startDate"
				type="date"
				bind:value={tripDetails.date[0]}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>

		<!-- End Date -->
		<div class="space-y-2">
			<label for="endDate" class="text-sm font-medium text-gray-700">End Date</label>
			<input
				id="endDate"
				type="date"
				bind:value={tripDetails.date[1]}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>

		<!-- Price -->
		<div class="space-y-2">
			<label for="price" class="text-sm font-medium text-gray-700">Price</label>
			<input
				id="price"
				type="number"
				bind:value={tripDetails.price}
				placeholder="Enter price"
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>

		<!-- Capacity -->
		<div class="space-y-2">
			<label for="capacity" class="text-sm font-medium text-gray-700">Capacity</label>
			<input
				id="capacity"
				type="number"
				bind:value={tripDetails.capacity}
				placeholder="Enter capacity"
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>
	</div>

	<!-- Description -->
	<div class="space-y-2">
		<label for="description" class="text-sm font-medium text-gray-700">Description</label>
		<textarea
			id="description"
			bind:value={tripDetails.description}
			placeholder="Enter trip description"
			rows="4"
			class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
		></textarea>
	</div>

	<button
		type="submit"
		class="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
	>
		Create Trip
	</button>
</form>
