declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      SOLID_APP_API_URL: string;
      SOLID_APP_RECAPTHA_SITE_KEY: string;
      SOLID_APP_MAPBOX_API_KEY: string;
    }
  }

  const Gender: {
    MALE: "MALE";
    FEMALE: "FEMALE";
    OTHER: "OTHER";
  };

  type Gender = typeof Gender[keyof typeof Gender];
  interface User {
    user_id: number;
    user_type_id: number;
    email: string;
    display_name?: string;
    avatar_url?: string;
    email_validated: boolean;
    locale: string;
    registration_date: string;
    last_login?: string;
    external_id?: string;
    external_type?: string;
    user_type: {
      user_type: string;
    };
  }
  interface Mentor {
    mentor_id?: number;
    first_name: string;
    last_name: string;
    date_of_birth: string | Date;
    emso: string;
    phone_number: string;
    gender: Gender;
    date_created?: string | Date | undefined;
  }

  interface Caregiver {
    caregiver_id: number;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    emso: string;
    phone_number: string;
    gender: Gender;
    additional_info: string | null;
    date_created: Date;
    user_id: number | null;
    location_id: string | null;
    mentor_id: number | null;
  }

  type Patient = {
    patient_id: number;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    emso: string;
    email: string | null;
    phone_number: string | null;
    gender: Gender;
    details: string | null;
    date_created: Date | string;
    location_id: string | null;
  };

  interface Location {
    location_id: string;
    place_name: string;
    coordinates: [number, number];
  }

  interface Session {
    session_id: number;
    start_time: Date;
    notes: string | null;
    patient_id: number;
    caregiver_id: number;
  }

  type Contact = {
    contact_id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone_number: string | null;
    patient_id: number;
  };
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
