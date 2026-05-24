const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { paymentMethodId, name, email, phone } = req.body;

  if (!paymentMethodId) return res.status(400).json({ error: 'Missing payment method' });

  try {
    // Create customer
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      name: name || 'Customer',
      email: email || undefined,
      phone: phone || undefined,
      invoice_settings: { default_payment_method: paymentMethodId }
    });

    // Create $200/mo subscription (price ID from Stripe dashboard)
    const priceId = process.env.STRIPE_PRICE_ID || 'price_placeholder';
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    res.json({ success: true, subscriptionId: subscription.id, customerId: customer.id });
  } catch (e) {
    console.error('Stripe error:', e);
    res.status(400).json({ error: e.message });
  }
};
