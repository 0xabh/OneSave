import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());


app.get('/', (req, res) => {
    console.log("this api is working")
    return res.json({message: 'Hello World!'});
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});



