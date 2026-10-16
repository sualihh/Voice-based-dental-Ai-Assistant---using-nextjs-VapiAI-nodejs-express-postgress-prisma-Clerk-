import { SignInButton, SignUpButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'

function Header() {
  return (
    <nav className='fixed top-0 right-0 left-0 z-50 px-6 border-b border-border/70 bg-white/85 shadow-sm backdrop-blur-xl h-16'>
      <div className='max-w-6xl mx-auto flex justify-between items-center'>
        <Link href="/" className=' flex items-center gap-2'>
          <Image src="/logo.png" alt="Dental Logo" width={32} height={32} className='w-11'/>
          <span className='font-semibold text-lg'>DENT AI</span>
        </Link>

        <div className='hidden md:flex items-center gap-8'>
          <a href='/#how-it-works' className='text-muted-foreground hover:text-foreground'>How it works</a>
          <a href='/#pricing' className='text-muted-foreground hover:text-foreground'>Pricing</a>
          <a href='/#about' className='text-muted-foreground hover:text-foreground'>About</a>

        </div>

        <div className='md:flex items-center gap-4'>
          <SignInButton mode='modal'>
            <Button variant={"ghost"} size={"sm"}>login</Button>
          </SignInButton>
          <SignUpButton mode='modal'>
            <Button >sign up</Button>
          </SignUpButton>
        </div>
      </div>
    </nav>
  )
}

export default Header
