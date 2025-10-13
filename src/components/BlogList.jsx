import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Calendar, User, Clock, Search, Filter, Tag, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

const BlogList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const allTags = [...new Set(articles.flatMap(article => article.tags || []))];

  const filteredArticles = articles
    .filter(article => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTag = !selectedTag || (article.tags && article.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.published_date) - new Date(a.published_date);
      } else if (sortBy === "oldest") {
        return new Date(a.published_date) - new Date(b.published_date);
      } else if (sortBy === "readTime") {
        return a.reading_time - b.reading_time;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Caricamento articoli...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Helmet>
        <title>Articoli Fiscali | Consigli e Guide Fiscali</title>
        <meta
          name="description"
          content="Scopri i nostri articoli fiscali per approfondimenti, consigli e guide su tasse, contabilità e gestione finanziaria."
        />
        <meta
          name="keywords"
          content="articoli fiscali, guide fiscali, tasse, contabilità, gestione finanziaria"
        />
        <meta name="author" content="Alessandro Amoroso" />
        <link rel="canonical" href="https://studiofiscaleamoroso.com/blog" />
      </Helmet>

      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Il Nostro Blog
              <span className="block text-blue-200 text-3xl md:text-4xl font-normal mt-2">
                Fiscale
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Approfondimenti, guide pratiche e aggiornamenti normativi
              per navigare nel mondo della fiscalità con sicurezza
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-blue-800/50 px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                Aggiornamenti settimanali
              </div>
              <div className="flex items-center bg-blue-800/50 px-4 py-2 rounded-full">
                <User className="w-4 h-4 mr-2" />
                Esperti qualificati
              </div>
              <div className="flex items-center bg-blue-800/50 px-4 py-2 rounded-full">
                <Tag className="w-4 h-4 mr-2" />
                Guide pratiche
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cerca negli articoli..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[150px]"
              >
                <option value="">Tutti i tag</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Ordina per:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="newest">Più recenti</option>
                <option value="oldest">Meno recenti</option>
                <option value="readTime">Tempo di lettura</option>
              </select>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <span>
                <strong className="text-blue-600">{filteredArticles.length}</strong> articoli trovati
              </span>
              <span>
                <strong className="text-blue-600">{allTags.length}</strong> categorie disponibili
              </span>
              <span>
                Ultimo aggiornamento: <strong className="text-blue-600">
                  {new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
              >
                {post.image_url && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.reading_time} min
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.published_date).toLocaleDateString('it-IT')}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt.length > 120
                      ? `${post.excerpt.substring(0, 120)}...`
                      : post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-gray-400 text-xs">
                          +{post.tags.length - 2} altri
                        </span>
                      )}
                    </div>
                  )}

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:gap-2 transition-all duration-200"
                  >
                    Leggi l'articolo
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nessun articolo trovato
              </h3>
              <p className="text-gray-500 mb-4">
                Prova a modificare i filtri di ricerca o esplora tutti gli articoli.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTag("");
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Mostra tutti gli articoli
              </button>
            </div>
          </div>
        )}

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Rimani aggiornato sulle novità fiscali
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Ricevi i nostri articoli più recenti e gli aggiornamenti normativi
            direttamente nella tua casella di posta elettronica.
          </p>
          <Link
            to="/contatti"
            className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
          >
            Contattaci per maggiori informazioni
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
