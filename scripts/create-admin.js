const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) => new Promise((resolve) => readline.question(query, resolve));

  try {
    console.log('\n=== Create Admin User ===\n');

    const name = await question('Admin Name: ');
    const email = await question('Admin Email: ');
    const password = await question('Password: ');

    if (!name || !email || !password) {
      console.error('\nAll fields are required!');
      readline.close();
      process.exit(1);
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          name,
          email,
          password_hash: passwordHash,
        },
      ])
      .select();

    if (error) {
      if (error.code === '23505') {
        console.error('\nError: An admin with this email already exists!');
      } else {
        console.error('\nError creating admin:', error.message);
      }
      readline.close();
      process.exit(1);
    }

    console.log('\n✓ Admin user created successfully!');
    console.log('\nAdmin Details:');
    console.log(`Name: ${data[0].name}`);
    console.log(`Email: ${data[0].email}`);
    console.log(`ID: ${data[0].id}`);
    console.log('\nYou can now login at: /admin/login\n');

    readline.close();
  } catch (error) {
    console.error('\nError:', error.message);
    readline.close();
    process.exit(1);
  }
}

createAdmin();
