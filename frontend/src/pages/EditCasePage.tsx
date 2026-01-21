import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StepForm from '@/components/form/StepForm';
import { crfSchema } from '@/data/crf-schema';
import { casesApi } from '@/lib/api/cases';
import type { FormData } from '@/types/form';

export default function EditCasePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
        // 后端返回的是 answers 字段
        setCaseData(response.answers || {});
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

  // 保存草稿
  const handleSaveDraft = async (data: FormData) => {
    if (!id) {
      console.error('无法保存草稿：病例ID不存在');
      return;
    }

    try {
      await casesApi.saveDraft(id, data);
      console.log('草稿已保存');
    } catch (err: any) {
      console.error('保存草稿失败:', err);
    }
  };

  // 提交表单
  const handleSubmit = async (data: FormData) => {
    if (!id) {
      setError('病例ID不存在，无法提交');
      return;
    }

    try {
      await casesApi.submit(id, data);
      setSubmitSuccess(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || '提交失败，请重试';
      setError(errorMsg);
      console.error('提交失败:', err);
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

  // 提交成功状态
  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">提交成功！</h2>
          <p className="text-gray-600 mb-6">您的病例已成功提交，感谢您的参与。</p>
          <div className="flex justify-center gap-3">
            {id && (
              <button
                onClick={() => navigate(`/cases/${id}`)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                查看详情
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-6">
          <h2 className="text-lg font-semibold mb-2">操作失败</h2>
          <p className="mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setError('');
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              重试
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StepForm
      schema={crfSchema}
      initialData={caseData || {}}
      onSave={handleSaveDraft}
      onSubmit={handleSubmit}
    />
  );
}
