// Vercel serverless function for Deliverect webhook
// This endpoint receives webhook data from Deliverect

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Webhook-Secret',
  'Access-Control-Max-Age': '86400'
};

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).setHeaders(corsHeaders).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('=== DELIVERECT WEBHOOK RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));

    // Validate webhook secret (optional but recommended)
    const webhookSecret = req.headers['x-webhook-secret'];
    const expectedSecret = process.env.WEBHOOK_SECRET;
    
    if (expectedSecret && webhookSecret !== expectedSecret) {
      console.error('Invalid webhook secret');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate required fields
    const { order_id, store_id, platform, total_amount } = req.body;
    
    if (!order_id || !store_id || !platform || !total_amount) {
      console.error('Missing required fields:', { order_id, store_id, platform, total_amount });
      res.status(400).json({ 
        error: 'Missing required fields',
        required: ['order_id', 'store_id', 'platform', 'total_amount']
      });
      return;
    }

    // Process the webhook data
    const processedData = {
      order_id,
      store_id,
      platform,
      total_amount: parseFloat(total_amount) || 0,
      currency: req.body.currency || 'GBP',
      order_date: req.body.order_date || new Date().toISOString(),
      customer_name: req.body.customer_name || null,
      items: req.body.items || [],
      delivery_fee: parseFloat(req.body.delivery_fee) || 0,
      service_fee: parseFloat(req.body.service_fee) || 0,
      tax_amount: parseFloat(req.body.tax_amount) || 0,
      status: req.body.status || 'confirmed',
      processed_at: new Date().toISOString(),
      raw_payload: req.body
    };

    console.log('Processed data:', processedData);

    // Here you would typically save to your database
    // For now, we'll just log it and return success
    
    // TODO: Save to Supabase or your database
    // await saveOrderToDatabase(processedData);

    console.log('Webhook processed successfully for order:', order_id);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      order_id,
      processed_at: processedData.processed_at
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Helper function to save order data (implement as needed)
async function saveOrderToDatabase(orderData) {
  // This would connect to your Supabase database
  // and save the order data
  console.log('Would save to database:', orderData);
}
