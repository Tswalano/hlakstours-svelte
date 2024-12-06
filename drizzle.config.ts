import { defineConfig } from 'drizzle-kit';

if (!process.env.SUPERBASE_DATABASE_URL) throw new Error('SUPERBASE_DATABASE_URL is not set');


export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/db/schema.ts',
	out: './src/lib/db/migrations',

	dbCredentials: {
		url: `${process.env.SUPERBASE_DATABASE_URL}?sslmode=disable`
	},
	// verbose: true,
	// strict: true
});
