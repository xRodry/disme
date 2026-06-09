<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted'             => 'The :attribute must be accepted.',
    'active_url'           => 'The :attribute is not a valid URL.',
    'after'                => 'The :attribute must be a date after :date.',
    'after_or_equal'       => 'The :attribute must be a date after or equal to :date.',
    'alpha'                => 'The :attribute may only contain letters.',
    'alpha_dash'           => 'The :attribute may only contain letters, numbers, and dashes.',
    'alpha_num'            => 'The :attribute may only contain letters and numbers.',
    'array'                => 'The :attribute must be an array.',
    'before'               => 'The :attribute must be a date before :date.',
    'before_or_equal'      => 'The :attribute must be a date before or equal to :date.',
    'boolean'              => 'The :attribute field must be true or false.',
    'confirmed'            => 'The :attribute confirmation does not match.',
    'date'                 => 'The :attribute is not a valid date.',
    'date_format'          => 'The :attribute does not match the format :format.',
    'different'            => 'The :attribute and :other must be different.',
    'digits'               => 'The :attribute must be :digits digits.',
    'digits_between'       => 'The :attribute must be between :min and :max digits.',
    'dimensions'           => 'The :attribute has invalid image dimensions.',
    'distinct'             => 'The :attribute field has a duplicate value.',
    'exists'               => 'The selected :attribute is invalid.',
    'file'                 => 'The :attribute must be a file.',
    'filled'               => 'The :attribute field is required.',
    'image'                => 'The :attribute must be an image.',
    'in_array'             => 'The :attribute field does not exist in :other.',
    'ip'                   => 'The :attribute must be a valid IP address.',
    'json'                 => 'The :attribute must be a valid JSON string.',
    'mimes'                => 'The :attribute must be a file of type: :values.',
    'mimetypes'            => 'The :attribute must be a file of type: :values.',
    'present'              => 'The :attribute field must be present.',
    'required_if'          => 'The :attribute field is required when :other is :value.',
    'required_unless'      => 'The :attribute field is required unless :other is in :values.',
    'required_with'        => 'The :attribute field is required when :values is present.',
    'required_with_all'    => 'The :attribute field is required when :values is present.',
    'required_without'     => 'The :attribute field is required when :values is not present.',
    'required_without_all' => 'The :attribute field is required when none of :values are present.',
    'same'                 => 'The :attribute and :other must match.',
    'size'                 => [
        'numeric' => 'The :attribute must be :size.',
        'file'    => 'The :attribute must be :size kilobytes.',
        'string'  => 'The :attribute must be :size characters.',
        'array'   => 'The :attribute must contain :size items.',
    ],
    'string'               => 'The :attribute must be a string.',
    'timezone'             => 'The :attribute must be a valid zone.',
    'unique'               => 'The :attribute has already been taken.',
    'uploaded'             => 'The :attribute failed to upload.',
    'integer-form-field'   => 'Must be an integer.',
    // ----------------------------------------
    // Used in form's server-side validation:
    // ----------------------------------------
    'integer'              => 'The :attribute field must be an integer.',
    'email'                => 'The :attribute field must be a valid email address.',
    'in'                   => 'The :attribute field must be equal to one of the following: :values.',
    'not_in'               => 'The :attribute field can\'t be equal to the following: :values.',
    'numeric'              => 'The :attribute field must be a number.',
    'not_regex'            => 'The :attribute field format is invalid.',
    'regex'                => 'The :attribute field format is invalid.',
    'required'             => 'It is necessary to fill in the :attribute field.',
    'url'                  => 'The :attribute field must be a valid URL.',
    'max'                  => [
        'numeric' => 'The :attribute field may not be greater than :max.',
        'file'    => 'The :attribute field may not be bigger than :max kilobytes.',
        'string'  => 'The :attribute field may not be greater than :max characters.',
        'array'   => 'The :attribute field may not have more than :max items.',
    ],
    'min'                  => [
        'numeric' => 'The :attribute field must be at least :min.',
        'file'    => 'The :attribute field must be at least :min kilobytes.',
        'string'  => 'The :attribute field must be at least :min characters.',
        'array'   => 'The :attribute field must have at least :min items.',
    ],
    'between'              => [
        'numeric' => 'The :attribute field must be between :min and :max.',
        'file'    => 'The :attribute field must be between :min and :max kilobytes.',
        'string'  => 'The :attribute field must be numeric and between :min and :max characters.',
        'array'   => 'The :attribute field must have between :min and :max items.',
    ],
    'lt'                   => [
        'numeric' => 'The :attribute field must be less than :value.',
        'file'    => 'The :attribute field must be less than :value kilobytes.',
        'string'  => 'The :attribute field must be numeric and less than :value.',
        'array'   => 'The :attribute field must have less than :value items.',
    ],
    'lte'                   => [
        'numeric' => 'The :attribute field must be less than or equal to :value.',
        'file'    => 'The :attribute field must be less than or equal to :value kilobytes.',
        'string'  => 'The :attribute field must be numeric and less than or equal to :value.',
        'array'   => 'The :attribute field must have less than or equal to :value items.',
    ],
    'gt'                   => [
        'numeric' => 'The :attribute field must be greater than :value.',
        'file'    => 'The :attribute field must be bigger than :value kilobytes.',
        'string'  => 'The :attribute field must be numeric and greater than :value.',
        'array'   => 'The :attribute field must have more than :value items.',
    ],
    'gte'                   => [
        'numeric' => 'The :attribute field must be greater than or equal to :value.',
        'file'    => 'The :attribute field must be bigger than or equal to :value kilobytes.',
        'string'  => 'The :attribute field must be numeric and greater than or equal to :value.',
        'array'   => 'The :attribute field must have more than or equal to :value items.',
    ],
    'belongs-range-negation'        => 'The :attribute can\'t be between :min and :max.',
    'negation-numeric'              => 'The :attribute field must be non-numeric.',
    'negation-integer'              => 'The :attribute field can\'t be an integer.',
    'negation-email'                => 'The :attribute field can\'t be an email.',
    'negation-url'                  => 'The :attribute field can\'t be a URL.',
    'negation-default'              => 'Negation condition invalid.',
    'has-word'                      => 'The :attribute field must have the word ":word".',
    'has-word-negation'             => 'The :attribute field can\'t have the word ":word".',
    'has-character'                 => 'The :attribute field must have the character ":char".',
    'has-character-negation'        => 'The :attribute field can\'t have the character ":char".',
    'min-word-length'               => 'The :attribute field must have a length of more than or equal to :min words.',
    'min-word-length-negation'      => 'The :attribute field can\'t have a length of more than or equal to :min words.',
    'max-word-length'               => 'The :attribute field must have a length of less than or equal to :max words.',
    'max-word-length-negation'      => 'The :attribute field can\'t have a length of less than or equal to :max words.',
    'bool-yes'                      => 'Yes',
    'bool-no'                       => 'No',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [],

];
