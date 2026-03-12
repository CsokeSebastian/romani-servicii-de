import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Token",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const token = req.headers.get("X-Admin-Token");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token lipsește" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const sessionResponse = await fetch(
      `${supabaseUrl}/rest/v1/admin_sessions?token=eq.${token}&select=*,admin_users(*)`,
      {
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    const sessions = await sessionResponse.json();

    if (!sessions || sessions.length === 0) {
      return new Response(
        JSON.stringify({ error: "Token invalid" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const session = sessions[0];
    const expiresAt = new Date(session.expires_at);

    if (expiresAt < new Date()) {
      await fetch(`${supabaseUrl}/rest/v1/admin_sessions?id=eq.${session.id}`, {
        method: "DELETE",
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
      });

      return new Response(
        JSON.stringify({ error: "Token expirat" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const admin = session.admin_users;

    return new Response(
      JSON.stringify({
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Eroare server" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
