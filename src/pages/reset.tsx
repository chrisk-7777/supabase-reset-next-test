import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";

import { supabase } from "@/supabase";
import { useRouter } from "next/router";

type ResetProps = {
  user: User;
};

function Reset(props: ResetProps) {
  const { user } = props;
  const [view, setView] = useState<"UPDATE_PASSWORD" | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("reset@subscribe");
    const instance = supabase.auth.onAuthStateChange(async (e) => {
      console.log("reset@auth-event", e);

      switch (e) {
        case "USER_UPDATED": {
          setView(null);
          router.push("/");
          break;
        }
        case "PASSWORD_RECOVERY": {
          setView("UPDATE_PASSWORD");
          break;
        }
      }
    });

    return () => {
      console.log("reset@unsubscribe");
      instance.data.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="App">
      <div className="App__container">
        {user && view === "UPDATE_PASSWORD" && <Auth supabaseClient={supabase} view="update_password" />}
      </div>
    </div>
  );
}

export default Reset;
