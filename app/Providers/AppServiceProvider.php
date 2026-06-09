<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Providers;

use App\Http\ExecutionEngine\EECGlobalVariables;
use Illuminate\Http\Resources\Json\Resource;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(EECGlobalVariables::class, function ($app) {
            return new EECGlobalVariables();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);
        Resource::withoutWrapping();

        // New blade directives for templates to be generated in pdf
        //  assumes view data contains the $processId, $userId and $langId

        Blade::directive('constant', function ($constantInfo) {
            $constantId = json_decode($constantInfo)[1];
            return "<?php echo Constant::where('id', intval($constantId))->first()->value; ?>";
        });

        Blade::directive('property', function ($propertyInfo) {
            $propertyId = json_decode($propertyInfo)[1];
            return "<?php
                \$hasSubPropRef = str_contains($propertyId, '.');
                \$propertyId = \$hasSubPropRef ? strtok($propertyId, '.') : $propertyId;

                \$property = \\App\\Property::find(\$propertyId);

                \$transaction = \\App\\Transaction::where([
                    'transaction_type_id' => \$property->entType->transaction_type_id,
                    'process_id' => \"\$processId\" // \"\$processId\" is passed through the view() call
                ])->whereNull('deleted_at')->latest()->first();

                \$entities = \\App\\Entity::where([
                    'ent_type_id' => \$property->ent_type_id,
                    'transaction_id' => optional(\$transaction)->id // Handling potential null value
                ])->select('id')->whereNull('deleted_at')->get();

                if (\$hasSubPropRef) {
                   \$subPropertyId = substr($propertyId, strpos($propertyId, '.') + 1);

                   \$fkPropertyValues = optional(\\App\\Value::where([
                        'property_id' => \$property->id,
                        'state' => 'active'
                    ])->whereIn('entity_id', \$entities->pluck('id'))
                    ->whereNull('deleted_at')->select('value')->get()) ?? 0;

                   \$fkRefEntities = optional(\\App\\Value::whereIn('id', \$fkPropertyValues->pluck('value'))
                    ->whereNull('deleted_at')->select('entity_id AS id')->get()) ?? 0;

                    \$entities = \$fkRefEntities;

                   \$property = \\App\\Property::find(\$subPropertyId);
                }

                \$propertyValues = optional(\\App\\Value::where([
                    'property_id' => \$property->id,
                    'state' => 'active'
                ])->whereIn('entity_id', \$entities->pluck('id'))
                ->whereNull('deleted_at')->select('value', 'id')->get()) ?? 0;

                if (\$property->value_type === 'prop_ref') {

                        \$fkProperty = \\App\\Property::find(\$property->fk_property_id);
                        if (\$property->fk_property_id && \$fkProperty->requires_translation) {

                            \$propertyValue = optional(\\App\\ValueText::where('language_id', \"\$langId\")
                                ->whereIn('value_id', \$propertyValues->pluck('id'))
                                ->select('text')->whereNull('deleted_at')->get()->pluck('text')) ?? 0;

                        } else if (\$property->fk_property_id && !\$fkProperty->requires_translation) {

                            \$propertyValue = optional(\\App\\Value::whereIn('id', \$propertyValues->pluck('value'))
                                ->select('value')->whereNull('deleted_at')->get()->pluck('value')) ?? 0;

                        } else {

                            \$propertyValue = optional(\\App\\Entity::whereIn('id', \$propertyValues->pluck('value'))
                                ->select('internal_id')->whereNull('deleted_at')->get()->pluck('internal_id')) ?? 0;
                        }

                } else if (\$property->value_type === 'enum') {

                    \$propAllowedValues = optional(\\App\\PropAllowedValue::where('property_id', \$property->id)
                        ->whereIn('id', \$propertyValues->pluck('value'))
                        ->select('id')->whereNull('deleted_at')->get());

                    \$propertyValue = optional(\\App\\PropAllowedValueName::where('language_id', \"\$langId\")
                        ->whereIn('p_a_v_id', \$propAllowedValues->pluck('id'))
                        ->select('name')->whereNull('deleted_at')->get()->pluck('name'));

                } else {

                    if (\$property->requires_translation) {

                        \$propertyValue = optional(\\App\\ValueText::where('language_id', \"\$langId\")
                            ->whereIn('value_id', \$propertyValues->pluck('id'))
                            ->select('text')->whereNull('deleted_at')->get()->pluck('text')) ?? 0;

                    } else {

                        \$propertyValue = \$propertyValues->pluck('value');

                    }

                }

                \$valueType = isset(\$fkProperty) ? \$fkProperty->value_type : \$property->value_type;
                foreach (\$propertyValue as \$key => \$propValue) {
                    if (\$valueType === 'text' && !\$propValue) {
                        \$propertyValue[\$key] = '';
                    } else if (\$valueType === 'bool') {
                        \$propertyValue[\$key] = \$propValue ? 'yes' : 'no';
                    } else if (\$valueType === 'int' && !\$propValue) {
                        \$propertyValue[\$key] = '0';
                    } else if (\$valueType === 'double') {
                        \$propertyValue[\$key] = \$propValue ? round(\$propValue, 2) : '0';
                    } else if (\$valueType === 'date') {
                        \$propertyValue[\$key] = date('l, d M Y, G:i.',strtotime(date(\$propValue)));
                    } else if (\$valueType === 'time') {
                        \$propertyValue[\$key] = date('G:i.',strtotime(\$propValue));
                    }
                }

                \$propertyValue = \$propertyValue ? (\$propertyValue->count() > 0 ? (\$property->multiple_values ? \implode(', ', \$propertyValue->toArray()) : \$propertyValue->first()) : null) : null;

                echo \$propertyValue;
            ?>";
        });

    }
}
