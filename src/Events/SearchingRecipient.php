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

namespace wusong8899\transferMoney\Events;

use Flarum\Search\SearchState;

class SearchingRecipient
{
    public function __construct(
        public readonly SearchState $search,
        public readonly array $matches,
        public readonly bool $negate
    ) {
    }
}
