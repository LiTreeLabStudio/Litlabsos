// Homebase-3.0: Supabase Storage Upload Example
// Place in frontend/src/lib/supabaseStorage.ts

import { supabase } from './supabaseClient';

export async function uploadArtifact(file: File, path: string) {
  const { data, error } = await supabase.storage.from('artifacts').upload(path, file);
  if (error) throw error;
  return data;
}

export async function getArtifactUrl(path: string) {
  const { data } = supabase.storage.from('artifacts').getPublicUrl(path);
  return data.publicUrl;
}
