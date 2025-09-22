// Webhook endpoint for Deliverect integration
// This is a simple endpoint that logs incoming webhook data

// Enable CORS for all origins
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Webhook-Secret',
  'Access-Control-Max-Age': '86400'
};

// Handle preflight requests
if (typeof Request !== 'undefined' && typeof Response !== 'undefined') {
  // This is running in a service worker or similar environment
  self.addEventListener('fetch', event => {
    if (event.request.method === 'OPTIONS') {
      event.respondWith(new Response(null, {
        status: 200,
        headers: corsHeaders
      }));
      return;
    }
    
    if (event.request.url.includes('/api/webhook/deliverect')) {
      event.respondWith(handleWebhook(event.request));
    }
  });
}

async function handleWebhook(request) {
  try {
    // Log the incoming request
    console.log('Webhook received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString()
    });

    // Get the request body
    const body = await request.text();
    console.log('Webhook payload:', body);

    // Parse JSON payload
    let payload;
    try {
      payload = JSON.parse(body);
    } catch (e) {
      console.error('Invalid JSON payload:', e);
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Log the parsed payload
    console.log('Parsed webhook payload:', payload);

    // Validate required fields
    const requiredFields = ['order_id', 'store_id', 'platform', 'total_amount'];
    const missingFields = requiredFields.filter(field => !payload[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return new Response(JSON.stringify({ 
        error: 'Missing required fields', 
        missing: missingFields 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Process the webhook data
    const processedData = {
      order_id: payload.order_id,
      store_id: payload.store_id,
      platform: payload.platform,
      total_amount: parseFloat(payload.total_amount) || 0,
      currency: payload.currency || 'GBP',
      order_date: payload.order_date || new Date().toISOString(),
      customer_name: payload.customer_name || null,
      items: payload.items || [],
      delivery_fee: parseFloat(payload.delivery_fee) || 0,
      service_fee: parseFloat(payload.service_fee) || 0,
      tax_amount: parseFloat(payload.tax_amount) || 0,
      status: payload.status || 'confirmed',
      processed_at: new Date().toISOString()
    };

    console.log('Processed webhook data:', processedData);

    // Store in localStorage for debugging (client-side)
    if (typeof window !== 'undefined') {
      const webhookLog = JSON.parse(localStorage.getItem('webhook_log') || '[]');
      webhookLog.unshift({
        ...processedData,
        received_at: new Date().toISOString(),
        raw_payload: payload
      });
      
      // Keep only last 50 webhooks
      if (webhookLog.length > 50) {
        webhookLog.splice(50);
      }
      
      localStorage.setItem('webhook_log', JSON.stringify(webhookLog));
    }

    // Return success response
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook processed successfully',
      order_id: payload.order_id,
      processed_at: processedData.processed_at
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { handleWebhook, corsHeaders };
}
