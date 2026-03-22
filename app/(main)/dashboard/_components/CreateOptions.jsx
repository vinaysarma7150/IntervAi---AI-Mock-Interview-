import React from 'react'
import {Video} from 'lucide-react'
import Link from "next/link"

function CreateOptions() {
  return (
    <div className='grid grid-cols-2 gap-5'>
        <Link href = {'/dashboard/create-interview'  }className = 'rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-colors hover:bg-accent/60 dark:border-white/8 dark:bg-[#11203a]/92'
       >

                <Video className = 'h-10 w-10 rounded-xl bg-blue-500/10 p-3 text-primary'/>
                <h2 className='mt-4 font-bold'>Create new interview</h2>
                <p className='mt-1 text-sm text-muted-foreground'> Create new AI Interview and shedule them with candidates</p>
        </Link>
    </div>
  )
}

export default CreateOptions
