<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class maxWordLength implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($max, $negation = false)
    {
        $this->max = $max;
        $this->negation = $negation;
    }

    private $max;
    private $negation;

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // '0..9' is so that it includes numbers in the word count. For example: 'Car 345' returns 2 words, but without this parameter it returns 1.
        $result = str_word_count($value, 0, '0..9') <= $this->max;
        return $this->negation ? !$result : $result;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->negation ? trans('validation.max-word-length-negation', ['max' => $this->max]) :
            trans('validation.max-word-length', ['max' => $this->max]);
    }
}
