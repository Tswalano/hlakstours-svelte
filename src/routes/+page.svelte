<script lang="ts">
	import { onMount } from 'svelte';
	import { Bell, Car, Globe, Map } from 'lucide-svelte';
	import Loader from '$lib/components/Loader.svelte';
	import TripCard from '$lib/components/TripCard.svelte';
	import type { Trip } from '../lib/types/trip';
	import TravelCarousel from '$lib/components/TravelCarousel.svelte';
	import TripCarousel from '$lib/components/TripCarousel.svelte';

	let tp: Trip[] = [];
	let loading: boolean = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const res = await fetch('/api/trips');
			const trips = await res.json();

			console.log('trips', trips);

			tp = trips;

			loading = false;
		} catch (err: any) {
			error = err.message;
			loading = false;
		}
	});
</script>

<!-- Hero Section -->
<TravelCarousel />

<!-- Upcoming Trips -->
<div class="py-20">
	<!-- <div class="py-20 bg-gradient-to-b from-white to-blue-50"> -->
	<!-- relative w-full min-h-screen bg-gradient-to-b from-emerald-100 to-white overflow-hidden -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if loading}
			<Loader />
		{:else if error}
			<p class="text-red-600">Error: {error}</p>
		{:else if tp.length > 0}
			<!-- <div class="flex justify-between items-center mb-12">
				<h2 class="text-3xl md:text-4xl font-bold text-primary">Upcoming Trips</h2>
			</div>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> -->
				<!-- {#each tp as trip} -->
					<!-- <TripCard {trip} /> -->
					<TripCarousel trips={tp} />
				<!-- {/each} -->
			<!-- </div> -->
		{:else}
			<div
				class="rounded-2xl shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300"
			>
				<div class="flex flex-col md:flex-row">
					<!-- Image Section -->
					<div class="md:w-2/5 relative bg-gradient-to-br from-emerald-50 to-emerald-100">
						<!-- Main Image -->
						<div class="relative z-10 p-6 h-full flex items-center justify-center">
							<img
								src="/assets/rb_2151303984.png"
								alt="Traveler waiting for next adventure"
								class="w-full h-48 md:h-[300px] object-contain transform transition-transform duration-700 hover:scale-105"
							/>
						</div>

						<!-- Decorative Elements -->
						<div class="absolute inset-0 overflow-hidden">
							<!-- Animated Background Shapes -->
							<div
								class="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
							></div>
							<div
								class="absolute bottom-1/4 right-1/4 w-32 h-32 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"
							></div>

							<!-- Decorative Patterns -->
							<div class="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent"></div>
						</div>
					</div>

					<!-- Content Section -->
					<div class="md:w-3/5 p-8 md:p-10 flex flex-col justify-center bg-white">
						<div class="space-y-6">
							<!-- Status Badge -->
							<div
								class="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>Coming Soon</span>
							</div>

							<!-- Main Content -->
							<div class="space-y-4">
								<h3 class="text-2xl font-bold text-gray-900">
									Oops! These Adventures Are Taking a Break
								</h3>

								<p class="text-gray-600 text-lg">
									Our team is crafting unforgettable experiences for your next journey. The
									destinations you're looking for are currently unavailable, but new and exciting
									trips are coming soon!
								</p>
							</div>

							<!-- Action Section -->
							<div class="space-y-4">
								<button
									class="group w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
								>
									<svg
										class="w-5 h-5 mr-2 transition-transform group-hover:animate-bell"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
										/>
									</svg>
									Notify Me About New Trips
								</button>

								<p class="text-sm text-gray-500 flex items-center">
									<svg
										class="w-4 h-4 mr-2 text-emerald-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									We'll let you know as soon as new adventures become available!
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Gallery Section -->
<div class="py-8 bg-gradient-to-b from-blue-50 to-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center mb-8">
			<div>
				<h2 class="text-3xl font-bold text-primary">Our Gallery</h2>
				<p class="text-gray-light">Share Your Happy Moments</p>
			</div>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
			<!-- Add image items as required -->
			<img
				src="https://www.discoverafrica.com/wp-content/uploads/2018/03/Durbans_coastline_beach-1200x800.jpg"
				alt="Gallery 1"
				class="w-full h-64 object-cover rounded-xl"
			/>
			<img
				src="http://www.melanievanzyl.com/uploads/3/0/3/3/30337809/pamorama-route-adventures-melanie-van-zyl-16_orig.jpg"
				alt="Gallery 2"
				class="w-full h-64 object-cover rounded-xl"
			/>
			<img
				src="http://www.melanievanzyl.com/uploads/3/0/3/3/30337809/published/1-national-parks.jpg?1571579176"
				alt="Gallery 3"
				class="w-full h-64 object-cover rounded-xl"
			/>
			<img
				src="https://www.roxannereid.co.za/uploads/3/7/7/8/3778676/roxannereid-2012-01-04-1302-20111227_orig.jpg"
				alt="Gallery 4"
				class="w-full h-64 object-cover rounded-xl"
			/>
			<img
				src="http://www.melanievanzyl.com/uploads/3/0/3/3/30337809/published/1-national-parks.jpg?1571579176"
				alt="Gallery 5"
				class="w-full h-64 object-cover rounded-xl"
			/>
			<img
				src="http://www.melanievanzyl.com/uploads/3/0/3/3/30337809/pamorama-route-adventures-melanie-van-zyl-16_orig.jpg"
				alt="Gallery 6"
				class="w-full h-64 object-cover rounded-xl"
			/>
		</div>
	</div>
</div>

<!-- Features Section -->
<div class="relative py-20">
	<div class="absolute top-10 left-10 opacity-20">
		<img src="/assets/vector1.png" alt="Travel destinations" class="w-auto h-auto" />
	</div>
	<!-- <div class="absolute top-20 right-20 opacity-20">
		<img src="/assets/vector2.png" alt="Travel destinations" class="w-auto h-auto" />
	</div> -->
	<!-- <div class="absolute bottom-10 left-20 opacity-20">
		<img src="/assets/vector3.png" alt="Travel destinations" class="w-auto h-auto" />
	</div> -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<div class="relative">
				<div class="absolute top-0 right-0 w-4/5 h-4/5 bg-secondary rounded-full"></div>
				<img src="/tourist-with-thumb-up.png" alt="Travel Guide" class="relative z-10" />
				<div class="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 max-w-xs z-10">
					<div class="flex items-center">
						<img
							src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2445"
							alt="Profile"
							class="w-10 h-10 rounded-full"
						/>
						<div class="ml-3">
							<p class="font-medium text-secondary">World of The Best Agency</p>
							<div class="flex text-primary">★★★★★</div>
						</div>
					</div>
				</div>
			</div>
			<div class="space-y-8">
				<h2 class="text-4xl font-bold text-primary">Explore All Corners of the World With Us</h2>
				<p class="text-gray-dark">
					Travel is fatal to prejudice, and narrow-mindedness, and many of our people need it sorely
					on and many of our people need it sorely.
				</p>
				<div class="grid grid-cols-3 gap-6">
					<div class="flex items-center space-x-4">
						<div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
							<Map class="w-6 h-6" />
						</div>
						<span class="font-medium text-primary">Travel Guide</span>
					</div>
					<div class="flex items-center space-x-4">
						<div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
							<Car class="w-6 h-6" />
						</div>
						<span class="font-medium text-primary">Luxury Tour</span>
					</div>
					<div class="flex items-center space-x-4">
						<div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
							<Globe class="w-6 h-6" />
						</div>
						<span class="font-medium text-primary">Adventure</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		33% {
			transform: translate(8px, -8px) rotate(2deg);
		}
		66% {
			transform: translate(-8px, 8px) rotate(-2deg);
		}
	}

	.animate-float {
		animation: float 12s ease-in-out infinite;
	}

	.animation-delay-2000 {
		animation-delay: 2s;
	}

	@keyframes bell {
		0%,
		100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(10deg);
		}
		75% {
			transform: rotate(-10deg);
		}
	}

	.group:hover .group-hover\:animate-bell {
		animation: bell 0.5s ease-in-out infinite;
	}
</style>
