import app from 'flarum/forum/app';
import Search from 'flarum/forum/components/Search';
import UserSearchSource from './sources/user-search-source';
import ItemList from 'flarum/common/utils/ItemList';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import username from 'flarum/common/helpers/username';
import avatar from 'flarum/common/helpers/avatar';
import type Mithril from 'mithril';
import type User from 'flarum/common/models/User';
import {
  RANDOM_STRING_BASE,
  RANDOM_STRING_START_INDEX,
  SEARCH_TYPING_DELAY,
  MIN_SEARCH_LENGTH,
  EMPTY_ARRAY_LENGTH
} from '../constants';

interface TransferMoneySearchModalAttrs {
  selected: unknown;
  selectedUsers: Record<string, number>;
  needMoney: unknown;
  callback: () => void;
}

export default class TransferMoneySearchModal extends Search<TransferMoneySearchModalAttrs> {
  private inputUuid!: string;
  private typingTimer?: number;
  private doSearch = false;

  oninit(vnode: Mithril.Vnode<TransferMoneySearchModalAttrs, this>): void {
    super.oninit(vnode);
    this.inputUuid = Math.random().toString(RANDOM_STRING_BASE).substring(RANDOM_STRING_START_INDEX);
  }

  oncreate(vnode: Mithril.VnodeDOM<TransferMoneySearchModalAttrs, this>): void {
    super.oncreate(vnode);

    this.$('.Search-results').on('click', () => {
      const target = this.$('.SearchResult.active');
      this.addRecipient(target.data('index') as string);
      this.$('.RecipientsInput').focus();
    });

    this.$('.Search-results').on('touchstart', (event: TouchEvent) => {
      const target = this.$(event.target as Element).parent();
      this.addRecipient(target.data('index') as string);
      this.$('.RecipientsInput').focus();
    });

    (globalThis as { jquery: (selector: string) => JQuery }).jquery('.RecipientsInput')
      .on('input', () => {
        clearTimeout(this.typingTimer);
        this.doSearch = false;
        this.typingTimer = globalThis.setTimeout(() => {
          this.doSearch = true;
          m.redraw();
        }, SEARCH_TYPING_DELAY);
      })
      .on('keydown', () => {
        clearTimeout(this.typingTimer);
      });

    super.oncreate(vnode);
  }

  view(): Mithril.Children {
    if (typeof this.searchState.getValue() === 'undefined') {
      this.searchState.setValue('');
    }

    const searchValue = this.searchState.getValue();
    const loading = searchValue && searchValue.length >= MIN_SEARCH_LENGTH;

    if (!this.sources) {
      this.sources = this.sourceItems().toArray();
    }

    const selectedUserArray = (this.attrs.selected as () => ItemList<User>)().toArray();

    return (
      <div className="transferSearchContainer">
        <div className="transferSearchUserListContainer">
          {selectedUserArray.length === EMPTY_ARRAY_LENGTH && (
            <div style="height:34px;cursor: default !important;" class="transferSearchUserContainer">
              <span class="transferSearchUser">{app.translator.trans('wusong8899-transfer-money.forum.transfer-search-no-user-selected')}</span>
            </div>
          )}

          {selectedUserArray
            .map((recipient: User) => {
              const userName = username(recipient);
              const userAvatar = avatar(recipient);

              return (
                <div class="transferSearchUserContainer" onclick={(event: MouseEvent) => this.removeRecipient(recipient, event)}>
                  <span class="transferSearchUser">{userAvatar}</span> {userName}
                </div>
              );
            })}
        </div>

        <div className="Search">
          <div className="Search-input">
            <input
              className="RecipientsInput FormControl"
              type="search"
              placeholder={extractText(app.translator.trans('wusong8899-transfer-money.forum.transfer-search-placeholder'))}
              value={this.searchState.getValue()}
              oninput={(event: InputEvent) => this.searchState.setValue((event.target as HTMLInputElement).value)}
              onfocus={() => (this.hasFocus = true)}
              onblur={() => (this.hasFocus = false)}
            />
            <ul className={classList('Dropdown-menu', 'Search-results', 'fade', { in: !!loading })}>
              {this.renderSearchResults()}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  private renderSearchResults(): Mithril.Children {
    if (!this.doSearch) {
      return LoadingIndicator.component({ size: 'tiny', className: 'Button Button--icon Button--link' });
    }

    return this.sources.map((source: UserSearchSource) => source.view(this.searchState.getValue()));
  }

  sourceItems(): ItemList<UserSearchSource> {
    const items = new ItemList<UserSearchSource>();
    items.add('users', new UserSearchSource());
    return items;
  }

  addRecipient(value: string): void {
    const [type, id] = value.split(':');
    const recipient = this.findRecipient(type, id);

    if (recipient) {
      (this.attrs.selected as () => ItemList<User>)().add(value, recipient);
      this.attrs.selectedUsers[recipient.data.id] = 1;
      (this.attrs.needMoney as (value: number) => void)(this.getNeedMoney());
      this.searchState.setValue('');
    }
  }

  removeRecipient(recipient: User, event: Event): void {
    event.preventDefault();

    const userID = recipient.data.id;
    Reflect.deleteProperty(this.attrs.selectedUsers, userID);

    (this.attrs.selected as () => ItemList<User>)().remove('users:' + userID);
    (this.attrs.needMoney as (value: number) => void)(this.getNeedMoney());
  }

  getNeedMoney(): number {
    const inputElement = document.getElementById('moneyTransferInput') as HTMLInputElement;
    if (!inputElement) {
      return EMPTY_ARRAY_LENGTH;
    }
    const moneyTransferValue = Number.parseFloat(inputElement.value);
    return moneyTransferValue * Object.keys(this.attrs.selectedUsers).length;
  }

  findRecipient(store: string, id: string): User | null {
    return app.store.getById(store, id) as User | null;
  }
}
