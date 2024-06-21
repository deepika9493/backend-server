import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(bodyParser.json());

interface Submission {
    name: string;
    email: string;
    phone: string;
    github_link: string;
    stopwatch_time: string;
}

let submissions: Submission[] = [];

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Submission API');
});

app.get('/ping', (req, res) => {
    res.send(true);
});

app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const newSubmission: Submission = { name, email, phone, github_link, stopwatch_time };
    submissions.push(newSubmission);
    fs.writeFileSync('db.json', JSON.stringify(submissions, null, 2));
    res.send('Submission saved');
});

app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string);
    if (index >= 0 && index < submissions.length) {
        res.json(submissions[index]);
    } else {
        res.status(404).send('Submission not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    if (fs.existsSync('db.json')) {
        submissions = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
    }
});
