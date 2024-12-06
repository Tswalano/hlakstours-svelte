<!-- AboutUs.svelte -->
<script lang="ts">
	import {
		Building2,
		Users,
		Wallet,
		Headphones,
		ChevronDown,
		Globe,
		Map,
		Award,
		Linkedin,
		Instagram,
		Twitter,
		Mail
	} from 'lucide-svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	interface Feature {
		icon: typeof Building2;
		title: string;
		description: string;
	}

	interface Stats {
		value: string;
		label: string;
		icon: typeof Building2;
	}

	interface FaqItem {
		question: string;
		answer: string;
		isOpen: boolean;
	}

	interface TransitionParams {
		duration: number;
		delay: number;
	}

	interface FlyParams extends TransitionParams {
		y?: number;
		x?: number;
	}

	interface TeamMember {
		name: string;
		position: string;
		image: string;
		social: [
			{
				url: string;
				icon: typeof Linkedin;
			},
			{
				url: string;
				icon: typeof Twitter;
			},
			{
				url: string;
				icon: typeof Instagram;
			},
			{
				url: string;
				icon: typeof Mail;
			}
		];
	}

	const features: Feature[] = [
		{
			icon: Building2,
			title: 'Luxury Trip',
			description: 'Our algorithm connects you with like-minded partners using your interests.'
		},
		{
			icon: Users,
			title: 'Personalized approach',
			description:
				'Effortlessly navigate and find your perfect match with our user-friendly interface.'
		},
		{
			icon: Wallet,
			title: 'Affordable Budget',
			description: 'Your safety is a priority. We ensure strict security for your information.'
		},
		{
			icon: Headphones,
			title: 'Experienced Guide',
			description: 'Our team is available 24/7 to assist you with any queries or concern.'
		}
	];

	const stats: Stats[] = [
		{ value: '10K+', label: 'Happy Travelers', icon: Users },
		{ value: '150+', label: 'Destinations', icon: Map },
		{ value: '15+', label: 'Years Experience', icon: Award },
		{ value: '24/7', label: 'Support', icon: Headphones }
	];

	let faqItems: FaqItem[] = [
		{
			question: 'What makes Hlaks Tours different from other travel agencies?',
			answer:
				'Hlaks Tours stands out through our personalized approach, luxury experiences at affordable prices, and 24/7 expert support. We combine technology with human expertise to create unforgettable journeys.',
			isOpen: false
		},
		{
			question: 'How do you ensure the best prices for your trips?',
			answer:
				'We maintain strong relationships with local partners and negotiate bulk rates, passing the savings directly to our customers. Our price match guarantee ensures you always get the best deal.',
			isOpen: false
		},
		{
			question: 'What kind of support do you offer during the trip?',
			answer:
				'Our dedicated support team is available 24/7 through multiple channels. Each traveler gets a dedicated travel consultant and access to our emergency helpline.',
			isOpen: false
		},
		{
			question: 'Can I customize my travel itinerary?',
			answer:
				'Absolutely! We specialize in creating customized itineraries that match your preferences, budget, and travel style. Our experts will work with you to craft the perfect journey.',
			isOpen: false
		}
	];

	const teamMembers: TeamMember[] = [
		{
			name: 'Glen B. Mogane',
			position: 'Support & CTO',
			image: '/assets/review-person1.png',
			social: [
				{
					url: 'https://linkedin.com',
					icon: Linkedin
				},
				{
					url: 'https://twitter.com',
					icon: Twitter
				},
				{
					url: 'https://instagram.com',
					icon: Instagram
				},
				{
					url: 'glen@hlakstours.co.za',
					icon: Mail
				}
			]
		},
		{
			name: 'Robbin T. Mahlake',
			position: 'Founder & CEO',
			image: '/assets/review-person2.png',
			social: [
				{
					url: 'https://linkedin.com',
					icon: Linkedin
				},
				{
					url: 'https://twitter.com',
					icon: Twitter
				},
				{
					url: 'https://instagram.com',
					icon: Instagram
				},
				{
					url: 'robbin@hlakstours.co.za',
					icon: Mail
				}
			]
		},
		{
			name: 'Mrs Mahlake',
			position: 'CFO',
			image: '/assets/review-person3.png',
			social: [
				{
					url: 'https://linkedin.com',
					icon: Linkedin
				},
				{
					url: 'https://twitter.com',
					icon: Twitter
				},
				{
					url: 'https://instagram.com',
					icon: Instagram
				},
				{
					url: 'mrs.mahlake@hlakstours.co.za',
					icon: Mail
				}
			]
		}
	];

	let mounted: boolean = false;

	onMount((): void => {
		mounted = true;
	});

	function toggleFaq(index: number): void {
		faqItems[index].isOpen = !faqItems[index].isOpen;
		faqItems = [...faqItems];
	}

	// Add these if you want more interactivity
	function handleEmailClick(email: string): void {
		window.location.href = `mailto:${email}`;
	}

	function handleSocialClick(url: string): void {
		window.open(url, '_blank', 'noopener noreferrer');
	}
