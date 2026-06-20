import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://griz:griz_password_2024@localhost:5432/griz_db",
});

const router = Router();

// Настраиваем multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public/images/categories');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const categoryKey = req.params.categoryKey;
    const ext = path.extname(file.originalname);
    cb(null, `${categoryKey}${ext}`);
  }
});

const upload = multer({ storage });

// POST /upload-category-image/:categoryKey - загрузить изображение категории
router.post("/upload-category-image/:categoryKey", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const categoryKey = req.params.categoryKey;
    const imageUrl = `/images/categories/${req.file.filename}`;

    // Обновляем путь в БД
    await pool.query(
      'UPDATE menu_categories SET image = $1, updated_at = NOW() WHERE key = $2',
      [imageUrl, categoryKey]
    );

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
