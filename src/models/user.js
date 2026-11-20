import db from './db.js'
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};


//function too find user by email
const findUserByEmail = async (email) =>{
    //as you find user it returns users roles as well. Also after returning user detail in sessionit inncludes user role.
    const query = `
    SELECT u.user_id,u.name, u.email, u.password_hash, r.role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
    `;

    const queryParams = [email];
    const result = await db.query(query, queryParams);

    //if user not found 
    if ( result.rows.length === 0){
        return null; //User not found
    }
    //if user exist 
    return result.rows[0]
}

///function to authnticate user
// verify password: returns true if it matches, false if not
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// authenticate a user: returns the user (without the hash) or null
const authenticateUser = async (email, password) => {
    // 1. Find the user
    const user = await findUserByEmail(email);

    // 2. No user with that email
    if (!user) {
        return null;
    }

    // 3. Check the password against the stored hash
    const passwordMatch = await verifyPassword(password, user.password_hash);

    // 4. Wrong password
    if (!passwordMatch) {
        return null;
    }

    // 5. Remove the hash before returning the user
    delete user.password_hash;
    return user;
};

//function to get all the all users 
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

export { createUser, authenticateUser, getAllUsers };



