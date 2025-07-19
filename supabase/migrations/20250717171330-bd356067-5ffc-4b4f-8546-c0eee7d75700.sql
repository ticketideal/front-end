-- Update the user_type enum to include all requested user types
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'vendedor';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'validador';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'cliente';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'administrador';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'local';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'representante_comercial';

-- Insert specific user profiles with the requested IDs and types
INSERT INTO public.profiles (id, user_type, full_name, email) VALUES
('00000000-0000-0000-0000-000000000001', 'total', 'João Silva', 'joao.silva@exemplo.com'),
('00000000-0000-0000-0000-000000000002', 'producer', 'Maria Produtora', 'maria.produtora@exemplo.com'),
('00000000-0000-0000-0000-000000000003', 'vendedor', 'Carlos Vendedor', 'carlos.vendedor@exemplo.com'),
('00000000-0000-0000-0000-000000000004', 'validador', 'Ana Validadora', 'ana.validadora@exemplo.com'),
('00000000-0000-0000-0000-000000000005', 'cliente', 'Pedro Cliente', 'pedro.cliente@exemplo.com'),
('00000000-0000-0000-0000-000000000006', 'administrador', 'Sofia Admin', 'sofia.admin@exemplo.com'),
('00000000-0000-0000-0000-000000000007', 'local', 'Teatro Municipal', 'teatro.municipal@exemplo.com'),
('00000000-0000-0000-0000-000000000008', 'representante_comercial', 'Lucas Comercial', 'lucas.comercial@exemplo.com')
ON CONFLICT (id) DO UPDATE SET 
  user_type = EXCLUDED.user_type,
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email;