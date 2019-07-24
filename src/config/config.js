process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';
process.env.SENDGRID_API_KEY = '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';


//process.env.URLDB = 'mongodb://localhost:27017/coursesManager'

let urlDB
if (process.env.NODE_ENV === 'local') {
	urlDB = 'mongodb://localhost:27017/coursesManager';
} else {
	urlDB = 'mongodb+srv://jca-admin:jca87admin@cluster0-zfyfv.mongodb.net/coursesManager?retryWrites=true';
}

process.env.URLDB = urlDB
