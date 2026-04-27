// ============================================
// Supabase 設定
// ============================================
// 請到 https://supabase.com 建立專案後，把下面兩個值替換成你自己的：
//   1. SUPABASE_URL：Project Settings → API → Project URL
//   2. SUPABASE_ANON_KEY：Project Settings → API → anon / public key
//
// 注意：anon key 是公開的可以放前端（這是 Supabase 的設計），
// 但「service_role key」絕對不能放！只放 anon key。

export const SUPABASE_URL = 'https://njsfybrfoarwnwyhttdh.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qc2Z5YnJmb2Fyd253eWh0dGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTI1NTYsImV4cCI6MjA5MjgyODU1Nn0.VdLQ6ZrPDL2bMu1GVyKC5ELn6f21WZGCvYy3eWDIt4E';

// ============================================
// Edit 模式設定
// ============================================
// 在網址後加 ?edit 就會進入編輯模式（任何人知道這個機制都能編輯）
// 例如：https://你的網址/trip.html?id=xxx&edit

export const EDIT_QUERY_PARAM = 'edit';
