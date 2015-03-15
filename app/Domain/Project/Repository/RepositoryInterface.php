<?php namespace App\Domain\Project\Repository;

interface RepositoryInterface
{
    public function all();
    public function findByCriteria($Criteria);
}
