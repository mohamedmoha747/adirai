import { generateTransactionId } from '../utils/ids.js';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../utils/constants.js';
import { env, isDev } from '../config/env.js';
import { ApiError } from '../utils/api.js';

class PaymentProvider {
  constructor(name) {
    this.name = name;
  }

  async initiate() {
    throw new Error('Not implemented');
  }

  async verify() {
    throw new Error('Not implemented');
  }
}

class UPIProvider extends PaymentProvider {
  constructor() {
    super('UPI');
  }

  async initiate({ amount, orderNumber }) {
    const transactionId = generateTransactionId('UPI');
    return {
      transactionId,
      status: PAYMENT_STATUS.PROCESSING,
      meta: {
        qrPayload: `upi://pay?pa=adirai@upi&pn=Adirai&am=${amount.toFixed(2)}&tn=${orderNumber}&cu=INR`,
        instructions: 'Scan the QR or complete UPI payment, then confirm on the next screen.',
      },
    };
  }

  async verify({ success }) {
    if (env.paymentApiKey && env.paymentApiKey !== 'dev' && !isDev) {
      throw new ApiError(502, 'Live UPI verification is not configured');
    }
    const ok = success !== false;
    return {
      status: ok ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED,
      paidAt: ok ? new Date() : null,
    };
  }
}

class CardProvider extends PaymentProvider {
  constructor() {
    super('CARD');
  }

  async initiate({ amount }) {
    return {
      transactionId: generateTransactionId('CARD'),
      status: PAYMENT_STATUS.PROCESSING,
      meta: {
        clientSecret: `mock_secret_${amount}`,
        instructions: 'Enter card details. In development the backend verifies the charge.',
      },
    };
  }

  async verify({ cardLast4, success }) {
    if (env.paymentApiKey && env.paymentApiKey !== 'dev' && !isDev) {
      throw new ApiError(502, 'Live card verification is not configured');
    }
    const ok = success !== false && (!cardLast4 || /^\d{4}$/.test(String(cardLast4)));
    return {
      status: ok ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED,
      paidAt: ok ? new Date() : null,
    };
  }
}

class CODProvider extends PaymentProvider {
  constructor() {
    super('COD');
  }

  async initiate({ amount }) {
    return {
      transactionId: generateTransactionId('COD'),
      status: PAYMENT_STATUS.COD,
      meta: { amountDue: amount },
      paidAt: null,
    };
  }

  async verify() {
    return { status: PAYMENT_STATUS.COD, paidAt: null };
  }
}

const providers = {
  [PAYMENT_METHOD.UPI]: new UPIProvider(),
  [PAYMENT_METHOD.CARD]: new CardProvider(),
  [PAYMENT_METHOD.COD]: new CODProvider(),
};

export const PaymentService = {
  getProvider(method) {
    const provider = providers[method];
    if (!provider) throw new ApiError(400, 'Unsupported payment method');
    return provider;
  },

  initiate(method, payload) {
    return this.getProvider(method).initiate(payload);
  },

  verify(method, payload) {
    return this.getProvider(method).verify(payload);
  },
};
