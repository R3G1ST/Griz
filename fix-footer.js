const fs = require('fs');
const filePath = '/var/www/Griz/artifacts/grizli/src/components/Footer.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Добавляем импорты иконок
code = code.replace(
  'import { Phone, MapPin, Send } from "lucide-react";',
  'import { Phone, MapPin, Send, Instagram } from "lucide-react";'
);

// Находим блок с Telegram и добавляем Instagram и VK после него
const telegramBlock = `{contacts.telegram && (
              <li className="flex items-start gap-2">
                <Send className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Telegram</a>
              </li>
            )}`;

const socialBlock = `{contacts.telegram && (
              <li className="flex items-start gap-2">
                <Send className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Telegram</a>
              </li>
            )}
            {contacts.instagram && (
              <li className="flex items-start gap-2">
                <Instagram className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href={contacts.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
              </li>
            )}
            {contacts.vk && (
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm-1.93 14.26h-1.47c-.55 0-.72-.44-1.71-1.44-.86-.83-1.23-.94-1.45-.94-.31 0-.39.09-.39.51v1.31c0 .36-.11.57-1.06.57-1.57 0-3.31-.95-4.53-2.72C.89 11.23.5 9.24.5 8.81c0-.22.09-.42.51-.42h1.47c.38 0 .52.17.67.57.73 2.12 1.95 3.98 2.45 3.98.19 0 .27-.09.27-.57v-2.18c-.06-.99-.58-1.07-.58-1.42 0-.17.14-.34.36-.34h2.31c.31 0 .42.17.42.54v2.93c0 .31.14.42.23.42.19 0 .34-.11.69-.46 1.07-1.2 1.83-3.05 1.83-3.05.1-.22.27-.42.65-.42h1.47c.44 0 .54.22.44.54-.19.89-2.03 3.54-2.03 3.54-.16.26-.22.38 0 .67.16.22.69.67 1.04 1.08.65.74 1.15 1.36 1.28 1.79.14.42-.08.64-.5.64z"/>
                </svg>
                <a href={contacts.vk} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">ВКонтакте</a>
              </li>
            )}`;

code = code.replace(telegramBlock, socialBlock);

fs.writeFileSync(filePath, code);
console.log('✅ Footer успешно исправлен!');
