declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
			SOLID_APP_API_URL: string;
			SOLID_APP_RECAPTHA_SITE_KEY: string;
			SOLID_APP_MAPBOX_API_KEY: string;
		}
	}

	interface User {
		user_id: number;
		user_type_id: number;
		email: string;
		display_name?: string;
		avatar_url?: string;
		email_validated: boolean;
		locale: string;
	}
	interface Mentor {
		mentor_id?: number;
		first_name: string;
		last_name: string;
		date_of_birth: string | Date;
		emso: string;
		phone_number: string;
		gender: "MALE" | "FEMALE";
		date_created?: string | Date | undefined;
	}

	interface Patient {
		patient_id?: number;
		first_name: string;
		last_name: string;
		date_of_birth: Date | string;
		emso: string;
		email?: string | null;
		phone_number?: string | null;
		gender: "MALE" | "FEMALE";
		details?: string | null;
		date_created?: Date | string;
		location?: Location;
	}

	interface Location {
		location_id: string;
		place_name: string;
		coordinates: [number, number];
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
