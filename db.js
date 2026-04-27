// ============================================
// Supabase Database & Storage Helpers
// ============================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY, EDIT_QUERY_PARAM } from './config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== Edit mode =====
export function isEditMode() {
  return new URLSearchParams(window.location.search).has(EDIT_QUERY_PARAM);
}

export function toggleEditMode() {
  const url = new URL(window.location.href);
  if (isEditMode()) {
    url.searchParams.delete(EDIT_QUERY_PARAM);
  } else {
    url.searchParams.set(EDIT_QUERY_PARAM, '');
  }
  window.location.href = url.toString();
}

// ===== Toast =====
export function toast(message, type = '') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = message;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 2400);
}

// ===== Trips =====
export async function listTrips() {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getTrip(id) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createTrip(trip) {
  const { data, error } = await supabase
    .from('trips')
    .insert(trip)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrip(id, updates) {
  const { data, error } = await supabase
    .from('trips')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrip(id) {
  // Delete associated photos first
  const photos = await listPhotos(id);
  for (const p of photos) {
    if (p.path) await deletePhotoFromStorage(p.path);
  }
  const { error } = await supabase.from('trips').delete().eq('id', id);
  if (error) throw error;
}

// ===== Sections (Day blocks, Reference sections) =====
export async function listSections(tripId) {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('trip_id', tripId)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createSection(section) {
  const { data, error } = await supabase
    .from('sections')
    .insert(section)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSection(id, updates) {
  const { data, error } = await supabase
    .from('sections')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSection(id) {
  // Delete blocks under this section
  await supabase.from('blocks').delete().eq('section_id', id);
  const { error } = await supabase.from('sections').delete().eq('id', id);
  if (error) throw error;
}

// ===== Blocks (timeline items inside a section) =====
export async function listBlocks(sectionId) {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('section_id', sectionId)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function listBlocksForTrip(tripId) {
  const { data, error } = await supabase
    .from('blocks')
    .select('*, sections!inner(trip_id)')
    .eq('sections.trip_id', tripId)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createBlock(block) {
  const { data, error } = await supabase
    .from('blocks')
    .insert(block)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBlock(id, updates) {
  const { data, error } = await supabase
    .from('blocks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBlock(id) {
  const { error } = await supabase.from('blocks').delete().eq('id', id);
  if (error) throw error;
}

// ===== Photos =====
const BUCKET = 'trip-photos';

export async function listPhotos(tripId) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function uploadPhoto(tripId, file, caption = '') {
  // Generate a unique path: tripId/timestamp-filename
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${tripId}/${fileName}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
  if (uploadError) throw uploadError;

  // Get public URL
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  // Insert into photos table
  const { data, error } = await supabase
    .from('photos')
    .insert({
      trip_id: tripId,
      path,
      url: urlData.publicUrl,
      caption,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePhoto(photoId, path) {
  if (path) {
    await deletePhotoFromStorage(path);
  }
  const { error } = await supabase.from('photos').delete().eq('id', photoId);
  if (error) throw error;
}

async function deletePhotoFromStorage(path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.warn('Storage delete failed:', error);
}

export async function setTripCover(tripId, photoUrl) {
  return updateTrip(tripId, { cover_url: photoUrl });
}
