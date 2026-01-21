import type { FormSchema } from '@/types/form';

/**
 * 心脏骤停心肺复苏调查表单 Schema
 * 基于《上海市级医院心脏骤停心肺复苏横断面调查研究》改良版 CRF
 */
export const crfSchema: FormSchema = {
  formId: 'cardiac-arrest-crf',
  title: '心脏骤停心肺复苏调查表',
  version: '2.0',
  description: '上海市级医院心脏骤停心肺复苏横断面调查研究',
  modules: [
    // ==================== 模块 A：患者基础信息（通用） ====================
    {
      id: 'module-a',
      title: '模块 A：患者基础信息',
      description: '所有患者必填',
      sections: [
        // 第一部分：基本信息
        {
          id: 'basic-info',
          title: '基本信息',
          fieldGroups: [
            {
              id: 'hospital-researcher',
              fields: [
                {
                  id: 'hospitalName',
                  type: 'select',
                  label: '中心/医院名称',
                  required: true,
                  allowCustom: true,
                  defaultValue: '上海交通大学医学院附属瑞金医院',
                  options: [
                    { value: '上海交通大学医学院附属仁济医院', label: '上海交通大学医学院附属仁济医院' },
                    { value: '上海交通大学医学院附属仁济医院南院', label: '上海交通大学医学院附属仁济医院南院' },
                    { value: '上海交通大学医学院附属瑞金医院', label: '上海交通大学医学院附属瑞金医院' },
                    { value: '上海交通大学医学院附属瑞金医院北院', label: '上海交通大学医学院附属瑞金医院北院' },
                    { value: '上海交通大学医学院附属第九人民医院', label: '上海交通大学医学院附属第九人民医院' },
                    { value: '上海交通大学医学院附属第一人民医院', label: '上海交通大学医学院附属第一人民医院' },
                    { value: '上海交通大学医学院附属第三人民医院', label: '上海交通大学医学院附属第三人民医院' },
                    { value: '上海交通大学医学院附属新华医院', label: '上海交通大学医学院附属新华医院' },
                    { value: '上海交通大学医学院附属第六人民医院', label: '上海交通大学医学院附属第六人民医院' },
                    { value: '上海交通大学医学院附属上海儿童医学中心', label: '上海交通大学医学院附属上海儿童医学中心' },
                    { value: '上海市第六人民医院东院', label: '上海市第六人民医院东院' },
                    { value: '上海市东方医院（同济大学附属东方医院）', label: '上海市东方医院（同济大学附属东方医院）' },
                    { value: '复旦大学附属中山医院', label: '复旦大学附属中山医院' },
                    { value: '复旦大学附属华山医院', label: '复旦大学附属华山医院' },
                    { value: '复旦大学附属肿瘤医院', label: '复旦大学附属肿瘤医院' },
                    { value: '复旦大学附属儿科医院', label: '复旦大学附属儿科医院' },
                    { value: '复旦大学附属华山医院北院', label: '复旦大学附属华山医院北院' },
                    { value: '复旦大学附属妇产科医院（红房子医院）', label: '复旦大学附属妇产科医院（红房子医院）' },
                    { value: '复旦大学附属金山医院', label: '复旦大学附属金山医院' },
                    { value: '复旦大学附属眼耳鼻喉科医院', label: '复旦大学附属眼耳鼻喉科医院' },
                    { value: '复旦大学附属公共卫生临床中心', label: '复旦大学附属公共卫生临床中心' },
                    { value: '华东医院（复旦大学附属华东医院）', label: '华东医院（复旦大学附属华东医院）' },
                    { value: 'other', label: '其他' },
                  ],
                },
                {
                  id: 'researcher',
                  type: 'text',
                  label: '登记医师/研究者',
                  required: true,
                  placeholder: '请输入登记医师姓名',
                },
              ],
            },
          ],
        },

        // 第二部分：患者信息
        {
          id: 'patient-info',
          title: '患者信息',
          fieldGroups: [
            {
              id: 'patient-ids',
              fields: [
                {
                  id: 'patientHospitalId',
                  type: 'text',
                  label: '患者住院号/急诊号',
                  required: true,
                  placeholder: '用于后续随访，需去隐私化处理',
                  helpText: '用于后续随访，需去隐私化处理',
                },
                {
                  id: 'patientIdCard',
                  type: 'text',
                  label: '患者身份证号',
                  required: false,
                  placeholder: '用于后续随访，需去隐私化处理',
                  helpText: '用于后续随访，需去隐私化处理',
                },
                {
                  id: 'patientContact',
                  type: 'text',
                  label: '患者或家属联系方式',
                  required: false,
                  placeholder: '用于后续随访，需去隐私化处理',
                  helpText: '用于后续随访，需去隐私化处理',
                },
                {
                  id: 'inclusionDate',
                  type: 'date',
                  label: '纳入日期',
                  required: true,
                },
              ],
            },
          ],
        },

        // 第三部分：人口学信息
        {
          id: 'demographics',
          title: '人口学信息',
          fieldGroups: [
            {
              id: 'birth-age',
              fields: [
                {
                  id: 'birthDate',
                  type: 'date',
                  label: '出生日期',
                  required: false,
                  helpText: '用于精确计算年龄',
                },
                {
                  id: 'estimatedAge',
                  type: 'number',
                  label: '预估年龄（若出生日期未知）',
                  required: false,
                  unit: '岁',
                  placeholder: '若未知出生日期，请填写预估年龄',
                },
              ],
            },
            {
              id: 'gender-physical',
              fields: [
                {
                  id: 'gender',
                  type: 'radio',
                  label: '性别',
                  required: true,
                  options: [
                    { value: 'male', label: '男' },
                    { value: 'female', label: '女' },
                  ],
                },
                {
                  id: 'height',
                  type: 'number',
                  label: '估算身高',
                  required: false,
                  unit: 'cm',
                  placeholder: '请输入身高',
                },
                {
                  id: 'weight',
                  type: 'number',
                  label: '估算体重',
                  required: false,
                  unit: 'kg',
                  placeholder: '请输入体重',
                },
              ],
            },
            {
              id: 'marital-occupation',
              fields: [
                {
                  id: 'maritalStatus',
                  type: 'radio',
                  label: '婚姻',
                  required: false,
                  options: [
                    { value: 'married', label: '已婚' },
                    { value: 'single', label: '未婚' },
                    { value: 'divorced', label: '离异' },
                    { value: 'unknown', label: '未知' },
                  ],
                },
                {
                  id: 'occupation',
                  type: 'text',
                  label: '患者职业',
                  required: false,
                  placeholder: '请输入职业',
                },
              ],
            },
          ],
        },

        // 第四部分：既往史
        {
          id: 'medical-history',
          title: '既往史 (Comorbidities)',
          fieldGroups: [
            {
              id: 'comorbidities',
              fields: [
                {
                  id: 'comorbidities',
                  type: 'checkbox-group',
                  label: '既往史',
                  required: true,
                  options: [
                    { value: 'none', label: '无' },
                    { value: 'cardiovascular', label: '心血管疾病' },
                    { value: 'respiratory', label: '呼吸系统疾病' },
                    { value: 'endocrine', label: '内分泌代谢性疾病' },
                    { value: 'renal', label: '肾脏疾病' },
                    { value: 'cancer', label: '恶性肿瘤（且处于活动期/治疗期）' },
                    { value: 'neurological', label: '神经系统疾病' },
                    { value: 'surgery', label: '手术史' },
                    { value: 'trauma', label: '外伤史' },
                    { value: 'smoking', label: '吸烟史' },
                    { value: 'alcohol', label: '饮酒史' },
                    { value: 'allergy', label: '过敏史' },
                    { value: 'medication', label: '既往服用特殊药物史' },
                    { value: 'other', label: '其他' },
                  ],
                },
              ],
            },
          ],
        },

        // 第五部分：心脏骤停类型（关键分支点）
        {
          id: 'arrest-type',
          title: '心脏骤停类型',
          description: '请选择心脏骤停发生地点类型，这将决定后续需要填写的模块',
          fieldGroups: [
            {
              id: 'arrest-type-selection',
              fields: [
                {
                  id: 'arrestType',
                  type: 'radio',
                  label: '心脏骤停发生地点类型',
                  required: true,
                  options: [
                    { value: 'OHCA', label: '院外（OHCA）- 送入急诊的患者' },
                    { value: 'IHCA', label: '院内（IHCA）- 在院内发生心搏骤停的患者' },
                  ],
                  helpText: '选择后将显示对应的专属数据采集模块',
                },
              ],
            },
          ],
        },

        // 第六部分：复苏前神经功能状态
        {
          id: 'pre-arrest-neuro',
          title: '复苏前神经功能状态',
          fieldGroups: [
            {
              id: 'cpc-baseline',
              fields: [
                {
                  id: 'preArrestCPC',
                  type: 'radio',
                  label: '复苏前神经功能状态（CPC评分）',
                  required: true,
                  options: [
                    { value: 'cpc-1-2', label: 'CPC 1-2 (功能良好)' },
                    { value: 'cpc-3-4', label: 'CPC 3-4 (严重残疾/植物状态)' },
                    { value: 'unknown', label: '未知' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // ==================== 模块 B：OHCA 专属数据 ====================
    {
      id: 'module-b',
      title: '模块 B：OHCA 专属数据',
      description: '仅针对院外发病，送入急诊的患者',
      visibleWhen: {
        field: 'arrestType',
        operator: 'equals',
        value: 'OHCA',
      },
      sections: [
        {
          id: 'ohca-location',
          title: '心脏骤停发生地点',
          fieldGroups: [
            {
              id: 'arrest-location',
              fields: [
                {
                  id: 'ohcaLocation',
                  type: 'radio',
                  label: '心脏骤停发生地点',
                  required: true,
                  options: [
                    { value: 'home', label: '家中/居住地' },
                    { value: 'public', label: '公共场所' },
                    { value: 'workplace', label: '工作场所' },
                    { value: 'nursing-home', label: '养老院/康复机构' },
                    { value: 'ambulance', label: '救护车上' },
                    { value: 'other', label: '其他' },
                  ],
                },
              ],
            },
          ],
        },

        {
          id: 'ohca-witness',
          title: '目击情况与旁观者反应',
          fieldGroups: [
            {
              id: 'witness-cpr',
              fields: [
                {
                  id: 'witnessStatus',
                  type: 'radio',
                  label: '目击情况 (Witnessed)',
                  required: true,
                  options: [
                    { value: 'unwitnessed', label: '无目击' },
                    { value: 'bystander', label: '旁观者目击（非医务人员）' },
                    { value: 'ems', label: '医务人员目击（EMS到达后）' },
                  ],
                },
                {
                  id: 'bystanderCPR',
                  type: 'radio',
                  label: '旁观者 CPR',
                  required: true,
                  options: [
                    { value: 'none', label: '未实施' },
                    { value: 'compression-only', label: '实施（仅胸外按压）' },
                    { value: 'full-cpr', label: '实施（按压+人工呼吸）' },
                  ],
                },
                {
                  id: 'bystanderAED',
                  type: 'radio',
                  label: '旁观者 AED 使用',
                  required: true,
                  options: [
                    { value: 'not-used', label: '未使用' },
                    { value: 'used-no-shock', label: '使用但未除颤' },
                    { value: 'used-shocked', label: '使用并除颤' },
                  ],
                },
              ],
            },
          ],
        },

        {
          id: 'ohca-ems-timeline',
          title: 'EMS（急救系统）时间轴',
          description: 'Utstein Core，精确到分，若无记录填 ND',
          fieldGroups: [
            {
              id: 'ems-times',
              fields: [
                {
                  id: 'emsCallTime',
                  type: 'time',
                  label: '呼叫 EMS 时间',
                  required: false,
                  placeholder: 'hh:mm',
                },
                {
                  id: 'emsArrivalTime',
                  type: 'time',
                  label: 'EMS 到达现场时间',
                  required: false,
                  placeholder: 'hh:mm',
                },
                {
                  id: 'emsCPRStartTime',
                  type: 'time',
                  label: 'EMS 开始 CPR 时间',
                  required: false,
                  placeholder: 'hh:mm',
                },
              ],
            },
          ],
        },

        {
          id: 'ohca-initial-rhythm',
          title: 'OHCA 初始心律',
          description: 'EMS接手时的心律（Utstein Core）',
          fieldGroups: [
            {
              id: 'initial-rhythm',
              fields: [
                {
                  id: 'ohcaInitialRhythm',
                  type: 'radio',
                  label: 'OHCA 初始心律（EMS接手时）',
                  required: true,
                  options: [
                    { value: 'shockable', label: '可除颤心律（VF/无脉室速 pVT）' },
                    { value: 'non-shockable', label: '不可除颤心律（PEA/Asystole）' },
                    { value: 'other', label: '其他/未知' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // ==================== 模块 C：IHCA 专属数据 ====================
    {
      id: 'module-c',
      title: '模块 C：IHCA 专属数据',
      description: '仅针对院内发生心搏骤停的患者',
      visibleWhen: {
        field: 'arrestType',
        operator: 'equals',
        value: 'IHCA',
      },
      sections: [
        {
          id: 'ihca-location',
          title: '心脏骤停发生具体地点',
          fieldGroups: [
            {
              id: 'arrest-location',
              fields: [
                {
                  id: 'ihcaLocation',
                  type: 'radio',
                  label: '心脏骤停发生具体地点（Utstein Core）',
                  required: true,
                  options: [
                    { value: 'icu', label: '重症监护室（ICU/CCU/NICU等）' },
                    { value: 'er', label: '急诊抢救室（已在院治疗期间）' },
                    { value: 'er-observation', label: '急诊留观室/病房' },
                    { value: 'or', label: '手术室/麻醉复苏室' },
                    { value: 'cath-lab', label: '导管室（Cath Lab）' },
                    { value: 'imaging', label: '影像检查室（CT/MRI）' },
                    { value: 'ward', label: '普通病房' },
                    { value: 'other', label: '其他/未知' },
                  ],
                },
              ],
            },
          ],
        },

        {
          id: 'ihca-monitoring',
          title: '事件前监护状态',
          fieldGroups: [
            {
              id: 'monitoring-status',
              fields: [
                {
                  id: 'monitoringStatus',
                  type: 'radio',
                  label: '事件前监护状态（Utstein Core）',
                  required: true,
                  options: [
                    { value: 'none', label: '无监护' },
                    { value: 'ecg', label: '持续心电监护' },
                    { value: 'spo2', label: '持续指脉氧监测' },
                  ],
                },
              ],
            },
          ],
        },

        {
          id: 'ihca-cause',
          title: '主要直接病因',
          fieldGroups: [
            {
              id: 'direct-cause',
              fields: [
                {
                  id: 'directCause',
                  type: 'radio',
                  label: '主要直接病因（Utstein Core）',
                  required: true,
                  options: [
                    { value: 'cardiac', label: '心源性（心肌缺血、心律失常）' },
                    { value: 'respiratory', label: '呼吸性（缺氧、气道梗阻）' },
                    { value: 'circulatory', label: '循环性（休克、低血压）' },
                    { value: 'metabolic', label: '代谢/电解质紊乱' },
                    { value: 'trauma', label: '创伤/出血' },
                    { value: 'other', label: '其他/未知' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // ==================== 模块 D：复苏过程（通用） ====================
    {
      id: 'module-d',
      title: '模块 D：心脏骤停与复苏过程',
      description: '所有患者必填',
      sections: [
        {
          id: 'resuscitation-timeline',
          title: '复苏时间轴',
          description: '关键数据，请精确记录',
          fieldGroups: [
            {
              id: 'timeline-events',
              fields: [
                {
                  id: 'arrestTime',
                  type: 'datetime',
                  label: '确认心脏骤停时间',
                  required: true,
                  placeholder: 'YYYY-MM-DD hh:mm',
                },
                {
                  id: 'cprStartTime',
                  type: 'time',
                  label: '开始按压时间',
                  required: true,
                  placeholder: 'hh:mm',
                },
                {
                  id: 'firstShockTime',
                  type: 'time',
                  label: '首次除颤时间（如适用）',
                  required: false,
                  placeholder: 'hh:mm',
                },
                {
                  id: 'firstEpiTime',
                  type: 'time',
                  label: '肾上腺素首剂时间',
                  required: false,
                  placeholder: 'hh:mm',
                },
                {
                  id: 'airwayTime',
                  type: 'time',
                  label: '建立高级气道时间',
                  required: false,
                  placeholder: 'hh:mm',
                },
                {
                  id: 'resuscitationEndTime',
                  type: 'time',
                  label: '复苏结束时间（ROSC或宣布死亡）',
                  required: true,
                  placeholder: 'hh:mm',
                },
                {
                  id: 'resuscitationDuration',
                  type: 'number',
                  label: '持续复苏时长',
                  required: false,
                  unit: '分钟',
                },
              ],
            },
          ],
        },

        {
          id: 'initial-rhythm',
          title: '初始心律',
          fieldGroups: [
            {
              id: 'rhythm-type',
              fields: [
                {
                  id: 'initialRhythm',
                  type: 'radio',
                  label: '初始心律',
                  required: true,
                  options: [
                    { value: 'vf', label: 'VF（室颤）' },
                    { value: 'pvt', label: 'pVT（无脉室速）' },
                    { value: 'pea', label: 'PEA（无脉电活动）' },
                    { value: 'asystole', label: 'Asystole（心搏停止）' },
                    { value: 'unknown', label: '未知' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // ==================== 模块 E：预后与结局（通用） ====================
    {
      id: 'module-e',
      title: '模块 E：预后与结局',
      description: '所有患者必填',
      sections: [
        {
          id: 'immediate-outcome',
          title: '复苏后即刻结局',
          fieldGroups: [
            {
              id: 'rosc-status',
              fields: [
                {
                  id: 'roscAchieved',
                  type: 'radio',
                  label: 'ROSC（自主循环恢复）',
                  required: true,
                  options: [
                    { value: 'yes', label: '是（且维持 > 20分钟）' },
                    { value: 'no', label: '否（现场死亡/终止抢救）' },
                  ],
                },
              ],
            },
          ],
        },

        {
          id: 'discharge-outcome',
          title: '出院时结局',
          description: 'Utstein Core - 必须精确',
          fieldGroups: [
            {
              id: 'survival-status',
              fields: [
                {
                  id: 'dischargeStatus',
                  type: 'radio',
                  label: '生存状态',
                  required: true,
                  options: [
                    { value: 'death', label: '死亡' },
                    { value: 'alive', label: '存活出院' },
                  ],
                },
                {
                  id: 'dischargeDate',
                  type: 'date',
                  label: '出院日期',
                  required: false,
                },
                {
                  id: 'dischargeCPC',
                  type: 'radio',
                  label: '出院时神经功能评分（CPC Score）',
                  required: true,
                  options: [
                    { value: 'cpc-1', label: 'CPC 1（脑功能良好，生活自理）' },
                    { value: 'cpc-2', label: 'CPC 2（中度残疾，生活自理）' },
                    { value: 'cpc-3', label: 'CPC 3（重度残疾，需他人照料）' },
                    { value: 'cpc-4', label: 'CPC 4（植物状态/昏迷）' },
                    { value: 'cpc-5', label: 'CPC 5（死亡）' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
