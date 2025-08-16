<?php

declare(strict_types=1);

namespace wusong8899\transferMoney\Notification;

use wusong8899\transferMoney\Model\TransferMoney;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\User\User;

class TransferMoneyBlueprint implements BlueprintInterface
{
    public function __construct(
        private readonly TransferMoney $transferMoney
    ) {
    }

    public function getSubject(): TransferMoney
    {
        return $this->transferMoney;
    }

    public function getFromUser(): ?User
    {
        return $this->transferMoney->fromUser;
    }

    public function getData(): ?array
    {
        return null;
    }

    public static function getType(): string
    {
        return 'transferMoney';
    }

    public static function getSubjectModel(): string
    {
        return TransferMoney::class;
    }
}
