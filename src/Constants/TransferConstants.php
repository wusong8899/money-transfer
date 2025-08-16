<?php

declare(strict_types=1);

namespace wusong8899\transferMoney\Constants;

class TransferConstants
{
    // Default timezone for transfers
    public const DEFAULT_TIMEZONE = 'Asia/Shanghai';

    // Minimum values
    public const MIN_TRANSFER_AMOUNT = 0.0;
    public const MIN_USER_COUNT = 0;

    // Permission constants
    public const PERMISSION_TRANSFER_MONEY = 'transferMoney.allowUseTransferMoney';

    // Error message keys
    public const ERROR_GENERAL = 'wusong8899-transfer-money.forum.transfer-error';
    public const ERROR_INSUFFICIENT_FUND = 'wusong8899-transfer-money.forum.transfer-error-insufficient-fund';
    public const ERROR_NO_PERMISSION = 'wusong8899-transfer-money.forum.transfer-error-no-permission';

    // Settings keys
    public const SETTING_TIMEZONE = 'moneyTransfer.moneyTransferTimeZone';
    public const SETTING_CLIENT_CUSTOMIZATION = 'moneyTransfer.moneyTransferClient1Customization';

    // Extension names
    public const EXTENSION_FLARUM_SUSPEND = 'flarum-suspend';
}
