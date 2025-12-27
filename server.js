import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// JSON file to persist paper data
const DATA_FILE = path.join(__dirname, 'papers.json');

const getPapersData = () => {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  return [
    { id: '1', college: 'Harvard University', degree: 'B.Sc', stream: 'Computer Science', subject: 'Data Structures', year: '1', content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: 'CS_101_2023.pdf' },
    { id: '2', college: 'Stanford University', degree: 'M.Tech', stream: 'Artificial Intelligence', subject: 'Neural Networks', year: '2', content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: 'AI_Advanced_2024.pdf' },
    { id: '3', college: 'MIT', degree: 'B.E', stream: 'Electronics', subject: 'Digital Circuits', year: '3', content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: 'Digital_Logic_2022.pdf' }
  ];
};

const savePapersData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// API Endpoints
app.get('/api/papers', (req, res) => {
  const data = getPapersData();
  res.json(data);
});

app.post('/api/papers', upload.single('pdf'), (req, res) => {
  try {
    const { college, degree, stream, subject, year, content: urlContent } = req.body;
    let paperContent = urlContent;
    let fileName = '';

    if (req.file) {
      paperContent = `http://localhost:${PORT}/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
    }

    const newPaper = {
      id: Date.now().toString(),
      college,
      degree,
      stream,
      subject,
      year,
      content: paperContent,
      fileName
    };

    const papers = getPapersData();
    papers.unshift(newPaper);
    savePapersData(papers);

    res.status(201).json(newPaper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/papers/:id', (req, res) => {
  const { id } = req.params;
  const papers = getPapersData();
  const filtered = papers.filter(p => p.id !== id);
  
  // Optionally delete the physical file if it exists
  const paper = papers.find(p => p.id === id);
  if (paper && paper.content.includes('/uploads/')) {
    const filename = paper.content.split('/').pop();
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  savePapersData(filtered);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend Server running at http://localhost:${PORT}`);
});

