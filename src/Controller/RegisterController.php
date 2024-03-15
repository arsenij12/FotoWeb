<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\UserRegistration;
use Psr\Log\LoggerInterface;
use PDO;

class RegisterController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(['error' => 'Failed to decode JSON data'], 400);
        }

        try {
            $pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

            $statement = $pdo->prepare('SELECT id FROM userRegistration WHERE email = :email');
            $statement->bindParam(':email', $data['email']);
            $statement->execute();

            if ($statement->rowCount() > 0) {
                return new JsonResponse(['error' => 'Email is already registered'], 400);
            }

            $statement = $pdo->prepare('INSERT INTO userRegistration (name, email, password) VALUES (:name, :email, :password)');

            $statement->bindParam(':name', $data['name']);
            $statement->bindParam(':email', $data['email']);
            $statement->bindParam(':password', $data['password']);

            $statement->execute();

            $pdo = null;

            return new JsonResponse(['success' => true]);
        } catch (PDOException $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
