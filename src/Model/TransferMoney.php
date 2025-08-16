<?php

declare(strict_types=1);

namespace wusong8899\transferMoney\Model;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Flarum\User\User;

class TransferMoney extends AbstractModel
{
    use ScopeVisibilityTrait;

    protected string $table = 'wusong8899_transfer_money';

    protected array $fillable = [
        'from_user_id',
        'target_user_id',
        'transfer_money_value',
        'notes',
        'assigned_at',
    ];

    protected array $casts = [
        'from_user_id' => 'integer',
        'target_user_id' => 'integer',
        'transfer_money_value' => 'float',
        'assigned_at' => 'datetime',
    ];

    public function fromUser(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'from_user_id');
    }

    public function targetUser(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'target_user_id');
    }
}
