import React from "react";
import PricingPlans from "../components/PricingPlans"; // Asegúrate de que el path sea correcto

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Encabezado */}
      <section className="text-center pt-20 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Elige el plan perfecto para ti
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Planes diseñados para adaptarse a tus necesidades. Mejora tu experiencia
          y obtén acceso a herramientas exclusivas.
        </p>
      </section>

      {/* Componente de planes */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <PricingPlans />
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default PricingPage;
