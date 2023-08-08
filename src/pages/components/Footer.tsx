import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  return (
    
<footer className="rounded-lg shadow px-1 bg-white border-gray-200 dark:bg-gray-900">
  <hr />
    <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <Link href="/" className="hover:underline">ฝ่ายพัฒนาระบบ™</Link>. สำนักเทคโนโลยีสารสนเทศ รพ.วิชัยเวชฯ อ้อมน้อย
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        08/08/66
    </ul>
    </div>
</footer>

  );
}

export default Footer;
