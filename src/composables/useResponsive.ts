import { useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'

export function useResponsive() {
  const breakpoints = useBreakpoints({
    mobile: 640,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
  })

  const isMobile = breakpoints.smaller('tablet')
  const isTablet = breakpoints.between('tablet', 'laptop')
  const isLaptop = breakpoints.between('laptop', 'desktop')
  const isDesktop = breakpoints.greater('desktop')

  const screenSize = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    if (isLaptop.value) return 'laptop'
    return 'desktop'
  })

  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    screenSize,
  }
}
