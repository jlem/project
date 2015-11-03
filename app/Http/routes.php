<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::get('/', 'WelcomeController@index');
Route::resource('project', 'ProjectController');
Route::resource('task', 'TaskController');
Route::get('/user/projects', 'ProjectController@byUser');
Route::get('/user/tasks', 'TaskController@byUser');
Route::post('/what', function() {
    echo 'hey';
});
