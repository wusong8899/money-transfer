import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import SearchState from 'flarum/forum/states/SearchState';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import Alert from 'flarum/common/components/Alert';
import type Mithril from 'mithril';

import TransferMoneySearchModal from './transfer-money-search-modal';
import TransferMoneySuccessModal from './transfer-money-success-modal';
import type {
  TransferMoneyModalAttrs,
  TransferMoneyResponsePayload
} from '../types';
import {
  DEFAULT_MONEY_AMOUNT,
  DEFAULT_USER_COUNT,
  MINIMUM_TRANSFER_AMOUNT,
  DEFAULT_MONEY_NAME,
  MONEY_ATTRIBUTE_KEY,
  USER_SELECTION_PREFIX,
  DEFAULT_USER_SELECTION_COUNT,
  TEXTAREA_MAX_LENGTH
} from '../constants';

export default class TransferMoneyModal extends Modal<TransferMoneyModalAttrs> {
  static isDismissible = false;

  private selected!: Stream<ItemList<unknown>>;
  private selectedUsers!: Record<string, number>;
  private moneyName!: string;
  private recipientSearch!: SearchState;
  private needMoney!: Stream<number>;

  oninit(vnode: Mithril.Vnode<TransferMoneyModalAttrs, this>): void {
    super.oninit(vnode);
    this.selected = Stream.of(new ItemList());
    this.selectedUsers = {};
    this.moneyName = app.forum.attribute(MONEY_ATTRIBUTE_KEY) as string || DEFAULT_MONEY_NAME;

    const targetUser = this.attrs.user;
    if (targetUser) {
      this.selected().add(USER_SELECTION_PREFIX + targetUser.id(), targetUser);
      this.selectedUsers[targetUser.id()] = DEFAULT_USER_SELECTION_COUNT;
    }

    this.recipientSearch = new SearchState();
    this.needMoney = Stream.of(DEFAULT_MONEY_AMOUNT);
  }

  className(): string {
    return 'Modal--small';
  }

  title(): string {
    return app.translator.trans('wusong8899-transfer-money.forum.transfer-money');
  }

  private getCurrentUserMoney(): number {
    if (!app.session.user) {
      return DEFAULT_MONEY_AMOUNT;
    }
    const money = app.session.user.attribute('money');
    if (typeof money === 'number') {
      return money;
    }
    return DEFAULT_MONEY_AMOUNT;
  }

  private getMoneyTransferInputValue(): number {
    const inputElement = document.getElementById('moneyTransferInput') as HTMLInputElement;
    if (!inputElement) {
      return DEFAULT_MONEY_AMOUNT;
    }
    const value = Number.parseFloat(inputElement.value);
    if (Number.isNaN(value)) {
      return DEFAULT_MONEY_AMOUNT;
    }
    return value;
  }

  private getMoneyTransferNotesValue(): string {
    const inputElement = document.getElementById('moneyTransferNotesInput') as HTMLInputElement;
    if (!inputElement) {
      return '';
    }
    return inputElement.value;
  }

  private handleRedraw = (): void => {
    m.redraw();
  };

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div style="padding-bottom:20px;" className="TransferMoneyModal-form">
            {TransferMoneySearchModal.component({
              state: this.recipientSearch,
              selected: this.selected,
              selectedUsers: this.selectedUsers,
              needMoney: this.needMoney,
              callback: this.handleRedraw,
            })}
          </div>

          <div className="Form-group">
            <label>
              {app.translator.trans('wusong8899-transfer-money.forum.current-money-amount')}
              {this.moneyName.replace('[money]', String(this.getCurrentUserMoney()))}
            </label>
            <input
              id="moneyTransferInput"
              placeholder={app.translator.trans('wusong8899-transfer-money.forum.transfer-money-input-placeholder')}
              required
              className="FormControl"
              type="number"
              step="any"
              min="0"
              oninput={() => this.moneyTransferChanged()}
            />
            <div style="padding-top:10px">
              {app.translator.trans('wusong8899-transfer-money.forum.need-money-amount')}
              <span id="needMoneyContainer">{this.moneyName.replace('[money]', String(this.needMoney()))}</span>
            </div>
          </div>

          <div className="Form-group">
            <label>{app.translator.trans('wusong8899-transfer-money.forum.transfer-money-notes')}</label>
            <textarea id="moneyTransferNotesInput" maxlength={TEXTAREA_MAX_LENGTH} className="FormControl" />
          </div>

          <div className="Form-group" style="text-align: center;">
            {Button.component(
              {
                className: 'Button Button--primary',
                type: 'submit',
                loading: this.loading,
              },
              app.translator.trans('wusong8899-transfer-money.forum.ok')
            )}
            &nbsp;
            {Button.component(
              {
                className: 'Button transferMoneyButton--gray',
                loading: this.loading,
                onclick: () => {
                  this.hide();

                  if (this.attrs.callback && typeof this.attrs.callback === 'function') {
                    this.attrs.callback();
                  }
                },
              },
              app.translator.trans('wusong8899-transfer-money.forum.cancel')
            )}
          </div>
        </div>
      </div>
    );
  }

  private getTotalNeedMoney(): number {
    const inputElement = document.getElementById('moneyTransferInput') as HTMLInputElement;
    if (!inputElement) {
      return DEFAULT_MONEY_AMOUNT;
    }

    let moneyTransferValue = Number.parseFloat(inputElement.value);

    if (Number.isNaN(moneyTransferValue)) {
      moneyTransferValue = DEFAULT_MONEY_AMOUNT;
    }

    return Object.keys(this.selectedUsers).length * moneyTransferValue;
  }

  private moneyTransferChanged(): void {
    const totalNeedMoney = this.getTotalNeedMoney();
    const totalNeedMoneyText = this.moneyName.replace('[money]', String(totalNeedMoney));
    const needMoneyContainer = document.getElementById('needMoneyContainer');
    if (needMoneyContainer) {
      needMoneyContainer.textContent = totalNeedMoneyText;
    }
  }

  onsubmit(event: Event): void {
    event.preventDefault();
    const userMoney = this.getCurrentUserMoney();
    const moneyTransferValue = this.getMoneyTransferInputValue();
    const moneyTransferValueTotal = this.getTotalNeedMoney();
    const moneyTransferNotesValue = this.getMoneyTransferNotesValue();

    if (moneyTransferValueTotal > userMoney) {
      app.alerts.show(Alert, { type: 'error' }, app.translator.trans('wusong8899-transfer-money.forum.transfer-error-insufficient-fund'));
      return;
    }

    if (Object.keys(this.selectedUsers).length === DEFAULT_USER_COUNT) {
      app.alerts.show(
        Alert,
        { type: 'error' },
        app.translator.trans('wusong8899-transfer-money.forum.transfer-error-no-target-user-selected')
      );
      return;
    }

    if (moneyTransferValue > MINIMUM_TRANSFER_AMOUNT) {
      const moneyTransferData = {
        moneyTransfer: moneyTransferValue,
        moneyTransferNotes: moneyTransferNotesValue,
        selectedUsers: JSON.stringify(Object.keys(this.selectedUsers)),
      };

      this.loading = true;

      app.store
        .createRecord('transferMoney')
        .save(moneyTransferData)
        .then((payload: TransferMoneyResponsePayload) => {
          app.store.pushPayload(payload);
          app.modal.show(TransferMoneySuccessModal);
          this.loading = false;

          if (this.attrs.callback && typeof this.attrs.callback === 'function') {
            this.attrs.callback();
          }
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
}

