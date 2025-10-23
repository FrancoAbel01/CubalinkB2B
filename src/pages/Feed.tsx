import { useEffect, useState } from 'react';
import { MessageSquare, Building2, Clock } from 'lucide-react';
import { supabase, Post, Company } from '../lib/supabase';

interface PostWithCompany extends Post {
  company: Company;
}

export function Feed() {
  const [posts, setPosts] = useState<PostWithCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          *,
          company:companies(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPosts = (postsData || []).map((post: any) => ({
        ...post,
        company: post.company,
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Hace menos de 1 hora';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm rounded-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
           
            <div className='w-full text-center'>
              <h1 className="text-3xl font-bold text-black">Feed de Publicaciones</h1>
              <p className="text-black mt-1">
                Últimas novedades de las empresas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">
              Aún no hay publicaciones. Sé el primero en compartir algo.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0">
                      {post.company.logo_url ? (
                        <img
                          src={post.company.logo_url}
                          alt={post.company.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-slate-800">{post.company.name}</h3>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-800 mb-3">{post.title}</h2>
                  <p className="text-slate-600 mb-4 whitespace-pre-wrap">{post.content}</p>

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full rounded-lg object-cover max-h-96"
                    />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
