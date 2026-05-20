import { supabase } from '../../../lib/supabase';

export async function searchPropertiesWithAi(message) {
  const cleanMessage = String(message || '').trim();

  if (!cleanMessage) {
    throw new Error('الرسالة مطلوبة');
  }

  const { data, error } = await supabase.functions.invoke('aqari-ai-agent', {
    body: {
      message: cleanMessage,
    },
  });

  if (error) {
    throw new Error(error.message || 'AI request failed');
  }

  if (data?.error || data?.message === 'error') {
    throw new Error(data?.error || data?.details || 'AI request failed');
  }

  return data || { reply: '', results: [] };
}
