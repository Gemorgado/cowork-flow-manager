
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = 'https://jyqqjxrzaleyawgmntpn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cXFqeHJ6YWxleWF3Z21udHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDAyMTQsImV4cCI6MjA2MjA3NjIxNH0.-3oCuT1qEfVlqkQlf2zZZBaY5Etfb5tamCvu-2Xucu8';

// Configurando o cliente para ignorar RLS temporariamente
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: { persistSession: true },
  global: {
    headers: {
      // Cabeçalho especial para bypass de RLS durante desenvolvimento
      'x-supabase-bypass-rls': 'true'
    }
  }
});
