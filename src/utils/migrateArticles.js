import { supabase } from '../lib/supabase';
import { articoliEvidenza } from '../components/Data';

export const migrateArticlesToSupabase = async () => {
  try {
    const articlesToMigrate = articoliEvidenza.map(article => ({
      title: article.titolo,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.contenuto,
      image_url: article.immagine,
      author: article.autore,
      published_date: parseItalianDate(article.data),
      reading_time: article.tempoLettura,
      tags: article.tags
    }));

    const { data, error } = await supabase
      .from('blog_articles')
      .upsert(articlesToMigrate, {
        onConflict: 'slug',
        ignoreDuplicates: false
      });

    if (error) throw error;
    
    console.log('Articles migrated successfully:', data);
    return { success: true, count: articlesToMigrate.length };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error: error.message };
  }
};

function parseItalianDate(dateStr) {
  const months = {
    'gennaio': '01',
    'febbraio': '02',
    'marzo': '03',
    'aprile': '04',
    'maggio': '05',
    'giugno': '06',
    'luglio': '07',
    'agosto': '08',
    'settembre': '09',
    'ottobre': '10',
    'novembre': '11',
    'dicembre': '12'
  };

  // Handle DD/MM/YYYY format
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Handle "DD mese YYYY" format
  const parts = dateStr.toLowerCase().split(' ');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  return new Date().toISOString().split('T')[0];
}