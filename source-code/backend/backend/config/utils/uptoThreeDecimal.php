<?php

use Illuminate\Support\Str;

if (!function_exists('takeUptoThreeDecimal')) {
function takeUptoThreeDecimal($number): float
{
    return floatval(round((float) $number, 3));
}
} // end if !function_exists
