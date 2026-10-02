create table public.profiles (
  id uuid primary key,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (category in ('semana','rapida','avancada')),
  difficulty text not null,
  xp_per_step int not null default 20,
  xp_bonus int not null default 100,
  starts_at date not null default current_date,
  ends_at date not null default (current_date + 7),
  sort int not null default 0
);
grant select on public.missions to authenticated;
grant all on public.missions to service_role;
alter table public.missions enable row level security;
create policy "missions readable" on public.missions for select to authenticated using (true);

create table public.mission_steps (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  position int not null,
  title text not null
);
grant select on public.mission_steps to authenticated;
grant all on public.mission_steps to service_role;
alter table public.mission_steps enable row level security;
create policy "steps readable" on public.mission_steps for select to authenticated using (true);

create table public.user_step_progress (
  user_id uuid not null default auth.uid(),
  step_id uuid not null references public.mission_steps(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, step_id)
);
grant select, insert, delete on public.user_step_progress to authenticated;
grant all on public.user_step_progress to service_role;
alter table public.user_step_progress enable row level security;
create policy "own steps" on public.user_step_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.daily_missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  xp int not null default 30,
  sort int not null
);
grant select on public.daily_missions to authenticated;
grant all on public.daily_missions to service_role;
alter table public.daily_missions enable row level security;
create policy "daily readable" on public.daily_missions for select to authenticated using (true);

create table public.daily_completions (
  user_id uuid not null default auth.uid(),
  day date not null default current_date,
  daily_mission_id uuid not null references public.daily_missions(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, day)
);
grant select, insert on public.daily_completions to authenticated;
grant all on public.daily_completions to service_role;
alter table public.daily_completions enable row level security;
create policy "own daily" on public.daily_completions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

do $$
declare m uuid;
begin
  insert into public.missions (title, description, category, difficulty, sort) values ('Crie uma ideia de produto usando IA','Use a IA para sair do zero até uma primeira versão apresentável da sua ideia.','semana','Intermediária',1) returning id into m;
  insert into public.mission_steps (mission_id, position, title) values (m,1,'Escolha um problema'),(m,2,'Defina seu público'),(m,3,'Crie uma solução'),(m,4,'Monte sua primeira versão'),(m,5,'Crie uma página de apresentação');

  insert into public.missions (title, description, category, difficulty, ends_at, sort) values ('Escreva sua bio profissional com IA','Crie uma apresentação curta e clara sobre você e o que está construindo.','rapida','Fácil', current_date + 30, 2) returning id into m;
  insert into public.mission_steps (mission_id, position, title) values (m,1,'Liste 3 habilidades suas'),(m,2,'Peça 3 versões à IA'),(m,3,'Escolha e ajuste a melhor');

  insert into public.missions (title, description, category, difficulty, ends_at, sort) values ('Nomeie seu primeiro projeto','Gere opções de nome, verifique disponibilidade e escolha um.','rapida','Fácil', current_date + 30, 3) returning id into m;
  insert into public.mission_steps (mission_id, position, title) values (m,1,'Gere 10 nomes com IA'),(m,2,'Verifique se o nome está livre'),(m,3,'Escolha o nome final');

  insert into public.missions (title, description, category, difficulty, ends_at, sort) values ('Publique uma landing page completa','Construa e publique uma página que explica seu projeto e coleta interessados.','avancada','Avançada', current_date + 30, 4) returning id into m;
  insert into public.mission_steps (mission_id, position, title) values (m,1,'Escreva a proposta de valor'),(m,2,'Estruture as seções'),(m,3,'Crie com uma ferramenta de IA'),(m,4,'Adicione um formulário'),(m,5,'Publique e compartilhe'),(m,6,'Colete o primeiro feedback');
end $$;

insert into public.daily_missions (title, sort) values
('Encontre 3 problemas que você poderia resolver com um produto.',1),
('Peça à IA 5 ideias de projeto para um hobby seu.',2),
('Anote uma ferramenta nova e teste por 10 minutos.',3),
('Descreva seu público ideal em 3 frases.',4),
('Analise um site que você admira e liste 3 coisas que ele faz bem.',5),
('Escreva o título de uma página para sua ideia.',6),
('Mostre sua ideia para uma pessoa e anote o que ela disse.',7);