

// recorded-course\skillo-frontend\src\app\(public)\blog\page.tsx
import React from 'react'

import ListSection from '@/components/blog/BlogListing'
import HeroSlider from '@/components/home/HeroSlider'

const page = () => {
  return (
    <div>
      <HeroSlider />
      <ListSection/>
    </div>
  )
}

export default page
