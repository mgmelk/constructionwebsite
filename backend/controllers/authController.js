const User = require("../models/User");
const Client = require("../models/Client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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
                message: "No account found with this email address."
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

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const emailSubject = "Password Reset Request - WEMASTER Construction";
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #081924; margin-top: 0;">WEMASTER Construction</h2>
            <hr style="border: none; border-top: 2px solid #f7b500; margin-bottom: 20px;" />
            <h3 style="color: #081924;">Password Reset Request</h3>
            <p style="color: #444; font-size: 15px;">Hello <strong>${user.fullName || 'User'}</strong>,</p>
            <p style="color: #444; font-size: 15px;">We received a request to reset the password for your account associated with <strong>${user.email}</strong>.</p>
            <p style="color: #444; font-size: 15px;">Click the button below to choose a new password. This reset link will expire in <strong>1 hour</strong>.</p>
            <div style="margin: 28px 0; text-align: center;">
              <a href="${resetUrl}" target="_blank" style="background-color: #f7b500; color: #081924; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 8px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 13px; color: #666;">If the button above does not work, copy and paste this link into your browser:</p>
            <p style="font-size: 13px; color: #0066cc; word-break: break-all;">${resetUrl}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 16px;" />
            <p style="font-size: 12px; color: #888; text-align: center;">If you did not request this change, you can safely ignore this email.</p>
          </div>
        `;

        await sendEmail({
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
          text: `Reset your password at: ${resetUrl}`
        });

        res.json({
            message: `A password reset link has been sent to ${user.email}. Please check your email inbox to reset your password.`
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