export function closeAllPopovers() {
  document.querySelectorAll('.task-popover').forEach(p => p.classList.add('hidden'));
}

export function initPopoverUI() {
  document.addEventListener('click', (e) => {
    // Nếu click vào nút menu 3 chấm
    const menuBtn = e.target.closest('.task-menu-btn');
    if (menuBtn) {
      e.preventDefault();
      e.stopPropagation();
      const popover = menuBtn.nextElementSibling;
      const isOpen = !popover.classList.contains('hidden');
      closeAllPopovers();
      if (!isOpen) popover.classList.remove('hidden');
      return;
    }
    
    // Nếu click ra ngoài popover
    if (!e.target.closest('.task-popover')) {
      closeAllPopovers();
    }
  });
}
