import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./database/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import userRoute from "./routes/user.js"

dotenv.config();
const __dirname = path.resolve();
connectDB().then();

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'Notification API',
          version: '1.0.0',
          description: 'API for sending notifications to users from an Excel file'
      },
      servers: [
          {
              url: `http://localhost:${process.env.PORT}`
          }
      ]
  },
  apis: [userRoute, ] // Path to the API docs
};

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use("/test", (req, res) => {
	res.send("Server running successfully");
});

app.use("/api/users", userRoute)
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
