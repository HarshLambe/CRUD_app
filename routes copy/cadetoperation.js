const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validatecadetreg } = require('../middleware'); // Import the CadetregSchema from your schema file

const Cadetreg = require('../models/cadetreg');







// // Display form to add new cadet
router.get('/cadetform', isLoggedIn, (req, res) => {
    res.render('cadetregsiter/add_cadet');
});

// Add new cadet
router.post('/cadetform', isLoggedIn, validatecadetreg, catchAsync(async (req, res) => {

    const cadetreg = new Cadetreg(req.body);
    cadetreg.author = req.user._id;
    await cadetreg.save();
    req.flash('success', 'Successfully registered new cadet!');
    res.redirect('/index');
}));


router.get('/index', isLoggedIn, async (req, res) => {
    try {
        // Define the query criteria
        const queryCriteria = { author: req.user._id };

        // Execute the query
        const users = await Cadetreg.find(queryCriteria).exec();

        res.render('index', {
            title: 'Home Page',
            users: users,
            message: req.flash('message'), // Assuming you are using flash messages
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/dashboard', isLoggedIn, async (req, res) => {
    try {
        // Ensure user is logged in
        if (!req.user) {
            return res.redirect('/login'); // Redirect to login if user is not authenticated
        }

        // Query the database for the specific user's registration statistics
        const totalRegistrations = await Cadetreg.countDocuments({ author: req.user._id });
        const maleRegistrations = await Cadetreg.countDocuments({ author: req.user._id, gender: 'Male' });
        const femaleRegistrations = await Cadetreg.countDocuments({ author: req.user._id, gender: 'Female' });

        // Render the dashboard page and pass data
        res.render('dashboard', {
            title: 'Dashboard',
            totalRegistrations: totalRegistrations,
            maleRegistrations: maleRegistrations,
            femaleRegistrations: femaleRegistrations
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.get('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const id = req.params.id;

        // Find the user in the database by ID using the User model
        const user = await Cadetreg.findById(id).exec();

        // Check if the user with the specified ID was found
        if (!user) {
            // If no user was found, redirect to the home page ('/')
            req.flash("danger", 'User was  not found');
            return res.redirect('/index');


        }

        // If the user was found, render the 'edit_user' view with the user data
        res.render('edit_cadet', {
            title: 'Edit User',
            user: user,
        });
    } catch (error) {
        // Handle any errors that may occur during the process
        console.error(error);
        res.redirect('/index');
    }
});


router.post('/update/:id', isLoggedIn, async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const userId = req.params.id;

        // Find the user by ID in the database
        const user = await Cadetreg.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Update user data with the form inputs
        const result = await Cadetreg.findByIdAndUpdate(userId, {

            regimentno: req.body.regimentno,
            id: req.body.id,
            year: req.body.year,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            Bloodgroup: req.body.Bloodgroup,
            gender: req.body.gender,
            fathername: req.body.fathername,
            mothername: req.body.mothername,
            DOB: req.body.DOB,
            caste: req.body.caste,
            Address: req.body.address,
            parentmobno: req.body.parentmobno,
            aadharno: req.body.aadharno,

        }).exec();


        req.flash('success', 'User updated successfully');



        // Redirect to the user's profile page or any other appropriate page
        res.redirect('/index');
    } catch (error) {
        // Handle any errors that may occur during the process
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



router.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        let id = req.params.id;

        // Find the user by ID and delete it
        const result = await Cadetreg.findOneAndDelete({ _id: id });

        if (!result) {
            // If the user was not found, inform the user

            return res.json({ message: "User not found", type: "danger" });
        }

        // If the user had an image, delete it from the 'uploads' directory


        // Inform the user about the successful deletion
        req.flash('success', 'User deleted successfully');

        res.redirect('/index');
    } catch (error) {
        // Handle unexpected errors
        console.error("Error deleting user:", error);
        res.json({ message: "Internal server error", type: "danger" });
    }
});











module.exports = router;





































// // router.get('/add', (req, res) => {
// //     res.render('add_cadet', { title: 'Add user' })
// // })

// // router.get('/edit/:id', async (req, res) => {
// //     try {
// //         // Extract the user ID from the request parameters
// //         let id = req.params.id;

// //         // Find the user in the database by ID using the User model (assuming it's defined)
// //         const user = await Cadets.findById(id).exec();

// //         // Check if the user with the specified ID was found
// //         if (!user) {
// //             // If no user was found, redirect to the home page ('/')
// //             return res.redirect('/');
// //         }

// //         // If the user was found, render the 'edit_users' view with the user data
// //         res.render('edit_users', {
// //             title: "edit user",
// //             user: user,
// //         });
// //     } catch (error) {
// //         // Handle any errors that may occur during the process
// //         console.error(error);
// //         res.redirect('/');
// //     }
// // });

// // //update
// // router.post('/update/:id', upload, async (req, res) => {
// //     try {
// //         let id = req.params.id;
// //         let newImage = '';

// //         if (req.file) {
// //             newImage = req.file.filename;

// //             // Properly concatenate the path for unlinking the old image
// //             try {
// //                 fs.unlinkSync("./uploads/" + req.body.old_image);
// //             } catch (err) {
// //                 console.error("Error deleting old image:", err);
// //                 // Inform the user about the error
// //                 return res.json({ message: "Error deleting old image", type: "danger" });
// //             }
// //         } else {
// //             newImage = req.body.old_image;
// //         }

// //         // Update the user in the database
// //         const result = await Cadets.findByIdAndUpdate(id, {
// //             name: req.body.name,
// //             email: req.body.email,
// //             phone: req.body.phone,
// //             image: newImage,
// //         }).exec();

// //         if (!result) {
// //             // If the user was not found, inform the user
// //             return res.json({ message: "User not found", type: "danger" });
// //         }

// //         // Inform the user about the successful update
// //         req.session.message = {
// //             type: 'success',
// //             message: 'User updated successfully',
// //         };

// //         res.redirect('/');
// //     } catch (error) {
// //         // Handle unexpected errors
// //         console.error("Error updating user:", error);
// //         res.json({ message: "Internal server error", type: "danger" });
// //     }
// // });


// // //delete
// // router.get('/delete/:id', async (req, res) => {
// //     try {
// //         let id = req.params.id;

// //         // Find the user by ID and delete it
// //         const result = await Cadets.findOneAndDelete({ _id: id });

// //         if (!result) {
// //             // If the user was not found, inform the user

// //             return res.json({ message: "User not found", type: "danger" });
// //         }

// //         // If the user had an image, delete it from the 'uploads' directory
// //         if (result.image !== '') {
// //             try {
// //                 fs.unlinkSync('./uploads/' + result.image);
// //             } catch (err) {
// //                 console.error("Error deleting user image:", err);
// //                 // Inform the user about the error
// //                 return res.json({ message: "Error deleting user image", type: "danger" });
// //             }
// //         }

// //         // Inform the user about the successful deletion
// //         req.session.message = {
// //             type: 'info',
// //             message: 'User deleted successfully',
// //         };

// //         res.redirect('/');
// //     } catch (error) {
// //         // Handle unexpected errors
// //         console.error("Error deleting user:", error);
// //         res.json({ message: "Internal server error", type: "danger" });
// //     }
// // });


module.exports = router;