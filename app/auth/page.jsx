"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import ThemeToggle from '@/components/ThemeToggle'


const Login = ()=>{


    //Used to sign  in with google
    const signInWithGoogle = async () =>{
            const redirectTo =
                typeof window !== "undefined"
                    ? `${window.location.origin}/dashboard`
                    : undefined;

            const {error} = await supabase.auth.signInWithOAuth(
                {
                    provider : 'google',
                    options: {
                        redirectTo,
                    },
                }
            );

            if(error){
                console.log("error: ", error.message)
            }
    }

    
  return (
    <div className='flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_24%),linear-gradient(180deg,rgba(1,5,12,1)_0%,rgba(2,8,16,1)_100%)]'>
        <div className='relative flex w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur lg:flex-row dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:shadow-[0_24px_70px_rgba(2,6,23,0.65)]'>
            <div className='absolute right-5 top-5 z-20'>
                <ThemeToggle />
            </div>
            <div className='relative hidden overflow-hidden lg:flex lg:w-[46%] flex-col justify-between border-r border-slate-200 bg-slate-50 p-10 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'>
                <div className='pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl' />
                <div className='pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl' />
                <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(59,130,246,0.16),rgba(255,255,255,0.65)_50%,rgba(34,211,238,0.14))] dark:bg-[linear-gradient(145deg,rgba(59,130,246,0.16),rgba(15,23,42,0.35)_55%,rgba(34,211,238,0.12))]' />
                <div className='relative flex flex-col items-center text-center'>
                    <Image src = {"/logo-whitebg.png"} alt = 'logo'
                    width = {400}
                    height= {500}
                    className = 'w-[170px] drop-shadow-[0_10px_30px_rgba(15,23,42,0.55)] dark:hidden'
                    />
                    <Image src = {"/logo.jpeg"} alt = 'logo'
                    width = {400}
                    height= {500}
                    className = 'hidden w-[170px] drop-shadow-[0_10px_30px_rgba(15,23,42,0.55)] dark:block'
                    />
                    <p className='mt-8 max-w-sm text-base leading-8 text-slate-600 dark:text-slate-200/90'>
                        Build AI interviews, share them instantly, and review structured candidate feedback from one place.
                    </p>
                </div>
                <div className='relative rounded-3xl border border-slate-200/80 bg-white/65 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl dark:border-slate-200/15 dark:bg-slate-800/45 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'>
                    <h3 className='text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white'>Hire faster with better signal</h3>
                    <p className='mt-4 text-base leading-8 text-slate-600 dark:text-slate-200/90'>
                        Generate interviews, monitor candidate submissions, and review reports with a cleaner workflow.
                    </p>
                </div>
            </div>

            <div className='flex flex-1 flex-col items-center p-8 sm:p-10'>
            <Image src = {"/logo-whitebg.png"} alt = 'logo'
            width = {400}
            height= {500}
            className = 'w-[170px] dark:hidden'
            />
            <Image src = {"/logo.jpeg"} alt = 'logo'
            width = {400}
            height= {500}
            className = 'hidden w-[170px] dark:block'
            />


            <div className = 'flex w-full max-w-md items-center flex-col'>
                <Image src = {'/login.png'} alt = 'login'
                width ={600}
                height = {400}
                className='mt-2 h-[220px] w-full rounded-3xl border border-slate-200 object-cover sm:h-[250px] dark:border-slate-700/70'
                />
                <h2 className = 'mt-6 text-center text-3xl font-bold text-slate-900 dark:text-slate-100'> Welcome to AI mock interview</h2>
                <p className= 'mt-2 text-center text-slate-500 dark:text-slate-400'> Sign in with google to continue to your workspace</p>
                <Button className='mt-7 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90' onClick = {signInWithGoogle}>Login with google</Button>
            </div>
            </div>
        </div>
    </div>

    
  )
}

export default Login
