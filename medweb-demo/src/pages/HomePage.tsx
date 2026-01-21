export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          《上海市级医院心脏骤停心肺复苏横断面调查研究》
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          改良版 CRF 数据采集系统
        </p>
        <div className="bg-white rounded-lg shadow-md p-8 text-left">
          <h2 className="text-2xl font-semibold mb-4">项目简介</h2>
          <p className="text-gray-700 mb-4">
            本系统依据 2015/2024 OHCA Utstein 及 2019 IHCA Utstein 指南，
            为心脏骤停心肺复苏横断面调查研究提供标准化的数据采集平台。
          </p>
          <h3 className="text-xl font-semibold mb-2 mt-6">使用说明</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>首次使用请先注册账号</li>
            <li>等待管理员审核通过</li>
            <li>审核通过后即可登录并填写病例数据</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
