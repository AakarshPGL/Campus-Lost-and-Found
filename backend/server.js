const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const multer = require("multer")
const ImageKit = require("@imagekit/nodejs")

require("dotenv").config()

const Item = require("./models/Item")
const User = require("./models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()

app.use(cors())
app.use(express.json())

const upload = multer({
    storage: multer.memoryStorage(),
})

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully")
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message)
    })

app.get("/", (req, res) => {
    res.json({
        message: "Lost & Found API is running",
    })
})

app.get("/api/items", async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 })

        res.json(items)
    } catch (error) {
        console.error("Error fetching items:", error.message)

        res.status(500).json({
            message: "Failed to fetch items",
        })
    }
})
app.get("/api/items/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)

        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            })
        }

        res.json(item)
    } catch (error) {
        console.error("Error fetching item:", error.message)

        res.status(500).json({
            message: "Failed to fetch item",
        })
    }
})

app.post("/api/items", upload.single("image"), async (req, res) => {
    try {
        let imageUrl = ""

        if (req.file) {
            const result = await imagekit.files.upload({
                file: req.file.buffer.toString("base64"),
                fileName: req.file.originalname,
                folder: "/lost-found",
            })

            imageUrl = result.url
        }

        const item = await Item.create({
            type: req.body.type,
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            location: req.body.location,
            date: req.body.date,
            imageUrl: imageUrl,
        })

        console.log("Item saved:", item)

        res.status(201).json({
            message: "Item created successfully",
            item: item,
        })
    } catch (error) {
        console.error("Error creating item:", error.message)

        res.status(400).json({
            message: "Failed to create item",
            error: error.message,
        })
    }
})

const PORT = 5000
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        })

    } catch (error) {
        console.error("Registration error:", error.message)

        res.status(500).json({
            message: "Failed to register user",
        })
    }
})
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        )

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        })

    } catch (error) {
        console.error("Login error:", error.message)

        res.status(500).json({
            message: "Failed to login",
        })
    }
})
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})