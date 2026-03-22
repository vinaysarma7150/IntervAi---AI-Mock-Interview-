import Image from 'next/image'
import React from 'react'
import ThemeToggle from '@/components/ThemeToggle'

function InterviewHeader() {
  return (
    <div className='flex items-center justify-between border-b border-border bg-card p-4 shadow-sm dark:border-white/10 dark:bg-[#11203a]/92'>

      <Image
        src={'/logo-whitebg.png'}
        alt='logo'
        width={200}
        height={100}
        className='w-[140px] dark:hidden'
      />
      <Image
        src={'/logo.jpeg'}
        alt='logo'
        width={200}
        height={100}
        className='hidden w-[140px] dark:block'
      />
      <ThemeToggle />

    </div>
  )
}

export default InterviewHeader
