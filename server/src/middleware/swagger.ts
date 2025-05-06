import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { config } from '../config/config';
import path from 'path';
import fs from 'fs';

/**
 * Swagger options for generating the OpenAPI specification
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sushi Shop API',
      version: '1.0.0',
      description: 'API documentation for the Sushi Shop application',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'Sushi Shop Support',
        url: 'https://sushishop.example.com',
        email: 'support@sushishop.example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.apiPrefix}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path patterns to files containing OpenAPI annotations
  apis: [
    // Adding filter to only include files that actually exist
    ...[  
      path.join(__dirname, '../routes/**/*.ts'),
      path.join(__dirname, '../controllers/**/*.ts'),
      path.join(__dirname, '../models/**/*.ts'),
    ].filter(pattern => {
      try {
        // For patterns with wildcards, we'll just check if the directory exists
        const dir = pattern.split('/**')[0];
        return fs.existsSync(dir);
      } catch (e) {
        return false;
      }
    }),
  ],
};

/**
 * Environment flag to enable/disable Swagger documentation generation
 * Set to false to completely disable in case of persistent errors
 */
const ENABLE_SWAGGER = process.env.ENABLE_SWAGGER !== 'false';

/**
 * OpenAPI specification generated from JSDoc annotations
 * Wrapped in try-catch to prevent server crash if there are issues with JSDoc comments
 */
let swaggerSpec: any = null;
if (ENABLE_SWAGGER) {
  try {
    // Log the API paths being scanned for better debugging
    console.log('Scanning for Swagger annotations in:', options.apis);
    
    swaggerSpec = swaggerJsdoc(options);
    console.log('Swagger documentation generated successfully');
  } catch (error) {
    console.error('Error generating Swagger documentation:', error);
    
    // Try to provide more specific error information
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Create a minimal valid specification when generation fails
    swaggerSpec = {
      openapi: '3.0.0',
      info: {
        title: 'Sushi Shop API (Documentation Error)',
        version: '1.0.0',
        description: 'There was an error generating the full API documentation. Error: ' + 
                    (error instanceof Error ? error.message : String(error)) + 
                    '. To fix this, review the JSDoc comments in your controllers.'
      },
      paths: {}
    };
  }
} else {
  console.log('Swagger documentation generation is disabled via ENABLE_SWAGGER environment variable');
  swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Sushi Shop API (Documentation Disabled)',
      version: '1.0.0',
      description: 'API documentation generation is disabled. Set ENABLE_SWAGGER=true to re-enable.'
    },
    paths: {}
  };
}

/**
 * Apply Swagger middleware to Express app
 * Provides API documentation UI and OpenAPI specification
 */
export const setupSwagger = (app: Express): void => {
  // Serve Swagger UI
  app.use(
    `${config.apiPrefix}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Sushi Shop API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );

  // Serve OpenAPI specification as JSON
  app.get(`${config.apiPrefix}/api-docs.json`, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Save OpenAPI spec to a file in development mode
  if (config.env === 'development') {
    // Create a directory for the OpenAPI spec if it doesn't exist
    const outputDir = path.join(__dirname, '../../api-docs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the OpenAPI spec to a file
    fs.writeFileSync(
      path.join(outputDir, 'openapi.json'),
      JSON.stringify(swaggerSpec, null, 2)
    );
  }
};
