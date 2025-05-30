'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Jules RABUS - Chat App</h1>
        <Link href="/chat/create" className="font-medium flex-1">
          Créer un chat
        </Link>
        <Link href="/login" className="font-medium flex-1">
          Se connecter
        </Link>
        <Link href="/register" className="font-medium flex-1">
          S'inscrire
        </Link>
      </div>
    </>
  );
}
