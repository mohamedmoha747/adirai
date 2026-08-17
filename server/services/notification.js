import { Notification } from '../models/Notification.js';
import { NOTIFICATION_CHANNEL } from '../utils/constants.js';
import { env, isDev } from '../config/env.js';
import { emitToUser } from './socket.js';

class ChannelProvider {
  constructor(channel) {
    this.channel = channel;
  }

  async send() {
    throw new Error('Not implemented');
  }
}

class MockProvider extends ChannelProvider {
  async send({ to, title, message }) {
    console.log(`[${this.channel}] to=${to} | ${title} | ${message}`);
    return { ok: true, mocked: true };
  }
}

class EmailProvider extends ChannelProvider {
  constructor() {
    super(NOTIFICATION_CHANNEL.EMAIL);
  }

  async send(payload) {
    if (!env.emailApiKey || isDev) {
      return new MockProvider(this.channel).send(payload);
    }
    return new MockProvider(this.channel).send(payload);
  }
}

class SmsProvider extends ChannelProvider {
  constructor() {
    super(NOTIFICATION_CHANNEL.SMS);
  }

  async send(payload) {
    if (!env.smsApiKey || isDev) {
      return new MockProvider(this.channel).send(payload);
    }
    return new MockProvider(this.channel).send(payload);
  }
}

class WhatsAppProvider extends ChannelProvider {
  constructor() {
    super(NOTIFICATION_CHANNEL.WHATSAPP);
  }

  async send(payload) {
    if (!env.whatsappApiKey || isDev) {
      return new MockProvider(this.channel).send(payload);
    }
    return new MockProvider(this.channel).send(payload);
  }
}

const outbound = {
  [NOTIFICATION_CHANNEL.EMAIL]: new EmailProvider(),
  [NOTIFICATION_CHANNEL.SMS]: new SmsProvider(),
  [NOTIFICATION_CHANNEL.WHATSAPP]: new WhatsAppProvider(),
};

export const NotificationService = {
  async notify({
    user,
    order = null,
    title,
    message,
    type = 'ORDER',
    channels = [NOTIFICATION_CHANNEL.IN_APP, NOTIFICATION_CHANNEL.EMAIL],
    phone,
    email,
  }) {
    const created = [];
    for (const channel of channels) {
      const doc = await Notification.create({
        user: user._id || user,
        order,
        type,
        title,
        message,
        channel,
        status: 'QUEUED',
      });

      try {
        if (channel === NOTIFICATION_CHANNEL.IN_APP) {
          doc.status = 'SENT';
          await doc.save();
          emitToUser(String(user._id || user), 'notification:new', {
            id: doc._id,
            title,
            message,
            order,
            createdAt: doc.createdAt,
          });
        } else {
          const provider = outbound[channel];
          const to = channel === NOTIFICATION_CHANNEL.EMAIL ? email : phone;
          await provider.send({ to, title, message });
          doc.status = 'SENT';
          await doc.save();
        }
      } catch (err) {
        doc.status = 'FAILED';
        await doc.save();
        console.error(`Notification ${channel} failed`, err.message);
      }
      created.push(doc);
    }
    return created;
  },
};
