import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import type Mithril from 'mithril';

export default class SettingsPage extends ExtensionPage {
  oninit(vnode: Mithril.Vnode<unknown, this>): void {
    super.oninit(vnode);
  }

  content(): JSX.Element {
    return (
      <div className="ExtensionPage-settings">
        <div className="container">
          {this.buildSettingComponent({
            type: 'switch',
            setting: 'moneyTransfer.moneyTransferClient1Customization',
            label: app.translator.trans('wusong8899-transfer-money.admin.transfer-money-client-customization'),
            help: app.translator.trans('wusong8899-transfer-money.admin.transfer-money-client-customization-help'),
          })}

          {this.buildSettingComponent({
            type: 'string',
            setting: 'moneyTransfer.moneyTransferTimeZone',
            label: app.translator.trans('wusong8899-transfer-money.admin.transfer-money-timezone'),
            help: app.translator.trans('wusong8899-transfer-money.admin.transfer-money-timezone-help'),
            placeholder: app.translator.trans('wusong8899-transfer-money.admin.transfer-money-timezone-default'),
          })}

          <div className="Form-group">{this.submitButton()}</div>
        </div>
      </div>
    );
  }
}
