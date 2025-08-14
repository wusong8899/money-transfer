import ExtensionPage from 'flarum/components/ExtensionPage';

export default class SettingsPage extends ExtensionPage {
  oninit(attrs) {
    super.oninit(attrs);
  }

  content() {
    return (
      <div className="ExtensionPage-settings">
        <div className="container">
          {this.buildSettingComponent({
            type: 'switch',
            setting: 'moneyTransfer.moneyTransferClient1Customization',
            label: app.translator.trans('wusong8899-transfer-money.admin.transfer-money-client-customization'),
            help:app.translator.trans('wusong8899-transfer-money.admin.transfer-money-client-customization-help')
          })}

          {this.buildSettingComponent({
            type: 'string',
            setting: 'moneyTransfer.moneyTransferTimeZone',
            label: app.translator.trans('wusong8899-transfer-money.admin.transfer-money-timezone'),
            help: app.translator.trans('wusong8899-transfer-money.admin.transfer-money-timezone-help'),
            placeholder:app.translator.trans('wusong8899-transfer-money.admin.transfer-money-timezone-default')
          })}

          <div className="Form-group">{this.submitButton()}</div>
        </div>
      </div>
    );
  }

}
