import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { casesApi } from '@/lib/api/cases';
import { crfSchema } from '@/data/crf-schema';

export default function CaseDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 加载病例数据
  useEffect(() => {
    const loadCase = async () => {
      if (!id) {
        setError('病例ID无效');
        setLoading(false);
        return;
      }

      try {
        const response = await casesApi.getById(id);
        setCaseData(response);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || '加载病例失败，请重试';
        setError(errorMsg);
        console.error('加载病例失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '未填写';
    const date = new Date(dateString);
    // 指定时区为上海时间，确保正确显示
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Shanghai',
      hour12: false,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">草稿</span>;
      case 'submitted':
        return <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">已提交</span>;
      case 'reviewed':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">已审核</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded">{status}</span>;
    }
  };

  // 渲染字段值
  const renderFieldValue = (field: any, value: any) => {
    if (value === undefined || value === null || value === '') {
      return <span className="text-gray-400">未填写</span>;
    }

    switch (field.type) {
      case 'checkbox':
        return value === true ? '是' : '否';
      case 'checkbox-group':
        return Array.isArray(value) ? value.join('、') : value;
      case 'date':
      case 'datetime':
        return formatDate(value);
      case 'time':
        return value;
      default:
        return String(value);
    }
  };

  // 加载中状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载病例...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-6">
          <h2 className="text-lg font-semibold mb-2">加载失败</h2>
          <p className="mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              返回
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              回到首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answers = caseData.answers || {};

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* 顶部信息栏 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">病例详情</h1>
            <p className="text-sm text-gray-600">病例编号: {caseData.caseNumber || '未生成'}</p>
          </div>
          <div className="flex gap-3">
            {getStatusBadge(caseData.status)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">创建时间: </span>
            {formatDate(caseData.createdAt)}
          </div>
          <div>
            <span className="text-gray-600">最后更新: </span>
            {formatDate(caseData.updatedAt)}
          </div>
          {caseData.submittedAt && (
            <div>
              <span className="text-gray-600">提交时间: </span>
              {formatDate(caseData.submittedAt)}
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          返回
        </button>
        <button
          onClick={() => navigate(`/cases/${id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          编辑病例
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          回到首页
        </button>
      </div>

      {/* 表单内容 */}
      {crfSchema.modules.map((module) => (
        <div key={module.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{module.title}</h2>
          {module.description && (
            <p className="text-gray-600 mb-6">{module.description}</p>
          )}

          {module.sections.map((section) => (
            <div key={section.id} className="mb-6">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                {section.title}
              </h3>
              {section.description && (
                <p className="text-sm text-gray-600 mb-4">{section.description}</p>
              )}

              {section.fieldGroups.map((group) => (
                <div key={group.id} className="mb-6">
                  {group.title && (
                    <h4 className="text-md font-medium mb-3">{group.title}</h4>
                  )}
                  <div className="space-y-4">
                    {group.fields.map((field) => (
                      <div key={field.id} className="flex border-b border-gray-100 pb-3">
                        <div className="w-1/3 pr-4">
                          <label className="text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                        </div>
                        <div className="w-2/3">
                          <div className="text-sm text-gray-900">
                            {renderFieldValue(field, answers[field.id])}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
