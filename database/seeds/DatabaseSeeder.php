<?php
/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        $this->call(LanguageTableSeeder::class);
        $this->call(TStateTableSeeder::class);
        $this->call(TransactionTypeTableSeeder::class);
        $this->call(ActionRuleTableSeeder::class);
        $this->call(ActionTableSeeder::class);
        $this->call(CausalLinkTableSeeder::class);
        $this->call(EntTypeTableSeeder::class);
        $this->call(PropertyTableSeeder::class);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
