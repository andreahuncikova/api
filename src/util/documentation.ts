import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Application } from 'express';



// setup Swagger documentation
export function setupDocumentation(app: Application) {
    
    // Swagger definition
     const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'MENTS-API',
      version: '1.0.0',
      description: 'MongoDB Express Node TypeScript REST API',
    },
    servers: [
      {
        url: 'http://localhost:4000/api/',
        description: 'Local development server',
      },
      {
        url: 'https://api-e7dw.onrender.com/api-docs/',
        description: 'Remote development server',
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'auth-token',
        },
      },
      schemas: {
        Book: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            image: { type: 'string' },
            price: { type: 'number' },
            genre: { type: 'string' },
            publishedYear: { type: 'number' },
            pages: { type: 'number' },
            summary: { type: 'string' },
            available: { type: 'boolean' },
            _createdBy: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            registerDate: { type: 'string' },
            },
            },
        },
        }
    }
    //swagger options
    const options = {
    swaggerDefinition,
    // Path to the files containing OpenAPI definitions
    apis: ['**/*.ts']
    };

    //swagger specification
    const swaggerSpec = swaggerJSDoc(options);

    //create swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}