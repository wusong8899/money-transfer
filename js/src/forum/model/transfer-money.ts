import Model from 'flarum/common/Model';
import type { TransferMoneyModel, UserWithMoney } from '../types';

/**
 * Model for transfer money records with strict typing
 */
export default class TransferMoney extends Model implements TransferMoneyModel {
  /**
   * Get the unique identifier for this transfer
   */
  id(): string {
    return Model.attribute<string>('id').call(this) || '';
  }

  /**
   * Get the transfer amount
   */
  transferMoney(): number {
    const DEFAULT_AMOUNT = 0;
    const amount = Model.attribute<number>('transfer_money_value').call(this);
    if (amount === null || typeof amount === 'undefined') {
      return DEFAULT_AMOUNT;
    }
    return amount;
  }

  /**
   * Get the transfer notes
   */
  notes(): string | null {
    return Model.attribute<string | null>('notes').call(this);
  }

  /**
   * Get the assignment date
   */
  assignedAt(): Date {
    const dateStr = Model.attribute<string>('assigned_at').call(this);
    if (dateStr) {
      return new Date(dateStr);
    }
    return new Date();
  }

  /**
   * Get the user who initiated the transfer
   */
  fromUser(): UserWithMoney {
    return Model.hasOne<UserWithMoney>('fromUser').call(this);
  }

  /**
   * Get the user who received the transfer
   */
  targetUser(): UserWithMoney {
    return Model.hasOne<UserWithMoney>('targetUser').call(this);
  }

  /**
   * Get the creation date
   */
  createdAt(): Date {
    const dateStr = Model.attribute<string>('created_at').call(this);
    if (dateStr) {
      return new Date(dateStr);
    }
    return new Date();
  }

  /**
   * Get the last update date
   */
  updatedAt(): Date {
    const dateStr = Model.attribute<string>('updated_at').call(this);
    if (dateStr) {
      return new Date(dateStr);
    }
    return new Date();
  }
}

// Map API attributes/relationships to model accessors for backward compatibility
Object.assign(TransferMoney.prototype, {
  // id is provided by the API
  id: Model.attribute<string>('id'),
  transferMoney: Model.attribute<number>('transfer_money_value'),
  notes: Model.attribute<string | null>('notes'),
  assignedAt: Model.attribute<string>('assigned_at'),
  fromUser: Model.hasOne('fromUser'),
  targetUser: Model.hasOne('targetUser'),
});
