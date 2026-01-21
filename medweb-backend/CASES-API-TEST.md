# 病例管理API测试文档

## 测试环境
- 后端地址: http://localhost:3000
- 数据库: PostgreSQL 15 (medweb_db)
- 测试账号: admin / Admin@123456

## 测试流程

### 1. 登录获取Token
```bash
curl --noproxy localhost -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123456"
  }'
```

### 2. 创建表单版本（前置条件）
需要先有一个已发布的表单版本才能创建病例。

### 3. 创建病例
```bash
curl --noproxy localhost -X POST http://localhost:3000/cases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "formVersionId": "FORM_VERSION_ID"
  }'
```

### 4. 查询病例列表
```bash
curl --noproxy localhost -X GET "http://localhost:3000/cases?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. 获取单个病例
```bash
curl --noproxy localhost -X GET http://localhost:3000/cases/CASE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. 更新病例答案
```bash
curl --noproxy localhost -X PUT http://localhost:3000/cases/CASE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "answers": {
      "patient_hospital_number": "12345678",
      "patient_admission_date": "2026-01-19",
      "arrest_type": "IHCA"
    }
  }'
```

### 7. 提交病例
```bash
curl --noproxy localhost -X POST http://localhost:3000/cases/CASE_ID/submit \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8. 删除病例（仅草稿状态）
```bash
curl --noproxy localhost -X DELETE http://localhost:3000/cases/CASE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 测试结果
待测试...
