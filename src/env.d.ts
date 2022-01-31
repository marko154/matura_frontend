interface ImportMetaEnv {
	readonly SOLID_APP_API_URL: string;
	readonly SOLID_APP_RECAPTHA_SITE_KEY: string;
	readonly SOLID_APP_MAPBOX_API_KEY: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
