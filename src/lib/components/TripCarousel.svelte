<!-- TripCarousel.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { Trip } from '../types/trip';
	import TripCard from './TripCard.svelte';

	export let trips: Trip[] = [];

	let currentIndex = 0;
	let containerWidth = 0;
	let container: HTMLElement;

	$: visibleTrips = trips.slice(currentIndex, currentIndex + 3);
	$: canGoNext = currentIndex + 3 < trips.length;
	$: canGoPrev = currentIndex > 0;

	function nextSlide() {
		if (canGoNext) {
			currentIndex += 1;
		}
	}

	function prevSlide() {
		if (canGoPrev) {
			currentIndex -= 1;
		}
	}
</script>

<div class="w-full">
	<div class="flex justify-between items-center mb-12">
		<h2 class="text-3xl md:text-4xl font-bold text-primary">Upcoming Trips</h2>
		<div class="flex gap-2">
			<button
				class="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
				on:click={prevSlide}
				disabled={!canGoPrev}
				aria-label="Previous trips"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
			<button
				class="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
				on:click={nextSlide}
				disabled={!canGoNext}
				aria-label="Next trips"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>

	<div class="relative overflow-hidden" bind:this={container}>
		<div
			class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-transform duration-500 ease-in-out"
			style="transform: translateX(-{currentIndex * (100 / 3)}%)"
		>
			{#each trips as trip, i (trip.id)}
				<div
					class="transition-opacity duration-500"
					style="opacity: {i >= currentIndex && i < currentIndex + 3 ? '1' : '0'}"
				>
					<TripCard {trip} />
				</div>
			{/each}
		</div>
	</div>

	<!-- Mobile Navigation Dots -->
	<div class="mt-6 flex justify-center gap-2 lg:hidden">
		{#each Array(Math.ceil(trips.length / 3)) as _, i}
			<button
				class="w-2 h-2 rounded-full transition-all duration-200 {currentIndex === i * 3
					? 'bg-emerald-600 w-4'
					: 'bg-emerald-200'}"
				on:click={() => (currentIndex = i * 3)}
				aria-label="Go to slide {i + 1}"
			></button>
		{/each}
	</div>
</div>

<style>
	/* Optional: Add custom scrollbar styling */
	.overflow-hidden::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.overflow-hidden {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
