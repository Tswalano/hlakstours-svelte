<script>
	import { onMount } from 'svelte';
	import { Globe } from 'lucide-svelte';

	let currentIndex = 0;
	let fadeIn = true;

	const carouselItems = [
		{
			title: 'Discover New Horizons!',
			heading: 'Embark on an Epic Journey!',
			description: 'Explore new horizons and create unforgettable memories.'
		},
		{
			title: 'Experience the Unseen!',
			heading: 'Discover Hidden Gems!',
			description: 'Experience the thrill of discovering hidden treasures.'
		},
		{
			title: 'Explore the World!',
			heading: "Let's Make Your Best Trip Ever!",
			description: "Embark on a journey to discover the world's wonders."
		}
	];

	// @ts-ignore
	const handleSlideChange = (newIndex) => {
		fadeIn = false;
		setTimeout(() => {
			currentIndex = newIndex;
			fadeIn = true;
		}, 200);
	};

	const nextSlide = () => {
		handleSlideChange((currentIndex + 1) % carouselItems.length);
	};

	const prevSlide = () => {
		handleSlideChange((currentIndex - 1 + carouselItems.length) % carouselItems.length);
	};

	onMount(() => {
		const interval = setInterval(() => {
			handleSlideChange((currentIndex + 1) % carouselItems.length);
		}, 5000);

		return () => clearInterval(interval); // Cleanup on component destroy
	});
</script>

<!-- <div class="py-20 bg-gradient-to-b bg-emerald-50 to-white"> -->
<section
	class="relative w-full min-h-screen bg-gradient-to-b from-emerald-100 to-white overflow-hidden"
>
	<!-- <section class="relative w-full min-h-screen bg-gradient-to-b bg-emerald-50 to-white overflow-hidden"> -->
	<!-- Decorative vectors -->
	<div class="absolute top-10 left-10 opacity-20">
		<img src="/assets/vector1.png" alt="Travel destinations" class="w-auto h-auto" />
	</div>
	<div class="absolute top-20 right-20 opacity-20">
		<img src="/assets/vector2.png" alt="Travel destinations" class="w-auto h-auto" />
	</div>
	<div class="absolute bottom-10 left-20 opacity-20">
		<img src="/assets/vector3.png" alt="Travel destinations" class="w-auto h-auto" />
	</div>
	<!-- relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 -->
	<!-- <div class="container relative z-40 mx-auto py-10"> -->
	<div class="container relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
		<div class="relative">
			<div
				class={`flex flex-col lg:flex-row items-center justify-between p-6 min-h-[500px] transition-opacity duration-200 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
			>
				<div class="lg:w-1/2 mb-6 lg:mb-0">
					<div class="banner-inner-content">
						<h4 class="text-xl font-semibold mb-2 flex items-center text-emerald-600">
							{carouselItems[currentIndex].title}
							<Globe class="ml-2" />
						</h4>
						<h1 class="text-4xl md:text-5xl font-bold mb-4 text-purple-900">
							{carouselItems[currentIndex].heading}
						</h1>
						<p class="text-lg mb-6 text-gray-600">
							{carouselItems[currentIndex].description}
						</p>
						<a
							href="/about"
							class="inline-block bg-emerald-500 text-white py-3 px-8 rounded-full hover:bg-emerald-600 transition-colors duration-200 font-medium"
						>
							Explore Now
						</a>
					</div>
				</div>
				<div class="lg:w-1/2 relative">
					<img
						src="/assets/home-banner-image.png"
						alt="Travel Illustration"
						class="w-full max-w-lg mx-auto"
					/>
					<!-- Decorative dots -->
					<div
						class="absolute -bottom-4 -right-4 w-20 h-20 bg-purple-200 rounded-full opacity-50"
					></div>
					<div
						class="absolute -top-4 -left-4 w-16 h-16 bg-emerald-200 rounded-full opacity-50"
					></div>
				</div>
			</div>

			<!-- Slide indicators -->
			<div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
				{#each carouselItems as _, index}
					<button
						on:click={() => handleSlideChange(index)}
						class={`h-2 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-purple-600 w-6' : 'bg-purple-300 w-2'}`}
						aria-label={`Go to slide ${index + 1}`}
					></button>
				{/each}
			</div>
		</div>
	</div>
</section>
