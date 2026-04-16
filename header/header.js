/**
 * Header Module
 * Handles scroll effects, mobile menu toggle, and theme switching
 */

export function initHeader() {
  const header = document.getElementById('site-header');
  const themeToggle = document.getElementById('header-theme-toggle');
  const mobileToggle = document.getElementById('header-mobile-toggle');
  const mobileMenu = document.getElementById('header-mobile-menu');
  const menuIcon = document.querySelector('.header-menu-icon');
  const closeIcon = document.querySelector('.header-close-icon');

  // Handle scroll effect
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      
      // Make glassmorphism a bit more opaque when scrolling
      const bg = header.querySelector('.backdrop-blur-2xl');
      if (bg) {
        if (document.documentElement.classList.contains('dark')) {
          bg.classList.replace('dark:bg-[#030014]/80', 'dark:bg-[#030014]/95');
        } else {
          bg.classList.replace('bg-white/70', 'bg-white/90');
        }
      }
    } else {
      header.classList.remove('scrolled');
      
      const bg = header.querySelector('.backdrop-blur-2xl');
      if (bg) {
        if (document.documentElement.classList.contains('dark')) {
          bg.classList.replace('dark:bg-[#030014]/95', 'dark:bg-[#030014]/80');
        } else {
          bg.classList.replace('bg-white/90', 'bg-white/70');
        }
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Handle theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.theme = isDark ? 'dark' : 'light';
      handleScroll(); // Update background opacity
    });
  }

  // Handle mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      
      if (isOpen) {
        // Close menu
        mobileMenu.classList.remove('open');
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 300); // match transition duration
        menuIcon?.classList.remove('hidden');
        closeIcon?.classList.add('hidden');
      } else {
        // Open menu
        mobileMenu.classList.remove('hidden');
        // Small delay to allow display:block to apply before animating opacity/transform
        requestAnimationFrame(() => {
          mobileMenu.classList.add('open');
        });
        menuIcon?.classList.add('hidden');
        closeIcon?.classList.remove('hidden');
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden') && 
          !mobileMenu.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        
        mobileMenu.classList.remove('open');
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 300);
        menuIcon?.classList.remove('hidden');
        closeIcon?.classList.add('hidden');
      }
    });
  }

  // Active state based on URL
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll('.header-nav-link, .header-mobile-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Exact match or active section
    if ((path === '/' && href === '/') || 
        (href !== '/' && path.includes(href.replace('.html', '')))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
