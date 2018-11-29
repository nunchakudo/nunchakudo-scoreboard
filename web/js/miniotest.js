var Minio = require('minio')

// Instantiate the minio client with the endpoint
// and access keys as shown below.
var minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    ssl: false,
    accessKey: 'KVJ3O57LGOI4E2L0G8UN',
    secretKey: '7+usBBsTsg62Cp9+0aJAy95EvlKV+ADKFKA+Tbh+'
});

minioClient.bucketExists('nuncha', function(err, exists) 
            {
				if (err) {
					return console.log(err)
				}
				if (exists) {
					console.log("Bucket exists.")
				}
			});
