<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { MapPin, Users, Calendar, CircleCheckBig } from 'lucide-svelte';
    import TripDetailsLoader from '$lib/components/TripDetailsLoader.svelte';
    import { formatAmount, formatDate } from '$lib/utils/format';
    import type { CreateBooking, Trip } from '$lib/types/trip';
    import { PUBLIC_PAYSTACK_PUBLIC_KEY } from '$env/static/public';
	import StatusOverlay from '$lib/components/common/StatusOverlay.svelte';

    let selectedTrip = {} as Trip;
    let error: string | null = null;
    let loading: boolean = true;
    let paymentLoading: boolean = false;
    let tripId: string = '';
    let email: string = '';
    let fullNames: string = '';
    let paymentStatus: 'processing' | 'success' | 'error' | null = null;
    let statusMessage = '';

    $: tripId = $page.params.tripId;
    $: isFormValid = email && fullNames;

    onMount(async () => {
        try {
            const res = await fetch(`/api/trips?id=${tripId}`);
            const trips: Trip = await res.json();

            if (!trips) {
                console.log('No trips found');
                return;
            }

            selectedTrip = trips;
        } catch (err: any) {
            error = err.message;
            console.log(error);
        } finally {
            loading = false;
        }
    });

    async function handlePayment(e: Event) {
        e.preventDefault();
        
        try {
            if (typeof window !== 'undefined') {
                const Paystack = await import('@paystack/inline-js');
                const popup = new Paystack.default();
				
				// // create a div element with text
				// const divElement = document.createElement('div');
				// divElement.style.display = 'none';
				// divElement.textContent = 'Please wait...';
			
				// popup.backgroundDiv = divElement;
				
                popup.newTransaction({
                    amount: selectedTrip.price * 100,
                    email,
                    firstName: fullNames.split(' ')[0],
                    lastName: fullNames.split(' ')[1] || '',
                    key: PUBLIC_PAYSTACK_PUBLIC_KEY,
					currency: 'ZAR',

                    onSuccess: async (data) => {
                        try {
                            const bookingDetails: CreateBooking = {
                                email,
                                fullNames,
                                tripId: parseInt(tripId),
                                paymentStatus: 'SUCCESS',
                                paymentMethod: 'PAYSTACK',
                                paymentReference: data.reference,
								amount: selectedTrip.price,
                                tripDate: new Date(selectedTrip.date[0]).toString()
                            };

                            const response = await fetch('/api/payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(bookingDetails)
                            });

                            const apiResponse = await response.json();

							console.log(data);

                            if (response.ok) {
                                    goto(`/booking/confirmation/${data.reference}`);
                            } else {
								
								paymentStatus = 'error';
								statusMessage = apiResponse.message || 'Payment successful but booking failed. Our team will contact you shortly.';
								console.error(apiResponse);

                                throw new Error(apiResponse.message || 'Failed to create booking');
                            }
                        } catch (err) {
                            paymentStatus = 'error';
                            statusMessage = 'Payment successful but booking failed. Our team will contact you shortly.';
                            console.error(err);
                        }
                    },

					onError(error) {
						paymentStatus = 'error';
						statusMessage = error.message || 'An error occurred. Please try again.';
					},
                    
                    onCancel: () => {
                        paymentStatus = 'error';
                        statusMessage = 'Payment was cancelled. Please try again.';
                    },
					
                })
            }
        } catch (err: any) {
            paymentStatus = 'error';
            statusMessage = err.message || 'An error occurred. Please try again.';
            console.error(err);
        }
    }
</script>

<!-- <div id="paystackEmbedContainer"></div> -->
<TripDetailsLoader {loading}>
    {#if selectedTrip && selectedTrip.id}
        <div class="min-h-screen bg-white">
            <div class="relative h-[500px] w-full">
                <img
                    src={selectedTrip.imageUrl}
                    alt="Siasconset Beach"
                    width="1920"
                    height="500"
                    class="object-cover w-full h-full"
                />
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-8">
                    <div class="w-fit mb-4 bg-white text-black px-3 py-1 rounded-full text-sm font-semibold">
                        Featured Destination
                    </div>
                    <h1 class="text-4xl font-bold text-white mb-2">
                        {selectedTrip.name}
                    </h1>
                    <div class="flex items-center gap-4 text-white">
                        <div class="flex items-center gap-1">
                            <MapPin class="w-4 h-4" />
                            <span class="text-sm">
                                {selectedTrip.location}
                            </span>
                        </div>
                        <div class="flex items-center gap-1">
                            <Calendar class="w-4 h-4" />
                            <span class="text-sm">
                                From {formatDate(selectedTrip.date[0])} to {formatDate(selectedTrip.date[1])}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-8">
                    <!-- Overview Section -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4">Overview</h2>
                        <p class="text-gray-600">
                            {selectedTrip.description}
                        </p>
                    </section>

                    <!-- Trip Details -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4">Trip Details</h2>
                        <div class="grid sm:grid-cols-2 gap-4">
                            <div class="bg-gray-100 rounded-lg p-4 flex items-center gap-4">
                                <div class="bg-white p-2 rounded-full">
                                    <Users class="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 class="font-semibold">Group Size</h3>
                                    <p class="text-sm text-gray-600">Max 12 people</p>
                                </div>
                            </div>
                            <div class="bg-gray-100 rounded-lg p-4 flex items-center gap-4">
                                <div class="bg-white p-2 rounded-full">
                                    <Users class="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 class="font-semibold">Duration</h3>
                                    <p class="text-sm text-gray-600">7 Days, 6 Nights</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Included Services -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4">Included Services</h2>
                        <div class="grid sm:grid-cols-2 gap-4">
                            {#each selectedTrip.includes as include}
                                <div class="flex items-center gap-2">
                                    <CircleCheckBig class="w-5 h-5 text-emerald-500" />
                                    <span class="text-gray-600">
                                        {include}
                                    </span>
                                </div>
                            {/each}
                        </div>
                    </section>

                    <!-- Gallery -->
                    <section>
                        <h2 class="text-2xl font-bold mb-4">Gallery</h2>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {#each selectedTrip.galleryImages as image}
                                <div class="relative">
                                    <img src={image} alt="Gallery" class="w-full h-full object-cover" />
                                </div>
                            {/each}
                        </div>
                    </section>
                </div>

                <!-- Booking Card -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-lg shadow-lg p-6 sticky top-28">
                        <form class="space-y-6" on:submit|preventDefault={handlePayment}>
                            <div class="space-y-2">
                                <div class="text-3xl font-bold text-primary">
                                    {formatAmount(selectedTrip.price)}
                                </div>
                                <p class="text-sm text-gray-600">per person</p>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <label for="fullNames" class="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullNames"
                                        bind:value={fullNames}
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                                         focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm
                                         p-2 border"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label for="email" class="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        bind:value={email}
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                                         focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm
                                         p-2 border"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={paymentLoading || !isFormValid}
                                class="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {#if paymentLoading}
                                    <span class="flex items-center justify-center">
                                        <svg
                                            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                class="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                stroke-width="4"
                                            />
                                            <path
                                                class="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Processing...
                                    </span>
                                {:else}
                                    Pay Now
                                {/if}
                            </button>

                            <p class="text-xs text-center text-gray-500">
                                Free cancellation up to 24 hours before check-in
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <section
            class="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 via-emerald-100/50 to-white overflow-hidden"
        >
            <!-- Error state UI remains the same -->
            <!-- ... -->
        </section>
    {/if}
</TripDetailsLoader>

{#if paymentStatus}
    <StatusOverlay status={paymentStatus} message={statusMessage} />
{/if}
