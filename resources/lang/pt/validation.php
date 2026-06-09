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

    'accepted'             => 'O campo :attribute tem de ser aceite.',
    'active_url'           => 'O campo :attribute não é um URL válido.',
    'after'                => 'O campo :attribute tem de ser uma data posterior a :date.',
    'after_or_equal'       => 'O campo :attribute tem de ser uma data posterior ou igual a :date.',
    'alpha'                => 'O campo :attribute pode apenas conter letras.',
    'alpha_dash'           => 'O campo :attribute pode apenas conter letras, números e travessões.',
    'alpha_num'            => 'O campo :attribute pode apenas conter letras e números.',
    'array'                => 'O campo :attribute tem de ser um array.',
    'before'               => 'O campo :attribute tem de ser uma data anterior a :date.',
    'before_or_equal'      => 'O campo :attribute tem de ser uma data anterior ou igual a :date.',
    'boolean'              => 'O campo :attribute tem de ser verdadeiro ou falso.',
    'confirmed'            => 'A confirmação do campo :attribute não corresponde.',
    'date'                 => 'O campo :attribute não é uma data válida.',
    'date_format'          => 'O campo :attribute não corresponde ao formato :format.',
    'different'            => 'O campo :attribute e :other têm de ser diferentes.',
    'digits'               => 'O campo :attribute tem de ter :digits dígitos.',
    'digits_between'       => 'O campo :attribute tem de ter entre :min e :max dígitos.',
    'dimensions'           => 'O campo :attribute tem dimensões de imagem inválidas.',
    'distinct'             => 'O campo :attribute tem um valor duplicado.',
    'exists'               => 'O campo selecionado :attribute é inválido.',
    'file'                 => 'O campo :attribute tem de ser um ficheiro.',
    'filled'               => 'O campo :attribute é obrigatório.',
    'image'                => 'O campo :attribute tem de ser uma imagem.',
    'in_array'             => 'O campo :attribute não existe em :other.',
    'ip'                   => 'O campo :attribute tem de ser um endereço IP válido.',
    'json'                 => 'O campo :attribute tem de ser uma string JSON válida.',
    'mimes'                => 'O campo :attribute tem de ser um ficheiro do tipo: :values.',
    'mimetypes'            => 'O campo :attribute tem de ser um ficheiro do tipo: :values.',
    'present'              => 'O campo :attribute tem de estar presente.',
    'required_if'          => 'O campo :attribute é obrigatório quando :other é :value.',
    'required_unless'      => 'O campo :attribute é obrigatório a não ser que :other esteja em: :values.',
    'required_with'        => 'O campo :attribute é obrigatório quando :values está presente.',
    'required_with_all'    => 'O campo :attribute é obrigatório quando :values está presente.',
    'required_without'     => 'O campo :attribute é obrigatório quando :values não está presente.',
    'required_without_all' => 'O campo :attribute é obrigatório quando nenhum dos :values está presente.',
    'same'                 => 'O campo :attribute e :other têm de corresponder.',
    'size'                 => [
        'numeric' => 'O campo :attribute tem de ser :size.',
        'file'    => 'O campo :attribute tem de ter :size kilobytes.',
        'string'  => 'O campo :attribute tem de ter :size carateres.',
        'array'   => 'O campo :attribute tem de conter :size itens.',
    ],
    'string'               => 'O campo :attribute tem de ser uma string.',
    'timezone'             => 'O campo :attribute tem de ser uma timezone válida.',
    'unique'               => 'O campo :attribute já foi escolhido.',
    'uploaded'             => 'O upload do campo :attribute falhou.',
    'integer-form-field'   => 'Tem de ser um inteiro.',
    // ----------------------------------------
    // Used in form's server-side validation:
    // ----------------------------------------
    'integer'              => 'O campo :attribute tem de ser um inteiro.',
    'email'                => 'O campo :attribute tem de ser um endereço de email válido.',
    'in'                   => 'O campo :attribute tem de ser igual a um dos seguintes valores: :values.',
    'not_in'               => 'O campo :attribute não pode ser igual aos seguintes: :values.',
    'numeric'              => 'O campo :attribute tem de ser um número.',
    'not_regex'            => 'O formato do campo :attribute é inválido.',
    'regex'                => 'O formato do campo :attribute é inválido.',
    'required'             => 'É necessário preencher o campo :attribute.',
    'url'                  => 'O campo :attribute tem de ser um URL válido.',
    'max'                  => [
        'numeric' => 'O campo :attribute não pode ser maior que :max.',
        'file'    => 'O campo :attribute não pode ter mais de :max kilobytes.',
        'string'  => 'O campo :attribute não pode ter mais de :max caracteres.',
        'array'   => 'O campo :attribute não pode ter mais de :max itens.',
    ],
    'min'                  => [
        'numeric' => 'O campo :attribute não pode ser menor que :min.',
        'file'    => 'O campo :attribute não pode ter menos de :min kilobytes.',
        'string'  => 'O campo :attribute não pode ter menos de :min caracteres.',
        'array'   => 'O campo :attribute não pode ter menos de :min itens.',
    ],
    'between'              => [
        'numeric' => 'O campo :attribute tem de estar entre :min e :max.',
        'file'    => 'O campo :attribute tem de ter entre :min e :max kilobytes.',
        'string'  => 'O campo :attribute tem de ser numérico e estar entre :min e :max caracteres.',
        'array'   => 'O campo :attribute tem de ter entre :min e :max itens.',
    ],
    'lt'                   => [
        'numeric' => 'O campo :attribute tem de ser menor que :value.',
        'file'    => 'O campo :attribute tem de ser menor que :value kilobytes.',
        'string'  => 'O campo :attribute tem de ser numérico e menor que :value.',
        'array'   => 'O campo :attribute tem de ter menos que :value itens.',
    ],
    'lte'                   => [
        'numeric' => 'O campo :attribute tem de ser menor ou igual que :value.',
        'file'    => 'O campo :attribute tem de ter um tamanho inferior ou igual a :value kilobytes.',
        'string'  => 'O campo :attribute tem de ser numérico e menor ou igual que :value.',
        'array'   => 'O campo :attribute tem de ter um tamanho inferior ou igual a :value itens.',
    ],
    'gt'                   => [
        'numeric' => 'O campo :attribute tem de ser maior que :value.',
        'file'    => 'O campo :attribute tem de ser maior que :value kilobytes.',
        'string'  => 'O campo :attribute tem de ser numérico e maior que :value.',
        'array'   => 'O campo :attribute tem de ter mais que :value itens.',
    ],
    'gte'                   => [
        'numeric' => 'O campo :attribute tem de ser maior ou igual que :value.',
        'file'    => 'O campo :attribute tem de ter um tamanho superior ou igual a :value kilobytes.',
        'string'  => 'O campo :attribute tem de ser numérico e maior ou igual que :value.',
        'array'   => 'O campo :attribute tem de ter um tamanho superior ou igual a :value itens.',
    ],
    'belongs-range-negation'        => 'O campo :attribute não pode estar entre :min e :max.',
    'negation-numeric'              => 'O campo :attribute não pode ser numérico.',
    'negation-integer'              => 'O campo :attribute não pode ser um inteiro.',
    'negation-email'                => 'O campo :attribute não pode ser um email.',
    'negation-url'                  => 'O campo :attribute não pode ser um URL.',
    'negation-default'              => 'Condição de negação inválida.',
    'has-word'                      => 'O campo :attribute tem de conter a palavra ":word".',
    'has-word-negation'             => 'O campo :attribute não pode conter a palavra ":word".',
    'has-character'                 => 'O campo :attribute tem de conter o caracter ":char".',
    'has-character-negation'        => 'O campo :attribute não pode conter o caracter ":char".',
    'min-word-length'               => 'O campo :attribute tem de ter um tamanho maior ou igual a :min words.',
    'min-word-length-negation'      => 'O campo :attribute não pode ter um tamanho maior ou igual a :min words.',
    'max-word-length'               => 'O campo :attribute tem de ter um tamanho inferior ou igual a :max words.',
    'max-word-length-negation'      => 'O campo :attribute não pode ter um tamanho inferior ou igual a :max words.',
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
