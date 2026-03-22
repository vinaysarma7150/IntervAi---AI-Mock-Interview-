"use client"
import { UserDetailContext } from '@/context/UserDEtailContext';
import { supabase } from '@/services/supabaseClient'
import { ThemeProvider } from 'next-themes';
import React, { useContext, useEffect, useState } from 'react'





const Provider = ({ children }) => {


    const [user, setUser ] = useState();
    const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    createNewUser()
  }, [])

  const createNewUser = async () => {

    //getting user data from authentication data, we get only one user info who is currently logged in now
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      setLoading(false);
      return
    }


    //checking 
    const { data: users, error } = await supabase
      .from("Users")
      .select("*")
      .eq("email", user.email)

    if (error) {
      console.log(error)
      setLoading(false)
      return
    }


    // new user detected,now inserting to database
    if (users?.length === 0) {
      const { data, error: insertError } = await supabase.from("Users").insert([
        {
          name: user?.user_metadata?.name,
          email: user.email,
          picture: user?.user_metadata?.picture,
        },
      ])

      if (insertError) {
        console.log(insertError)
        setLoading(false)
        return
      }

      console.log(data)
      setUser(data)
      setLoading(false)
      return;
    }


    //not new user
    console.log(user)
    setUser(users[0])
    setLoading(false)

  }

  return(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <UserDetailContext.Provider value={ {user,setUser,loading}}>
        <div>
          {children}
        </div>
      </UserDetailContext.Provider>
    </ThemeProvider>
  )
}


export default Provider




export const useUser = ()=>{
    const context  = useContext(UserDetailContext);
    return context;
}
