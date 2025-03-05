<script lang="ts">
	import { page } from "$app/stores";
	import AuthGuard from "$lib/components/auth/AuthGuard.svelte";
	import LogoutButton from "$lib/components/auth/LogoutButton.svelte";
	import type { NavigationItem } from "$lib/types/navigation";
	import { authStore } from "$lib/stores/auth";

	import {
		LayoutDashboard,
		Map,
		CalendarDays,
		Users,
		Settings,
		Menu,
		X,
	} from "lucide-svelte";

	let isSidebarOpen = false;
	$: user = $authStore.user;

	const navigationItems: NavigationItem[] = [
		{
			label: "Dashboard",
			icon: LayoutDashboard,
			href: "/admin",
			match: /^\/admin$/,
		},
		{
			label: "Trips",
			icon: Map,
			href: "/admin/trips",
			match: /^\/admin\/trips/,
		},
		{
			label: "Bookings",
			icon: CalendarDays,
			href: "/admin/bookings",
			match: /^\/admin\/bookings/,
		},
		{
			label: "Customers",
			icon: Users,
			href: "/admin/customers",
			match: /^\/admin\/customers/,
		},
		{
			label: "Settings",
			icon: Settings,
			href: "/admin/settings",
			match: /^\/admin\/settings/,
		},
	];

	function toggleSidebar(): void {
		isSidebarOpen = !isSidebarOpen;
	}

	function isCurrentPage(pattern: RegExp): boolean {
		return pattern.test($page.url.pathname);
	}
</script>

<div class="min-h-screen bg-gray-100">
	<AuthGuard>
		<!-- Mobile Sidebar Toggle -->
		<div class="lg:hidden fixed top-4 left-4 z-50">
			<button
				on:click={() => (isSidebarOpen = !isSidebarOpen)}
				class="p-2 bg-white rounded-lg shadow-md hover:bg-emerald-50"
				aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
			>
				{#if isSidebarOpen}
					<X class="w-6 h-6 text-gray-600" />
				{:else}
					<Menu class="w-6 h-6 text-gray-600" />
				{/if}
			</button>
		</div>

		<!-- Sidebar -->
		<aside
			class="fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300
					 lg:translate-x-0 {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
		>
			<!-- Logo -->
			<div class="border-b border-gray-200">
				<div class="p-6">
					<a href="/" class="flex items-center gap-3 group">
						<div class="flex-shrink-0">
							<img
								src="/logo.png"
								alt="Logo"
								class="h-12 w-auto object-contain group-hover:opacity-90 transition-opacity"
							/>
						</div>
						<div class="flex flex-col">
							<span
								class="text-2xl font-bold text-gray-900 leading-none group-hover:text-emerald-600 transition-colors"
							>
								Admin Panel
							</span>
							<span class="text-sm text-gray-500 mt-1">
								Hlaks Tours Dashboard
							</span>
						</div>
					</a>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="p-4 space-y-1">
				{#each navigationItems as item (item.href)}
					<a
						href={item.href}
						class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600
						   {$page.url.pathname.match(item.match)
							? 'bg-emerald-50 text-emerald-600'
							: ''}"
					>
						<svelte:component
							this={item.icon}
							class="w-5 h-5 mr-3"
						/>
						{item.label}
					</a>
				{/each}
			</nav>

			{#if $authStore.user}
				<div class="mt-auto p-4 border-t border-gray-200">
					<div class="flex items-center mb-4">
						<div class="flex-shrink-0">
							<div
								class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"
							>
								<span
									class="text-sm font-medium text-emerald-600"
								>
									{$authStore.user.email?.[0].toUpperCase()}
								</span>
							</div>
						</div>
						<div class="ml-3">
							<p class="text-sm font-medium text-gray-900">
								{$authStore.user.email}
							</p>
						</div>
					</div>
					<LogoutButton />
				</div>
			{/if}
		</aside>

		<!-- Main Content -->
		<main class="lg:pl-64">
			<div class="p-6">
				<slot />
			</div>
		</main>
	</AuthGuard>
</div>

<style lang="ts">
	/* Ensure image maintains quality */
	img {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* Optional: Add subtle animation on hover */
	a {
		transform: translateZ(0);
		backface-visibility: hidden;
	}

	a:hover img {
		transform: scale(1.02);
		transition: transform 0.2s ease-in-out;
	}
</style>
