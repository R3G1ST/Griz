const fs = require('fs');

const filePath = '/var/www/Griz/artifacts/grizli/src/pages/Menu.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Добавляем проверку menu-домена после getTableNumber
const oldGetTable = `function getTableNumber(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("table");
}`;

const newGetTable = `function getTableNumber(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("table");
}

function isMenuDomain(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.includes("menu-grizzly");
}`;

code = code.replace(oldGetTable, newGetTable);

// Теперь заменяем return в функции Menu
const oldReturn = `  return (
    <NeonPage
      eyebrow="/ MENU · LIVE FROM CMS"
      title={<>МЕНЮ <span className="gn-neon">ГРИЗЛИ</span></>}
      lead="Всё для идеального вечера — от чаши до последнего глотка. Меню обновляется регулярно, цены актуальны."
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-16">`;

const newReturn = `  const menuContent = (
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-16">`;

code = code.replace(oldReturn, newReturn);

// Заменяем закрывающий NeonPage
const oldEnd = `        <div className="mt-8 gn-mono text-[10px] tracking-[0.24em] text-[#F5F1E8]/40 text-center">
          ЦЕНЫ В РУБЛЯХ · МЕНЮ МОЖЕТ МЕНЯТЬСЯ — УТОЧНЯЙТЕ У МАСТЕРА
        </div>
      </div>
    </NeonPage>
  );
}`;

const newEnd = `        <div className="mt-8 gn-mono text-[10px] tracking-[0.24em] text-[#F5F1E8]/40 text-center">
          ЦЕНЫ В РУБЛЯХ · МЕНЮ МОЖЕТ МЕНЯТЬСЯ — УТОЧНЯЙТЕ У МАСТЕРА
        </div>
      </div>
  );

  if (isMenuDomain()) {
    return (
      <main className="min-h-screen bg-black text-white gn-root gn-sans">
        {menuContent}
      </main>
    );
  }

  return (
    <NeonPage
      eyebrow="/ MENU · LIVE FROM CMS"
      title={<>МЕНЮ <span className="gn-neon">ГРИЗЛИ</span></>}
      lead="Всё для идеального вечера — от чаши до последнего глотка. Меню обновляется регулярно, цены актуальны."
    >
      {menuContent}
    </NeonPage>
  );
}`;

code = code.replace(oldEnd, newEnd);

fs.writeFileSync(filePath, code);
console.log('✅ Menu.tsx обновлён для menu-режима');
