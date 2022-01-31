declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
			SOLID_APP_API_URL: string;
			SOLID_APP_RECAPTHA_SITE_KEY: string;
			SOLID_APP_MAPBOX_API_KEY: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
