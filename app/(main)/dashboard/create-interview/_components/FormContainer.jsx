import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BriefcaseBusiness,
  CodeXml,
  Lightbulb,
  Puzzle,
  Users,
} from 'lucide-react'

const interviewTypes = [
  { label: 'Technical', icon: CodeXml },
  { label: 'Behavioral', icon: Users },
  { label: 'Experience', icon: BriefcaseBusiness },
  { label: 'Problem Solving', icon: Puzzle },
  { label: 'Leadership', icon: Lightbulb },
]

function FormContainer({onHandleInputChange, GoToNext}) {
    const [selectedTypes, setSelectedTypes] = useState(['Technical'])

    useEffect( () =>{
        onHandleInputChange('type', ['Technical'])
    }, [])

    const onSelectInterviewType = (type) => {
        const updatedTypes = selectedTypes.includes(type)
          ? selectedTypes.filter((item) => item !== type)
          : [...selectedTypes, type]

        setSelectedTypes(updatedTypes)
        onHandleInputChange('type', updatedTypes)
    }

  return (
    <div className='rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-white/8 dark:bg-[#101a2c]/92 dark:shadow-[0_22px_45px_rgba(2,8,23,0.38)]'>
        <div>
            <h2 className='text-sm font-medium text-card-foreground'>Job Position</h2>
            <Input  placeholder = "e.g. Full stack developer" className='mt-2 h-12 rounded-2xl'
            onChange= {(event) => onHandleInputChange('jobPosition', event.target.value)}
                />
        </div>

        <div className='mt-5'>
            <h2 className='text-sm font-medium text-card-foreground'>Job Description</h2>
            <Textarea
                placeholder= "Enter job description"
                onChange= {(event) => onHandleInputChange('jobDescription', event.target.value)}
                className = 'mt-2 h-[220px] rounded-2xl'
            />
        </div>

        <div className='mt-5'>
            <h2 className='text-sm font-medium text-card-foreground'>Interview Duration</h2>
            <Select onValueChange={ (v) => onHandleInputChange('duration', v)}>
            <SelectTrigger className="mt-2 h-12 w-full rounded-2xl">
                <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectItem value="5 min">5 mins</SelectItem>
                <SelectItem value="10 min">10mins</SelectItem>
                <SelectItem value="20 min">20mins</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>
        </div>

        <div className='mt-5'>
            <h2 className='text-sm font-medium text-card-foreground'>Interview Type</h2>
            <div className='mt-3 flex flex-wrap gap-4'>
                {interviewTypes.map(({ label, icon: Icon }) => {
                    const isSelected = selectedTypes.includes(label)

                    return (
                      <Button
                          key={label}
                          type='button'
                          variant='outline'
                          onClick={() => onSelectInterviewType(label)}
                          className={`h-11 rounded-full px-5 text-sm font-medium shadow-none ${
                            isSelected
                              ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'border-border bg-background text-foreground dark:border-white/10 dark:bg-[#11203a]/82'
                          }`}
                      >
                          <Icon className='mr-2 h-4 w-4' />
                          {label}
                      </Button>
                    )
                })}
            </div>
        </div>

        <div className='mt-7 flex justify-end'>
        <Button type='button' className='h-11 rounded-xl px-6 cursor-pointer' onClick={ () => GoToNext()}>
          Generate Question <ArrowRight/>
        </Button>

        </div>

    </div>
  )
}

export default FormContainer
