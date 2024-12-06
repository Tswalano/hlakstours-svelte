<!-- src/routes/admin/trips/create/+page.svelte -->
<script lang="ts">
	import { Plus, Info, Calendar, MapPin, Users, DollarSign, Clock, Image, X } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { Trip, TripImage } from '$lib/types/trip';
	// import { tripStore } from '$lib/stores/tripStore';
	import ImageUpload from '$lib/components/common/ImageUpload.svelte';
	import { sanitizeFileName, uploadImageToStorage } from '$lib/utils/clientStorage';

	let loading = false;
	let error: string | null = null;
	// Temporary image URL
	let tempMainImage: File | null = null;
	let tempGallaryImages: File[] = [];

	const tripDetails: Trip = {
		name: 'Mpumalanga Panorama Route Adventure',
		description:
			'Explore the breathtaking landscapes of the Mpumalanga Panorama Route, famous for its dramatic views, natural wonders, and rich cultural heritage. This tour takes you through scenic viewpoints, waterfalls, and wildlife reserves for an unforgettable experience.',
		durationDays: 0,
		durationNights: 0,
		price: 3650,
		deposit: 0,
		date: ['2024-12-05', '2024-12-12', '2024-12-20'],
		includes: [
			'Guided tour through the Panorama Route',
			'Accommodation in 3-star hotels',
			'Breakfast and lunch daily',
			"Entrance fees to attractions (e.g., Blyde River Canyon, God's Window)",
			'Transport during the tour'
		],
		location: 'Mpumalanga',
		imageUrl: '',
		galleryImages: [],
		active: true, // Assuming the trip is active by default
		status: 'UPCOMING', // Default status
		availableSlots: 10, // Assuming all slots are available initially
		capacity: 10
	};

	// Calculate duration when dates change
	$: if (tripDetails.date[0] && tripDetails.date[1]) {
		const start = new Date(tripDetails.date[0]);
		const end = new Date(tripDetails.date[1]);
		const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
		tripDetails.durationDays = days;
		tripDetails.durationNights = days - 1;
	}

	// Calculate deposit (20% of price)
	$: tripDetails.deposit = Math.floor(tripDetails.price * 0.2);

	async function handleSubmit(event: Event) {
		event.preventDefault();
		loading = true;
		error = null;

		try {
			// const folderName = sanitizeFileName(tripDetails.name);

			// Upload main image
			let mainImageData: { fullUrl: string; path: string } | null = null;
			if (tempMainImage) {
				mainImageData = await uploadImageToStorage(tempMainImage, `trips`);
			}

			// Upload gallery images
			const galleryImagesData = await Promise.all(
				tempGallaryImages
					.filter((file) => file instanceof File)
					.map((file) => uploadImageToStorage(file, `trips`))
			);

			// Prepare trip data
			const tripData = {
				...tripDetails,
				imageUrl: mainImageData?.fullUrl || '',
				galleryImages: galleryImagesData.map((img) => img.fullUrl)
			};

			console.log('Creating Trip...', tripData);

			// Create trip record
			const response = await fetch('/api/trips', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(tripData)
			});

			if (!response.ok) {
				throw new Error('Failed to create trip');
			}

			// const addedTrip = await response.json();
			// tripStore.addTrip(addedTrip);
			goto('/admin/trips');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create trip';
			console.error('Error creating trip:', err);
		} finally {
			loading = false;
		}
	}

	// Handle main image selection
	function handleMainImageSelect(files: File[]) {
		if (files.length > 0) {
			tempMainImage = files[0];
			tripDetails.imageUrl = URL.createObjectURL(files[0]);
		}
	}

	// Handle gallery image selection (array of File objects)
	function handleGalleryImageSelect(files: File[]) {
		const newImageUrls = files.map((file) => URL.createObjectURL(file));
		tripDetails.galleryImages = [...tripDetails.galleryImages, ...newImageUrls];

		tempGallaryImages = [...tempGallaryImages, ...files];
	}

	function handleMainImageRemove() {
		tripDetails.imageUrl = '';
	}

	function removeGalleryImage(index: number) {
		tripDetails.galleryImages.splice(index, 1);
		tripDetails.galleryImages = [...tripDetails.galleryImages];
	}

	function addIncludedItem() {
		tripDetails.includes = [...tripDetails.includes, ''];
	}

	function removeIncludedItem(index: number) {
		tripDetails.includes = tripDetails.includes.filter((_, i) => i !== index);
	}
