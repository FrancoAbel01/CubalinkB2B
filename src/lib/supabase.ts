import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  user_id: string;
  role: 'client' | 'company' | 'admin';
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Company = {
  id: string;

  // Relación
  user_id: string | null;

  // Datos visibles
  name: string;
  username?: string | null;           // <-- nuevo
  description: string;
  logo_url: string | null;
  banner_url?: string | null;         // <-- nuevo
  website: string | null;
  websites?: Record<string, any> | null; // <-- nuevo (jsonb)
  email: string | null;
  phone: string | null;
  address: string | null;

  // Contacto y legal
  contact_name?: string | null;       // <-- nuevo
  legal_identifier?: string | null;   // <-- nuevo

  // Categorías / meta
  keywords?: string[] | null;         // <-- nuevo (text[])
  sector?: string | null;             // <-- nuevo

  // JSON / estructurados
  social_links?: Record<string, any> | null;      // <-- nuevo (jsonb)
  catalog_pdf?: Record<string, any> | null;       // <-- nuevo (jsonb)
  additional_services?: Record<string, any> | null; // <-- nuevo (jsonb)
  affiliates?: Record<string, any> | null;        // <-- nuevo (jsonb)

  // Geo
  latitude?: number | null;           // <-- nuevo (numeric -> number)
  longitude?: number | null;          // <-- nuevo

  // Subscripción / plan
  plan_type?: 'free' | 'premium' | 'enterprise' | null; // <-- nuevo (enum)
  subscription_status: 'pending' | 'active' | 'inactive';
  subscription_activated_at: string | null;
  subscription_expires_at: string | null;
  terms_accepted_at?: string | null;  // <-- nuevo

  // Estado
  status?: 'pending' | 'active' | 'suspended' | 'deleted' | null; // <-- nuevo

  // Timestamps
  created_at: string;
  updated_at: string;
};


export type Product = {
  id: string;
  company_id: string;
  name: string;
  description: string;
  price: number | null;
  image_url: string | null;
  created_at: string;
};

export type Service = {
  id: string;
  company_id: string;
  name: string;
  description: string;
  created_at: string;
};

export type Post = {
  id: string;
  company_id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ExtraService = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export type UserProfile = {
//   id: string;
//   user_id: string;
//   role: 'client' | 'company' | 'admin';
//   full_name: string | null;
//   phone: string | null;
//   created_at: string;
//   updated_at: string;
// };

// export type Company = {
//   id: string;
//   name: string;
//   description: string;
//   logo_url: string | null;
//   website: string | null;
//   email: string | null;
//   phone: string | null;
//   address: string | null;
//   user_id: string | null;
//   subscription_status: 'pending' | 'active' | 'inactive';
//   subscription_activated_at: string | null;
//   subscription_expires_at: string | null;
//   created_at: string;
//   updated_at: string;
// };

// export type Product = {
//   id: string;
//   company_id: string;
//   name: string;
//   description: string;
//   price: number | null;
//   image_url: string | null;
//   created_at: string;
// };

// export type Service = {
//   id: string;
//   company_id: string;
//   name: string;
//   description: string;
//   created_at: string;
// };

// export type Post = {
//   id: string;
//   company_id: string;
//   title: string;
//   content: string;
//   image_url: string | null;
//   created_at: string;
//   updated_at: string;
// };

// export type ExtraService = {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image_url: string | null;
//   is_active: boolean;
//   created_at: string;
// };
