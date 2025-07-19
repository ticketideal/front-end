-- Create the user_type enum with all requested user types
CREATE TYPE public.user_type AS ENUM (
  'total',
  'producer', 
  'vendedor',
  'validador',
  'cliente',
  'administrador',
  'local',
  'representante_comercial'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type user_type NOT NULL DEFAULT 'cliente',
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.uid() = id);

-- Insert specific user profiles with the requested IDs and types
INSERT INTO public.profiles (id, user_type, full_name, email) VALUES
('00000000-0000-0000-0000-000000000001', 'total', 'João Silva', 'joao.silva@exemplo.com'),
('00000000-0000-0000-0000-000000000002', 'producer', 'Maria Produtora', 'maria.produtora@exemplo.com'),
('00000000-0000-0000-0000-000000000003', 'vendedor', 'Carlos Vendedor', 'carlos.vendedor@exemplo.com'),
('00000000-0000-0000-0000-000000000004', 'validador', 'Ana Validadora', 'ana.validadora@exemplo.com'),
('00000000-0000-0000-0000-000000000005', 'cliente', 'Pedro Cliente', 'pedro.cliente@exemplo.com'),
('00000000-0000-0000-0000-000000000006', 'administrador', 'Sofia Admin', 'sofia.admin@exemplo.com'),
('00000000-0000-0000-0000-000000000007', 'local', 'Teatro Municipal', 'teatro.municipal@exemplo.com'),
('00000000-0000-0000-0000-000000000008', 'representante_comercial', 'Lucas Comercial', 'lucas.comercial@exemplo.com');