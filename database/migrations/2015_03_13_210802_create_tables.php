<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::dropIfExists('users');
		Schema::create('users', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('first_name');
			$table->string('last_name');
			$table->integer('type');
			$table->string('email')->unique();
			$table->string('password', 255);
			$table->rememberToken();
			$table->timestamps();
		});

		Schema::dropIfExists('password_resets');
		Schema::create('password_resets', function(Blueprint $table)
		{
			$table->string('email')->index();
			$table->string('token')->index();
			$table->timestamp('created_at');
		});

		Schema::dropIfExists('clients');
		Schema::create('clients', function($table) {
			$table->increments('id');
			$table->string('name');
			$table->timestamps();
		});

		Schema::dropIfExists('projects');
		Schema::create('projects', function($table) {
			$table->increments('id');
			$table->string('name');
			$table->integer('client_id');
			$table->integer('status');
			$table->integer('type');
			$table->timestamps();
		});

		Schema::dropIfExists('tasks');
		Schema::create('tasks', function($table) {
			$table->increments('id');
			$table->string('name');
			$table->integer('project_id');
			$table->integer('status');
			$table->integer('owner')->nullable();
			$table->integer('total_hours');
			$table->timestamps();
		});

		Schema::dropIfExists('time_entries');
		Schema::create('time_entries', function($table) {
			$table->increments('id');
			$table->string('task_id');
			$table->integer('project_id');
			$table->integer('user_id');
			$table->float('time');
			$table->timestamps();
		});

		Schema::dropIfExists('atoms');
		Schema::create('atoms', function($table) {
			$table->increments('id');
			$table->string('task_id');
			$table->integer('project_id');
			$table->string('key');
			$table->string('value');
			$table->timestamps();
		});

		Schema::dropIfExists('project_user');
		Schema::create('project_user', function($table) {
			$table->increments('id');
			$table->string('project_id');
			$table->integer('user_id');
			$table->string('role');
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('users');
		Schema::drop('password_resets');
		Schema::drop('clients');
		Schema::drop('projects');
		Schema::drop('tasks');
		Schema::drop('time_entries');
		Schema::drop('project_user');
		Schema::drop('atoms');
	}

}
