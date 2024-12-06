export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/about": [4],
		"/admin": [5,[2]],
		"/admin/bookings": [6,[2]],
		"/admin/customers": [7,[2]],
		"/admin/settings": [8,[2]],
		"/admin/trips": [9,[2]],
		"/admin/trips/create": [10,[2]],
		"/booking/confirmation/[referanceId]": [11],
		"/test": [12],
		"/trips": [13],
		"/trips/[tripId]": [14]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';