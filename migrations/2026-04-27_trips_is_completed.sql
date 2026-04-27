-- 旅行完成標記 — 控制照片輪播位置
alter table trips add column if not exists is_completed boolean default false;
