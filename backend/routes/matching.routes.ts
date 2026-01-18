
import express from 'express';
import { getCompatibility } from '../controllers/matching.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/compatibility', authenticateToken, getCompatibility);

export default router;
