// // src/pages/Register.tsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   Building2,
//   Mail,
//   Lock,
//   CheckCircle,
//   AlertCircle,
//   User,
//   Users,
//   Eye,
//   EyeOff,
// } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import Alert from '../components/Alert';

// export function Register() {
//   const [email, setEmail] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [role, setRole] = useState<'client' | 'company'>('client');

//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [alertState, setAlertState] = useState<{
//     variant: 'info' | 'success' | 'warning' | 'danger';
//     title?: React.ReactNode;
//     message?: React.ReactNode;
//     show: boolean;
//   }>({ variant: 'info', show: false });

//   const [requiresConfirmation, setRequiresConfirmation] = useState(false);
//   const { signUp, resendConfirmation } = useAuth();
//   const navigate = useNavigate();

//   // auto-hide alerts
//   useEffect(() => {
//     if (!alertState.show) return;
//     const t = setTimeout(() => setAlertState((s) => ({ ...s, show: false })), 5000);
//     return () => clearTimeout(t);
//   }, [alertState.show]);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setAlertState((s) => ({ ...s, show: false }));
//     setRequiresConfirmation(false);

//     if (password !== confirmPassword) {
//       setAlertState({ variant: 'danger', title: 'Error', message: 'Las contraseñas no coinciden', show: true });
//       return;
//     }

//     if (password.length < 6) {
//       setAlertState({
//         variant: 'danger',
//         title: 'Error',
//         message: 'La contraseña debe tener al menos 6 caracteres',
//         show: true,
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const { error, requiresConfirmation: rc } = await signUp(email.trim(), password, role, fullName || undefined);

//       if (error) {
//         setAlertState({ variant: 'danger', title: 'Error', message: error.message || 'Error al crear la cuenta', show: true });
//         setLoading(false);
//         return;
//       }

//       if (rc) {
//         setRequiresConfirmation(true);
//         setAlertState({
//           variant: 'success',
//           title: 'Cuenta creada',
//           message: 'Cuenta creada. Revisa tu correo para confirmar la cuenta.',
//           show: true,
//         });
//         setLoading(false);
//         return;
//       }

//       // Creación y login exitoso
//       setAlertState({
//         variant: 'success',
//         title: 'Cuenta creada',
//         message: 'Cuenta creada exitosamente. Redirigiendo...',
//         show: true,
//       });

