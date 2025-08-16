import { extend } from 'flarum/common/extend';
import LinkButton from 'flarum/components/LinkButton';
import UserPage from 'flarum/components/UserPage';
import TransferHistoryPage from './components/transfer-history-page';
import type ItemList from 'flarum/utils/ItemList';

const TRANSFER_HISTORY_PRIORITY = 10;

export default function addTransferMoneyPage(): void {
  (app as unknown as { routes: Record<string, unknown> }).routes['user.transferHistory'] = {
    component: TransferHistoryPage,
    path: '/u/:username/transferHistory',
  };

  extend(UserPage.prototype, 'navItems', function addNavItem(items: unknown) {
    if (app.session.user) {
      const currentUser = app.session.user;
      const profileUser = this.user;

      if (currentUser && profileUser && currentUser.id() === profileUser.id()) {
        (items as ItemList<unknown>).add(
          'transferHistory',
          LinkButton.component(
            {
              href: app.route('user.transferHistory', { username: profileUser.username() }),
              icon: 'fas fa-exchange-alt',
            },
            app.translator.trans('wusong8899-transfer-money.forum.transfer-history')
          ),
          TRANSFER_HISTORY_PRIORITY
        );
      }
    }
  });
}
