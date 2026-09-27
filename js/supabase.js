import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://fmxgmfrpiqlndsdhyeql.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_JLaXqQ59oW-_tRl0u6zygQ_PXgljmTs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);