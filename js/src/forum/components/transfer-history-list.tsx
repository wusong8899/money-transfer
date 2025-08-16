import Component from 'flarum/Component';
import app from 'flarum/app';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Placeholder from 'flarum/common/components/Placeholder';
import Alert from 'flarum/common/components/Alert';
import TransferHistoryListItem from './transfer-history-list-item';
import type Mithril from 'mithril';
import type {
  TransferHistoryListProps,
  TransferMoneyModel,
  UserWithMoney,
  ComponentState
} from '../types';
import { STANDARD_ITEMS_PER_PAGE, DEFAULT_MONEY_AMOUNT } from '../constants';

/**
 * Component for displaying a list of transfer history records
 *
 * This component handles loading, displaying, and pagination of
 * money transfer history for a specific user.
 */
export default class TransferHistoryList extends Component<TransferHistoryListProps> {
  private state: ComponentState = {
    loading: false,
    error: '',
    data: [],
    hasMore: false
  };

  private user: UserWithMoney;
  private static readonly ITEMS_PER_PAGE = STANDARD_ITEMS_PER_PAGE; // Standard pagination size
  private static readonly EMPTY_LIST_LENGTH = DEFAULT_MONEY_AMOUNT;

  /**
   * Initialize the component and start loading data
   */
  oninit(vnode: Mithril.Vnode<TransferHistoryListProps, this>): void {
    super.oninit(vnode);

    this.user = this.attrs.params.user;
    this.state = {
      loading: false,
      error: '',
      data: [],
      hasMore: false
    };

    this.loadResults();
  }

  /**
   * Render the transfer history list
   */
  view(): Mithril.Children {
    // Show loading indicator
    if (this.state.loading) {
      return (
        <div className="TransferHistoryList">
          <div className="TransferHistoryList-loading">
            <LoadingIndicator />
          </div>
        </div>
      );
    }

    // Show error message if there's an error
    if (this.state.error) {
      return (
        <div className="TransferHistoryList">
          <div className="TransferHistoryList-error">
            <Alert type="error" dismissible={false}>
              {this.state.error}
            </Alert>
          </div>
        </div>
      );
    }

    // Render transfer history items
    const transferHistoryItems = this.state.data
      .filter((transferHistory): transferHistory is TransferMoneyModel =>
        transferHistory && typeof transferHistory.id === 'function'
      )
      .map((transferHistory) => (
        <li
          className="TransferHistoryList-item"
          key={transferHistory.id()}
          data-id={transferHistory.id()}
        >
          <TransferHistoryListItem transferHistory={transferHistory} />
        </li>
      ));

    return (
      <div className="TransferHistoryList">
        <div className="TransferHistoryList-header">
          <h3>{app.translator.trans('wusong8899-transfer-money.forum.transfer-history')}</h3>
        </div>

        <div className="TransferHistoryList-content">
          {this.state.data.length === TransferHistoryList.EMPTY_LIST_LENGTH && (
            <div className="TransferHistoryList-empty">
              <Placeholder text={app.translator.trans('wusong8899-transfer-money.forum.transfer-history-empty')} />
            </div>
          )}

          {this.state.data.length > TransferHistoryList.EMPTY_LIST_LENGTH && (
            <ul className="TransferHistoryList-items">
              {transferHistoryItems}
            </ul>
          )}

          {this.state.hasMore && (
            <div className="TransferHistoryList-loadMore">
              <Button
                className="Button"
                onclick={this.loadMore.bind(this)}
                loading={this.state.loading}
              >
                {app.translator.trans('wusong8899-transfer-money.forum.load-more')}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /**
   * Load more transfer history records
   */
  loadMore(): void {
    if (this.state.loading) {
      return;
    }

    this.state.loading = true;
    this.loadResults(this.state.data.length)
      .catch((error) => this.handleError(error))
      .finally(() => {
        this.state.loading = false;
        m.redraw();
      });
  }

  /**
   * Parse API response and update component state
   */
  private parseResults(results: unknown): void {
    try {
      if (typeof results === 'object' && results) {
        const response = results as { payload?: { links?: { next?: string } } };
        const hasNext = response.payload && response.payload.links && response.payload.links.next;
        this.state.hasMore = !!hasNext;
      } else {
        this.state.hasMore = false;
      }

      // Get fresh data from store
      const newData = app.store.all('transferMoney') as TransferMoneyModel[];
      this.state.data = [...this.state.data, ...newData.filter(item =>
        !this.state.data.some(existing => existing.id() === item.id())
      )];

      this.state.error = '';
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handle errors during data loading
   */
  private handleError(error: unknown): void {
    // Log error for debugging (will be removed in production)
    if (app.forum.attribute('debug')) {
      // eslint-disable-next-line no-console
      console.error('Transfer history loading error:', error);
    }

    if (isApiError(error)) {
      this.state.error = error.message;
    } else if (error instanceof Error) {
      this.state.error = error.message;
    } else {
      this.state.error = app.translator.trans('wusong8899-transfer-money.forum.error-loading-history');
    }
  }

  /**
   * Load transfer history results from API
   */
  private loadResults(offset?: number): Promise<void> {
    const DEFAULT_OFFSET = 0;
    const actualOffset = offset ?? DEFAULT_OFFSET;

    this.state.loading = true;
    this.state.error = '';

    return app.store.find('transferMoney', {
      filter: {
        user: this.user.id(),
      },
      page: {
        offset: actualOffset,
        limit: TransferHistoryList.ITEMS_PER_PAGE,
      },
    })
    .then((results) => {
      this.parseResults(results);
    })
    .catch((error) => {
      this.handleError(error);
      throw error;
    })
    .finally(() => {
      this.state.loading = false;
    });
  }
}
