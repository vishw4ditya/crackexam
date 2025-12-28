import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Paper Schema
const paperSchema = new mongoose.Schema({
  college: String,
  degree: String,
  stream: String,
  subject: String,
  year: String,
  fileName: String,
  content: String, // Cloudinary URL
  cloudinaryPublicId: String,
  createdAt: { type: Date, default: Date.now }
});

const Paper = mongoose.model('Paper', paperSchema);

// Serve static files from the 'dist' directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use(cors());
app.use(express.json());

// Configure Multer for memory storage
const storage = multer.memoryStorage();
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

// Serve PDF from Cloudinary with proper headers
// Use query parameter for better mobile compatibility (handles slashes in public IDs)
app.get('/api/pdf', async (req, res) => {
  try {
    const publicId = req.query.id || req.query.publicId;
    
    if (!publicId) {
      return res.status(400).json({ error: 'Public ID is required' });
  }

    // Decode the public ID (it may be URL-encoded)
    const decodedPublicId = decodeURIComponent(publicId);
    
    // Generate Cloudinary URL
    const pdfUrl = cloudinary.url(decodedPublicId, {
      resource_type: 'raw',
      secure: true
    });

    // Parse URL to determine protocol
    const urlObj = new URL(pdfUrl);
    const client = urlObj.protocol === 'https:' ? https : http;

    // Stream PDF from Cloudinary to client
    client.get(pdfUrl, (cloudinaryRes) => {
      if (cloudinaryRes.statusCode !== 200) {
        return res.status(404).send('PDF not found');
      }

      // Set proper headers for PDF viewing (mobile compatible)
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Accept-Ranges', 'bytes');
      
      // Pipe the response
      cloudinaryRes.pipe(res);
    }).on('error', (error) => {
      console.error('Error fetching PDF from Cloudinary:', error);
      res.status(500).json({ error: 'Failed to load PDF' });
    });
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Failed to load PDF' });
  }
});


// API Endpoints

app.get('/api/papers', async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    // Transform to match frontend expectations
    const transformed = papers.map(p => ({
      id: p._id,
      college: p.college,
      degree: p.degree,
      stream: p.stream,
      subject: p.subject,
      year: p.year,
      fileName: p.fileName,
      content: p.cloudinaryPublicId ? `/api/pdf?id=${encodeURIComponent(p.cloudinaryPublicId)}` : p.content
    }));
    res.json(transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/papers', upload.single('pdf'), async (req, res) => {
  try {
    const { college, degree, stream, subject, year } = req.body;
    let cloudinaryUrl = '';
    let cloudinaryPublicId = '';
    let fileName = '';

    if (req.file) {
      fileName = req.file.originalname;
      
      // Upload to Cloudinary using a Promise to handle the stream
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw', // Use 'raw' for PDF to preserve format
            folder: 'crackexam_pdfs'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      cloudinaryUrl = result.secure_url;
      cloudinaryPublicId = result.public_id;
    }

    const newPaper = new Paper({
      college,
      degree,
      stream,
      subject,
      year,
      fileName,
      content: cloudinaryUrl,
      cloudinaryPublicId
    });

    await newPaper.save();

    res.status(201).json({
      ...newPaper.toObject(),
      id: newPaper._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/papers/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    // Delete from Cloudinary if public ID exists
    if (paper.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(paper.cloudinaryPublicId, { resource_type: 'raw' });
    }

    await Paper.findByIdAndDelete(req.params.id);
  res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle client-side routing: serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server running at http://localhost:${PORT}`);
});
