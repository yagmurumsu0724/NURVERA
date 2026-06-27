const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envLines = envLocal.split('\n');
const env = {};
envLines.forEach(line => {
  if (line.includes('=')) {
    const [key, ...rest] = line.split('=');
    env[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function testOrder() {
  const orderData = {
       user_id: 'fdde063a-b251-4a5f-98e3-477224cd57b5', // User's ID
       customer_name: 'Test Name',
       customer_email: 'test@example.com',
       customer_phone: '1234567890',
       shipping_address: {
         fullName: 'Test Name',
         address: '123 Test St',
         city: 'Test City',
         district: 'Test District',
       },
       subtotal: 100,
       shipping_cost: 0,
       total: 100,
       items: [{
         product_id: '123e4567-e89b-12d3-a456-426614174000', // valid UUID format
         name: 'Test Product',
         price: 100,
         qty: 1,
         image: '/placeholder.jpg'
       }]
    };

  const { error } = await supabase.from('orders').insert(orderData);
  console.log("Error details:", JSON.stringify(error, null, 2));
}

testOrder();
