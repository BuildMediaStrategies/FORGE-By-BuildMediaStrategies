import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase] Initializing client...');
console.log('[Supabase] URL:', supabaseUrl);
console.log('[Supabase] Anon key present:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('[Supabase] Client created successfully');

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
    console.log('[Upload] Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('[Upload] User ID:', userId);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    console.log('[Upload] File path:', filePath);
    console.log('[Upload] Uploading to Supabase Storage...');

    if (onProgress) {
      onProgress(10);
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[Upload] Storage upload error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    console.log('[Upload] Storage upload successful:', uploadData);

    if (onProgress) {
      onProgress(50);
    }

    const { data: urlData } = supabase.storage
      .from('drawings')
      .getPublicUrl(filePath);

    console.log('[Upload] Public URL:', urlData.publicUrl);

    if (onProgress) {
      onProgress(70);
    }

    console.log('[Upload] Inserting record into database...');

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
      console.error('[Upload] Database insert error:', dbError);
      await supabase.storage.from('drawings').remove([filePath]);
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    console.log('[Upload] Database insert successful:', dbData);

    if (onProgress) {
      onProgress(100);
    }

    console.log('[Upload] Upload completed successfully!');
    return { data: dbData, error: null };
  } catch (error) {
    console.error('[Upload] Upload failed with error:', error);
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
