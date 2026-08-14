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
const { OAuth2Client } = require("google-auth-library")

const app = express()

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
)

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
        console.error(
            "MongoDB connection failed:",
            error.message
        )
    })


// ===============================
// JWT AUTHENTICATION MIDDLEWARE
// ===============================

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization

    const token =
        authHeader &&
        authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Authentication required",
        })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decoded

        next()

    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token",
        })
    }
}


// ===============================
// BASIC ROUTE
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Lost & Found API is running",
    })
})


// ===============================
// GET ALL ITEMS
// ===============================

app.get("/api/items", async (req, res) => {
    try {
        const items = await Item.find({
            $or: [
                { status: "Active" },
                { status: { $exists: false } },
            ],
        }).sort({ createdAt: -1 })

        res.json(items)

    } catch (error) {
        console.error(
            "Error fetching items:",
            error.message
        )

        res.status(500).json({
            message: "Failed to fetch items",
        })
    }
})


// ===============================
// GET SINGLE ITEM
// ===============================

app.get("/api/items/:id", async (req, res) => {
    try {
        const item = await Item.findById(
            req.params.id
        ).populate(
            "reportedBy",
            "name email"
        )

        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            })
        }

        res.json(item)

    } catch (error) {
        console.error(
            "Error fetching item:",
            error.message
        )

        res.status(500).json({
            message: "Failed to fetch item",
        })
    }
})

// ===============================
// GET MY REPORTS
// ===============================

app.get(
    "/api/my-reports",
    authenticateToken,
    async (req, res) => {
        try {
            const items = await Item.find({
                reportedBy: req.user.userId,
            }).sort({
                createdAt: -1,
            })

            res.json(items)

        } catch (error) {
            console.error(
                "Error fetching my reports:",
                error.message
            )

            res.status(500).json({
                message:
                    "Failed to fetch your reports",
            })
        }
    }
)
// ===============================
// RESOLVE MY REPORT
// ===============================

app.patch(
    "/api/items/:id/resolve",
    authenticateToken,
    async (req, res) => {
        try {
            const item = await Item.findOne({
                _id: req.params.id,
                reportedBy: req.user.userId,
            })

            if (!item) {
                return res.status(404).json({
                    message:
                        "Report not found or you are not allowed to update it",
                })
            }

            if (item.status === "Resolved") {
                return res.status(400).json({
                    message:
                        "This report is already resolved",
                })
            }

            item.status = "Resolved"

            await item.save()

            res.json({
                message:
                    "Report marked as resolved",
                item,
            })

        } catch (error) {
            console.error(
                "Error resolving report:",
                error.message
            )

            res.status(500).json({
                message:
                    "Failed to resolve report",
            })
        }
    }
)

// ===============================
// CREATE ITEM
// ===============================

app.post(
    "/api/items",
    authenticateToken,
    upload.single("image"),
    async (req, res) => {

        try {
            let imageUrl = ""

            // Upload image to ImageKit
            if (req.file) {
                const result =
                    await imagekit.files.upload({
                        file: req.file.buffer.toString(
                            "base64"
                        ),
                        fileName:
                            req.file.originalname,
                        folder: "/lost-found",
                    })

                imageUrl = result.url
            }

            // Create item
            const item = await Item.create({
                type: req.body.type,
                name: req.body.name,
                category: req.body.category,
                description: req.body.description,
                location: req.body.location,
                date: req.body.date,
                imageUrl: imageUrl,

                // Logged-in user
                reportedBy: req.user.userId,
            })

            console.log(
                "Item saved:",
                item
            )

            res.status(201).json({
                message:
                    "Item created successfully",
                item: item,
            })

        } catch (error) {
            console.error(
                "Error creating item:",
                error.message
            )

            res.status(400).json({
                message:
                    "Failed to create item",
                error: error.message,
            })
        }
    }
)


// ===============================
// REGISTER
// ===============================

app.post(
    "/api/auth/register",
    async (req, res) => {

        try {
            const {
                name,
                email,
                password,
            } = req.body

            if (
                !name ||
                !email ||
                !password
            ) {
                return res.status(400).json({
                    message:
                        "Name, email and password are required",
                })
            }

            const existingUser =
                await User.findOne({ email })

            if (existingUser) {
                return res.status(400).json({
                    message:
                        "Email already registered",
                })
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                )

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
            })

            res.status(201).json({
                message:
                    "User registered successfully",

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            })

        } catch (error) {
            console.error(
                "Registration error:",
                error.message
            )

            res.status(500).json({
                message:
                    "Failed to register user",
            })
        }
    }
)


// ===============================
// LOGIN
// ===============================

app.post(
    "/api/auth/login",
    async (req, res) => {

        try {
            const {
                email,
                password,
            } = req.body

            if (!email || !password) {
                return res.status(400).json({
                    message:
                        "Email and password are required",
                })
            }

            const user =
                await User.findOne({ email })

            if (!user) {
                return res.status(401).json({
                    message:
                        "Invalid email or password",
                })
            }

            const isPasswordCorrect =
                await bcrypt.compare(
                    password,
                    user.password
                )

            if (!isPasswordCorrect) {
                return res.status(401).json({
                    message:
                        "Invalid email or password",
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
                message:
                    "Login successful",

                token,

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            })

        } catch (error) {
            console.error(
                "Login error:",
                error.message
            )

            res.status(500).json({
                message:
                    "Failed to login",
            })
        }
    }
)


// ===============================
// GOOGLE LOGIN
// ===============================

app.post(
    "/api/auth/google",
    async (req, res) => {

        try {
            const { credential } = req.body

            if (!credential) {
                return res.status(400).json({
                    message:
                        "Google credential is required",
                })
            }

            // Verify Google's ID token
            const ticket =
                await googleClient.verifyIdToken({
                    idToken: credential,
                    audience:
                        process.env.GOOGLE_CLIENT_ID,
                })

            const payload =
                ticket.getPayload()

            const googleId = payload.sub
            const email = payload.email
            const name = payload.name

            if (!googleId || !email) {
                return res.status(400).json({
                    message:
                        "Invalid Google account information",
                })
            }

            // Check whether user already exists
            let user =
                await User.findOne({ email })

            // Create new user if necessary
            if (!user) {

                const randomPassword =
                    await bcrypt.hash(
                        `${googleId}-${Date.now()}-${Math.random()}`,
                        10
                    )

                user = await User.create({
                    name,
                    email,
                    password: randomPassword,
                    googleId,
                })

            } else {

                // Link Google account
                // to an existing account
                if (!user.googleId) {
                    user.googleId = googleId

                    await user.save()
                }
            }

            // Create our normal JWT
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
                message:
                    "Google login successful",

                token,

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            })

        } catch (error) {
            console.error(
                "Google login error:",
                error.message
            )

            res.status(401).json({
                message:
                    "Google authentication failed",
            })
        }
    }
)


// ===============================
// START SERVER
// ===============================

const PORT = 5000

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    )
})