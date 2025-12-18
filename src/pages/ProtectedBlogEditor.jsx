import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Helmet } from "react-helmet";
import { ArrowLeft, Save, Bold, Italic, Underline, List, ListOrdered, Link, Image, Code, LogOut } from "lucide-react";

const ProtectedBlogEditor = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [article, setArticle] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Alessandro Amoroso",
    tags: "",
    readingTime: 5,
    imageUrl: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [supabaseError, setSupabaseError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    
    // Check if Supabase is properly configured
    if (!supabase) {
      setSupabaseError("Supabase non è configurato. Controlla le variabili d'ambiente.");
    }
  }, [user, navigate]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setArticle({
      ...article,
      title,
      slug: generateSlug(title)
    });
  };

  const handleContentChange = (e) => {
    setArticle({
      ...article,
      content: e.target.value
    });
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!supabase) {
      setError("Impossibile salvare l'articolo: Supabase non è configurato.");
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const articleData = {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        image_url: article.imageUrl,
        author: article.author,
        reading_time: parseInt(article.readingTime),
        tags: article.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        published_date: new Date().toISOString()
      };

      const { error: insertError } = await supabase
        .from('blog_articles')
        .insert([articleData]);

      if (insertError) throw insertError;

      alert("Articolo salvato con successo!");
      // Reset form after saving
      setArticle({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "Alessandro Amoroso",
        tags: "",
        readingTime: 5,
        imageUrl: ""
      });
    } catch (err) {
      console.error("Error saving article:", err);
      setError("Errore durante il salvataggio dell'articolo: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Reindirizzamento al login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Editor Blog | Studio Tributario Alessandro Amoroso</title>
        <meta name="description" content="Crea e modifica articoli del blog" />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Torna al Blog
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Benvenuto, {user.email || user.user_metadata?.name || 'Utente'}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Esci
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Editor Articoli</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {supabaseError && (
              <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                {supabaseError}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titolo *
                </label>
                <input
                  type="text"
                  value={article.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Inserisci il titolo dell'articolo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => setArticle({...article, slug: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  placeholder="slug-automatico"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estratto *
              </label>
              <textarea
                value={article.excerpt}
                onChange={(e) => setArticle({...article, excerpt: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Breve descrizione dell'articolo"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Immagine
              </label>
              <input
                type="text"
                value={article.imageUrl}
                onChange={(e) => setArticle({...article, imageUrl: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://esempio.com/immagine.jpg"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (separati da virgola)
              </label>
              <input
                type="text"
                value={article.tags}
                onChange={(e) => setArticle({...article, tags: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="fisco, dichiarazione, tasse"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autore
                </label>
                <input
                  type="text"
                  value={article.author}
                  onChange={(e) => setArticle({...article, author: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo di lettura (minuti)
                </label>
                <input
                  type="number"
                  value={article.readingTime}
                  onChange={(e) => setArticle({...article, readingTime: parseInt(e.target.value) || 0})}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contenuto *
                </label>
                <span className="text-xs text-gray-500">Usa i pulsanti per formattare</span>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
                <button
                  type="button"
                  onClick={() => formatText('bold')}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                  title="Grassetto"
                  disabled={!document.queryCommandSupported('bold')}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatText('italic')}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                  title="Corsivo"
                  disabled={!document.queryCommandSupported('italic')}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatText('underline')}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                  title="Sottolineato"
                  disabled={!document.queryCommandSupported('underline')}
                >
                  <Underline className="w-4 h-4" />
                </button>
                <div className="w-px bg-gray-300 h-6 my-auto"></div>
                <button
                  type="button"
                  onClick={() => formatText('insertUnorderedList')}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                  title="Elenco puntato"
                  disabled={!document.queryCommandSupported('insertUnorderedList')}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatText('insertOrderedList')}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                  title="Elenco numerato"
                  disabled={!document.queryCommandSupported('insertOrderedList')}
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px bg-gray-300 h-6 my-auto"></div>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Inserisci l'URL del link:");
                    if (url) formatText('createLink', url);
                  }}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                  title="Link"
                  disabled={!document.queryCommandSupported('createLink')}
                >
                  <Link className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatText('insertImage', prompt("Inserisci l'URL dell'immagine:"))}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                  title="Immagine"
                  disabled={!document.queryCommandSupported('insertImage')}
                >
                  <Image className="w-4 h-4" />
                </button>
                <div className="w-px bg-gray-300 h-6 my-auto"></div>
                <button
                  type="button"
                  onClick={() => formatText('formatBlock', '<p>')}
                  className="p-2 rounded hover:bg-gray-200 transition-colors text-xs"
                  title="Paragrafo"
                  disabled={!document.queryCommandSupported('formatBlock')}
                >
                  P
                </button>
                <button
                  type="button"
                  onClick={() => formatText('formatBlock', '<h2>')}
                  className="p-2 rounded hover:bg-gray-200 transition-colors text-xs"
                  title="Titolo"
                  disabled={!document.queryCommandSupported('formatBlock')}
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => formatText('formatBlock', '<h3>')}
                  className="p-2 rounded hover:bg-gray-200 transition-colors text-xs"
                  title="Sottotitolo"
                  disabled={!document.queryCommandSupported('formatBlock')}
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => formatText('formatBlock', '<blockquote>')}
                  className="p-2 rounded hover:bg-gray-200 transition-colors text-xs"
                  title="Citazione"
                  disabled={!document.queryCommandSupported('formatBlock')}
                >
                  "
                </button>
                <button
                  type="button"
                  onClick={() => formatText('formatBlock', '<pre>')}
                  className="p-2 rounded hover:bg-gray-200 transition-colors"
                  title="Codice"
                  disabled={!document.queryCommandSupported('formatBlock')}
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>

              {/* Content Editor */}
              <textarea
                value={article.content}
                onChange={handleContentChange}
                rows={15}
                className="w-full px-4 py-2 border border-t-0 border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Scrivi il contenuto dell'articolo qui. Usa i pulsanti sopra per formattare il testo."
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/blog")}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={isSaving || !supabase}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSaving ? "Salvataggio..." : "Salva Articolo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProtectedBlogEditor;