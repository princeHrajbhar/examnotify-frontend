// recorded-course\skillo-frontend\src\app\(public)\blog\[category]\[slug]\page.tsx
import Detail from '@/components/blog/Detail'
import HeroSlider from '@/components/blog/BlogHero'
import React from 'react'

const page = () => {
  return (
    <div>
      <HeroSlider />
      <Detail/>
    </div>
  )
}

export default page
