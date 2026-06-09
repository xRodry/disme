<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class NotBelongsRange implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($min, $max)
    {
        $this->min = $min;
        $this->max = $max;
    }

    private $min;
    private $max;

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return !($value > $this->min && $value < $this->max);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.belongs-range-negation', ['min' => $this->min, 'max' => $this->max]);
    }
}
