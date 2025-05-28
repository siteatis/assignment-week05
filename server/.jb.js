import pg from "pg";
const log = console.log;

const db = new pg.Pool({
  connectionString:
    "postgresql://postgres.jvkvdnvwyoebqrvyzhrk:G0j9sVYauxz0cCYq@aws-0-eu-west-2.pooler.supabase.com:6543/postgres",
});

db.query("CREATE TABLE test (message TEXT)").then((p) => log(p));
