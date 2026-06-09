<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class hasCharacter implements Rule
{

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($char, $matchCase, $negation = false)
    {
        $this->char = $char;
        $this->negation = $negation;
        $this->matchCase = $matchCase;
    }

    private $char;
    private $negation;
    private $matchCase;

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $pattern = '/'.$this->char.'/';
        if (!$this->matchCase) {
            $pattern .= 'i';
        }
        $containsChar = preg_match($pattern,$value);
        return $this->negation ? !$containsChar : $containsChar;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->negation ? trans('validation.has-character-negation',['char' => $this->char]) :
            trans('validation.has-character',['char' => $this->char]);
    }
}
