<?php

namespace App\Contracts;

interface ProductRepositoryInterface
{
    public function getAll(array $filters = []);
    public function findById(int $id);
    public function findBySku(string $sku);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function getByCategory(int $categoryId);
    public function getLowStock(int $threshold = 5);
    public function search(string $keyword);
    public function updateStock(int $productId, int $quantity, string $type = 'out');
}
