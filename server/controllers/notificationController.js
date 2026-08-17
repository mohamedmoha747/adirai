import { Notification } from '../models/Notification.js';
import { asyncHandler, success } from '../utils/api.js';

export const myNotifications = asyncHandler(async (req, res) => {
  const items = await Notification.find({ user: req.user._id, channel: 'IN_APP' }).sort({ createdAt: -1 }).limit(50);
  return success(res, { notifications: items });
});

export const markRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, _id: { $in: req.body.ids || [] } },
    { $set: { status: 'READ' } },
  );
  return success(res, {}, 200, 'Updated');
});
