import "@/styles/globals.css";
import Layout from "@/components/layout/Layout";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </SessionContextProvider>
  );
}

