process.env.PORT = process.env.PORT || 3000;
//process.env.URLDB = 'mongodb://localhost:27017/coursesManager'

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/coursesManager';
}
else
	urlDB = 'mongodb+srv://jca-admin:jca87admin@cluster0-zfyfv.mongodb.net/coursesManager?retryWrites=true'
}

process.env.URLDB = urlDB
