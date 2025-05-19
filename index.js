const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const helmet = require('helmet')
const compression = require('compression')
const session = require('express-session')
const { engine } = require('express-handlebars')
const homeRoutes = require('./routes/home')
const moderatorRoutes = require('./routes/moderator')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/user')
const vacanciesRoutes = require('./routes/vacancies')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const keys = require('./keys')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')


const app = express();


app.engine('hbs', engine({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars), 
    helpers: require('./utils/hbs-helpers')
}));
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.static(path.join(`C:/Users/Heaven/Desktop/Coursa4/TestOtherDBConnection/node.js`, 'public')))
const imagesDir = path.join(`C:/Users/Heaven/Desktop/Coursa4/TestOtherDBConnection/node.js`, 'images')
app.use('/images', express.static(imagesDir))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(csrf())
app.use(flash())
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'", 
            "https://cdnjs.cloudflare.com", 
            "'unsafe-inline'", 
            "'unsafe-eval'" 
        ],
        styleSrc: [
            "'self'", 
            "https://cdnjs.cloudflare.com", 
            "'unsafe-inline'",
            "https://fonts.googleapis.com" 
        ],
        fontSrc: [
            "'self'", 
            "https://fonts.gstatic.com", 
            "https://cdnjs.cloudflare.com"
        ],
        imgSrc: [
            "'self'", 
            "data:",
            "http://localhost:3000" 
        ],
        connectSrc: [
            "'self'",
            "http://localhost:3000"
        ] 
    }
}))
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes);
app.get('/', (req, res) => {
    res.redirect('/auth/login')
})
app.use('/auth', authRoutes)
app.use('/moderator', moderatorRoutes)
app.use('/vacancies', vacanciesRoutes)
app.use('/user', usersRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log('server is running on port: ', PORT)
})
