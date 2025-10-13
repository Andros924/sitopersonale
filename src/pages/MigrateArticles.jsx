import { useState } from 'react';
import { migrateArticlesToSupabase } from '../utils/migrateArticles';

export default function MigrateArticles() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMigration = async () => {
    setLoading(true);
    setStatus('Migrazione in corso...');

    try {
      const result = await migrateArticlesToSupabase();
      if (result.success) {
        setStatus(`Migrazione completata! ${result.count} articoli migrati con successo.`);
      } else {
        setStatus(`Errore durante la migrazione: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Migrazione Articoli
        </h1>
        <p className="text-gray-600 mb-6">
          Clicca il pulsante per migrare tutti gli articoli esistenti da Data.jsx a Supabase.
        </p>

        <button
          onClick={handleMigration}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed mb-4"
        >
          {loading ? 'Migrazione in corso...' : 'Avvia Migrazione'}
        </button>

        {status && (
          <div className={`p-4 rounded-lg ${status.includes('Errore') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
