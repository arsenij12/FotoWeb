<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use PDO;

class LoginControlerController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null || !isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse(['error' => 'Invalid JSON data or missing fields'], 400);
        }

        try {
            $pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

            $statement = $pdo->prepare('SELECT id, name, email, password FROM userRegistration WHERE email = :email');

            $statement->bindParam(':email', $data['email']);
            $statement->execute();

            $user = $statement->fetch(PDO::FETCH_ASSOC);

            if (!$user || $user['password'] !== $data['password']) {
                return new JsonResponse(['error' => 'Invalid email or password'], 401);
            }

            return new JsonResponse([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'password' => $user['password'],
                    'name' => $user['name']
                ],
            ]);
        } catch (PDOException $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}

