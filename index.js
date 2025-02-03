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
              url: `http://localhost:${process.env.PORT}`
          }
      ]
  },
  apis: ["./routes/**/*.js"]
};

app.use(express.json());
app.use(cors());

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
