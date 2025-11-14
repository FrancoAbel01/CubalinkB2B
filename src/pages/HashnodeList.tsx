// src/components/blog/HashnodeList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type PostNode = {
  title: string;
  brief?: string | null;
  slug: string;
  coverImage?: string | null;
  url?: string | null;
};

interface Props {
  host?: string;
  first?: number;
}

const GQL = "https://gql.hashnode.com/";

const LIST_QUERY = `
query GetPosts($host: String!, $first: Int!) {
  publication(host: $host) {
    posts(first: $first) {
      edges {
        node {
          title
          brief
          slug
          url
          coverImage {
            url
          }
        }
      }
    }
  }
}
`;

const DEFAULT_HOST = "los-beneficios-de-informatizar-todo.hashnode.dev";

const HashnodeList: React.FC<Props> = ({ host = DEFAULT_HOST, first = 12 }) => {
  const [posts, setPosts] = useState<PostNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(GQL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ query: LIST_QUERY, variables: { host, first } }),
        });

        const text = await res.text();
        let json: any;
        try { json = JSON.parse(text); } catch { throw new Error(`Respuesta no-JSON: ${text}`); }

        if (!res.ok) {
          const msg = json?.errors ? JSON.stringify(json.errors) : text;
          throw new Error(`HTTP ${res.status} — ${msg}`);
        }
        if (json.errors && json.errors.length) {
          throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
        }

        const edges: any[] = json?.data?.publication?.posts?.edges ?? [];
        const nodes: PostNode[] = edges
          .map(e => {
            const n = e.node ?? {};
            return {
              title: n.title,
              brief: n.brief ?? null,
              slug: n.slug,
              url: n.url ?? null,
              coverImage: n.coverImage?.url ?? null,
            } as PostNode;
          })
          .filter(Boolean);

        if (mounted) setPosts(nodes);
      } catch (err) {
        if (mounted) setError((err as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPosts();
    return () => { mounted = false; };
  }, [host, first]);

  /* --- UI --- */
  if (loading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Últimos artículos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: Math.min(first, 9) }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gray-200 h-44 w-full" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="mt-4 h-9 bg-gray-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
          <p className="text-red-700 font-semibold">Error al cargar publicaciones</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Últimos artículos</h2>
        <div className="text-center text-gray-600">No hay publicaciones para mostrar.</div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Últimos artículos</h2>
        <p className="text-sm text-gray-500 hidden sm:block">Lecturas seleccionadas de la publicación</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article
            key={p.slug}
            className="group bg-white rounded-2xl shadow-md overflow-hidden flex flex-col border border-transparent hover:shadow-lg transition-shadow duration-200"
            aria-labelledby={`title-${p.slug}`}
          >
            <div className="relative">
              {p.coverImage ? (
                <img src={p.coverImage} alt={p.title} className="w-full h-44 object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-44 bg-gradient-to-r from-gray-100 via-white to-gray-100 flex items-center justify-center">
                  <span className="text-sm text-gray-400">Sin imagen</span>
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 id={`title-${p.slug}`} className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {p.title}
              </h3>

              <p className="text-sm text-gray-600 flex-1 overflow-hidden max-h-[4.5rem]">
                {p.brief ?? ""}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <Link
                  to={`/blog/${encodeURIComponent(p.slug)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  aria-label={`Leer ${p.title}`}
                >
                  Leer
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                <a
                  href={p.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Ver en Hashnode ↗
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HashnodeList;
