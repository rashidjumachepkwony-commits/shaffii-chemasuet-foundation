/**
 * TEMPORARY local diagnostic — delete this file when you're done.
 *
 * Usage (from the worker/ directory):
 *   node admin-tools.cjs                              # inspect account
 *   node admin-tools.cjs "your-email@example.org"     # inspect a specific email
 *   node admin-tools.cjs --set-password "NewPass123"  # also set a known password
 *
 * Reads SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY from worker/.dev.vars.
 * The service key is never printed.
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const envPath = path.join(__dirname, ".dev.vars");
const env = {};
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key || key.startsWith("your-")) {
  console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing or still a placeholder in worker/.dev.vars");
  process.exitCode = 1;
} else {
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const args = process.argv.slice(2);
let TARGET = null;
let newPassword = null;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--set-password") {
    newPassword = args[i + 1];
    i++;
  } else if (!a.startsWith("--")) {
    TARGET = String(a || "").toLowerCase();
  }
}

if (!TARGET) TARGET = "info@shaffiechemasuetfoundation.org";

let failed = false;

(async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("listUsers failed:", error.message);
    failed = true;
    return;
  }

  const users = data.users || [];
  console.log(`Auth users in project: ${users.length}\n`);
  users.forEach((u) =>
    console.log(
      `  ${u.email}  | confirmed: ${u.email_confirmed_at ? "yes" : "NO"} | sign-ins: ${u.last_sign_in_at ? "yes" : "never"}`
    )
  );

  console.log("");
  const exact = users.find((u) => (u.email || "").toLowerCase() === TARGET);
  const fuzzy = users.filter((u) => {
    const local = TARGET.split("@")[0];
    return !exact && (u.email || "").toLowerCase().includes(local.slice(0, 6));
  });

  if (!exact) {
    console.log(`NOT FOUND: ${TARGET}`);
    if (fuzzy.length) {
      console.log("\nSimilar addresses that DO exist:");
      fuzzy.forEach((u) => console.log(`  ${u.email}   (id: ${u.id})`));
    }
    return;
  }

  console.log(`FOUND: ${exact.email}`);
  console.log(`  id:                ${exact.id}`);
  console.log(`  email_confirmed_at:${exact.email_confirmed_at || " NULL <-- unconfirmed accounts cannot log in"}`);
  console.log(`  last_sign_in_at:   ${exact.last_sign_in_at || "never signed in"}`);

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", exact.id);
  const role = roleRows && roleRows.length ? roleRows[0].role : null;
  console.log(`  user_roles:         ${role ? role : "(none) <-- needs a role to enter /admin"}`);

  if (newPassword) {
    const attrs = exact.email_confirmed_at
      ? { password: newPassword }
      : { password: newPassword, email_confirm: true };

    const { error: upErr } = await supabase.auth.admin.updateUserById(exact.id, attrs);
    if (upErr) {
      console.error("\nPassword set failed:", upErr.message);
      failed = true;
      return;
    }
    console.log(
      `\nPassword set${exact.email_confirmed_at ? "" : " (email also confirmed)"}. Log in at /admin/login with ${exact.email}`
    );
  } else if (!role) {
    console.log("\nRun this in the Supabase SQL Editor to grant admin:");
    console.log("  insert into user_roles (user_id, role)");
    console.log(`  select id, 'SUPER_ADMIN' from auth.users where email = '${exact.email}'`);
  }
})().catch((e) => {
  console.error("Unexpected error:", e.message);
  failed = true;
}).finally(() => {
  process.exitCode = failed ? 1 : 0;
});
}
