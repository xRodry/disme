<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class hasWord implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($word, $matchCase, $negation = false)
    {
        $this->word = $word;
        $this->negation = $negation;
        $this->matchCase = $matchCase;
    }

    private $word;
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
        $pattern = '/\\b'.$this->word.'\\b/';
        if (!$this->matchCase) {
            $pattern .= 'i';
        }
        $containsWord = preg_match($pattern,$value);
        return $this->negation ? !$containsWord : $containsWord;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->negation ? trans('validation.has-word-negation',['word' => $this->word]) :
            trans('validation.has-word',['word' => $this->word]);
    }
}
