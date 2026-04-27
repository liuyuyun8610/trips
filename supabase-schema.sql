-- ============================================
-- Family Trips · Supabase Schema
-- ============================================
-- 把整個檔案貼到 Supabase 的 SQL Editor 執行（一次貼完）
-- Project Dashboard → SQL Editor → New query → 貼上 → Run

-- ===== 啟用 UUID 擴充 =====
create extension if not exists "uuid-ossp";

-- ===== Trips 表（每趟旅行）=====
create table if not exists trips (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  start_date date not null,
  end_date date not null,
  location text not null,
  family text[] default '{}',
  description text,
  cover_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ===== Sections 表（每個段落，例如 Day 1、Day 2 或附錄）=====
create table if not exists sections (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid not null references trips(id) on delete cascade,
  number text,           -- 例：Day 01 · 5.15 Friday
  title text not null,   -- 例：抵達日
  subtitle text,         -- 英文 slogan
  meta text[] default '{}', -- 標籤 ["輕鬆路線", "步行可達"]
  order_index int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_sections_trip on sections(trip_id, order_index);

-- ===== Blocks 表（時間軸項目）=====
create table if not exists blocks (
  id uuid primary key default uuid_generate_v4(),
  section_id uuid not null references sections(id) on delete cascade,
  time text,             -- 例：09:00、14:00—17:00
  title text not null,   -- 例：景福宮
  body text,             -- 描述內容
  tags text[] default '{}', -- 標籤
  tip text,              -- 小提示
  order_index int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_blocks_section on blocks(section_id, order_index);

-- ===== Photos 表（照片）=====
create table if not exists photos (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid not null references trips(id) on delete cascade,
  path text not null,    -- Storage 內的路徑
  url text not null,     -- 公開 URL
  caption text,
  created_at timestamptz default now()
);

create index if not exists idx_photos_trip on photos(trip_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
-- 這個網站沒有登入機制，所以 RLS 設成「所有人都能讀寫」
-- 安全保護靠：(1) URL 帶 ?edit 才能寫 (前端控制) (2) 不公開網址
-- 注意：anon key 任何人拿到都能寫資料庫，所以這是 "security through obscurity"

alter table trips enable row level security;
alter table sections enable row level security;
alter table blocks enable row level security;
alter table photos enable row level security;

-- 公開讀
drop policy if exists "public read trips" on trips;
create policy "public read trips" on trips for select using (true);

drop policy if exists "public read sections" on sections;
create policy "public read sections" on sections for select using (true);

drop policy if exists "public read blocks" on blocks;
create policy "public read blocks" on blocks for select using (true);

drop policy if exists "public read photos" on photos;
create policy "public read photos" on photos for select using (true);

-- 公開寫（任何人都能寫，前端用 ?edit 控制 UI）
drop policy if exists "public write trips" on trips;
create policy "public write trips" on trips for all using (true) with check (true);

drop policy if exists "public write sections" on sections;
create policy "public write sections" on sections for all using (true) with check (true);

drop policy if exists "public write blocks" on blocks;
create policy "public write blocks" on blocks for all using (true) with check (true);

drop policy if exists "public write photos" on photos;
create policy "public write photos" on photos for all using (true) with check (true);

-- ============================================
-- Storage Bucket
-- ============================================
-- 注意：bucket 要透過 Storage UI 手動建立！
-- 步驟：
--   1. 左側選單 → Storage
--   2. New bucket → 命名 trip-photos
--   3. 勾選 "Public bucket"（這樣照片才能直接顯示）
--   4. Save
--
-- 然後執行下面的 SQL 設定 storage policies：

-- 允許任何人上傳到 trip-photos
drop policy if exists "public upload to trip-photos" on storage.objects;
create policy "public upload to trip-photos" on storage.objects
  for insert with check (bucket_id = 'trip-photos');

-- 允許任何人讀取 trip-photos
drop policy if exists "public read trip-photos" on storage.objects;
create policy "public read trip-photos" on storage.objects
  for select using (bucket_id = 'trip-photos');

-- 允許任何人刪除 trip-photos
drop policy if exists "public delete trip-photos" on storage.objects;
create policy "public delete trip-photos" on storage.objects
  for delete using (bucket_id = 'trip-photos');
