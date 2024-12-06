<script lang="ts">
	import { formatAmount, formatDate } from '$lib/utils/format';
	import type { Trip } from '../types/trip';
	export let trip: Trip;
</script>

<a href={`/trips/${trip.id}`} class="block">
	<div
		class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
	>
		<img src={trip.imageUrl} alt={trip.location} class="w-full h-48 object-cover" />
		<div class="p-4">
			<div class="flex justify-between items-center">
				<h3 class="text-xl font-semibold">{trip.location}</h3>
			</div>
			<div class="flex justify-between items-center">
				<div class="flex items-center mt-2 text-gray-500">
					<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
					</svg>
					{formatAmount(trip.price)} ~ pp sharing
				</div>
				<div class="flex items-center">
					<span class="text-primary">
						{formatDate(trip.date[0])}
					</span>
				</div>
			</div>
		</div>
	</div>
</a>