</script>

<svelte:head>
	<title>Create Trip - Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-6">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8 flex justify-between items-center">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Create New Trip</h1>
				<p class="mt-1 text-sm text-gray-500">Add a new trip package to your offerings</p>
			</div>
		</div>

		{#if error}
			<div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
				{error}
			</div>
		{/if}

		<div class="bg-white rounded-lg shadow-lg overflow-hidden">
			<form on:submit|preventDefault={handleSubmit} class="divide-y divide-gray-200">
				<!-- Basic Information Section -->
				<div class="p-8 space-y-8">
					<div class="flex items-center space-x-2 text-lg font-medium text-gray-900">
						<Info class="w-5 h-5 text-emerald-500" />
						<h2>Basic Information</h2>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="tripName" class="block text-sm font-medium text-gray-700">
								Trip Name
							</label>
							<input
								id="tripName"
								type="text"
								bind:value={tripDetails.name}
								class="block w-full p-2 rounded-md bg-gray-50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
								placeholder="Enter trip name"
								required
							/>
						</div>

						<div class="space-y-2">
							<label for="location" class="block text-sm font-medium text-gray-700">
								Location
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<MapPin class="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="location"
									type="text"
									bind:value={tripDetails.location}
									class="block w-full pl-10 p-2 rounded-md bg-gray-50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
									placeholder="Enter destination"
									required
								/>
							</div>
						</div>
					</div>

					<div class="space-y-2">
						<label for="description" class="block text-sm font-medium text-gray-700">
							Description
						</label>
						<textarea
							id="description"
							bind:value={tripDetails.description}
							rows="4"
							class="block w-full p-2 rounded-md bg-gray-50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
							placeholder="Describe the trip experience..."
							required
						></textarea>
					</div>
				</div>

				<!-- Dates and Duration Section -->
				<div class="p-8 space-y-8">
					<div class="flex items-center space-x-2 text-lg font-medium text-gray-900">
						<Calendar class="w-5 h-5 text-emerald-500" />
						<h2>Dates and Duration</h2>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="startDate" class="block text-sm font-medium text-gray-700">
								Start Date
							</label>
							<input
								id="startDate"
								type="date"
								bind:value={tripDetails.date[0]}
								class="block w-full p-2 rounded-md bg-gray-50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
								required
							/>
						</div>

						<div class="space-y-2">
							<label for="endDate" class="block text-sm font-medium text-gray-700">
								End Date
							</label>
							<input
								id="endDate"
								type="date"
								bind:value={tripDetails.date[1]}
								class="block w-full p-2 rounded-md bg-gray-50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
								required
							/>
						</div>
					</div>

					<div class="bg-emerald-50 rounded-lg p-4">
						<div class="flex items-center space-x-2">
							<Clock class="w-5 h-5 text-emerald-600" />
							<span class="text-sm text-emerald-700">
								Duration: {tripDetails.durationDays} days, {tripDetails.durationNights} nights
							</span>
						</div>
					</div>
				</div>

				<!-- Pricing and Capacity Section -->
				<div class="p-8 space-y-8">
					<div class="flex items-center space-x-2 text-lg font-medium text-gray-900">
						<DollarSign class="w-5 h-5 text-emerald-500" />
						<h2>Pricing and Capacity</h2>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div class="space-y-2">
							<label for="price" class="block text-sm font-medium text-gray-700">
								Price per Person
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<span class="text-gray-500">R</span>
								</div>
								<input
									id="price"
									type="number"
									bind:value={tripDetails.price}
									class="block w-full pl-7 p-2 rounded-md bg-gray-50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
									min="0"
									step="0.01"
									required
								/>
							</div>
						</div>

						<div class="space-y-2">
							<label for="deposit" class="block text-sm font-medium text-gray-700">
								Required Deposit (20%)
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<span class="text-gray-500">R</span>
								</div>
								<input
									type="text"
									value={tripDetails.deposit}
									class="block w-full pl-7 p-2 rounded-md bg-gray-50 border-gray-300"
									disabled
								/>
							</div>
						</div>

						<div class="space-y-2">
							<label for="capacity" class="block text-sm font-medium text-gray-700">
								Capacity
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Users class="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="capacity"
									type="number"
									bind:value={tripDetails.capacity}
									class="block w-full pl-10 p-2 rounded-md bg-gray-50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
									min="1"
									required
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- What's Included Section -->
				<div class="p-8 space-y-8">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2 text-lg font-medium text-gray-900">
							<Info class="w-5 h-5 text-emerald-500" />
							<h2>What's Included</h2>
						</div>
						<button
							type="button"
							on:click={addIncludedItem}
							class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
						>
							<Plus class="w-4 h-4 mr-1" />
							Add Item
						</button>
					</div>

					<div class="space-y-4">
						{#each tripDetails.includes as item, index}
							<div class="flex items-center space-x-2">
								<input
									type="text"
									bind:value={tripDetails.includes[index]}
									placeholder="Enter included item"
									class="flex-1 p-2 rounded-md bg-gray-50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
								/>
								{#if index > 0}
									<button
										type="button"
										on:click={() => handleMainImageRemove()}
										class="p-2 text-red-600 hover:text-red-800"
									>
										<X class="w-5 h-5" />
									</button>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Images Section -->
				<div class="p-8 space-y-8">
					<div class="flex items-center space-x-2 text-lg font-medium text-gray-900">
						<Image class="w-5 h-5 text-emerald-500" />
						<h2>Images</h2>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Main Image Upload -->
						<div class="space-y-4">
							<label for="main-image" class="block text-sm pb-4 font-medium text-gray-700">
								Main Image
							</label>
							{#if tripDetails.imageUrl}
								<div class="relative inline-block">
									<!-- svelte-ignore a11y_img_redundant_alt -->
									<img
										src={tripDetails.imageUrl}
										alt="Selected image"
										class="h-32 w-32 rounded-lg object-contain"
									/>
									<button
										type="button"
										on:click={handleMainImageRemove}
										class="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
										aria-label="Remove image"
									>
										<X class="w-4 h-4 text-gray-600" />
									</button>
								</div>
							{:else}
								<ImageUpload
									onImageSelect={handleMainImageSelect}
									label="Upload Main Image"
									multiple={false}
								/>
							{/if}
						</div>

						<!-- Gallery Images -->
						<div class="space-y-4">
							<label for="gallery" class="block text-sm font-medium text-gray-700">
								Gallery Images
							</label>
							<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
								{#each tripDetails.galleryImages as image, index}
									<div class="relative group aspect-square">
										<!-- svelte-ignore a11y_img_redundant_alt -->
										<img
											src={image}
											alt="Gallery image"
											class="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-lg"
										/>
										<button
											type="button"
											on:click={() => removeGalleryImage(index)}
											class="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
											aria-label="Remove image"
										>
											<X class="w-4 h-4 text-gray-600" />
										</button>
									</div>
								{/each}
							</div>
							<ImageUpload
								onImageSelect={handleGalleryImageSelect}
								label="Upload Gallery Images"
								multiple={true}
							/>
						</div>
					</div>

					<!-- Submit Button -->
					<div class="px-8 py-4 bg-gray-50 flex justify-end">
						<button
							type="submit"
							disabled={loading}
							class="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700
                   focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? 'Creating Trip...' : 'Create Trip'}
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>

<!-- Loading Overlay -->
{#if loading}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white p-6 rounded-lg shadow-lg">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
			<p class="mt-4 text-sm text-gray-600">Creating trip...</p>
		</div>
	</div>
{/if}

<style>
	img {
		opacity: 0;
		animation: fadeIn 0.3s ease-in-out forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Custom styles for date inputs */
	input[type='date'] {
		-webkit-appearance: none;
		appearance: none;
	}

	/* Remove number input spinners */
	input[type='number'] {
		-moz-appearance: textfield;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
