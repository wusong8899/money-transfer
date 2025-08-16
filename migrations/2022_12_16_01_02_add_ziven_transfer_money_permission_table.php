<?php

use Flarum\Database\Migration;
use Flarum\Group\Group;

return Migration::addPermissions([
    'transferMoney.allowUseTransferMoney' => Group::MEMBER_ID,
]);
