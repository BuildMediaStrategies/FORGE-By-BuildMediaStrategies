import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Drawing {
  id: string;
  user_id: string;
  job_id: string | null;
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

export async function uploadDrawing(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<{ data: Drawing | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from('drawings')
      .getPublicUrl(filePath);

    const { data: dbData, error: dbError } = await supabase
      .from('drawings')
      .insert({
        user_id: userId,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
      })
      .select()
      .maybeSingle();

    if (dbError) {
      await supabase.storage.from('drawings').remove([filePath]);
      throw dbError;
    }

    if (onProgress) {
      onProgress(100);
    }

    return { data: dbData, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function getDrawings(
  userId: string
): Promise<{ data: Drawing[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('drawings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteDrawing(
  drawingId: string,
  userId: string
): Promise<{ error: Error | null }> {
  try {
    const { data: drawing, error: fetchError } = await supabase
      .from('drawings')
      .select('file_url')
      .eq('id', drawingId)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!drawing) throw new Error('Drawing not found');

    const urlParts = drawing.file_url.split('/');
    const filePath = `${userId}/${urlParts[urlParts.length - 1]}`;

    await supabase.storage.from('drawings').remove([filePath]);

    const { error: deleteError } = await supabase
      .from('drawings')
      .delete()
      .eq('id', drawingId)
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}
