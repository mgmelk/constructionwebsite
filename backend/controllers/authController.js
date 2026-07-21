const User = require("../models/User");
const Client = require("../models/Client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const DEFAULT_ADMIN = {
    email: "admin@gmail.com",
    password: "Admin123!"
};

const ensureDefaultAdmin = async (email, password) => {
    if (email !== DEFAULT_ADMIN.email || password !== DEFAULT_ADMIN.password) {
        return null;
    }

    let adminUser = await User.findOne({ email: DEFAULT_ADMIN.email });

    if (!adminUser) {
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

        adminUser = await User.create({
            fullName: "Admin",
            email: DEFAULT_ADMIN.email,
            phone: "+251900000000",
            password: hashedPassword,
            role: "admin"
        });
    } else if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        await adminUser.save();
    }

    return adminUser;
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role || "client"
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );
};

// Register User
const register = async (req, res) => {
    try {
        console.log("Register request body:", req.body);

        const { fullName, companyName, email, phone, password, role, adminSecret, address } = req.body;

        // Basic validation
        if (!fullName || !email || !phone || !password || (role?.trim().toLowerCase() !== "admin" && !companyName)) {
            return res.status(400).json({ message: "fullName, companyName, email, phone and password are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const requestedRole = role?.trim().toLowerCase() === "admin" ? "admin" : "client";

        if (requestedRole === "admin") {
            const secret = process.env.ADMIN_REGISTRATION_SECRET || "Admin@123";
            if (!adminSecret || adminSecret !== secret) {
                return res.status(403).json({ message: "Admin registration requires a valid admin secret" });
            }
        }

        // Check existing user or client by email
        const existingUser = await User.findOne({ email: normalizedEmail });
        const existingClient = await Client.findOne({ email: normalizedEmail });
        if (existingUser || existingClient) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            fullName,
            email: normalizedEmail,
            phone,
            password: hashedPassword,
            role: requestedRole,
        });

        if (requestedRole === "client") {
            try {
                await Client.create({
                    companyName: companyName.trim(),
                    contactPerson: fullName.trim(),
                    email: normalizedEmail,
                    phone: phone.trim(),
                    address: address?.trim() || "",
                });
            } catch (clientError) {
                await User.deleteOne({ _id: user._id });
                throw clientError;
            }
        }

        const saved = await User.findById(user._id).select("-password");
        console.log(`New public registration: ${saved.email} (${saved._id})`);

        const token = generateToken(user);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: saved._id,
                fullName: saved.fullName,
                email: saved.email,
                role: saved.role,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};
const login = async (req, res) => {

    try {

        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();


        // Find user by email
        let user = await User.findOne({ email: normalizedEmail });


        if (!user) {
            user = await ensureDefaultAdmin(normalizedEmail, password);
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }


        const token = generateToken(user);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });


    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;

        res.json({
            message: "Password reset token generated",
            resetUrl
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.token;
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired password reset token"
            });
        }

        const { password } = req.body;
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({
            message: "Password has been reset successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({
            message: "Password changed successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    changePassword
};