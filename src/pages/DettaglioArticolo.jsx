import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarIcon, UserIcon, ClockIcon, ArrowLeft, Tag } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Helmet } from "react-helmet";

const DettaglioArticolo = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Caricamento articolo...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center py-10 bg-white rounded-lg shadow-lg p-12 max-w-md">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            Articolo non trovato
          </h1>
          <p className="text-gray-500 mb-6">
            L'articolo richiesto non esiste o è stato rimosso.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <Helmet>
        <title>{article.title} | Blog</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image_url} />
        <meta
          property="og:url"
          content={`https://studiofiscaleamoroso.com/blog/${article.slug}`}
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={article.image_url} />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna al blog
        </Link>

        {article.image_url && (
          <div className="w-full mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <article className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags && article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                <span>{new Date(article.published_date).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
                <span>{article.reading_time} min di lettura</span>
              </div>
            </div>

            <div className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
              {article.excerpt}
            </div>

            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Hai bisogno di una consulenza personalizzata?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Il nostro team di esperti è pronto ad assisterti con soluzioni su misura per le tue esigenze fiscali.
          </p>
          <Link
            to="/contatti"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
          >
            Contattaci ora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DettaglioArticolo;
