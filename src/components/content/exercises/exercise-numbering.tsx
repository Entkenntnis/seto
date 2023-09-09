import clsx from 'clsx'

import { tw } from '@/helper/tw'

interface ExerciseNumberingProps {
  index: number
  href: string
  solved?: boolean
}

export function ExerciseNumbering({ index, solved }: ExerciseNumberingProps) {
  if (!Number.isInteger(index)) return null

  return (
    <div
      className={clsx(
        tw`
          mx-side mb-5 block h-12 w-12 rounded-full bg-brand
          pt-1 text-center text-4xl font-bold
          text-white hover:no-underline sm:absolute sm:-ml-10
          sm:-mt-2.5 md:-ml-14
        `,
        solved ? 'bg-brandgreen' : 'bg-brand'
      )}
    >
      {index + 1}
    </div>
  )
}
