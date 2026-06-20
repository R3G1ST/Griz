const fs = require('fs');
const filePath = '/var/www/Griz/artifacts/grizli/src/pages/Home.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Находим блок с телефоном и вентиляцией
const oldBlock = `{ Icon: Phone, text: contacts.phone },
              { Icon: Wind,  text: "ПРОФ. ВЕНТИЛЯЦИЯ" },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 text-[#D4FF3F] shrink-0" />
                <span className="gn-mono text-[11px] sm:text-[12px] tracking-[0.18em] text-[#F5F1E8]/85 truncate">
                  {text}
                </span>
              </div>
            ))}
          </div>`;

const newBlock = `{ Icon: Phone, text: contacts.phone },
              { Icon: Wind,  text: "ПРОФ. ВЕНТИЛЯЦИЯ" },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 text-[#D4FF3F] shrink-0" />
                <span className="gn-mono text-[11px] sm:text-[12px] tracking-[0.18em] text-[#F5F1E8]/85 truncate">
                  {text}
                </span>
              </div>
            ))}
            {/* Соцсети под телефоном с надписью "Мы в" */}
            {(contacts.instagram || contacts.telegram || contacts.vk) && (
              <div className="flex flex-wrap items-center gap-4 min-w-0 sm:col-span-2 lg:col-span-1 mt-2">
                {contacts.instagram && (
                  <a href={contacts.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] sm:text-[12px] tracking-[0.18em] text-[#F5F1E8]/85 hover:text-[#D4FF3F] transition group uppercase" aria-label="Instagram">
                    <span>Мы в</span>
                    <Instagram className="w-4 h-4 text-[#F5F1E8]/70 group-hover:text-[#D4FF3F]" />
                  </a>
                )}
                {contacts.telegram && (
                  <a href={contacts.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] sm:text-[12px] tracking-[0.18em] text-[#F5F1E8]/85 hover:text-[#D4FF3F] transition group uppercase" aria-label="Telegram">
                    <span>Мы в</span>
                    <Send className="w-4 h-4 text-[#F5F1E8]/70 group-hover:text-[#D4FF3F]" />
                  </a>
                )}
                {contacts.vk && (
                  <a href={contacts.vk} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] sm:text-[12px] tracking-[0.18em] text-[#F5F1E8]/85 hover:text-[#D4FF3F] transition group uppercase" aria-label="VK">
                    <span>Мы в</span>
                    <svg className="w-4 h-4 text-[#F5F1E8]/70 group-hover:text-[#D4FF3F]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm-1.93 14.26h-1.47c-.55 0-.72-.44-1.71-1.44-.86-.83-1.23-.94-1.45-.94-.31 0-.39.09-.39.51v1.31c0 .36-.11.57-1.06.57-1.57 0-3.31-.95-4.53-2.72C.89 11.23.5 9.24.5 8.81c0-.22.09-.42.51-.42h1.47c.38 0 .52.17.67.57.73 2.12 1.95 3.98 2.45 3.98.19 0 .27-.09.27-.57v-2.18c-.06-.99-.58-1.07-.58-1.42 0-.17.14-.34.36-.34h2.31c.31 0 .42.17.42.54v2.93c0 .31.14.42.23.42.19 0 .34-.11.69-.46 1.07-1.2 1.83-3.05 1.83-3.05.1-.22.27-.42.65-.42h1.47c.44 0 .54.22.44.54-.19.89-2.03 3.54-2.03 3.54-.16.26-.22.38 0 .67.16.22.69.67 1.04 1.08.65.74 1.15 1.36 1.28 1.79.14.42-.08.64-.5.64z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>`;

if (!code.includes(oldBlock)) {
  console.log('❌ Блок не найден. Проверьте, что файл не был изменён вручную.');
  process.exit(1);
}

code = code.replace(oldBlock, newBlock);
fs.writeFileSync(filePath, code);
console.log('✅ Соцсети с надписью "Мы в" успешно добавлены!');
