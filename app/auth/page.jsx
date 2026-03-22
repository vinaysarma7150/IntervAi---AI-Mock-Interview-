"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'


const Login = ()=>{


    //Used to sign  in with google
    const signInWithGoogle = async () =>{

            const {error} = await supabase.auth.signInWithOAuth(
                {provider : 'google'}
            );

            if(error){
                console.log("error: ", error.message)
            }
    }

    
  return (
    <div className='dark'>
    <div className='flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8'>
        <div className='flex w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/90 text-slate-100 shadow-[0_24px_70px_rgba(2,6,23,0.65)] backdrop-blur lg:flex-row'>
            <div className='relative hidden overflow-hidden lg:flex lg:w-[46%] flex-col justify-between border-r border-slate-800 bg-slate-900 p-10 text-slate-100'>
                <div className='pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl' />
                <div className='pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl' />
                <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(59,130,246,0.16),rgba(15,23,42,0.35)_55%,rgba(34,211,238,0.12))]' />
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
                    <p className='mt-8 max-w-sm text-base leading-8 text-slate-200/90'>
                        Build AI interviews, share them instantly, and review structured candidate feedback from one place.
                    </p>
                </div>
                <div className='relative rounded-3xl border border-slate-200/15 bg-slate-800/45 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl'>
                    <h3 className='text-4xl font-extrabold tracking-tight text-white'>Hire faster with better signal</h3>
                    <p className='mt-4 text-base leading-8 text-slate-200/90'>
                        Generate interviews, monitor candidate submissions, and review reports with a cleaner workflow.
                    </p>
                </div>
            </div>

            <div className='flex flex-1 flex-col items-center p-8 sm:p-10'>
            <Image src = {"/logo-whitebg.png"} alt = 'logo'
            width = {400}
            height= {500}
            className = 'w-[170px] lg:hidden dark:hidden'
            />
            <Image src = {"/logo.jpeg"} alt = 'logo'
            width = {400}
            height= {500}
            className = 'hidden w-[170px] lg:hidden dark:block'
            />


            <div className = 'flex w-full max-w-md items-center flex-col'>
                <Image src = {'/login.png'} alt = 'login'
                width ={600}
                height = {400}
                className='mt-2 h-[220px] w-full rounded-3xl border border-slate-700/70 object-cover sm:h-[250px]'
                />
                <h2 className = 'mt-6 text-center text-3xl font-bold text-slate-100'> Welcome to AI mock interview</h2>
                <p className= 'mt-2 text-center text-slate-400'> Sign in with google to continue to your workspace</p>
                <Button className='mt-7 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90' onClick = {signInWithGoogle}>Login with google</Button>
            </div>
            </div>
        </div>
    </div>
    </div>

    
  )
}

export default Login
