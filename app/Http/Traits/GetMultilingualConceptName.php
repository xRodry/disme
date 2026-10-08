<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Traits;

use App\Language;
use Config;
use DB;

trait GetMultilingualConceptName {

    private function getMultilingualConceptName ($tableName, $attributeName, $foreignKey, $foreignKeyValue, $userLangId,
                                                 $needLanguageId = false, $withoutLanguageAbbreviation = false) {
        $fallbackLocale = Config::get('app.fallback_locale');
        $fallbackLangId = Language::where('abbrv', '=', $fallbackLocale)
            ->whereNull('deleted_at')->first()->id;

        $query = DB::table($tableName)
            ->where($foreignKey, $foreignKeyValue)
            ->whereNull('deleted_at');

        // Check if concept name exists in the user's language
        $conceptUserLanguage = (clone $query)->where('language_id', $userLangId)->first();
        // If it does, return it right away
        if (is_object($conceptUserLanguage)) {
            return $needLanguageId ? array($conceptUserLanguage->language_id, $conceptUserLanguage->$attributeName) :
                $conceptUserLanguage->$attributeName;
        } else {
            // If it doesn't, check first if it exists in the system's fallback language
            $conceptFallbackLanguage = (clone $query)->where('language_id', $fallbackLangId)->first();
            if (is_object($conceptFallbackLanguage)) {
                // If it does, return it right away
                return $this->getConceptName($conceptFallbackLanguage, $attributeName, $needLanguageId, $withoutLanguageAbbreviation);
            } else {
                // If it doesn't, return the occurrence that is firstly found on the database that hasn't been soft deleted
                $conceptFirstLanguageFound = (clone $query)->first();
                if (is_object($conceptFirstLanguageFound)) {
                    return $this->getConceptName($conceptFirstLanguageFound, $attributeName, $needLanguageId, $withoutLanguageAbbreviation);
                } else {
                    return null;
                }
            }
        }
    }

    private function getConceptName($conceptNameRecord, $attributeName, $needLanguageId, $withoutLanguageAbbreviation) {
        if ($needLanguageId) {
            return $withoutLanguageAbbreviation ? array($conceptNameRecord->language_id, $conceptNameRecord->$attributeName) :
                array($conceptNameRecord->language_id,
                 strtoupper(Language::find($conceptNameRecord->language_id)->abbrv). '_' . $conceptNameRecord->$attributeName);
        } else {
            return $withoutLanguageAbbreviation ? $conceptNameRecord->$attributeName :
                strtoupper(Language::find($conceptNameRecord->language_id)->abbrv). '_' . $conceptNameRecord->$attributeName;
        }
    }

    public function hydrateActionRuleFKNames($actionRule, $userLangId) {
        $actionRule->transaction_type_name = $this->getMultilingualConceptName('transaction_type_name',
            't_name', 'transaction_type_id', $actionRule->transaction_type_id, $userLangId);
        $actionRule->t_state_name = $this->getMultilingualConceptName('t_state_name', 'name',
            't_state_id', $actionRule->t_state_id, $userLangId);
        $actionRule->t_state_act_name = $this->getMultilingualConceptName('t_state_name', 'act_name',
            't_state_id', $actionRule->t_state_id, $userLangId);
    }

}

?>
