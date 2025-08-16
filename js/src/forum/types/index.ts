/**
 * Strict TypeScript type definitions for Money Transfer extension
 * 
 * This file provides type-safe interfaces for all models and components
 * used in the money transfer functionality.
 */

import type User from 'flarum/common/models/User';
import type Model from 'flarum/common/Model';
import type Stream from 'flarum/common/utils/Stream';
import type ItemList from 'flarum/common/utils/ItemList';
import type SearchState from 'flarum/forum/states/SearchState';

/**
 * Interface for User model with money transfer specific methods
 */
export interface UserWithMoney extends User {
  id(): string;
  username(): string;
  displayName(): string;
  email(): string | null;
  isEmailConfirmed(): boolean;
  money(): number;
  canTransferMoney(): boolean;
}

/**
 * Interface for Transfer Money model
 */
export interface TransferMoneyModel extends Model {
  id(): string;
  transferMoney(): number;
  notes(): string | null;
  assignedAt(): Date;
  fromUser(): UserWithMoney;
  targetUser(): UserWithMoney;
  createdAt(): Date;
  updatedAt(): Date;
}

/**
 * Interface for Transfer History List component props
 */
export interface TransferHistoryListProps {
  params: {
    user: UserWithMoney;
  };
}

/**
 * Interface for Transfer History List Item component props
 */
export interface TransferHistoryListItemProps {
  transferHistory: TransferMoneyModel;
}

/**
 * Interface for Transfer History Page component props
 */
export interface TransferHistoryPageProps {
  user?: UserWithMoney;
}

/**
 * Interface for API response structure
 */
export interface TransferHistoryApiResponse {
  data: TransferMoneyModel[];
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
}

/**
 * Interface for pagination parameters
 */
export interface PaginationParams {
  offset?: number;
  limit?: number;
}

/**
 * Interface for filter parameters
 */
export interface FilterParams {
  user?: string;
  [key: string]: unknown;
}

/**
 * Interface for API request parameters
 */
export interface ApiRequestParams {
  filter?: FilterParams;
  page?: PaginationParams;
  include?: string[];
  sort?: string;
}

/**
 * Type for component state
 */
export interface ComponentState {
  loading: boolean;
  error: string;
  data: TransferMoneyModel[];
  hasMore: boolean;
}

/**
 * Type for error handling
 */
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * Type guard to check if an object is a UserWithMoney
 */
export const isUserWithMoney = (obj: unknown): obj is UserWithMoney => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;
  return (
    'id' in candidate &&
    'username' in candidate &&
    typeof candidate.id === 'function' &&
    typeof candidate.username === 'function'
  );
};

/**
 * Type guard to check if an object is a TransferMoneyModel
 */
export const isTransferMoneyModel = (obj: unknown): obj is TransferMoneyModel => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;
  return (
    'id' in candidate &&
    'transferMoney' in candidate &&
    'fromUser' in candidate &&
    'targetUser' in candidate &&
    typeof candidate.id === 'function' &&
    typeof candidate.transferMoney === 'function'
  );
};

/**
 * Type guard to check if an object is an ApiError
 */
export const isApiError = (obj: unknown): obj is ApiError => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;
  return (
    'message' in candidate &&
    typeof candidate.message === 'string'
  );
};

/**
 * Interface for Transfer Money Modal attributes
 */
export interface TransferMoneyModalAttrs {
  user?: UserWithMoney;
  callback?: () => void;
}

/**
 * Interface for Transfer Money Modal state
 */
export interface TransferMoneyModalState {
  selected: Stream<ItemList<unknown>>;
  selectedUsers: Record<string, number>;
  moneyName: string;
  recipientSearch: SearchState;
  needMoney: Stream<number>;
}

/**
 * Interface for Transfer Money API request data
 */
export interface TransferMoneyRequestData {
  moneyTransfer: number;
  moneyTransferNotes: string;
  selectedUsers: string;
}

/**
 * Interface for Transfer Money API response payload
 */
export interface TransferMoneyResponsePayload {
  data: {
    type: string;
    id: string;
    attributes: {
      transfer_money_value: number;
      notes?: string;
      assigned_at: string;
    };
    relationships: {
      fromUser: {
        data: {
          type: string;
          id: string;
        };
      };
      targetUser: {
        data: {
          type: string;
          id: string;
        };
      };
    };
  };
}

/**
 * Type for jQuery element value
 */
export interface JQueryElement {
  val(): string | number | string[];
  text(value: string): JQueryElement;
}

/**
 * Type for global jQuery access
 */
export interface GlobalWithJQuery {
  jquery: (selector: string) => JQueryElement;
}
