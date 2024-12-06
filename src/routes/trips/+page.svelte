<!-- src/routes/trips/+page.svelte -->
<script lang="ts">
	import { Search, MapPin, Calendar, Users, ArrowUpDown, Filter, X } from 'lucide-svelte';
	import type { Trip } from '$lib/types/trip';

	// Sample data - replace with your actual data fetching
	let trips: Trip[] = [];
	let loading = false;
	let searchQuery = '';
	let selectedLocation = '';
	let selectedMonth = '';
	let selectedPriceRange = '';
	let showFilters = false;

	// Filter options
	const locations = ['Cape Town', 'Johannesburg', 'Durban', 'Mpumalanga'];
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const priceRanges = [
		{ label: 'Under R1000', value: '0-1000' },
		{ label: 'R1000 - R2000', value: '1000-2000' },
		{ label: 'R2000 - R5000', value: '2000-5000' },
		{ label: 'Above R5000', value: '5000+' }
	];

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-ZA', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function clearFilters() {
		selectedLocation = '';
		selectedMonth = '';
		selectedPriceRange = '';
		searchQuery = '';
	}
</script>

<section class="min-h-screen">
	<!-- Hero Section with Search -->
	<div class="relative bg-emerald-700 px-2 sm:px-4 py-12 lg:py-16 text-white">
		<div class="absolute inset-0">
			<img
				src="/mpumalanga.jpg"
				alt="Travel background"
				class="w-full h-full object-cover opacity-20"
			/>
		</div>
		<div class="relative container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
			<h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
				Discover Your Next Adventure
			</h1>
			<p class="mt-6 max-w-3xl text-xl">
				Explore our curated selection of unforgettable trips across South Africa
			</p>

			<!-- Search Bar -->
			<div class="mt-10 max-w-xl">
				<div class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search for trips..."
						class="w-full px-4 py-3 pl-12 pr-10 text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
					/>
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search class="h-5 w-5 text-gray-400" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
		<!-- Filters Section -->
		<div class="mb-8">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<button
					on:click={() => (showFilters = !showFilters)}
					class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
				>
					<Filter class="h-5 w-5 mr-2" />
					{showFilters ? 'Hide Filters' : 'Show Filters'}
				</button>

				{#if selectedLocation || selectedMonth || selectedPriceRange}
					<button
						on:click={clearFilters}
						class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-red-600 bg-white hover:bg-gray-50"
					>
						<X class="h-5 w-5 mr-2" />
						Clear Filters
					</button>
				{/if}
			</div>

			{#if showFilters}
				<div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<!-- Location Filter -->
					<div class="relative">
						<label for="location" class="block text-sm font-medium text-gray-700 mb-1">
							Location
						</label>
						<select
							id="location"
							bind:value={selectedLocation}
							class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
						>
							<option value="">All Locations</option>
							{#each locations as location}
								<option value={location}>{location}</option>
							{/each}
						</select>
					</div>

					<!-- Month Filter -->
					<div class="relative">
						<label for="month" class="block text-sm font-medium text-gray-700 mb-1">Month</label>
						<select
							id="month"
							bind:value={selectedMonth}
							class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
						>
							<option value="">All Months</option>
							{#each months as month}
								<option value={month}>{month}</option>
							{/each}
						</select>
					</div>

					<!-- Price Range Filter -->
					<div class="relative">
						<label for="price" class="block text-sm font-medium text-gray-700 mb-1">
							Price Range
						</label>
						<select
							id="price"
							bind:value={selectedPriceRange}
							class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
						>
							<option value="">All Prices</option>
							{#each priceRanges as range}
								<option value={range.value}>{range.label}</option>
							{/each}
						</select>
					</div>
				</div>
			{/if}
		</div>

		<!-- Trip Cards Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each trips as trip}
				<div
					class="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-lg"
				>
					<div class="relative">
						<img
							src={trip.imageUrl || '/images/placeholder.jpg'}
							alt={trip.name}
							class="h-48 w-full object-cover"
						/>
						<div
							class="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 m-4 rounded-full text-sm font-medium"
						>
							{trip.status}
						</div>
					</div>

					<div class="p-6">
						<div class="flex items-center text-sm text-gray-500 mb-2">
							<MapPin class="h-4 w-4 mr-1" />
							{trip.location}
						</div>

						<h3 class="text-xl font-semibold text-gray-900 mb-2">
							{trip.name}
						</h3>

						<p class="text-gray-600 text-sm mb-4 line-clamp-2">
							{trip.description}
						</p>

						<div class="space-y-2">
							<div class="flex items-center text-sm text-gray-500">
								<Calendar class="h-4 w-4 mr-1" />
								<span>Available dates:</span>
								<div class="ml-1 space-x-1">
									{#each trip.date.slice(0, 2) as date}
										<span class="inline-block bg-gray-100 rounded px-2 py-1 text-xs">
											{formatDate(date)}
										</span>
									{/each}
									{#if trip.date.length > 2}
										<span class="text-xs">+{trip.date.length - 2} more</span>
									{/if}
								</div>
							</div>

							<div class="flex items-center text-sm text-gray-500">
								<Users class="h-4 w-4 mr-1" />
								{trip.availableSlots} spots left
							</div>
						</div>

						<div class="mt-4 flex items-center justify-between">
							<div>
								<p class="text-2xl font-bold text-emerald-600">R{trip.price}</p>
								<p class="text-sm text-gray-500">per person</p>
							</div>
							<a
								href="/trips/{trip.id}"
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
							>
								View Details
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="flex justify-center items-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
			</div>
		{:else if trips.length === 0}
			<div class="text-center py-12">
				<div class="text-gray-500 text-lg">No trips found matching your criteria</div>
				<button
					on:click={clearFilters}
					class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
				>
					Clear all filters
				</button>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Add any additional custom styles here */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
