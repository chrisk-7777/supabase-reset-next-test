import { supabase } from '@/supabase';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import type { AppProps } from 'next/app'

import '@/index.css'

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("app@subscribe");

    const instance = supabase.auth.onAuthStateChange(async (e) => {
      console.log("app@auth-event", e);
      
      switch (e) {
        case "SIGNED_IN": {
          setUser((await supabase.auth.getUser()).data.user);
          break;
        }
        case "SIGNED_OUT": {
          setUser(null);
          break;
        }
      }
    });

    console.log("app@initial app mount");
    (async () => {
      setUser((await supabase.auth.getUser()).data.user);
    })();

    return () => {
      console.log("app@unsubscribe");
      instance.data.subscription.unsubscribe();
    };
  }, []);

  return <Component {...pageProps} user={user} />
}
