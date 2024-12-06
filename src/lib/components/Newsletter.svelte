<!-- NewsletterSignup.svelte -->
<script lang="ts">
	let email: string = '';

	function handleSubmit(): void {
		// Handle newsletter signup
		console.log('Newsletter signup:', email);
		// Reset form
		email = '';
	}
</script>

<section class="py-16 relative overflow-hidden">
	<!-- Background decorative circles -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute top-[-100px] right-[-100px] w-[400px] h-[400px]
                rounded-full bg-teal-500/10"
		></div>
		<div
			class="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px]
                rounded-full bg-teal-500/5"
		></div>
	</div>

	<!-- Newsletter Content -->
   <!-- relative w-full min-h-screen bg-gradient-to-b from-emerald-100 to-white overflow-hidden -->
	<div class="max-w-6xl mx-auto">
		<div class="bg-teal-600 rounded-2xl p-8 md:p-12 relative overflow-hidden">
			<!-- Background decorative elements -->
			<div
				class="absolute top-[-50px] right-[-50px] w-[200px] h-[200px]
                  rounded-full bg-teal-500/20"
			></div>
			<div
				class="absolute bottom-[-60px] left-[-60px] w-[180px] h-[180px]
                  rounded-full bg-teal-500/20"
			></div>

			<div class="relative z-10">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Get our pro offers</h2>
				<p class="text-teal-50 mb-8 max-w-xl">
					Create a visual identity for your company, and an overall branding that stands out.
				</p>

				<!-- Newsletter Form -->
				<form
					on:submit|preventDefault={handleSubmit}
					class="flex flex-col sm:flex-row gap-4 max-w-2xl"
				>
					<input
						type="email"
						bind:value={email}
						placeholder="Enter your email"
						class="flex-1 px-6 py-3 rounded-lg border-2 border-transparent
                   focus:border-teal-400 focus:ring-2 focus:ring-teal-400
                   focus:outline-none transition-colors"
						required
					/>
					<button
						type="submit"
						class="px-8 py-3 bg-slate-900 text-white rounded-lg font-medium
                   hover:bg-slate-800 transition-colors focus:outline-none
                   focus:ring-2 focus:ring-slate-400"
					>
						Subscribe
					</button>
				</form>
			</div>
		</div>
	</div>
</section>

<style>
	/* Optional: Add custom styles here */
	input::placeholder {
		color: #94a3b8;
	}
</style>
