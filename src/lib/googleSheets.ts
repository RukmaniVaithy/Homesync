import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

export async function getGoogleSheet() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SPREADSHEET_ID) {
    throw new Error('Missing Google Sheets credentials in .env.local');
  }

  // Format the private key to handle literal \n if they were placed as a string
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

  const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, jwt);
  await doc.loadInfo(); 
  
  await ensureSheetsExist(doc);

  return doc;
}

async function ensureSheetsExist(doc: GoogleSpreadsheet) {
  const requiredSheets = [
    { title: 'Pantry', headers: ['id', 'name', 'category', 'status', 'lastUpdatedBy'] },
    { title: 'Finances', headers: ['id', 'name', 'amount', 'dueDate', 'status', 'lastUpdatedBy'] },
    { title: 'Maintenance', headers: ['id', 'title', 'date', 'technician', 'nextDueDate'] },
    { title: 'Activity', headers: ['id', 'user', 'action', 'timestamp'] }
  ];

  let modified = false;

  for (const req of requiredSheets) {
    let sheet = doc.sheetsByTitle[req.title];
    if (!sheet) {
      sheet = await doc.addSheet({ title: req.title, headerValues: req.headers });
      
      // Seed with initial mock data
      try {
        const dataDir = path.join(process.cwd(), 'src/data');
        const mockFile = req.title === 'Finances' ? 'bills.json' : req.title.toLowerCase() + '.json';
        if (fs.existsSync(path.join(dataDir, mockFile))) {
          let rawData = fs.readFileSync(path.join(dataDir, mockFile), 'utf8');
          const user1 = process.env.NEXT_PUBLIC_USER1_NAME || 'User 1';
          const user2 = process.env.NEXT_PUBLIC_USER2_NAME || 'User 2';
          rawData = rawData.replace(/\{\{USER1\}\}/g, user1);
          rawData = rawData.replace(/\{\{USER2\}\}/g, user2);
          
          const initialData = JSON.parse(rawData);
          if (initialData.length > 0) {
            await sheet.addRows(initialData);
          }
        }
      } catch (e) {
        console.error(`Failed to seed ${req.title}`, e);
      }
      modified = true;
    }
  }

  if (modified) {
    await doc.loadInfo();
  }
}
