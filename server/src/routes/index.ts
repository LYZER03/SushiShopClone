import express from 'express';
import v1Routes from './v1/index';
import { config } from '../config/config';

const router = express.Router();

/**
 * API routes with versioning support
 * All API routes should be attached to the appropriate version router
 */

// Root API route - shows available versions
router.get('/', (req, res) => {
  res.json({
    message: 'Sushi Shop API',
    versions: {
      v1: `${req.protocol}://${req.get('host')}${config.apiPrefix}/v1`
    },
    currentVersion: 'v1',
    documentation: `${req.protocol}://${req.get('host')}${config.apiPrefix}/docs`
  });
});

// Attach v1 routes under /v1 path
router.use('/v1', v1Routes);

export default router;
