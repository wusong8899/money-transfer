<?php

declare(strict_types=1);

/*
 * This file is part of fof/byobu.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace wusong8899\transferMoney\Gambits;

use Flarum\Extension\ExtensionManager;
use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\SearchState;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Builder;
use wusong8899\transferMoney\Events\SearchingRecipient;
use wusong8899\transferMoney\Constants\TransferConstants;

class AllowsPdGambit extends AbstractRegexGambit
{
    public function __construct(
        private readonly Dispatcher $dispatcher
    ) {
    }

    public function getGambitPattern(): string
    {
        return 'allows-pd';
    }

    protected function conditions(SearchState $search, array $matches, $negate): void
    {
        $this->dispatcher->dispatch(new SearchingRecipient($search, $matches, $negate));

        $search
            ->getQuery()
            // Always prevent PD's by non-privileged users to suspended users.
            ->when(
                $this->extensionEnabled(TransferConstants::EXTENSION_FLARUM_SUSPEND) && !$negate,
                static function (Builder $query): void {
                    $query->whereNull('suspended_until');
                }
            )
            ->orderBy('username', 'asc');
    }

    protected function extensionEnabled(string $extension): bool
    {
        /** @var ExtensionManager $manager */
        $manager = resolve(ExtensionManager::class);

        return $manager->isEnabled($extension);
    }
}
