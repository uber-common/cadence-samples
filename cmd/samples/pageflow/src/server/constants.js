export const ALLOWED_ACTION_ON_STATUS_MAP = {
  approve: ['SUBMITTED'],
  reject: ['SUBMITTED'],
  submit: ['DRAFT', 'REJECTED', 'WITHDRAWN'],
  withdraw: ['SUBMITTED'],
};

export const ACTION_TO_STATUS_MAP = {
  approve: 'APPROVED',
  reject: 'REJECTED',
  submit: 'SUBMITTED',
  withdraw: 'WITHDRAWN',
};
