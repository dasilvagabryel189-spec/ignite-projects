create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  details text not null,
  tags text[] not null default '{}',
  level text not null check (level in ('Alta','Média','Emergente')),
  published_at date not null default current_date
);
grant select on public.opportunities to authenticated;
grant all on public.opportunities to service_role;
alter table public.opportunities enable row level security;
create policy "opps readable" on public.opportunities for select to authenticated using (true);

insert into public.opportunities (title, category, description, details, tags, level, published_at) values
('Assistentes de IA para pequenos negócios','Inteligência Artificial','Comércios locais querem responder clientes mais rápido, mas não sabem configurar IA.','Ideia de projeto: crie um guia ou modelo pronto de atendimento com IA para um tipo de negócio (padaria, salão, oficina). Comece entrevistando 2 donos de negócio.', '{IA,atendimento,local}','Alta', current_date),
('Vídeos curtos educativos','Conteúdo','Explicações rápidas sobre temas difíceis continuam crescendo.','Escolha um assunto que você domina e roteirize 5 vídeos de 30 segundos com ajuda da IA. Teste qual formato prende mais.', '{vídeo,educação}','Alta', current_date - 1),
('Templates de organização para estudantes','Produtos digitais','Planilhas e modelos de estudo bem feitos são procurados todo início de semestre.','Monte um modelo de cronograma de estudos no Notion ou Planilhas e peça feedback de 3 colegas.', '{template,estudos,notion}','Média', current_date - 2),
('Mini jogos no navegador','Jogos','Ferramentas de IA facilitam criar jogos simples sem programar muito.','Crie um jogo de perguntas sobre um tema que você gosta e compartilhe com amigos para testar.', '{jogos,web,iniciante}','Emergente', current_date - 3),
('Ferramentas sem código em alta','Ferramentas','Plataformas que criam sites e apps por texto estão mais acessíveis.','Teste uma ferramenta nova por 20 minutos e anote o que dá para construir com ela.', '{no-code,produtividade}','Média', current_date - 4),
('Conteúdo de bastidores','Marketing','Mostrar o processo de criação gera mais confiança do que só mostrar o resultado.','Registre a construção do seu primeiro projeto em 3 posts: ideia, meio do caminho e resultado.', '{redes sociais,marca pessoal}','Alta', current_date - 5),
('Serviços de organização de fotos com IA','Ideias de negócio','Muitas famílias têm milhares de fotos desorganizadas no celular.','Pense em como oferecer um serviço simples de organização e álbuns usando ferramentas de IA.', '{serviço,IA,família}','Emergente', current_date - 6),
('Comunidades de nicho','Tendências','Grupos pequenos e focados em um interesse específico estão ganhando força.','Liste 3 interesses seus e pesquise onde as pessoas desses nichos se reúnem online.', '{comunidade,nicho}','Média', current_date - 7);