'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div className="HomeWrapper min-h-screen">
      <header className="HomeHeader sticky top-0 left-0 flex items-center w-full h-hd px-8 bg-white shadow-sm">
        <h3 className="text-lg font-semibold"></h3>
        <Image
          aria-hidden
          src="/you.jpg"
          alt="User avatar"
          className="flex-none ml-auto w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
      </header>
      <main className="HomeMain grid grid-rows-[264px_1fr] w-full">
        <div className="HomeMainTop flex flex-col justify-center items-center w-full h-full bg-amber-200">
          <div className="Search w-full text-center">
            <input
              type="text"
              placeholder="输入关键词搜索"
              className="w-1/3 h-10 px-14 rounded-md focus:outline-none"
            />
          </div>
        </div>
        <div className="HomeMainContent w-full">Main Content</div>
      </main>
    </div>
  );
}
