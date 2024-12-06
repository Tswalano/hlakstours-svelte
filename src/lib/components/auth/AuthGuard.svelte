<script lang="ts">
	import { onMount } from 'svelte';
	import { Loader, Mail, Lock, AlertCircle } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';

	let email = '';
	let password = '';
	let isSignUp = false;

	onMount(async () => {
		try {
			const response = await fetch('/api/auth');
			const data = await response.json();

			if (data.error) {
				authStore.setError(data.error);
				return;
			}

			authStore.setUser(data.session?.user ?? null);
		} catch (error) {
			authStore.setError('Failed to fetch user session');
			console.error('Error:', error);
		}
	});

	const handleSubmit = async (event: SubmitEvent): Promise<void> => {
		event.preventDefault();
		authStore.setLoading(true);
		authStore.setError(null);

		try {
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password,
					action: isSignUp ? 'signup' : 'login'
				})
			});

			const data = await response.json();

			if (data.error) {
				authStore.setError(data.error);
				return;
			}

			authStore.setUser(data.data?.session?.user ?? null);
		} catch (error) {
			authStore.setError('An unexpected error occurred. Please try again.');
			console.error('Error during authentication:', error);
		}
	};

	const toggleAuthMode = () => {
		isSignUp = !isSignUp;
		authStore.setError(null);
	};
</script>

{#if $authStore.loading}
	<div class="min-h-screen flex items-center justify-center bg-gray-50">
		<Loader class="w-8 h-8 text-emerald-600 animate-spin" />
	</div>
{:else if !$authStore.user}
	<div class="min-h-screen flex items-center justify-center bg-gray-50">
		<div class="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
			<div class="text-center">
				<img src="/logo.png" alt="Logo" class="h-16 mx-auto mb-6" />
				<h2 class="text-3xl font-bold text-gray-900">
					{isSignUp ? 'Create Account' : 'Welcome Back'}
				</h2>
				<p class="mt-2 text-gray-600">
					{isSignUp
						? 'Sign up to access the admin dashboard'
						: 'Please sign in to access the admin dashboard'}
				</p>
			</div>

			{#if $authStore.error}
				<div class="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
					<AlertCircle class="w-5 h-5 mt-0.5 flex-shrink-0" />
					<p class="text-sm">{$authStore.error}</p>
				</div>
			{/if}

			<form class="space-y-6" on:submit={handleSubmit}>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
					<div class="mt-1 relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Mail class="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="email"
							bind:value={email}
							type="email"
							required
							class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                     placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
							placeholder="Enter your email"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
					<div class="mt-1 relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock class="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="password"
							bind:value={password}
							type="password"
							required
							class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                     placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
							placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
						/>
					</div>
				</div>

				<button
					type="submit"
					class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                 shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
				>
					{isSignUp ? 'Create Account' : 'Sign In'}
				</button>
			</form>

			<div class="text-center">
				<button
					type="button"
					on:click={toggleAuthMode}
					class="text-sm text-emerald-600 hover:text-emerald-500"
				>
					{isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
				</button>
			</div>
		</div>
	</div>
{:else}
	<slot />
{/if}
