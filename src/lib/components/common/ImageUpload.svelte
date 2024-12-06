<script lang="ts">
	import { Upload } from 'lucide-svelte';

	export let onImageSelect: (files: File[]) => void;
	export let label: string = 'Upload Image';
	export let multiple: boolean = false;
	export let maxFiles: number = 5;

	let inputElement: HTMLInputElement;
	let isDragging = false;

	function handleSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = input.files ? Array.from(input.files) : [];

		if (files.length > 0) {
			onImageSelect(files);
		}

		// Reset input value
		if (inputElement) {
			inputElement.value = '';
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		const files = event.dataTransfer ? Array.from(event.dataTransfer.files) : [];

		if (files.length > 0) {
			onImageSelect(files);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleClick() {
		inputElement?.click();
	}
</script>

<div
	class="relative border-2 border-dashed rounded-lg p-6 cursor-pointer
         {isDragging
		? 'border-emerald-500 bg-emerald-50'
		: 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
         transition-colors duration-200"
	on:dragover={handleDragOver}
	on:drop={handleDrop}
	on:dragleave={handleDragLeave}
	on:click={handleClick}
	on:keydown={(e) => e.key === 'Enter' && handleClick()}
	role="button"
	tabindex="0"
	aria-label="Drag and drop or click to upload image"
>
	<input
		bind:this={inputElement}
		type="file"
		id="file-upload"
		accept="image/*"
		{multiple}
		on:change={handleSelect}
		class="hidden"
	/>

	<div class="flex flex-col items-center justify-center pt-5 pb-6">
		<Upload
			class={`w-12 h-12 mb-3 transition-colors duration-200 ${isDragging ? 'text-emerald-500' : 'text-gray-400'}`}
		/>
		<p class="mb-2 text-sm text-gray-500">
			<span class="font-semibold">Click to upload</span> or drag and drop
		</p>
		<p class="text-xs text-gray-500">
			{#if multiple}
				Upload up to {maxFiles} images
			{:else}
				Upload one image
			{/if}
		</p>
	</div>
</div>
