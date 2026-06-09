<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Negation implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($type)
    {
        $this->type = $type;
    }

    private $type;
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        switch($this->type) {
            case 'numeric':
                return !is_numeric($value);
            case 'integer':
                return $value != (int)$value;
            case 'email':
                return !filter_var($value, FILTER_VALIDATE_EMAIL);
            case 'url':
                return !filter_var($value, FILTER_VALIDATE_URL);
            default:
                return false;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        switch($this->type) {
            case 'numeric':
                return trans('validation.negation-numeric');
            case 'integer':
                return trans('validation.negation-integer');
            case 'email':
                return trans('validation.negation-email');
            case 'url':
                return trans('validation.negation-url');
            default:
                return trans('validation.negation-default');
        }
    }
}
