const fs = require('fs');
const path = '/var/www/Griz/artifacts/api-server/src/routes/site.ts';
let code = fs.readFileSync(path, 'utf8');

// Добавляем console.log в PUT /menu/:id
const oldPut = `router.put("/menu/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);`;

const newPut = `router.put("/menu/:id", requireAdmin, async (req: Request, res: Response) => {
  console.log('PUT /menu/:id received body:', JSON.stringify(req.body));
  try {
    const id = Number(req.params.id);`;

if (code.includes(oldPut)) {
  code = code.replace(oldPut, newPut);
  fs.writeFileSync(path, code);
  console.log('✅ Логирование добавлено в PUT');
} else {
  console.log('❌ Не удалось найти PUT');
}

// Добавляем console.log в POST /menu
const oldPost = `router.post("/menu", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { section, category, name, description = "", price, sortOrder = 0, isActive = 1, isFeatured = 0 } = req.body ?? {};`;

const newPost = `router.post("/menu", requireAdmin, async (req: Request, res: Response) => {
  console.log('POST /menu received body:', JSON.stringify(req.body));
  try {
    const { section, category, name, description = "", price, sortOrder = 0, isActive = 1, isFeatured = 0 } = req.body ?? {};`;

if (code.includes(oldPost)) {
  code = code.replace(oldPost, newPost);
  fs.writeFileSync(path, code);
  console.log('✅ Логирование добавлено в POST');
} else {
  console.log('❌ Не удалось найти POST');
}