//       // pequeña espera visual y redirección (mantén breve)
//       setTimeout(() => {
//         navigate('/');
//       }, 900);
//     } catch (err) {
//       console.error('Register error', err);
//       setAlertState({ variant: 'danger', title: 'Error', message: 'Ocurrió un error al crear la cuenta', show: true });
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleResend() {
//     setAlertState((s) => ({ ...s, show: false }));
//     if (!email) {
//       setAlertState({
//         variant: 'info',
//         title: 'Info',
//         message: 'Introduce tu email arriba para reenviar la confirmación.',
//         show: true,
//       });
//       return;
//     }
//     try {
//       const { error } = await resendConfirmation(email.trim());
//       if (error) {
//         setAlertState({ variant: 'danger', title: 'Error', message: error.message ?? 'No se pudo reenviar el correo.', show: true });
//       } else {
//         setAlertState({
//           variant: 'success',
//           title: 'Enviado',
//           message: 'Correo de confirmación reenviado. Revisa tu bandeja y spam.',
//           show: true,
//         });
//       }
//     } catch (err) {
//       console.error('Resend error', err);
//       setAlertState({ variant: 'danger', title: 'Error', message: 'Ocurrió un error. Intenta más tarde.', show: true });
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
//       <div className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
//         {/* Left: Brand / Hero - azul oscuro */}
//         <div className="hidden md:flex flex-col justify-center gap-6 p-10 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
//           <div className="flex items-center gap-3">
//             <div className="p-3 rounded-lg bg-white/10">
//               <Building2 className="w-8 h-8 text-white" />
//             </div>
//             <h2 className="text-2xl font-semibold">Directorio Pro</h2>
//           </div>

//           <div>
//             <h3 className="text-3xl font-bold leading-tight">Únete a nuestra comunidad</h3>
//             <p className="mt-2 text-slate-200 max-w-sm">
//               Crea tu cuenta para administrar tu perfil, publicar productos y servicios, y gestionar suscripciones fácilmente.
//             </p>
//           </div>

//           <ul className="mt-4 space-y-3 text-sm text-slate-200">
//             <li>• Panel minimal y rápido</li>
//             <li>• Gestión de productos, servicios y publicaciones</li>
//             <li>• Soporte y facturación</li>
//           </ul>

//           <div className="mt-6 text-sm text-slate-300">
//             <p className="mb-1">¿Necesitas ayuda?</p>
//             <a href="mailto:admin@directorio.com" className="underline text-white/90 hover:text-white">
//               admin@directorio.com
//             </a>
//           </div>
//         </div>

//         {/* Right: Form - blanco */}
//         <div className="bg-white p-8 md:p-12">
//           <div className="max-w-md mx-auto">
//             <div className="flex items-center justify-center md:justify-start mb-6">
//               <div className="bg-blue-900 p-3 rounded-lg mr-3">
//                 <Building2 className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-900">Crear cuenta</h1>
//                 <p className="text-sm text-slate-500 mt-1">Únete al directorio de empresas</p>
//               </div>
//             </div>

//             {/* Alerts (error / success / info) */}
//             <div className="mb-4">
//               <Alert
//                 variant={alertState.variant as any}
//                 title={alertState.title}
//                 message={alertState.message}
//                 show={alertState.show}
//                 dismissible
//                 onClose={() => setAlertState((s) => ({ ...s, show: false }))}
//               />
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Role selector */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-3">Tipo de cuenta</label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setRole('client')}
//                     className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center ${
//                       role === 'client' ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-white'
//                     }`}
//                   >
//                     <User className={`w-8 h-8 mb-2 ${role === 'client' ? 'text-blue-600' : 'text-slate-400'}`} />
//                     <p className={`font-medium text-sm ${role === 'client' ? 'text-blue-600' : 'text-slate-700'}`}>Cliente</p>
//                     <p className="text-xs text-slate-500 mt-1">Gratis</p>
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setRole('company')}
//                     className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center ${
//                       role === 'company' ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-white'
//                     }`}
//                   >
//                     <Users className={`w-8 h-8 mb-2 ${role === 'company' ? 'text-blue-600' : 'text-slate-400'}`} />
//                     <p className={`font-medium text-sm ${role === 'company' ? 'text-blue-600' : 'text-slate-700'}`}>Empresa</p>
//                     <p className="text-xs text-slate-500 mt-1">Subscripción</p>
//                   </button>
//                 </div>
//                 {role === 'company' && (
//                   <p className="text-xs text-slate-600 mt-2">
//                     Las cuentas de empresa requieren aprobación y pago de suscripción mensual.
//                   </p>
//                 )}
//               </div>

//               {/* Full name / company name */}
//               <div>
//                 <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
//                   Nombre completo / Nombre de la empresa (opcional)
//                 </label>
//                 <input
//                   id="fullName"
//                   type="text"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
//                   placeholder={role === 'company' ? 'Nombre de la empresa' : 'Tu nombre (opcional)'}
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//                     <Mail className="w-4 h-4" />
//                   </span>
//                   <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
//                     placeholder="tu@empresa.com"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
//                   Contraseña
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//                     <Lock className="w-4 h-4" />
//                   </span>

//                   <input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
//                     placeholder="••••••••"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((s) => !s)}
//                     aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 p-1 rounded hover:bg-slate-100"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm password */}
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
//                   Confirmar contraseña
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//                     <Lock className="w-4 h-4" />
//                   </span>

//                   <input
//                     id="confirmPassword"
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                     className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
//                     placeholder="••••••••"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword((s) => !s)}
//                     aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 p-1 rounded hover:bg-slate-100"
//                   >
//                     {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading || alertState.variant === 'success' && alertState.show}
//                 className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
//               >
//                 {loading ? 'Creando cuenta...' : 'Crear cuenta'}
//               </button>
//             </form>

