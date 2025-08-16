<?php

declare(strict_types=1);

namespace wusong8899\transferMoney\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;

class TransferMoneySerializer extends AbstractSerializer
{
    protected $type = 'transferMoney';

    protected function getDefaultAttributes($data): array
    {
        return [
            'id' => $data->id,
            'from_user_id' => $data->from_user_id,
            'notes' => $data->notes,
            'target_user_id' => $data->target_user_id,
            'transfer_money_value' => $data->transfer_money_value,
            'assigned_at' => $data->assigned_at?->format('Y-m-d H:i:s')
        ];
    }

    protected function fromUser($transferHistory)
    {
        return $this->hasOne($transferHistory, BasicUserSerializer::class);
    }

    protected function targetUser($transferHistory)
    {
        return $this->hasOne($transferHistory, BasicUserSerializer::class);
    }
}
