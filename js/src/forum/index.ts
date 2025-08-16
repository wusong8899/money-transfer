import { extend } from 'flarum/extend';
import UserControls from 'flarum/utils/UserControls';
import NotificationGrid from "flarum/components/NotificationGrid";
import SessionDropdown from 'flarum/forum/components/SessionDropdown';
import Button from 'flarum/components/Button';

import TransferMoney from "./model/transfer-money";
import TransferMoneyModal from './components/transfer-money-modal';
import TransferMoneyNotification from "./components/transfer-money-notification";
import addTransferMoneyPage from "./add-transfer-money-page";
import addClient1CustomizationFeatures from "./add-client1-customization-features";


app.initializers.add('wusong8899-money-transfer', () => {
  app.store.models.transferMoney = TransferMoney;
  app.notificationComponents.transferMoney = TransferMoneyNotification;

  addTransferMoneyPage();
  addClient1CustomizationFeatures();

  extend(NotificationGrid.prototype, "notificationTypes", function addTransferMoneyNotification(items) {
    items.add("transferMoney", {
      name: "transferMoney",
      icon: "fas fa-dollar-sign",
      label: app.translator.trans(
        "wusong8899-transfer-money.forum.receive-transfer-from-user"
      ),
    });
  });

  extend(UserControls, 'moderationControls', (items, user) => {
    const allowUseTransferMoney = app.forum.attribute('allowUseTransferMoney');

    if (app.session.user && allowUseTransferMoney) {
      const currentUserID = app.session.user.id();
      const targetUserID = user.id();

      if (currentUserID !== targetUserID) {
        items.add('transferMoney', Button.component({
          icon: 'fas fa-money-bill',
          onclick: () => app.modal.show(TransferMoneyModal, { user })
        }, app.translator.trans('wusong8899-transfer-money.forum.transfer-money'))
        );
      }
    }
  });

  const TRANSFER_MONEY_PRIORITY = -1;

  extend(SessionDropdown.prototype, 'items', function addTransferMoneyButton(items) {
    if (!app.session.user) {
      return;
    }

    items.add(
      'transferMoney',
      Button.component(
        {
          icon: 'fas fa-money-bill',
          onclick: () => {
            app.modal.show(TransferMoneyModal)
          },
        },
        app.translator.trans('wusong8899-transfer-money.forum.transfer-money')
      ),
      TRANSFER_MONEY_PRIORITY
    );
  });
});