</script>

<!-- About Us Section -->
<!-- <section
class="relative w-full min-h-screen bg-gradient-to-b from-emerald-100 to-white overflow-hidden"
> -->
<!-- <section class="relative max-w-7xl bg-gradient-to-b from-emerald-100 to-white mx-auto px-6 sm:px-8 py-28 lg:py-36"> -->
<section class="relative w-full min-h-screen px-6 sm:px-8 py-28 lg:py-36 bg-gradient-to-b from-emerald-100 to-white overflow-hidden">
	<div class="container mx-auto max-w-6xl">
		<div class="text-center">
			<h1 class="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
				Your Journey Begins<br />With Hlaks Tours
			</h1>
			<p class="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-12">
				We're more than just a travel agency – we're your partners in creating unforgettable
				experiences and memories that last a lifetime.
			</p>

			<!-- Stats Grid -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
				{#each stats as { icon, value, label }, index}
					<div
						class="text-center transform transition-transform duration-300 hover:scale-105"
						in:fade={{ duration: 800, delay: 200 + index * 100 }}
					>
						<div
							class="w-14 h-14 rounded-full bg-orange-100 text-orange-500 mx-auto mb-4 flex items-center justify-center"
						>
							<svelte:component this={icon} class="w-7 h-7" />
						</div>
						<div class="font-bold text-3xl text-slate-900">{value}</div>
						<div class="text-slate-600">{label}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Our Team Section -->
<!-- <section class="py-20 bg-slate-50"> -->
<section class="py-20 bg-gradient-to-b from-slate-100 to-white">
	<div class="container mx-auto max-w-6xl px-6">
		<div class="text-center mb-16">
			<span class="text-orange-500 uppercase tracking-wide font-medium">Our Team</span>
			<h2 class="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
				Meet the Experts Behind<br />Your Perfect Journey
			</h2>
			<p class="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
				Our team of experienced travel enthusiasts is dedicated to crafting the perfect experience
				for every adventurer.
			</p>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each teamMembers as { image, name, position, social }, index}
				<div
					class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300"
					in:fly={{ y: 20, duration: 800, delay: 200 + index * 100 }}
				>
					<!-- Profile Image -->
					<div class="relative overflow-hidden rounded-xl mb-6 group">
						<img
							src={image}
							alt={name}
							class="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
						/>
					</div>

					<!-- Profile Info -->
					<div class="text-center">
						<h3 class="text-xl font-bold text-slate-900 mb-1">{name}</h3>
						<p class="text-orange-500 font-medium">{position}</p>
						<!-- Social Links -->
						<div class="flex justify-center space-x-4 mt-4">
							{#each social as { url, icon }, index}
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-slate-600 hover:text-orange-500"
								>
									<svelte:component this={icon} class="w-6 h-6" />
								</a>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-20 bg-white relative">
	<div class="container max-w-6xl mx-auto px-6">
		<div class="text-center mb-12">
			<span class="text-orange-500 uppercase tracking-wide font-medium">Features</span>
			<h2 class="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
				Experience the World with Us
			</h2>
			<p class="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
				Discover the features that make traveling seamless and unforgettable with Hlaks Tours.
			</p>
		</div>

		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<div class="grid sm:grid-cols-2 gap-8">
				{#each features as { icon, title, description }, index}
					<div
						class="bg-slate-50 p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition"
						in:fly={{ y: 20, duration: 800, delay: 300 + index * 100 }}
					>
						<div
							class="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-4"
						>
							<svelte:component this={icon} class="w-6 h-6" />
						</div>
						<h3 class="text-lg font-semibold text-slate-900">{title}</h3>
						<p class="text-slate-600 mt-2">{description}</p>
					</div>
				{/each}
			</div>

			<!-- Feature Image -->
			<div class="relative">
				<img
					src="/assets/article-img1.jpg"
					alt="Travel destinations"
					class="w-full rounded-xl shadow-xl transform hover:scale-[1.02] transition duration-500"
				/>
			</div>
		</div>
	</div>
</section>

<!-- Mission Section -->
<section class="py-20 bg-gradient-to-b from-slate-50 to-white">
	<div class="container max-w-6xl mx-auto px-6">
		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<img src="/assets/travel-image-bag.png" alt="Our Mission" class="rounded-lg w-full" />
			<div>
				<span class="text-orange-500 uppercase font-medium">Our Mission</span>
				<h2 class="text-4xl font-bold text-slate-900 mt-2 mb-6">Creating Journeys That Inspire</h2>
				<p class="text-lg text-slate-600">
					At Hlaks Tours, we believe travel has the power to transform lives. Our mission is to make
					extraordinary travel experiences accessible to everyone.
				</p>
			</div>
		</div>
	</div>
</section>