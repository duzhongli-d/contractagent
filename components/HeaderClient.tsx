"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useSession, signIn, signOut } from 'next-auth/react';
import LocaleSwitcher from './LocaleSwitcher';

type Props = {
  userTokens?: number | null;
  dictionary: any;
};

export default function HeaderClient({ userTokens, dictionary }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const locale = pathname.split('/')[1] || 'en';

  const getLocalizedHref = (href: string) => {
    if (href === '/') return `/${locale}`;
    return `/${locale}${href}`;
  };

  const navItems = [
    { href: '/', label: dictionary.nav.home },
    { href: '/liveAnalyser', label: dictionary.nav.liveAnalyser },
    { href: '/upload', label: dictionary.nav.upload },
    { href: '/contact', label: dictionary.nav.contact },
  ];

  return (
    <div className='container flex h-16 items-center justify-between'>
      <Link href={getLocalizedHref('/')}>
        <div className='flex items-center gap-1'>
          <Shield className='h-6 w-6 text-primary' />
          <span className='text-xl font-semibold tracking-tight'>
            Legal<span className='text-primary'>Edge</span>
          </span>
        </div>
      </Link>
      <nav className='hidden md:flex gap-6 text-md'>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={getLocalizedHref(item.href)}
            className={`font-medium transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm ${
              pathname === getLocalizedHref(item.href) ? 'text-foreground' : 'text-muted-foreground'
            }`}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className='flex items-center gap-4'>
        <LocaleSwitcher />
        <div className='hidden md:flex gap-4'>
          {status === 'loading' ? (
            <span className='text-sm text-muted-foreground'>Loading...</span>
          ) : session ? (
            <div className='flex items-center gap-4'>
              <span className='text-sm'>{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className='text-sm text-muted-foreground hover:text-foreground'
              >
                {dictionary.nav.signOut}
              </button>
            </div>
          ) : (
            <>
              <Button
                variant='ghost'
                onClick={() => signIn()}
                className='text-sm'
              >
                {dictionary.nav.signOut}
              </Button>
              <Button
                onClick={() => signIn()}
                className='text-sm'
              >
                {dictionary.nav.signUp}
              </Button>
            </>
          )}
        </div>
        {userTokens && <p>{userTokens} {dictionary.nav.demo}</p>}
        <Link href={getLocalizedHref('/buytokens')}>
          <Button className='hidden md:flex focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>{dictionary.nav.buyTokens}</Button>
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant='outline' size='icon' className='md:hidden'>
              <Menu className='h-6 w-6' />
              <span className='sr-only'>{dictionary.nav.openMenu}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='right' className='p-2'>
            <SheetTitle className='text-5xl'>LegalEdge</SheetTitle>
            <nav className='flex flex-col gap-4'>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={getLocalizedHref(item.href)}
                  className={`text-lg font-medium transition-colors hover:text-foreground border-b-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm ${
                    pathname === getLocalizedHref(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ))}
              {status === 'loading' ? (
                <span className='text-sm text-muted-foreground'>Loading...</span>
              ) : session ? (
                <button
                  onClick={() => signOut()}
                  className='text-left text-lg font-medium text-muted-foreground hover:text-foreground'
                >
                  {dictionary.nav.signOut}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => signIn()}
                    className='text-left text-lg font-medium text-muted-foreground hover:text-foreground'
                  >
                    {dictionary.nav.signOut}
                  </button>
                  <button
                    onClick={() => signIn()}
                    className='text-left text-lg font-medium text-muted-foreground hover:text-foreground'
                  >
                    {dictionary.nav.signUp}
                  </button>
                </>
              )}
              <Link href={getLocalizedHref('/buytokens')} className='mt-6'>
                <Button className='w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>{dictionary.nav.buyTokens}</Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}