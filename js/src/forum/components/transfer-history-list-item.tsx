import Component from 'flarum/Component';
import Link from 'flarum/common/components/Link';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import type Mithril from 'mithril';
import type { TransferHistoryListItemProps, UserWithMoney } from '../types';

/**
 * Helper function to get user profile link
 */
const getUserLink = (user: UserWithMoney): string => {
  if (user) {
    return app.route.user(user);
  }
  return '#';
};

/**
 * Component for displaying a single transfer history item
 *
 * This component renders the details of a money transfer including
 * users involved, amount, date, and notes.
 */
export default class TransferHistoryListItem extends Component<TransferHistoryListItemProps> {
  /**
   * Render the transfer history item
   */
  view(): Mithril.Children {
    const { transferHistory } = this.attrs;
    const currentUser = app.session.user;
    let currentUserID = '';
    if (currentUser) {
      currentUserID = currentUser.id();
    }

    const fromUserID = transferHistory.attribute('from_user_id');
    const assignedAt = transferHistory.assignedAt();
    const fromUser = transferHistory.fromUser();
    const targetUser = transferHistory.targetUser();
    const transferMoney = transferHistory.transferMoney();
    const transferNotes = transferHistory.notes();
    const transferID = transferHistory.id();

    // Determine transfer type and styling
    const isOutgoing = currentUserID === fromUserID;
    let transferType = '';
    let transferTypeClass = '';

    if (isOutgoing) {
      transferType = app.translator.trans('wusong8899-transfer-money.forum.transfer-money-out');
      transferTypeClass = 'TransferHistoryItem-outgoing';
    } else {
      transferType = app.translator.trans('wusong8899-transfer-money.forum.transfer-money-in');
      transferTypeClass = 'TransferHistoryItem-incoming';
    }

    // Format money display
    const moneyName = app.forum.attribute('antoinefr-money.moneyname') || '[money]';
    const transferMoneyText = moneyName.replace('[money]', transferMoney.toString());

    // Format notes
    const transferNotesText = transferNotes || app.translator.trans('wusong8899-transfer-money.forum.transfer-list-transfer-notes-none');

    return (
      <div className={`TransferHistoryItem ${transferTypeClass}`}>
        <div className="TransferHistoryItem-header">
          <span className="TransferHistoryItem-type">
            <strong>{app.translator.trans('wusong8899-transfer-money.forum.transfer-list-type')}: </strong>
            <span className={`TransferHistoryItem-typeLabel ${transferTypeClass}`}>
              {transferType}
            </span>
          </span>
          <span className="TransferHistoryItem-separator"> | </span>
          <span className="TransferHistoryItem-date">
            <strong>{app.translator.trans('wusong8899-transfer-money.forum.transfer-list-assign-at')}: </strong>
            <span className="TransferHistoryItem-dateValue">
              {assignedAt.toLocaleDateString()} {assignedAt.toLocaleTimeString()}
            </span>
          </span>
        </div>

        <div className="TransferHistoryItem-details">
          <div className="TransferHistoryItem-id">
            <strong>{app.translator.trans('wusong8899-transfer-money.forum.transfer-list-id')}: </strong>
            {transferID}
          </div>

          <div className="TransferHistoryItem-users">
            <span className="TransferHistoryItem-fromUser">
              <strong>{app.translator.trans('wusong8899-transfer-money.forum.transfer-list-from-user')}: </strong>
              <Link href={getUserLink(fromUser)} className="TransferHistoryItem-userLink">
                {avatar(fromUser)} {username(fromUser)}
              </Link>
            </span>
            <span className="TransferHistoryItem-separator"> | </span>
            <span className="TransferHistoryItem-targetUser">
              <strong>{app.translator.trans('wusong8899-transfer-money.forum.transfer-list-target-user')}: </strong>
              <Link href={getUserLink(targetUser)} className="TransferHistoryItem-userLink">
                {avatar(targetUser)} {username(targetUser)}
              </Link>
            </span>
          </div>

          <div className="TransferHistoryItem-amount">
            <strong>{app.translator.trans('wusong8899-transfer-money.forum.transfer-list-transfer-amount')}: </strong>
            <span className="TransferHistoryItem-money">{transferMoneyText}</span>
          </div>

          {transferNotes && (
            <div className="TransferHistoryItem-notes">
              <strong>{app.translator.trans('wusong8899-transfer-money.forum.transfer-list-transfer-notes')}: </strong>
              <span className="TransferHistoryItem-notesText">{transferNotesText}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
