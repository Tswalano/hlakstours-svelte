<script lang="ts">
	import { LogOut } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	async function handleLogout() {
		authStore.setLoading(true);
		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST'
			});

			if (!response.ok) {
				throw new Error('Logout failed');
			}

			authStore.reset();
			goto('/admin');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
            authStore.setLoading(false);
		}
	}
</script>

<button
	on:click={handleLogout}
	class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
>
	<LogOut class="w-4 h-4 mr-2" />
	Sign Out
</button>
