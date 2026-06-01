import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uucikriildtvpmertjeo.supabase.co'
const supabaseAnonKey = 'sb_publishable_igIERW-QgDTYbrWqF6robw_cHwUOA_w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)