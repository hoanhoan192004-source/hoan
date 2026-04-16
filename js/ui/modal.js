export function getModal() {
  return document.getElementById('task-modal');
}

export function openTaskModal() {
  const modal = getModal();
  if(!modal) return;
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modal.querySelector('.modal-content')?.classList.remove('translate-x-full');
    modal.querySelector('.modal-content')?.classList.add('translate-x-0');
  }, 10);
}

export function closeTaskModal() {
  const modal = getModal();
  if(!modal) return;
  modal.classList.add('opacity-0');
  modal.querySelector('.modal-content')?.classList.remove('translate-x-0');
  modal.querySelector('.modal-content')?.classList.add('translate-x-full');
  setTimeout(() => {
    modal.classList.add('hidden');
    document.getElementById('task-form')?.reset();
    document.getElementById('task-edit-id').value = '';
    document.getElementById('task-deadline').value = '';
    
    // Chuyển UI modal về chế độ "Add" (Thêm nhiệm vụ) mặc định 
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.textContent = 'Thêm nhiệm vụ';
    const subtitle = document.getElementById('modal-subtitle');
    if (subtitle) subtitle.textContent = 'Tạo nhiệm vụ mới cho dự án';
    const btnSubmit = document.getElementById('btn-submit-modal');
    if (btnSubmit) btnSubmit.textContent = 'Lưu';
  }, 300);
}

export function openEditModal(task) {
  document.getElementById('task-edit-id').value = task.id;
  document.getElementById('task-title').value = task.title || '';
  document.getElementById('task-desc').value = task.description || '';
  document.getElementById('modal-title').textContent = 'Sửa nhiệm vụ';
  document.getElementById('modal-subtitle').textContent = 'Chỉnh sửa thông tin nhiệm vụ';
  document.getElementById('btn-submit-modal').textContent = 'Cập nhật';

  // Set deadline
  const deadlineInput = document.getElementById('task-deadline');
  if (deadlineInput) {
    deadlineInput.value = task.deadline || '';
  }

  const prRadio = document.querySelector(`input[name="task-priority"][value="${task.priority}"]`);
  if (prRadio) prRadio.checked = true;

  openTaskModal();
}

export function initModalUI() {
  document.getElementById('btn-add-task')?.addEventListener('click', openTaskModal);
  document.getElementById('btn-close-modal')?.addEventListener('click', closeTaskModal);
  document.getElementById('btn-cancel-modal')?.addEventListener('click', closeTaskModal);
  document.querySelector('.fab')?.addEventListener('click', openTaskModal);
}
