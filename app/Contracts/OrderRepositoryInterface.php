<?php

namespace App\Contracts;

interface OrderRepositoryInterface
{
    public function getAll(array $filters = []);
    public function findById(int $id);
    public function findByUserId(int $userId);
    public function create(array $data);
    public function updateStatus(int $orderId, string $status, int $changedBy, string $note = null);
    public function cancel(int $orderId, int $changedBy, string $reason = null);
    public function getWithItems(int $orderId);
    public function getPendingOrders();
    public function getOrdersByStatus(string $status);
    public function getSalesSummary(string $startDate, string $endDate);
}
