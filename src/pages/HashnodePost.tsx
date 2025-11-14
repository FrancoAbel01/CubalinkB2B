// src/components/blog/HashnodePost.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Author = {
  name?: string | null;
  username?: string | null;
  profilePicture?: string | null;
};

type PostData = {
  title: string;
  htmlContent: string;
  coverImage?: string | null;
  author?: Author | null;
  url?: string | null;
};

const GQL = "https://gql.hashnode.com/";

const POST_QUERY = `
query GetPostBySlug($host: String!, $slug: String!) {
  publication(host: $host) {
    post(slug: $slug) {
      title
      content {
        html
      }
      coverImage {
        url
      }
      author {
        name
        username
        profilePicture
      }
      url
    }
  }
}
`;

const DEFAULT_HOST = "los-beneficios-de-informatizar-todo.hashnode.dev";

const IconExternal = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17 7h4v4M21 3l-9 9" />
    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 11v8a2 2 0 002 2h8" />
  </svg>
);

const IconShare = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 12v.01M12 12v.01M20 12v.01M4 12a8 8 0 0116 0" />
  </svg>
);

const HashnodePost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState<boolean>(!!slug);
  const [error, setError] = useState<string | null>(null);
  const host = DEFAULT_HOST;

  useEffect(() => {
    if (!slug) return;
    let mounted = true;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(GQL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ query: POST_QUERY, variables: { host, slug: decodeURIComponent(slug) } }),
        });

        const text = await res.text();
        let json: any;
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error(`Respuesta no válida: ${text}`);
        }

        if (!res.ok) {
          const msg = json?.errors ? JSON.stringify(json.errors) : text;
          throw new Error(`HTTP ${res.status} — ${msg}`);
        }
        if (json.errors?.length) {
          throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
        }

        const data = json?.data?.publication?.post;
        if (!data) throw new Error("Post no encontrado.");

        if (mounted) {
          setPost({
            title: data.title,
            htmlContent: data.content?.html ?? "",
            coverImage: data.coverImage?.url ?? null,
            author: data.author ?? null,
            url: data.url ?? null,
          });
        }
      } catch (err) {
        if (mounted) setError((err as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPost();
    return () => {
      mounted = false;
    };
  }, [slug, host]);

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post?.title, url: shareUrl }).catch(() => {});
    } else {
      // fallback: copy to clipboard
      navigator.clipboard?.writeText(shareUrl);
      alert("URL copiada al portapapeles");
    }
  };

  if (!slug) return <div className="container mx-auto px-4 py-12">Post no especificado.</div>;
  if (loading) return <div className="container mx-auto px-4 py-12 text-center">Cargando post…</div>;
  if (error) return <div className="container mx-auto px-4 py-12"><div className="rounded-md bg-red-50 border border-red-100 p-4 text-red-700">{error}</div></div>;
  if (!post) return <div className="container mx-auto px-4 py-12">No se encontró el post.</div>;

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <header className="px-6 py-6 sm:px-8 sm:py-8 border-b">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition"
            >
              <span className="inline-block rotate-180 transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </span>
              Volver
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition"
                aria-label="Compartir"
              >
                <IconShare />
                Compartir
              </button>

              {post.url && (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm hover:opacity-95 transition"
                >
                  Abrir en Hashnode <IconExternal className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Cover */}
        {post.coverImage && (
          <div className="w-full">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* Author box */}
          {post.author && (
            <div className="flex items-center gap-4 mb-6">
              {post.author.profilePicture ? (
                <img
                  src={post.author.profilePicture}
                  alt={post.author.name ?? post.author.username ?? "Autor"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0" /></svg>
                </div>
              )}

              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {post.author.name ?? post.author.username ?? "Autor desconocido"}
                </div>
                {post.author.username && (
                  <div className="text-xs text-gray-500">@{post.author.username}</div>
                )}
              </div>
            </div>
          )}

          {/* Article HTML (prose) */}
          <article className="prose max-w-none prose-a:no-underline prose-a:text-sky-600 hover:prose-a:text-sky-700">
            <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
          </article>
        </div>
      </div>
    </main>
  );
};

export default HashnodePost;
