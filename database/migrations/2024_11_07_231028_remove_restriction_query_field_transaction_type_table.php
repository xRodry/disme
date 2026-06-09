<?php

use Illuminate\Database\Migrations\Migration;

class RemoveRestrictionQueryFieldTransactionTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        (new AddRestrictionQueryFieldTransactionTypeTable)->down();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        (new AddRestrictionQueryFieldTransactionTypeTable)->up();
    }
}
