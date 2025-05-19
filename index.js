const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session') (session)
const { engine } = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/addModerator')
const authRoutes = require('./routes/auth')
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
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
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
            "'unsafe-inline'", // Для inline-скриптов Materialize
            "'unsafe-eval'"    // Для динамического выполнения кода (например, jQuery)
        ],
        styleSrc: [
            "'self'", 
            "https://cdnjs.cloudflare.com", 
            "'unsafe-inline'", // Для inline-стилей Materialize
            "https://fonts.googleapis.com" // Если используете Google Fonts
        ],
        fontSrc: [
            "'self'", 
            "https://fonts.gstatic.com", 
            "https://cdnjs.cloudflare.com"
        ],
        imgSrc: ["'self'", "data:"], // Разрешаем data: URI для изображений
        connectSrc: ["'self'"]
    }
}))
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes);
app.use('/addModerator', addRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler)

const PORT = process.env.PORT || 4000;

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI);
        app.listen(PORT, () => {
            console.log('server is running on port: ', PORT);
        });
    } catch (e) {
        console.log(e);
    }
}

start();