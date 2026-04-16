/**
 * Configuration
 * App settings, DB schema, and constants
 */

export const CONFIG = {
  supabase: {
    url: 'https://bbwdvmaeuzvqqfjjijcr.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJid2R2bWFldXp2cXFmamppamNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4OTI0MzgsImV4cCI6MjA5MTQ2ODQzOH0.a2LJbkvt5LSysV5OxjDEZIqGSO2YqeG92W3cXZWHwkI'
  },
  app: { name: 'Kanban Board', version: '2.0.0' }
};

export const DB_CONFIG = {
  table: 'tasks',
  columns: {
    id: 'id',
    title: 'title',
    description: 'description',
    status: 'status',
    priority: 'priority',
    deadline: 'deadline',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

export const STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  ARCHIVED: 'archived',
  ALIASES: {
    'cần làm': 'todo',
    'đang làm': 'in_progress',
    'hoàn thành': 'done',
    'lưu trữ': 'archived',
    'doing': 'in_progress',
    'completed': 'done',
    'archived': 'archived'
  }
};

export const PRIORITY = {
  HIGH: 'cao',
  MEDIUM: 'trung_binh',
  LOW: 'thap',
  ALIASES: {
    'cao': 'cao', 'high': 'cao',
    'trung_binh': 'trung_binh', 'trung bình': 'trung_binh', 'medium': 'trung_binh',
    'thap': 'thap', 'thấp': 'thap', 'low': 'thap'
  }
};
