import UserPage from 'flarum/components/UserPage';
import TransferHistoryList from './transfer-history-list';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import type Mithril from 'mithril';
import type { UserWithMoney, TransferHistoryPageProps } from '../types';

/**
 * Page component for displaying user's transfer history
 *
 * This component extends UserPage to provide a dedicated view
 * for users to see their money transfer history.
 */
export default class TransferHistoryPage extends UserPage<TransferHistoryPageProps> {
  /**
   * Initialize the component and load user data
   */
  oninit(vnode: Mithril.Vnode<TransferHistoryPageProps, this>): void {
    super.oninit(vnode);

    const username = m.route.param('username');
    if (username) {
      this.loadUser(username);
    }
  }

  /**
   * Render the main content of the transfer history page
   */
  content(): JSX.Element {
    // Show loading indicator while user data is being loaded
    if (!this.user) {
      return (
        <div className="TransferHistoryPage">
          <div className="TransferHistoryPage-loading">
            <LoadingIndicator />
          </div>
        </div>
      );
    }

    const typedUser = this.user as UserWithMoney;

    return (
      <div className="TransferHistoryPage">
        <div className="TransferHistoryPage-header">
          <h2 className="TransferHistoryPage-title">
            {app.translator.trans('wusong8899-transfer-money.forum.transfer-history')}
          </h2>
        </div>
        <div className="TransferHistoryPage-content">
          <TransferHistoryList params={{ user: typedUser }} />
        </div>
      </div>
    );
  }

  /**
   * Handle user data display
   */
  show(user: UserWithMoney): void {
    super.show(user);
  }

  /**
   * Get the page title for SEO and browser tab
   */
  title(): string {
    const baseTitle = app.translator.trans('wusong8899-transfer-money.forum.transfer-history');
    if (this.user) {
      return `${baseTitle} - ${this.user.displayName()}`;
    }
    return baseTitle;
  }
}
