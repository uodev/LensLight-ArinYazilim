import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import conn from "./db.js"
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"
import fileUpload from "express-fileupload"
import { v2 as cloudinary } from "cloudinary"
import authMiddleware from "./middlewares/authMiddleware.js"
import methodOverride from "method-override"
import nodemailer from "nodemailer"

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
})
//connection to the db
conn()

const app = express()
const port = process.env.PORT

//ejs
app.set("view engine", "ejs")

//static files middleware
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true }))
app.use(methodOverride("_method", { methods: ["POST", "GET"] }))

app.use("*", authMiddleware.checkUser)
app.use("/", pageRoute)
app.use("/photos", photoRoute)
app.use("/users", userRoute)

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`)
})
