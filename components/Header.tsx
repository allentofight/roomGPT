"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col xs:flex-row justify-between items-center w-full mt-3 border-b pb-7 sm:px-4 px-2 border-gray-500 gap-2">
      <Link href="/" className="flex space-x-2">
        <Image
          alt="header text"
          src="/couch.svg"
          className="sm:w-10 sm:h-10 w-9 h-9"
          width={24}
          height={24}
        />
        <h1 className="sm:text-3xl text-xl font-bold ml-2 tracking-tight">
          求未梦幻装修
        </h1>
      </Link>
      <div className="flex items-center space-x-4">
        <Link className="border-r border-gray-300 pr-4  space-x-2 hover:text-blue-400 transition hidden sm:flex" href="/buy-credits">
          <div className="hover:text-blue-500 font-bold underline">价格</div>
        </Link>

        <button className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground py-2 px-4 relative h-10 w-10 rounded-full" type="button" id="radix-:r2:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
          <span className="relative flex shrink-0 overflow-hidden rounded-full h-10 w-10">
            <img className="aspect-square h-full w-full" alt="umar faruk lions" src="https://b1.beisheng.com/common/starchain_self_image/2307/26/unnamed.png" />
          </span>
        </button>
      </div>
    </header>
  );
}
