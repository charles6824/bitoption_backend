import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./database/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import userRoute from "./routes/user.js"
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

dotenv.config();
const __dirname = path.resolve();
connectDB().then();

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: '247Bitoption API Docs',
          version: '1.0.0',
          description: 'API for 247Bitoption'
      },
      servers: [
          {
              url: process.env.NODE_ENV === "Development" ? `http://localhost:${process.env.PORT}` : "https://bitoption-backend.vercel.app"
          }
      ]
  },
  apis: ["./routes/**/*.js"]
};

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3400", // Allow requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Allow cookies and credentials to be sent
  optionsSuccessStatus: 204, // Respond with 204 No Content for preflight requests
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use("/test", (req, res) => {
	res.send("Server running successfully");
});
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Serve Swagger UI static files explicitly
app.use("/api-docs", express.static(path.join(__dirname, "node_modules/swagger-ui-dist")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads"))); 

app.use("/api/users", userRoute)

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
