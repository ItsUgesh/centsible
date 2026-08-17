const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const prisma = require('./db')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value

      // Check if user already exists
      let user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        // New user — create them (Google already verified the email)
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName,
            avatarUrl: profile.photos[0]?.value,
            provider: 'google',
            emailVerified: true
          }
        })
      }

      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  }
))

module.exports = passport