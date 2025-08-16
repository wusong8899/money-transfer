import app from 'flarum/admin/app';
import SettingsPage from './components/settings-page';

const PERMISSION_PRIORITY = 90;

app.initializers.add('wusong8899-money-transfer', (): void => {
  app.extensionData.for('wusong8899-money-transfer')
    .registerPage(SettingsPage)
    .registerPermission(
      {
        icon: 'fas fa-exchange-alt',
        label: app.translator.trans('wusong8899-transfer-money.admin.permission.allow_use_transfer_money'),
        permission: 'transferMoney.allowUseTransferMoney',
      },
      'moderate',
      PERMISSION_PRIORITY
    );
});
