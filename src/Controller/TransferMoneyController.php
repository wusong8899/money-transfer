<?php

declare(strict_types=1);

namespace wusong8899\transferMoney\Controller;

use wusong8899\transferMoney\Serializer\TransferMoneySerializer;
use wusong8899\transferMoney\Model\TransferMoney;
use wusong8899\transferMoney\Notification\TransferMoneyBlueprint;
use wusong8899\transferMoney\Constants\TransferConstants;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\User\User;
use Flarum\Foundation\ValidationException;
use Flarum\Locale\Translator;
use Flarum\Notification\NotificationSyncer;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Illuminate\Support\Carbon;

class TransferMoneyController extends AbstractCreateController
{
    public $serializer = TransferMoneySerializer::class;

    protected SettingsRepositoryInterface $settings;
    protected NotificationSyncer $notifications;
    protected Translator $translator;

    public function __construct(
        NotificationSyncer $notifications,
        Translator $translator,
        SettingsRepositoryInterface $settings
    ) {
        $this->settings = $settings;
        $this->notifications = $notifications;
        $this->translator = $translator;
    }

    protected function data(ServerRequestInterface $request, Document $document): User
    {
        $requestData = $request->getParsedBody()['data']['attributes'];
        $moneyTransfer = floatval($requestData['moneyTransfer']);
        $moneyTransferNotes = trim($requestData['moneyTransferNotes']);
        $selectedUsers = json_decode($requestData['selectedUsers']);
        $moneyTransferTotalUser = count($selectedUsers);
        $currentUserID = $request->getAttribute('actor')->id;
        $errorMessage = "";

        if (
            !isset($moneyTransfer) ||
            array_search($currentUserID, $selectedUsers) !== false ||
            $moneyTransfer <= TransferConstants::MIN_TRANSFER_AMOUNT ||
            $moneyTransferTotalUser === TransferConstants::MIN_USER_COUNT
        ) {
            $errorMessage = TransferConstants::ERROR_GENERAL;
        } else {
            $currentUserData = User::find($currentUserID);
            $allowUseTransferMoney = $request->getAttribute('actor')->can(
                TransferConstants::PERMISSION_TRANSFER_MONEY,
                $currentUserData
            );

            if ($allowUseTransferMoney) {
                $currentUserMoneyRemain = $currentUserData->money - ($moneyTransfer * $moneyTransferTotalUser);
                $selectedUsersDataCount = User::find($selectedUsers)->count();

                if ($selectedUsersDataCount === $moneyTransferTotalUser) {
                    if ($currentUserMoneyRemain < TransferConstants::MIN_TRANSFER_AMOUNT) {
                        $errorMessage = TransferConstants::ERROR_INSUFFICIENT_FUND;
                    } else {
                        $settingTimezone = $this->settings->get(
                            TransferConstants::SETTING_TIMEZONE,
                            TransferConstants::DEFAULT_TIMEZONE
                        );

                        if (!in_array($settingTimezone, timezone_identifiers_list())) {
                            $settingTimezone = TransferConstants::DEFAULT_TIMEZONE;
                        }

                        $currentUserData->money = $currentUserMoneyRemain;
                        $currentUserData->save();

                        foreach ($selectedUsers as $targetUserID) {
                            $transferMoney = new TransferMoney();
                            $transferMoney->from_user_id = $currentUserID;
                            $transferMoney->target_user_id = $targetUserID;
                            $transferMoney->transfer_money_value = $moneyTransfer;
                            $transferMoney->assigned_at = Carbon::now($settingTimezone);

                            if (!empty($moneyTransferNotes)) {
                                $transferMoney->notes = $moneyTransferNotes;
                            }

                            $transferMoney->save();

                            $targetUserData = User::find($targetUserID);
                            $targetUserData->money += $moneyTransfer;
                            $targetUserData->save();

                            $this->notifications->sync(new TransferMoneyBlueprint($transferMoney), [$targetUserData]);
                        }

                        return $currentUserData;
                    }
                } else {
                    $errorMessage = TransferConstants::ERROR_GENERAL;
                }
            } else {
                $errorMessage = TransferConstants::ERROR_NO_PERMISSION;
            }
        }

        if ($errorMessage !== "") {
            throw new ValidationException(['message' => $this->translator->trans($errorMessage)]);
        }

        // This should never be reached due to the validation above
        throw new ValidationException(['message' => 'Unexpected error occurred']);
    }
}
