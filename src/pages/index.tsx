import {  User } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";

import { supabase } from "@/supabase";

type AppProps = {
  user: User;
}

function App(props: AppProps) {
  const { user } = props;

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
          </>
        ) : (
          <>
            <h1>You are signed out</h1>
            <Auth supabaseClient={supabase} redirectTo={`${process.env.NEXT_PUBLIC_HOST}/reset`} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
