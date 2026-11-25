-- Lemma: tabel catatan hasil belajar.
-- Jalankan sekali di Supabase → SQL Editor. Aman dijalankan ulang (tidak menghapus data).
-- Tabel lain (settings, categories, sessions, active_timer) tidak disentuh.

create table if not exists public.notes (
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  id         text not null,
  cat_id     text not null,
  kind       text not null check (kind in ('bab', 'rangkuman', 'soal', 'konsep')),
  body       text not null default '' check (char_length(body) <= 140),
  qty        int  check (qty between 1 and 9999),        -- jumlah, opsional (misal 12 soal)
  minutes    int  check (minutes between 1 and 1440),    -- durasi, opsional
  noted_at   timestamptz not null,
  device     text,
  deleted    boolean not null default false,             -- hapus lunak, supaya sinkron antar perangkat
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
create index if not exists notes_user_noted on public.notes (user_id, noted_at desc);

-- updated_at otomatis (fungsi touch_updated_at sudah ada dari skema awal; dibuat ulang bila belum)
create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists touch on public.notes;
create trigger touch before update on public.notes for each row execute function public.touch_updated_at();

-- Row Level Security: hanya pemilik
alter table public.notes enable row level security;
drop policy if exists "pemilik saja" on public.notes;
create policy "pemilik saja" on public.notes for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
