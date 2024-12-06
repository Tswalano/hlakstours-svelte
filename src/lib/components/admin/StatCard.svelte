<!-- // src/lib/components/admin/StatCard.svelte -->
<script lang="ts">
	import type { ComponentType } from 'svelte';

	interface $$Props {
		title: string;
		value: string;
		change: string;
		icon: ComponentType;
		color: string;
	}

	export let title: $$Props['title'];
	export let value: $$Props['value'];
	export let change: $$Props['change'];
	export let icon: $$Props['icon'];
	export let color: $$Props['color'];

	// Determine if change is positive
	$: isPositive = change.startsWith('+');

	// Type-safe color class handling
	type ColorVariant = 'blue' | 'emerald' | 'purple' | 'orange';

	function getBackgroundColorClass(color: string): string {
		const variant = color.split('-')[1] as ColorVariant;
		return `bg-${variant}-50`;
	}

	$: backgroundColorClass = getBackgroundColorClass(color);
</script>

<div
	class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 relative overflow-hidden"
>
	<div class="flex items-center justify-between">
		<div class="relative z-10">
			<p class="text-sm font-medium text-gray-500">{title}</p>
			<h3 class="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
			<p class="text-sm {isPositive ? 'text-emerald-600' : 'text-red-600'} mt-2 font-medium">
				{change}
			</p>
		</div>

		<div class="relative z-10">
			<div class="p-3 rounded-full {backgroundColorClass}">
				<svelte:component this={icon} class="w-6 h-6 {color}" />
			</div>
		</div>
	</div>

	<!-- Decorative background -->
	<div class="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4 opacity-5">
		<svelte:component this={icon} class="w-32 h-32 {color}" />
	</div>
</div>
