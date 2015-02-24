

# Currency Fair app

This is the first time i did something with node.js, mongo and socket.io. There is a basic ip throttling.
Used Express and kue for handling jobs.
Currently there are 3 app runining
app.js -> handles the POST call and the frontend
consumer.js -> handles jobs for adding transactions and 
random-call.js -> make a call every two seconds

Front end is socketed with new transactions added and trending currencies updated every time the job is done. Trends is the last ten minutes

