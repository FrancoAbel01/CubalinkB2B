// src/components/Dashboard.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Post, Product, Service } from '../lib/supabase';
import { CompanyForm } from '../components/CompanyForm';

import { PostsManager } from '../components/PostsManager';
import { ProductsManager } from '../components/ProductsManager';
import { ServicesManager } from '../components/ServicesManager';
import { SubscriptionAlert } from '../components/SubscriptionAlert';
import CompanyProfile from '../components/CompanyProfile';

export function Dashboard() {
  const { user, userProfile, company, refreshCompany, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchPosts = useCallback(async () => {
    if (!company) {
      if (isMounted.current) setPosts([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (isMounted.current) setPosts((data as Post[]) || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      if (isMounted.current) setPosts([]);
    }
  }, [company?.id]);

  const fetchProducts = useCallback(async () => {
    if (!company) {
      if (isMounted.current) setProducts([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (isMounted.current) setProducts((data as Product[]) || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      if (isMounted.current) setProducts([]);
    }
  }, [company?.id]);

  const fetchServices = useCallback(async () => {
    if (!company) {
      if (isMounted.current) setServices([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (isMounted.current) setServices((data as Service[]) || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      if (isMounted.current) setServices([]);
    }
  }, [company?.id]);

  // Inicialización: esperar a que auth termine de resolverse
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      if (isMounted.current) setLoading(false);
      navigate('/');
      return;
    }

    const role = (userProfile?.role ?? '').toString().toLowerCase();
    if (role !== 'company' && role !== 'empresa') {
      if (isMounted.current) setLoading(false);
      navigate('/');
      return;
    }

    // inicialización de datos o mostrar formulario si no hay company
    (async () => {
      try {
        if (company) {
          if (isMounted.current) setShowCompanyForm(false);
          await Promise.all([fetchPosts(), fetchProducts(), fetchServices()]);
        } else {
          if (isMounted.current) {
            setShowCompanyForm(true);
            setPosts([]);
            setProducts([]);
            setServices([]);
          }
        }
      } catch (err) {
        console.error('Error inicializando Dashboard:', err);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    })();
  }, [authLoading, user, userProfile, company, navigate, fetchPosts, fetchProducts, fetchServices]);

  // Cuando company cambia, recargar posts/productos/servicios
  useEffect(() => {
    if (!company) return;
    fetchPosts();
    fetchProducts();
    fetchServices();
  }, [company?.id, fetchPosts, fetchProducts, fetchServices]);

  const refreshData = () => {
    fetchPosts();
    fetchProducts();
    fetchServices();
  };

  // Spinner mientras resolvemos auth o cargamos el componente
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si company no existe, mostramos el formulario de creación
  if (showCompanyForm) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-start justify-center py-12">
        <div className="w-full max-w-3xl px-4">
          <CompanyForm
            onCompanyCreated={() => {
              setShowCompanyForm(false);
              refreshCompany();
            }}
          />
        </div>
      </div>
    );
  }

  const canManage = company?.subscription_status === 'active';

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Alert + Profile + Managers */}
        <div className="space-y-6">
          <SubscriptionAlert company={company} />

          <CompanyProfile company={company} onCompanyUpdated={refreshCompany} />

          <section className="space-y-6">
            <PostsManager posts={posts} company={company} canManage={canManage} onPostsUpdated={fetchPosts} />

            <ProductsManager products={products} company={company} canManage={canManage} onProductsUpdated={fetchProducts} />

            <ServicesManager services={services} company={company} canManage={canManage} onServicesUpdated={fetchServices} />
          </section>
        </div>
      </div>
    </main>
  );
}
