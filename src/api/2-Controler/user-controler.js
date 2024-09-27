const { UserModel } = require("../1-Modle/modle");

async function Loginuser(req, res) {
    const { username, password, role } = req.body;

    try {
        // Find user with the provided username and role
        const user = await UserModel.findOne({ username, role });

        if (user) {
            // Compare provided password directly with the one stored in the database
            if (password === user.password) {
                res.status(200).send(user); // If passwords match, send the user data
            } else {
                res.status(401).send({ message: 'Invalid credentials' }); // If password doesn't match
            }
        } else {
            res.status(401).send({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

async function ChangePassword(req, res) {
    const { username, role, currentPassword, newPassword } = req.body;

    try {
        // Find user with the provided username and role
        const user = await UserModel.findOne({ username, role });

        if (user) {
            // Compare provided current password with the one stored in the database
            if (currentPassword === user.password) {
                // Update the password
                user.password = newPassword;
                await user.save();
                res.status(200).send({ message: 'Password updated successfully' });
            } else {
                res.status(401).send({ message: 'Invalid current password' }); // If current password doesn't match
            }
        } else {
            res.status(401).send({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

module.exports = { Loginuser, ChangePassword }; 