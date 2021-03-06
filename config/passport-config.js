const locStrat = require('passport-local').Strategy
let bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        
        if(user === undefined || user === null){
            return done(null, false, { message: 'No user with that email' });
        }

        try {
            if(await bcrypt.compare(password, user.hashPassword)) {
                return done(null, user)
            }else {
                return done(null, false, { message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new locStrat( {usernameField: 'email'}, authenticateUser ));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id))
    });
}

module.exports = initialize;