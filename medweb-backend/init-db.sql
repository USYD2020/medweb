-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  role VARCHAR(20) DEFAULT 'user',
  full_name VARCHAR(100) NOT NULL,
  hospital VARCHAR(200),
  department VARCHAR(100),
  position VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  purpose TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 创建审核申请表
CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewer_id UUID,
  decision_note TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_approval_user_id ON approval_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_approval_status ON approval_requests(status);

-- 创建表单版本表
CREATE TABLE IF NOT EXISTS form_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  schema_json JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_form_status ON form_versions(status);

-- 创建病例表
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number VARCHAR(50) UNIQUE NOT NULL,
  created_by UUID NOT NULL,
  form_version_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  patient_hospital_number VARCHAR(100),
  patient_admission_date DATE,
  arrest_type VARCHAR(20),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (form_version_id) REFERENCES form_versions(id)
);

CREATE INDEX IF NOT EXISTS idx_case_number ON cases(case_number);
CREATE INDEX IF NOT EXISTS idx_case_created_by ON cases(created_by);
CREATE INDEX IF NOT EXISTS idx_case_status ON cases(status);

-- 创建病例答案表
CREATE TABLE IF NOT EXISTS case_answers (
  case_id UUID PRIMARY KEY,
  answers_json JSONB DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- 插入管理员账号
INSERT INTO users (username, password_hash, status, role, full_name, hospital, department, position)
VALUES (
  'admin',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSBHxQiq',
  'approved',
  'admin',
  '系统管理员',
  '系统',
  '技术部',
  '管理员'
) ON CONFLICT (username) DO NOTHING;
