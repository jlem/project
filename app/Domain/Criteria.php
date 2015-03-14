<?php namespace App\Domain;

interface Criteria
{
    public function apply($gateway, $respository);
}
