import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { casesApi, type CaseListItem } from '@/lib/api/cases';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [draftCases, setDraftCases] = useState<CaseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载草稿列表
  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const cases = await casesApi.getList();
        const drafts = cases.filter(c => c.status === 'draft');
        setDraftCases(drafts);
      } catch (err) {
        console.error('加载草稿失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDrafts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">欢迎回来，{user?.fullName || user?.username}！</h1>
            <p className="text-gray-600">角色: {user?.role === 'admin' ? '管理员' : '用户'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">草稿箱</h2>
          <button
            onClick={() => navigate('/cases/new')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            新建病例
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        ) : draftCases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无草稿</p>
            <p className="text-sm mt-2">点击"新建病例"开始填写表单</p>
          </div>
        ) : (
          <div className="space-y-3">
            {draftCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        草稿
                      </span>
                      {caseItem.hospitalName && (
                        <span className="text-sm text-gray-600">
                          {caseItem.hospitalName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      患者住院号: {caseItem.patientHospitalId || '未填写'}
                    </p>
                    <p className="text-xs text-gray-500">
                      创建时间: {formatDate(caseItem.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      最后保存: {formatDate(caseItem.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/cases/${caseItem.id}/edit`)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm"
                  >
                    继续填写
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
