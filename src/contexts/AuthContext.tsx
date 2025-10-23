// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, UserProfile, Company } from '../lib/supabase';

type SignUpResult = {
  error?: any;
  user?: any | null;
  requiresConfirmation?: boolean;
};

type AuthContextType = {
  user: any | null;
  userProfile: UserProfile | null;
  company: Company | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, role: 'client' | 'company', fullName?: string) => Promise<SignUpResult>;
  resendConfirmation: (email: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  refreshCompany: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ---------------------------------------
  // loadProfile: obtiene user_profiles y company (por user_id)
  // ---------------------------------------
  async function loadProfile(supabaseUser?: any) {
    const u = supabaseUser ?? (await supabase.auth.getUser()).data?.user ?? null;
    if (!u) {
      setUserProfile(null);
      setCompany(null);
      return;
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', u.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setUserProfile((profile as UserProfile) ?? null);

      const { data: compByUser, error: compByUserErr } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', u.id)
        .maybeSingle();

      if (compByUserErr) throw compByUserErr;
      setCompany((compByUser as Company) ?? null);
    } catch (err) {
      console.error('[AuthContext] loadProfile error:', err);
      setUserProfile(null);
      setCompany(null);
    }
  }

  // ---------------------------------------
  // signUp: crear usuario enviando metadata (role + full_name)
  // ---------------------------------------
  // Tipo de retorno aproximado (ajusta si tienes un tipo propio)
type SignUpResult = {
  error: any | null;
  user?: any | null;
  requiresConfirmation?: boolean;
};

async function signUp(
  email: string,
  password: string,
  role: 'client' | 'company',
  fullName?: string
): Promise<SignUpResult> {
  try {
    console.log('🔧 signUp request', { email, role, fullName });

    // 1) Crear auth.user (envío metadata opcional)
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName ?? email.split('@')[0],
        },
      },
    });

    if (res.error) {
      console.error('[Auth] signUp error (supabase)', res.error);
      return { error: res.error };
    }

    // 2) Si supabase devuelve el user (no requiere confirmación)
    const createdUser = res.data?.user ?? null;

    if (createdUser) {
      const userId = createdUser.id;
      const full = fullName ?? email.split('@')[0];

      // 3) Llamar RPC para crear user_profiles (+ companies si corresponde)
      const rpc = await supabase.rpc('create_profile_and_company', {
        p_user_id: userId,
        p_role: role,
        p_full_name: full,
      });

      if ((rpc as any).error) {
        // Logueamos el error de la RPC y lo devolvemos para que la UI lo maneje
        console.error('[Auth] create_profile_and_company RPC error', (rpc as any).error);
        return { error: (rpc as any).error };
      }

      // 4) Si la RPC fue OK, cargamos perfil/empresa en el contexto
      setUser(createdUser);
      await loadProfile(createdUser);

      return { error: null, user: createdUser, requiresConfirmation: false };
    } else {
      // 5) Si requiere confirmación (signup devuelve user === null)
      // NO podemos llamar a la RPC porque no tenemos user.id todavía.
      // La RPC debe llamarse en el listener SIGNED_IN al primer login/confirmación.
      return { error: null, user: null, requiresConfirmation: true };
    }
  } catch (err) {
    console.error('💥 [AuthContext] signUp exception:', err);
    return { error: err };
  }
}


  // ---------------------------------------
  // resendConfirmation: reenviar email de confirmación
  // ---------------------------------------
  async function resendConfirmation(email: string) {
    try {
      if (!email) return { error: { message: 'Introduce un email válido' } };
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      return { error };
    } catch (err) {
      console.error('[AuthContext] resendConfirmation error:', err);
      return { error: err };
    }
  }

  // ---------------------------------------
  // signIn
  // ---------------------------------------
  async function signIn(email: string, password: string) {
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) {
        return { error: res.error };
      }
      const u = res.data?.user ?? null;
      setUser(u);
      await loadProfile(u);
      return { error: null };
    } catch (err: any) {
      console.error('[AuthContext] signIn exception', err);
      return { error: { message: err?.message ?? 'Error inesperado' } };
    }
  }

  // ---------------------------------------
  // signOut
  // ---------------------------------------
  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[AuthContext] signOut error', err);
    } finally {
      setUser(null);
      setUserProfile(null);
      setCompany(null);
    }
  }

  async function refreshCompany() {
    await loadProfile(user);
  }

  async function refreshProfile() {
    await loadProfile(user);
  }

  // ---------------------------------------
  // init: recuperar sesión persistida y listener seguro
  // ---------------------------------------
  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);
      try {
        const sessionResp = await supabase.auth.getSession();
        const currentUser = (sessionResp.data?.session?.user) ?? (await supabase.auth.getUser()).data?.user ?? null;
        if (!mounted) return;
        setUser(currentUser);
        await loadProfile(currentUser);
      } catch (err) {
        console.error('[AuthContext] init error', err);
        setUser(null);
        setUserProfile(null);
        setCompany(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      // recargar profile/company (no await para no bloquear el listener)
      loadProfile(u).catch((e) => console.error('[AuthContext] onAuthStateChange loadProfile', e));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        company,
        loading,
        signIn,
        signUp,
        resendConfirmation,
        signOut,
        refreshCompany,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
