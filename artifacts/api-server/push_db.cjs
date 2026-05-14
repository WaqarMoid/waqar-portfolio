const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.fxqelyttqwukizzpmhlb:UnderTaker1610$@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres'
});

async function run() {
  await client.connect();
  console.log("Connected...");
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS "projects" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "title" text NOT NULL,
      "description" text,
      "category" text,
      "tags" text[],
      "file_url" text NOT NULL,
      "file_name" text,
      "file_type" text,
      "is_protected" boolean DEFAULT false,
      "password_hash" text,
      "created_at" timestamp DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "blog_posts" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "title" text NOT NULL,
      "slug" text NOT NULL UNIQUE,
      "content" text NOT NULL,
      "excerpt" text,
      "tags" text[],
      "published" boolean DEFAULT false,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("Tables created!");
  await client.end();
}
run().catch(console.error);
