import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./database/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import userRoute from "./routes/user.js";
import accountRoute from "./routes/account.js";
import packageRoute from "./routes/package.js";
import adminRoute from "./routes/admin.js";
import investmentRoute from "./routes/investment.js";
import withdrawalRoute from "./routes/withdrawal.js";
import depositRoute from "./routes/deposit.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const __dirname = path.resolve();
connectDB().then();

const app = express();

const swaggerOptions = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "247Bitoption API Docs",
			version: "1.0.0",
			description: "API for 247Bitoption",
		},
		servers: [
			{
				url:
					process.env.NODE_ENV === "Development"
						? `http://localhost:${process.env.PORT}`
						: "https://bitoption-backend.vercel.app",
			},
		],
		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http", // <-- Change to http
					scheme: "bearer",
					bearerFormat: "JWT", // <-- Ensure JWT format
					description: "Enter JWT Bearer token in format: Bearer <your_token>",
				},
			},
		},
		security: [
			{
				BearerAuth: [],
			},
		],
	},
	apis: ["./routes/**/*.js"],
};

app.use(express.json());
const corsOptions = {
	origin:
		process.env.NODE_ENV === "Development"
			? `http://localhost:${process.env.PORT}`
			: "https://bitoption-backend.vercel.app",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	allowedHeaders: ["Authorization", "Content-Type"], // Ensure Authorization is allowed
	optionsSuccessStatus: 204,
};



app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use("/test", (req, res) => {
	res.send("Server running successfully");
});
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocs, {
		swaggerOptions: {
			persistAuthorization: true, // Keeps token between page refreshes
		},
	})
);

// Serve Swagger UI static files explicitly
app.use(
	"/api-docs",
	express.static(path.join(__dirname, "node_modules/swagger-ui-dist"))
);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/accounts", accountRoute);
app.use("/api/packages", packageRoute);
app.use("/api/investments", investmentRoute);
app.use("/api/deposit", depositRoute); 
app.use("/api/withdrawal", withdrawalRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
