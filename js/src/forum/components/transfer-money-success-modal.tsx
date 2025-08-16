import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import type Mithril from 'mithril';
import { BUTTON_WIDTH } from '../constants';

export default class TransferMoneySuccessModal extends Modal {
  static isDismissible = false;

  oninit(vnode: Mithril.Vnode<unknown, this>): void {
    super.oninit(vnode);
  }

  className(): string {
    return 'Modal--small';
  }

  title(): string {
    return app.translator.trans('wusong8899-transfer-money.forum.transfer-money-success');
  }

  content(): Mithril.Children {
    return [
      <div className="Modal-body">
        <div style="text-align:center">
          {Button.component(
            {
              style: `width:${BUTTON_WIDTH}`,
              className: 'Button Button--primary',
              onclick: () => {
                location.reload();
              },
            },
            app.translator.trans('wusong8899-transfer-money.forum.ok')
          )}
        </div>
      </div>,
    ];
  }
}
