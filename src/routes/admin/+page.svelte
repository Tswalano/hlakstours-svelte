<script lang="ts">
	import { TrendingUp, Users, Map, CreditCard, ArrowUpRight } from 'lucide-svelte';
	import DashboardCharts from '$lib/components/admin/charts/DashboardCharts.svelte';
	import StatCard from '$lib/components/admin/StatCard.svelte';
	import { onMount } from 'svelte';
	import type { StatItem } from '$lib/types/navigation';
	import { authStore } from '$lib/stores/auth';
	import type { BookingsWithPayment } from '$lib/types/trip';
	import { formatAmount } from '$lib/utils/format';

	$: user = $authStore.user;

	let greeting = '';
	let bookings = 0; // Current month bookings
	let revenue = 0; // Current month revenue
	let activeTrips = 0; // Current month active trips
	let customers = 0; // Track customers (this part is not used yet)
	let bookingsLastMonth = 0; // Last month bookings
	let revenueLastMonth = 0; // Last month revenue
	let activeTripsLastMonth = 0; // Last month active trips
	let loading = true;
	let error: string | null = null;
	let bookingDetails: BookingsWithPayment[] = []; // Initialize as an empty array

	// Dynamically set stats based on fetched data
	$: stats = [
		{
			title: 'Total Bookings',
			value: bookings.toString(),
			change: calculateChange(bookings, bookingsLastMonth),
			icon: TrendingUp,
			color: 'text-blue-600'
		},
		{
			title: 'Total Revenue',
			value: formatAmount(revenue),
			change: calculateChange(revenue, revenueLastMonth),
			icon: CreditCard,
			color: 'text-emerald-600'
		},
		{
			title: 'Active Trips',
			value: activeTrips.toString(),
			change: calculateChange(activeTrips, activeTripsLastMonth),
			icon: Map,
			color: 'text-purple-600'
		},
		{
			title: 'Total Customers',
			value: customers.toString(),
			change: '+5.2%', // Update if necessary
			icon: Users,
			color: 'text-orange-600'
		}
	];

	onMount(async () => {
		const hour = new Date().getHours();
		greeting = getGreeting(hour);

		try {
			const response = await fetch(`/api/bookings`);
			if (!response.ok) throw new Error('Booking not found');

			bookingDetails = await response.json();
			console.log('bookingDetails', bookingDetails);

			const currentMonth = new Date().getMonth();
			const lastMonth = (currentMonth - 1 + 12) % 12;

			// Initialize totals for the current month
			let currentBookings = 0;
			let currentRevenue = 0;
			let currentActiveTrips = 0;

			// Initialize totals for the last month
			let lastBookings = 0;
			let lastRevenue = 0;
			let lastActiveTrips = 0;

			// Process booking details and classify by current and last month
			bookingDetails.forEach((booking) => {
				const tripDate = new Date(booking.bookings.tripDate);
				const bookingMonth = tripDate.getMonth();

				// Calculate data for the current month
				if (bookingMonth === currentMonth && booking.payments?.amount !== null) {
					currentRevenue += booking.payments.amount;
					currentBookings += 1;
					if (tripDate > new Date()) currentActiveTrips += 1;
				}

				// Calculate data for the last month
				if (bookingMonth === lastMonth && booking.payments?.amount !== null) {
					lastRevenue += booking.payments.amount;
					lastBookings += 1;
					if (tripDate > new Date()) lastActiveTrips += 1;
				}
			});

			// Update the variables for current and last month
			bookings = currentBookings;
			revenue = currentRevenue;
			activeTrips = currentActiveTrips;

			bookingsLastMonth = lastBookings;
			revenueLastMonth = lastRevenue;
			activeTripsLastMonth = lastActiveTrips;
		} catch (err: any) {
			error = err.message || 'Failed to fetch booking details';
			console.error(error);
		} finally {
			loading = false;
		}
	});

	// Helper function to calculate the change percentage
	function calculateChange(current: number, last: number): string {
		if (last === 0) return '+100%'; // Handle case where last month's value is 0
		const change = ((current - last) / last) * 100;
		return `${change.toFixed(1)}%`;
	}

	function getGreeting(hour: number): string {
		if (hour < 12) return 'Good Morning';
		if (hour < 18) return 'Good Afternoon';
		return 'Good Evening';
	}

	function handleDownloadReport(): void {
		// Implement report download logic
		console.log('Downloading report...');
	}
</script>

<div class="min-h-screen bg-gray-50/50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">{greeting}, {user?.email}</h1>
					<p class="mt-1 text-sm text-gray-500">Here's what's happening with your business today</p>
				</div>
				<div class="flex gap-4">
					<button
						type="button"
						on:click={handleDownloadReport}
						class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Download Report
						<ArrowUpRight class="ml-2 w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			{#each stats as stat (stat.title)}
				<StatCard {...stat} />
			{/each}
		</div>

		<!-- Charts -->
		<div class="bg-white rounded-xl shadow-sm p-6">
			<DashboardCharts />
		</div>
	</div>
</div>
