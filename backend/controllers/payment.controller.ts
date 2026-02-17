
import { verifyTransaction } from '../services/paystack.service';

export const handleVerifyPayment = async (req: any, res: any) => {
  const { reference, userId } = req.body;
  try {
    const response = await verifyTransaction(reference);
    if (response.status && response.data.status === 'success') {
      // In a real DB: await User.update({ isPremium: true }, { where: { id: userId } });
      res.json({ success: true, message: 'Premium activated' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
