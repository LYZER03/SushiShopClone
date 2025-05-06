import { Request, Response } from 'express';
import mongoose from 'mongoose';
import os from 'os';
import { config } from '../config/config';

/**
 * Connection state constants for readable status
 */
const DB_STATES: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
  99: 'uninitialized'
};

/**
 * @swagger
 * /v1/health:
 *   get:
 *     summary: Basic health check endpoint
 *     description: Returns a simple health status to verify the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running normally
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 *                 uptime:
 *                   type: integer
 *                   example: 3600
 */
export const getHealthStatus = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
    uptime: Math.floor(process.uptime())
  });
};

/**
 * @swagger
 * /v1/health/details:
 *   get:
 *     summary: Detailed health check endpoint
 *     description: Returns detailed information about the API, database connection status, and system information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 api:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Sushi Shop API
 *                     version:
 *                       type: string
 *                       example: 1.0.0
 *                     environment:
 *                       type: string
 *                       example: development
 *                 database:
 *                   type: object
 *                   properties:
 *                     connected:
 *                       type: boolean
 *                       example: true
 *                     status:
 *                       type: string
 *                       example: connected
 *                     name:
 *                       type: string
 *                       example: sushishop
 *                     host:
 *                       type: string
 *                       example: mongodb://localhost:27017
 *                 system:
 *                   type: object
 *                   properties:
 *                     platform:
 *                       type: string
 *                       example: linux
 *                     uptime:
 *                       type: integer
 *                       example: 3600
 *                     memoryUsage:
 *                       type: object
 *                       description: Memory usage information
 */
export const getDetailedHealth = (req: Request, res: Response): void => {
  // Get database connection status
  const dbState = mongoose.connection.readyState;
  const dbStatus = DB_STATES[dbState] || 'unknown';
  const dbName = mongoose.connection.name;
  
  // Get system information
  const systemInfo = {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    uptime: Math.floor(process.uptime()),
    hostname: os.hostname(),
    cpus: os.cpus().length,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem()
  };
  
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    api: {
      name: 'Sushi Shop API',
      version: '1.0.0',
      environment: config.env
    },
    database: {
      connected: dbState === 1,
      status: dbStatus,
      name: dbName || 'Not connected',
      host: mongoose.connection.host || 'Not connected'
    },
    system: systemInfo
  });
};