//             {requiresConfirmation && (
//               <div className="mt-4 text-center">
//                 <p className="text-sm text-slate-700 mb-2">¿No te llegó el correo de confirmación?</p>
//                 <button onClick={handleResend} className="text-sm text-blue-600 hover:underline">
//                   Reenviar correo de confirmación
//                 </button>
//               </div>
//             )}

//             <div className="mt-6 text-center text-sm text-slate-600">
//               ¿Ya tienes una cuenta?{' '}
//               <Link to="/login" className="text-blue-600 font-medium hover:underline">
//                 Inicia sesión aquí
//               </Link>
//             </div>

//             <div className="mt-6 text-center text-xs text-slate-400">
//               <span>Al registrarte aceptas los términos y condiciones.</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/Register.tsx


// src/pages/Register.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  User,
  Users,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';
import image from '../img/logo.png';

export function Register() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'client' | 'company'>('client');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alertState, setAlertState] = useState<{
    variant: 'info' | 'success' | 'warning' | 'danger';
    title?: React.ReactNode;
    message?: React.ReactNode;
    show: boolean;
  }>({ variant: 'info', show: false });

  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const { signUp, resendConfirmation } = useAuth();
  const navigate = useNavigate();

  // auto-hide alerts
  useEffect(() => {
    if (!alertState.show) return;
    const t = setTimeout(() => setAlertState((s) => ({ ...s, show: false })), 5000);
    return () => clearTimeout(t);
  }, [alertState.show]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAlertState((s) => ({ ...s, show: false }));
    setRequiresConfirmation(false);

    if (password !== confirmPassword) {
      setAlertState({ variant: 'danger', title: 'Error', message: 'Las contraseñas no coinciden', show: true });
      return;
    }

    if (password.length < 6) {
      setAlertState({
        variant: 'danger',
        title: 'Error',
        message: 'La contraseña debe tener al menos 6 caracteres',
        show: true,
      });
      return;
    }

    setLoading(true);
    try {
      const { error, requiresConfirmation: rc } = await signUp(email.trim(), password, role, fullName || undefined);

      if (error) {
        setAlertState({ variant: 'danger', title: 'Error', message: error.message || 'Error al crear la cuenta', show: true });
        setLoading(false);
        return;
      }

      if (rc) {
        setRequiresConfirmation(true);
        setAlertState({
          variant: 'success',
          title: 'Cuenta creada',
          message: 'Cuenta creada. Revisa tu correo para confirmar la cuenta.',
          show: true,
        });
        setLoading(false);
        return;
      }

      // Creación y login exitoso
      setAlertState({
        variant: 'success',
        title: 'Cuenta creada',
        message: 'Cuenta creada exitosamente. Redirigiendo...',
        show: true,
      });

      // pequeña espera visual y redirección (mantén breve)
      setTimeout(() => {
        navigate('/');
      }, 900);
    } catch (err) {
      console.error('Register error', err);
      setAlertState({ variant: 'danger', title: 'Error', message: 'Ocurrió un error al crear la cuenta', show: true });
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setAlertState((s) => ({ ...s, show: false }));
    if (!email) {
      setAlertState({
        variant: 'info',
        title: 'Info',
        message: 'Introduce tu email arriba para reenviar la confirmación.',
        show: true,
      });
      return;
    }
    try {
      const { error } = await resendConfirmation(email.trim());
      if (error) {
        setAlertState({ variant: 'danger', title: 'Error', message: error.message ?? 'No se pudo reenviar el correo.', show: true });
      } else {
        setAlertState({
          variant: 'success',
          title: 'Enviado',
          message: 'Correo de confirmación reenviado. Revisa tu bandeja y spam.',
          show: true,
        });
      }
    } catch (err) {
      console.error('Resend error', err);
      setAlertState({ variant: 'danger', title: 'Error', message: 'Ocurrió un error. Intenta más tarde.', show: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left: Top half white (logo centered) + bottom half gradient */}
        <div className="hidden md:flex flex-col text-white">
          {/* Top half: completamente blanco */}
          <div className="flex-1 bg-white flex items-center justify-center">
            {/* imagen con menos espacio alrededor: sin padding interno y ocupando más ancho */}
            <img
              src={image}
              alt="Logo CubaLink"
              className="block h-24 md:h-36 lg:h-44 w-auto max-w-[80%] rounded-sm object-contain"
              loading="lazy"
              draggable={false}
            />
          </div>

          {/* Bottom half: degradado azul */}
          <div className="flex-1 bg-gradient-to-br from-blue-900 to-slate-900 p-10 flex flex-col justify-center gap-6">
            <div>
              <h3 className="text-3xl font-bold leading-tight">Únete a nuestra comunidad</h3>
              <p className="mt-2 text-slate-200 max-w-sm">
                Crea tu cuenta para administrar tu perfil, publicar productos y servicios, y gestionar suscripciones fácilmente.
              </p>
            </div>

            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>• Panel minimal y rápido</li>
              <li>• Gestión de productos, servicios y publicaciones</li>
              <li>• Soporte y facturación</li>
            </ul>

            <div className="mt-6 text-sm text-slate-300">
              <p className="mb-1">¿Necesitas ayuda?</p>
              <a href="mailto:admin@directorio.com" className="underline text-white/90 hover:text-white">
                admin@directorio.com
              </a>
            </div>
          </div>
        </div>

        {/* Right: Form - blanco */}
        <div className="bg-white p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center md:justify-start mb-6">
              
              <div className='text-center w-full'>
                <h1 className="text-2xl font-bold text-slate-900">Crear cuenta</h1>
                <p className="text-sm text-slate-500 mt-1">Únete al directorio de empresas</p>
              </div>
            </div>

            {/* Alerts (error / success / info) */}
            <div className="mb-4">
              <Alert
                variant={alertState.variant as any}
                title={alertState.title}
                message={alertState.message}
                show={alertState.show}
                dismissible
                onClose={() => setAlertState((s) => ({ ...s, show: false }))}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Tipo de cuenta</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center ${
                      role === 'client' ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-white'
                    }`}
                  >
                    <User className={`w-8 h-8 mb-2 ${role === 'client' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <p className={`font-medium text-sm ${role === 'client' ? 'text-blue-600' : 'text-slate-700'}`}>Cliente</p>
                    <p className="text-xs text-slate-500 mt-1">Gratis</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('company')}
                    className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center ${
                      role === 'company' ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-white'
                    }`}
                  >
                    <Users className={`w-8 h-8 mb-2 ${role === 'company' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <p className={`font-medium text-sm ${role === 'company' ? 'text-blue-600' : 'text-slate-700'}`}>Empresa</p>
                    <p className="text-xs text-slate-500 mt-1">Subscripción</p>
                  </button>
                </div>
                {role === 'company' && (
                  <p className="text-xs text-slate-600 mt-2">
                    Las cuentas de empresa requieren aprobación y pago de suscripción mensual.
                  </p>
                )}
              </div>

              {/* Full name / company name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre completo / Nombre de la empresa (opcional)
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder={role === 'company' ? 'Nombre de la empresa' : 'Tu nombre (opcional)'}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    placeholder="tu@empresa.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Contraseña
                </label>
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
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 p-1 rounded hover:bg-slate-100"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (alertState.variant === 'success' && alertState.show)}
                className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            {requiresConfirmation && (
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-700 mb-2">¿No te llegó el correo de confirmación?</p>
                <button onClick={handleResend} className="text-sm text-blue-600 hover:underline">
                  Reenviar correo de confirmación
                </button>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-slate-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Inicia sesión aquí
              </Link>
            </div>

            <div className="mt-6 text-center text-xs text-slate-400">
              <span>Al registrarte aceptas los términos y condiciones.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
