
import express from 'express';
import crypto from 'crypto';
import { verifyTransaction } from '../services/paystack.service';

const router = express.Router();

// 1. Verify a specific transaction reference
router.post('/verify', async (req, res) => {
  const { reference } = req.body;
  try {
    const data = await verifyTransaction(reference);
    if (data.status && data.data.status === 'success') {
      // Update User to Premium in Database here
      res.json({ status: 'success', message: 'Premium activated' });
    } else {
      res.status(400).json({ status: 'failed', message: 'Payment not successful' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// 2. Webhook listener for automated updates
router.post('/webhook', (req, res) => {
  // Validate Paystack Signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    const event = req.body;
    if (event.event === 'charge.success') {
      const email = event.data.customer.email;
      const amount = event.data.amount;
      console.log(`Payment confirmed for ${email}: ${amount}`);
      // DB Logic: SET isPremium = true WHERE email = email
    }
  }
  res.send(200);
});

export default router;
