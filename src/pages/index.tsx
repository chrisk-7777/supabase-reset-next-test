import { useEffect, useState } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";

// @ts-ignore
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<"UPDATE_PASSWORD" | null>(null);

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
        case "USER_UPDATED": {
          setView(null);
          break;
        }
        case "PASSWORD_RECOVERY": {
          setView("UPDATE_PASSWORD");
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

  const handleSignout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="App">
      <div className="App__container">
        {user ? (
          <>
            <h1>You are signed in</h1>
            <button onClick={handleSignout}>sign out</button>
            <hr />
            {view === "UPDATE_PASSWORD" && <Auth supabaseClient={supabase} view="update_password" />}
          </>
        ) : (
          <>
            <h1>You are signed out</h1>
            <Auth supabaseClient={supabase} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
