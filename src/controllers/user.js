import bcrypt from 'bcrypt';
import { createUser, authenticateUser} from '../models/user.js';
import { getAllUsers } from '../models/user.js';


//conntroller to display registration form
const showUserRegistrationForm = async (req, res) => {
    res.render( 'register', {title: 'Register'});
};

const processUserRegistrationForm = async ( req, res) => {
    const { name, email, password } = req.body;

    try{
        //hashing password before storing it
         //salt to determine the number of the times the hasing algorithm runs
         const salt = await bcrypt.genSalt(10);
         const passwordHash = await bcrypt.hash(password, salt);

         //create user in database 
         const userId = await createUser(name, email, passwordHash);
        
         //flash message to show registration success 
         req.flash('success', 'Registration successful! Please log in.')
         //redirecct to home after successful registration 
         res.redirect('/')
    } catch (error){
        console.error('Error registering user: ',error);
        req.flash('error', 'An error occured during registration. Please try again.' )
        res.redirect('/register');
    }
};

//show the login page 
const showLoginForm = async (req, res) => {
    res.render('login', {title : 'Login'});
};

//process the login form
const processLoginForm = async(req, res) => {
    const {email, password} = req.body;
    try{
        const user = await authenticateUser(email, password);
        //if user is available store 7details in session 
        if (user){
            //store user details in session
            req.session.user = user;
            req.flash('success', 'Login was successful');
            if(res.locals.NODE_ENV === 'development'){
                console.log('User logged in successful', user);
            };
            res.redirect('/dashboard');
        } else {
            // if user is null
            req.flash('error', 'Invalid email or password');
            res.redirect('/login');
        }
    }catch(error){
        console.error('Error logging in user: ',error);
        req.flash('error', 'An error occured during login. Please try again.' )
        res.redirect('/login');
    };
};

//Controller function for logout
const processLogout = async (req, res) => {
    if (req.session.user){
        delete req.session.user;
    };
    req.flash('success', 'Logout successful');
    res.redirect('/login');
};

//controller function ( requiring user to login first to access other pages )
const requireLogin = ( req, res, next) => {
    if (!req.session || !req.session.user){
        req.flash('error', "You must be logged in to access this page.")
        return res.redirect('/login');
    };
    next();
};

//show dashboard
const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};



const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', { title: 'Registered Users', users });
};

export{ showUserRegistrationForm, processUserRegistrationForm,
     processLoginForm, showLoginForm, processLogout, 
     requireLogin, showDashboard, requireRole, showUsersPage};