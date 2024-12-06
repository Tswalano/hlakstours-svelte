<script lang="ts">
	import { CheckCircle2, XCircle, Loader2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let status: 'processing' | 'success' | 'error' = 'processing';
	export let message: string = '';
</script>

<div
	id="paystack-overlay"
	class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
	transition:fade
>
	<div class="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center space-y-4">
		{#if status === 'processing'}
			<Loader2 class="w-16 h-16 mx-auto text-emerald-500 animate-spin" />
			<h2 class="text-xl font-semibold">Processing Payment</h2>
			<p class="text-gray-600">Please wait while we process your payment...</p>
		{:else if status === 'success'}
			<CheckCircle2 class="w-16 h-16 mx-auto text-emerald-500" />
			<h2 class="text-xl font-semibold text-emerald-700">Payment Successful!</h2>
			<p class="text-gray-600">{message || 'Your booking has been confirmed.'}</p>
		{:else}
			<XCircle class="w-16 h-16 mx-auto text-red-500" />
			<h2 class="text-xl font-semibold text-red-700">Payment Failed</h2>
			<p class="text-gray-600">
				{message || 'There was an error processing your payment. Please try again.'}
			</p>
		{/if}
	</div>
</div>
