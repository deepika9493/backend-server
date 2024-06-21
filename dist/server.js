"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
let submissions = [];
// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Submission API');
});
app.get('/ping', (req, res) => {
    res.send(true);
});
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    submissions.push(newSubmission);
    fs_1.default.writeFileSync('db.json', JSON.stringify(submissions, null, 2));
    res.send('Submission saved');
});
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index);
    if (index >= 0 && index < submissions.length) {
        res.json(submissions[index]);
    }
    else {
        res.status(404).send('Submission not found');
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    if (fs_1.default.existsSync('db.json')) {
        submissions = JSON.parse(fs_1.default.readFileSync('db.json', 'utf-8'));
    }
});
