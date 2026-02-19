import swaggerJsdoc from "swagger-jsdoc"

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Hotel Booking API",
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ["./docs/swagger.docs.js"] 
}

export const swaggerSpec = swaggerJsdoc(options) 