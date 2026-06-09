<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

namespace App\Http\Middleware;

use Closure;
use Config;
use App\Language;
use Auth;

class LanguageChange
{
    //private $language_id;

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        //dd($request->user());
        $app_locale = Config::get('app.locale');
        if(Auth::check()){
            $lang = Language::find($request->user()->language_id);
            if (strtolower($app_locale) != strtolower($lang->abbrv)) //app_locale geralmente em minuscula e lang->abbrv normalmente em maiuscula
            {
                Config::set('app.fallback_locale', $app_locale);
                app()->setLocale($lang->abbrv);
            }

            //$this->language_id = $lang->id;
        } else {
            app()->setLocale(Config::get('app.fallback_locale'));
            //$this->language_id = null;
        }

        //$request->attributes->add(['language_id' => $this->language_id]);

        return $next($request);
    }
}
