<?php

use Flarum\Extend;
use Flarum\Api\Serializer\ForumSerializer;

use wusong8899\transferMoney\Controller\ListTransferMoneyHistoryController;
use wusong8899\transferMoney\Controller\TransferMoneyController;
use wusong8899\transferMoney\Notification\TransferMoneyBlueprint;
use wusong8899\transferMoney\Serializer\TransferMoneySerializer;
use wusong8899\transferMoney\Gambits\AllowsPdGambit;
use wusong8899\transferMoney\Constants\TransferConstants;

use Flarum\User\Search\UserSearcher;

$extend = [
    (new Extend\Frontend('admin'))->js(__DIR__ . '/js/dist/admin.js'),
    (new Extend\Frontend('forum'))->js(__DIR__ . '/js/dist/forum.js')->css(__DIR__ . '/less/forum.less'),
    (new Extend\Locales(__DIR__ . '/locale')),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attribute('allowUseTransferMoney', function (ForumSerializer $serializer) {
            return $serializer->getActor()->hasPermission(TransferConstants::PERMISSION_TRANSFER_MONEY);
        }),
    (new Extend\Routes('api'))
        ->post('/transferMoney', 'money.transfer', TransferMoneyController::class)
        ->get('/transferHistory', 'money.history', ListTransferMoneyHistoryController::class),
    (new Extend\Notification())
        ->type(TransferMoneyBlueprint::class, TransferMoneySerializer::class, ['alert']),

    (new Extend\SimpleFlarumSearch(UserSearcher::class))
        ->addGambit(AllowsPdGambit::class),

    (new Extend\Settings())
        ->serializeToForum('moneyTransferClient1Customization', TransferConstants::SETTING_CLIENT_CUSTOMIZATION)
        ->serializeToForum('moneyTransferTimeZone', TransferConstants::SETTING_TIMEZONE),
];

return $extend;