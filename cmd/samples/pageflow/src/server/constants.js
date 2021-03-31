export const ALLOWED_STATE_ON_STATUS_MAP = {
  approve: ['submitted'],
  reject: ['submitted'],
  submit: ['created', 'withdrawn'],
  withdraw: ['submitted'],
};

export const EXPECTED_STATUS_FROM_STATE = {
  approve: 'approved',
  create: 'created',
  reject: 'created',
  save: 'created',
  submit: 'submitted',
  withdraw: 'withdrawn',
};

export const STATE_QUERY_TYPE = 'state';

export const STATE_QUERY_ARGS = Buffer.from('true', 'utf8');

export const STRONG_QUERY_CONSISTANCY = 'STRONG';

export const TRIGGER_SIGNAL = 'trigger-signal';
