// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';
import image from '../img/logo.png';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, refreshCompany } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorText('');
    setLoadingLocal(true);

    try {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setErrorText('Email o contraseña incorrectos');
        setLoadingLocal(false);
        return;
      }

      // Forzamos recarga por si faltó info (ej. company)
      await refreshCompany();

      // Ir al dashboard (si eres company) o al home según tu lógica
      navigate('/');
    } catch (err) {
      console.error('Login error', err);
      setErrorText('Ocurrió un error al iniciar sesión');
    } finally {
      setLoadingLocal(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left: Top half white (logo centered) + bottom half gradient */}
        <div className="hidden md:flex flex-col text-white">
          {/* Top half: completamente blanco */}
          <div className="flex-1 bg-white flex items-center justify-center p-6">
            <img
              src={image}
              alt="Logo CubaLink"
              className="h-20 md:h-28 lg:h-36 w-auto bg-white p-1 rounded-sm object-contain"
              loading="lazy"
              draggable={false}
            />
          </div>

          {/* Bottom half: degradado azul */}
          <div className="flex-1 bg-gradient-to-br from-blue-900 to-slate-900 p-10 flex flex-col justify-center gap-6">
            <div>
              <h3 className="text-3xl text-center font-bold leading-tight">Bienvenido </h3>
              <p className="mt-2 text-slate-200 max-w-sm">
                Accede a tu panel de empresa para administrar tu perfil, publicaciones, productos y servicios.
              </p>
            </div>

            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>• Panel minimal y rápido</li>
              <li>• Gestión de productos y publicaciones</li>
              <li>• Suscripciones y soporte</li>
            </ul>

            <div className="mt-6 text-sm text-slate-300">
              <p className="mb-1">¿Necesitas ayuda?</p>
              <a href="mailto:admin@directorio.com" className="underline text-white/90 hover:text-white">
                cubalinkb2b@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Right: Form - blanco */}
        <div className="bg-white p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center md:justify-start mb-6">
              <div className="text-center w-full">
                <h1 className="text-2xl font-bold text-slate-900">Iniciar sesión</h1>
                <p className="text-sm text-slate-500 mt-1">Accede a tu cuenta de empresa</p>
              </div>
            </div>

            {/* Error alert (si existe) */}
            {errorText && (
              <div className="mb-4">
                <Alert variant="danger" title="Error" message={errorText} dismissible onClose={() => setErrorText('')} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="tu@empresa.com"
                />
              </div>

              <label className="block text-sm font-medium text-slate-700">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Contraseña"
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 p-1 rounded hover:bg-slate-100"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                  <span>Recordarme</span>
                </label>

                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loadingLocal}
                className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
              >
                {loadingLocal ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Regístrate aquí
              </Link>
            </div>

            <div className="mt-6 text-center text-xs text-slate-400">
              <span>Al iniciar sesión aceptas los términos y condiciones.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
