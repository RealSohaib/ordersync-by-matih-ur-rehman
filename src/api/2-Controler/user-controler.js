const { UserModel } = require("../1-Modle/modle");

const DisplayUser = async function (req,res) {
    try {
        const data = await UserModel.find();
        res.status(200).json(data);
         console.log("user data is displayed");
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};


async function CreateUser(req, res) {
const { username, password, role,duty,salary,joingindate } = req.body;
    try {
        // Check if user already exists
        const userExists = await UserModel.findOne({ username, role });
        if (userExists) {
            return res.status(409).send({ message: 'User already exists' });
        } else {
            // Create a new user with the plain text password
            const user = new UserModel({ username, password, role,duty,salary,joingindate });
            const savedUser = await user.save();
            return res.status(201).send(savedUser); // Send the saved user data
        }
    } catch (err) {
        console.log(`Internal Server error ${err}`);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
}

async function Loginuser(req, res) {
    const { username, password, role } = req.body;

    try {
        // Find user with the provided username and role
        const user = await UserModel.findOne({ username, role });

        if (user) {
            // Compare provided password with the plain text password stored in the database
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

async function ChangeCredentials(req, res) {
    const { _id, username, newusername, password, newpassword,duty,newduty,salery,newsalery } = req.body;
    try {
        // Find user with the provided _id
        const user = await UserModel.findOne({ _id });

        if (user) 
            {
            // Compare provided current password with the one stored in the database
            if (password === user.password) {
                // Update username and password using findOneAndUpdate
                const updatedUser = await UserModel.findOneAndUpdate(
                    { _id },
                    {
                        username: newusername,
                        password: newpassword,
                        duty:newduty,
                        salery:newsalery
                     },
                    { new: true } // Return the updated document
                );

                if (updatedUser) {
                    res.status(200).send({ message: 'Credentials updated successfully' });
                } else {
                    res.status(404).send({ message: 'User not found' });
                }
            } else {
                res.status(401).send({ message: 'Invalid current password' }); // If current password doesn't match
            }
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

async function DeleteUser(req, res) {
    const { username } = req.body;
    try {
        // Find user with the provided username and delete
        const user = await UserModel.findOneAndDelete({ username });

        if (user) {
            res.status(200).send({ message: 'User deleted successfully' });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch(err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

module.exports = {
    ChangeCredentials,
    CreateUser,
    Loginuser,
    DeleteUser,
    DisplayUser
};