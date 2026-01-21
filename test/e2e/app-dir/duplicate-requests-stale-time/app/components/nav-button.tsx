'use client'

import { useRouter } from 'next/navigation'

type NavButtonProps = {
  to: string
  label: string
  id: string
}

export default function NavButton({ to, label, id }: NavButtonProps) {
  const router = useRouter()

  return (
    <button type="button" id={id} onClick={() => router.push(to)}>
      {label}
    </button>
  )
}
