<script lang="ts">
	export let loading = true;
</script>

<div class="min-h-screen bg-white">
	{#if loading}
		<div class="min-h-screen bg-white">
			<!-- Hero Section Skeleton -->
			<div class="relative h-[500px] w-full">
				<div class="absolute inset-0 bg-gray-200 animate-pulse"></div>
				<div class="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-8">
					<!-- Featured Tag Skeleton -->
					<div class="w-32 h-7 bg-gray-300 rounded-full mb-4 animate-pulse"></div>

					<!-- Title Skeleton -->
					<div class="h-12 bg-gray-300 w-2/3 rounded-lg mb-2 animate-pulse"></div>

					<!-- Location and Date Skeleton -->
					<div class="flex items-center gap-4">
						<div class="flex items-center gap-1">
							<div class="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
							<div class="w-24 h-5 bg-gray-300 rounded animate-pulse"></div>
						</div>
						<div class="flex items-center gap-1">
							<div class="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
							<div class="w-24 h-5 bg-gray-300 rounded animate-pulse"></div>
						</div>
					</div>
				</div>
			</div>

			<div class="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
				<!-- Main Content Skeleton -->
				<div class="lg:col-span-2 space-y-8">
					<!-- Overview Section Skeleton -->
					<section>
						<div class="h-8 bg-gray-200 w-32 rounded mb-4 animate-pulse"></div>
						<div class="space-y-2">
							<div class="h-4 bg-gray-200 rounded animate-pulse"></div>
							<div class="h-4 bg-gray-200 rounded animate-pulse"></div>
							<div class="h-4 bg-gray-200 w-2/3 rounded animate-pulse"></div>
						</div>
					</section>

					<!-- Trip Details Skeleton -->
					<section>
						<div class="h-8 bg-gray-200 w-36 rounded mb-4 animate-pulse"></div>
						<div class="grid sm:grid-cols-2 gap-4">
							{#each Array(2) as _}
								<div class="bg-gray-100 rounded-lg p-4 flex items-center gap-4">
									<div class="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
									<div class="flex-1">
										<div class="h-5 bg-gray-300 w-24 rounded mb-2 animate-pulse"></div>
										<div class="h-4 bg-gray-300 w-20 rounded animate-pulse"></div>
									</div>
								</div>
							{/each}
						</div>
					</section>

					<!-- Included Services Skeleton -->
					<section>
						<div class="h-8 bg-gray-200 w-44 rounded mb-4 animate-pulse"></div>
						<div class="grid sm:grid-cols-2 gap-4">
							{#each Array(4) as _}
								<div class="flex items-center gap-2">
									<div class="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
									<div class="h-4 bg-gray-300 w-32 rounded animate-pulse"></div>
								</div>
							{/each}
						</div>
					</section>

					<!-- Gallery Skeleton -->
					<section>
						<div class="h-8 bg-gray-200 w-24 rounded mb-4 animate-pulse"></div>
						<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
							{#each Array(6) as _}
								<div class="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
							{/each}
						</div>
					</section>
				</div>

				<!-- Booking Card Skeleton -->
				<div class="lg:col-span-1">
					<div class="bg-white rounded-lg shadow-lg p-6 sticky top-28">
						<div class="space-y-6">
							<div class="space-y-2">
								<div class="h-10 bg-gray-200 w-32 rounded animate-pulse"></div>
								<div class="h-4 bg-gray-200 w-24 rounded animate-pulse"></div>
							</div>
							<div class="h-12 bg-gray-200 rounded-full animate-pulse"></div>
							<div class="h-4 bg-gray-200 w-48 mx-auto rounded animate-pulse"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<slot />
	{/if}
</div>

<style>
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
