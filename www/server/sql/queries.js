
const initOptions = {
    capSQL: true // generate capitalized SQL 
  };
  

const pgp = require('pg-promise')(initOptions);
const connectionString = 'postgres://' + process.env.PGUSER + 
                    ':' + process.env.PGPASSWORD + 
                    '@' + process.env.PGHOST + 
                    ':' + process.env.PGPORT + 
                    '/' + process.env.PGDATABASE;

console.log("Database connection string: " + connectionString);

const db = pgp(connectionString);

async function createUser(username, email, hashed_password) {
    return  db.one('INSERT INTO users (username, email, password, login_attempts) VALUES($1, $2, $3, 0)', 
                [username, email, hashed_password]);
}

async function getUserByUsername(username) {
    return  db.any('SELECT * FROM users WHERE username=$1', [username]);
}

async function getUserByUsernameOrEmail(login) {
    return  db.any('SELECT * FROM users WHERE username=$1 OR email=$2', [login, login]);
}

async function getUserByEmail(email) {
    return  db.any('SELECT * FROM users WHERE email=$1', [email]);
}

async function updateProfile(firstname, lastname, company, email, tel, level, username) {
    return db.one('UPDATE users SET firstname=$1, lastname=$2, company=$3, email=$4, tel=$5, level=$6 WHERE username=?',
                [firstname, lastname, company, email, tel, level, username]);
}

async function updateMyProfile(firstname, lastname, company, email, tel, username) {
    return db.one('UPDATE users SET firstname=$1, lastname=$2, company=$3, email=$4, tel=$5 WHERE username=$6',
    [firstname, lastname, company, email, tel, username]);
}

async function getUsers() {
    return  db.any('SELECT username, firstname, lastname, company, email, tel, level, created, state FROM users');
}

async function deleteUser(username) {
    return db.one('UPDATE users SET state=0 WHERE username = $1', [username]);
}

async function setResetToken (id, token) {
    return db.none("UPDATE users SET reset_token=$1, reset_password_datetime=(CURRENT_TIMESTAMP + INTERVAL '15 minutes') WHERE id = $2", [token, id]);
}

async function getUserByResetToken(token) {
    return  db.any('SELECT * FROM users WHERE reset_token=$1', [token]);
}

async function setNewPassword(id, hashed_password) {
    return db.none('UPDATE users SET password=$1, reset_token=$2 WHERE id=$3',
                [hashed_password, '', id]);
}


// =====================================================================================
// UPGRADE DATABASE
// =====================================================================================
async function upgradeDB() {
    
    let infos = await db.any('SELECT version FROM infos');
    // database always return an array
    
    if (infos.length === 0) {
        // Version 1.0.0
        // Modification du 01/06/2020: on ajoute un champs 'state' à toutes les tables dont on peut supprimer des lignes
        // state = 0 : ligne supprimée
        // state = 1 : ligne valide
        // await db.one('ALTER TABLE machines ADD COLUMN state INT DEFAULT 1');
        // await db.one('ALTER TABLE users ADD COLUMN state INT DEFAULT 1');
        // await db.one("INSERT INTO infos (version) VALUES(?)", ['1.1.0']);
        // console.log("[DB] Upgraded to version 1.1.0");
    }
    // next version: check version with: infos[0].version, length muste be equal to 1

}

module.exports = {
    createUser,
    getUserByUsername,
    getUserByUsernameOrEmail,
    getUserByEmail,
    updateProfile,
    getUsers,
    deleteUser,
    updateMyProfile,
    setResetToken,
    getUserByResetToken,
    setNewPassword,

    // Autres, maintenance ou fonctions plus globales
    upgradeDB
}
