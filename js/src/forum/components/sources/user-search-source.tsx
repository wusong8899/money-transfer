import type Mithril from 'mithril';
import username from 'flarum/common/helpers/username';
import avatar from 'flarum/common/helpers/avatar';
import highlight from 'flarum/common/helpers/highlight';

const MIN_QUERY_LENGTH = 3;
const SEARCH_LIMIT = 5;

export default class UserSearchSource {
  private results: unknown[] = [];

  search(query: string): Promise<void> {
    if (!query || query.length < MIN_QUERY_LENGTH) {
      this.results = [];
      return Promise.resolve();
    }

    return app.store.find('users', { filter: { query }, page: { limit: SEARCH_LIMIT } })
      .then((results) => {
        this.results = results;
      });
  }

  view(query: string): Mithril.Vnode[] {
    if (!this.results || !this.results.length) {
      return [];
    }

    return this.results.map((user: unknown) => (
      <li className="SearchResult" data-index={`users:${(user as { id(): string }).id()}`}>
        <a className="SearchResult" tabindex="-1">
          {avatar(user)} {username(user)}
          <span className="SearchResult-excerpt">{highlight((user as { username(): string }).username(), query)}</span>
        </a>
      </li>
    ));
  }
}
