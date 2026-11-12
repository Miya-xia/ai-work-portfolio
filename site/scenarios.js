'use strict';
// Written for this public demo: not customer records, model output, or production rules.
window.PORTFOLIO_SCENARIOS = [
  {
    id: 'low', name: '常规咨询', risk: '低风险', emotion: '平稳，询问信息',
    messages: [['10:00', 'Hi! Could you help me check my delivery? 🙂']],
    signals: ['单条询问，未出现连续追问。', '表达礼貌，诉求是了解配送状态。', '表情仅为辅助线索，不能单独决定风险。'],
    decision: '准备常规草稿，必要信息与物流状态仍需人工核实。',
    reply: 'Hi! Thanks for reaching out. Our support team can help check the delivery status. Please share only the order reference needed for this inquiry in the appropriate support channel.',
    checks: '不编造配送进度或到货时间；不索取不必要的个人信息。'
  },
  {
    id: 'medium', name: '连续追问', risk: '中风险', emotion: '焦虑、不满，需要明确回应',
    messages: [['10:00', 'Any update on my delivery?'], ['10:03', 'I asked yesterday and still haven’t heard back.'], ['10:05', 'Hello?? This is frustrating 😤']],
    signals: ['虚构对话中出现连续追问，并提及之前未获回应。', '“still haven’t heard back / frustrating” 表达不满。', '结合文字和上下文理解表情，不设自动升级阈值。'],
    decision: '先回应感受，再明确核查路径。草稿必须经过人工审核。',
    reply: 'I’m sorry you’ve had to follow up more than once. I understand the wait has been frustrating. Our support team will check the available information before confirming the next steps, rather than give you an unverified delivery date.',
    checks: '检查语气是否自然；不要承诺未经确认的时效、退款或补偿。'
  },
  {
    id: 'high', name: '安全相关反馈', risk: '高风险', emotion: '担忧、紧迫，需要人工优先跟进',
    messages: [['10:00', 'The item seems damaged and I don’t feel safe using it.'], ['10:01', 'Please help me understand what to do next.'], ['10:02', 'I need a person to review this now 😡']],
    signals: ['安全相关的明确诉求优先于消息频次。', '用户要求人工介入，不能继续机械重复模板。', '情绪线索辅助理解，不代替事实核查或专业判断。'],
    decision: '停止常规自动处置，优先转人工；不推断损坏原因或安全结论。',
    reply: 'I’m sorry to hear about this. Please avoid using the item while the issue is being reviewed. A member of the support team should review the details and confirm the appropriate next steps. We won’t make a safety assessment or promise a resolution before checking.',
    checks: '保留人工升级路径；不做安全保证，不自动发送，不做未经核实的赔付承诺。'
  }
];
