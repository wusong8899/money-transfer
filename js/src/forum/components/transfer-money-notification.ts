import app from 'flarum/forum/app';
import Notification from 'flarum/forum/components/Notification';
import type NotificationModel from 'flarum/common/models/Notification';

export default class TransferMoneyNotification extends Notification<{ notification: NotificationModel }> {
  icon(): string {
    return 'fas fa-money-bill';
  }

  href(): string {
    const { user } = app.session;
    let username = '';
    if (user) {
      username = user.username();
    }
    return app.route('user.transferHistory', { username });
  }

  content(): Mithril.Children {
    const user = this.attrs.notification.fromUser();
    return app.translator.trans(
      'wusong8899-transfer-money.forum.notifications.user-transfer-money-to-you',
      {
        user,
      }
    );
  }

  excerpt(): Mithril.Children {
    const notification = this.attrs.notification.subject() as unknown;
    let transferMoney: unknown = '';
    let transferID: unknown = '';

    if (notification && (notification as { attribute?: Function }).attribute) {
      transferMoney = (notification as { attribute: Function }).attribute('transfer_money_value');
      transferID = (notification as { attribute: Function }).attribute('id');
    }
    const moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
    const costText = moneyName.replace('[money]', transferMoney);

    return app.translator.trans(
      'wusong8899-transfer-money.forum.notifications.user-transfer-money-details',
      {
        cost: costText,
        id: transferID,
      }
    );
  }
}
