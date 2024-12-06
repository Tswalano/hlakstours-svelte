<!-- src/lib/components/admin/charts/DashboardCharts.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let bookingsChart: any;
	let revenueChart: any;
	let destinationsChart: any;
	let ApexCharts: any;

	const initCharts = async () => {
		if (browser) {
			ApexCharts = (await import('apexcharts')).default;

			const bookingOptions = {
				chart: {
					type: 'line',
					height: 350,
					toolbar: {
						show: false
					}
				},
				series: [
					{
						name: 'Bookings',
						data: [65, 78, 92, 85, 105, 120]
					}
				],
				xaxis: {
					categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
				},
				colors: ['#3b82f6'],
				stroke: {
					curve: 'smooth',
					width: 3
				},
				fill: {
					type: 'gradient',
					gradient: {
						shadeIntensity: 1,
						opacityFrom: 0.7,
						opacityTo: 0.3
					}
				}
			};

			const revenueOptions = {
				chart: {
					type: 'bar',
					height: 350,
					toolbar: {
						show: false
					}
				},
				series: [
					{
						name: 'Revenue',
						data: [12000, 15000, 18000, 16500, 21000, 24000]
					}
				],
				xaxis: {
					categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
				},
				colors: ['#10b981'],
				plotOptions: {
					bar: {
						borderRadius: 4,
						columnWidth: '60%'
					}
				},
				dataLabels: {
					enabled: false
				},
				yaxis: {
					labels: {
						formatter: function (value: number) {
							return 'R ' + value.toLocaleString();
						}
					}
				}
			};

			const destinationOptions = {
				chart: {
					type: 'pie',
					height: 350
				},
				series: [35, 25, 20, 15, 5],
				labels: ['Mpumalanga', 'Cape Town', 'Durban', 'Garden Route', 'Free State'],
				colors: ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444'],
				legend: {
					position: 'bottom'
				},
				responsive: [
					{
						breakpoint: 480,
						options: {
							chart: {
								width: 300
							},
							legend: {
								position: 'bottom'
							}
						}
					}
				]
			};

			// Initialize charts
			bookingsChart = new ApexCharts(document.querySelector('#bookingsChart'), bookingOptions);
			revenueChart = new ApexCharts(document.querySelector('#revenueChart'), revenueOptions);
			destinationsChart = new ApexCharts(
				document.querySelector('#destinationsChart'),
				destinationOptions
			);

			bookingsChart.render();
			revenueChart.render();
			destinationsChart.render();
		}
	};

	onMount(() => {
		initCharts();

		return () => {
			// Cleanup on component destroy
			if (browser) {
				bookingsChart?.destroy();
				revenueChart?.destroy();
				destinationsChart?.destroy();
			}
		};
	});
</script>

<div class="space-y-8">
	<!-- Loading placeholder -->
	{#if !browser}
		<div class="space-y-8">
			{#each Array(3) as _}
				<div class="bg-white p-6 rounded-lg shadow">
					<div class="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
					<div class="h-[350px] bg-gray-100 rounded animate-pulse"></div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Bookings Trend Line Chart -->
		<div class="bg-white p-6 rounded-lg shadow">
			<h3 class="text-lg font-semibold mb-4">Bookings Trend</h3>
			<div id="bookingsChart"></div>
		</div>

		<!-- Revenue Bar Chart -->
		<div class="bg-white p-6 rounded-lg shadow">
			<h3 class="text-lg font-semibold mb-4">Revenue Overview</h3>
			<div id="revenueChart"></div>
		</div>

		<!-- Popular Destinations Pie Chart -->
		<div class="bg-white p-6 rounded-lg shadow">
			<h3 class="text-lg font-semibold mb-4">Popular Destinations</h3>
			<div id="destinationsChart"></div>
		</div>
	{/if}
</div>

<style>
	:global(.apexcharts-tooltip) {
		background: white !important;
		border: none !important;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
		border-radius: 0.5rem !important;
	}

	:global(.apexcharts-legend) {
		padding: 1rem 0 !important;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
