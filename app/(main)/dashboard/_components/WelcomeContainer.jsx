"use client"
import { useUser } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import React from 'react'
import Image from'next/image'
import ThemeToggle from '@/components/ThemeToggle'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

function WelcomeContainer() {
    const {user, setUser} = useUser();
    const router = useRouter();

    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log("logout error:", error.message);
        return;
      }

      setUser(undefined);
      router.replace("/auth");
    };


  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm dark:border-white/10 dark:bg-[#11203a]/92">
            <div>
                <h2 className='text-lg font-bold text-card-foreground'> Welcome Back, {user?.name} </h2>
                <h2 className='text-muted-foreground'> AI-Driven Interviews. Hassel - Free Hiring</h2>
            </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>

            {user &&<Image src = {user?.picture} className ='rounded-full ring-2 ring-white dark:ring-blue-400/20' alt ='userAvatar' width = {50} height = {50}/>}
          </div>


    </div>
  )
}

export default WelcomeContainer
