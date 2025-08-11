import {extend, override} from 'flarum/extend';
import SettingsPage from './components/SettingsPage';

app.initializers.add('wusong8899-money-transfer', () => {
  app.extensionData.for('wusong8899-money-transfer')
  .registerPage(SettingsPage)
  .registerPermission(
    {
      icon: 'fas fa-exchange-alt',
      label: app.translator.trans('wusong8899-transfer-money.admin.permission.allow_use_transfer_money'),
      permission: 'transferMoney.allowUseTranferMoney',
    },
    'moderate',
    90
  )
});
