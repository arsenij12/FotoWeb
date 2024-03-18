<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use PDO;

class RegisterController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    /**
     * @Route("/api/register", name="api_register", methods={"POST"})
     */
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(['error' => 'Failed to decode JSON data'], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            $pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

            $statement = $pdo->prepare('SELECT id FROM userRegistration WHERE email = :email');
            $statement->bindParam(':email', $data['email']);
            $statement->execute();

            if ($statement->rowCount() > 0) {
                return new JsonResponse(['error' => 'Email is already registered'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $statement = $pdo->prepare('INSERT INTO userRegistration (name, email, password) VALUES (:name, :email, :password)');

            $statement->bindParam(':name', $data['name']);
            $statement->bindParam(':email', $data['email']);
            $statement->bindParam(':password', $data['password']);

            $statement->execute();

            $pdo = null;

            return new JsonResponse(['success' => true]);
        } catch (PDOException $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

     /**
     * @Route("/api/change-password", name="change_password", methods={"POST"})
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data || !isset($data['email']) || !isset($data['newPassword'])) {
                return new JsonResponse(['error' => 'Invalid request data'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

            $statement = $pdo->prepare('SELECT * FROM userRegistration WHERE email = :email');
            $statement->bindParam(':email', $data['email']);
            $statement->execute();
            $user = $statement->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $hashedPassword = $data['newPassword'];

            $statement = $pdo->prepare('UPDATE userRegistration SET password = :password WHERE email = :email');
            $statement->bindParam(':password', $hashedPassword);
            $statement->bindParam(':email', $data['email']);
            $statement->execute();

            return new JsonResponse(['success' => true, 'message' => 'Password changed successfully']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * @Route("/api/delete-account", name="delete_account", methods={"POST"})
     */
    public function deleteAccount(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return new JsonResponse(['error' => 'No data provided'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

            $userId = $data['userId'];

            $statement = $pdo->prepare('DELETE FROM userRegistration WHERE id = :id');
            $statement->bindValue(':id', $userId);
            $statement->execute();

            $pdo = null;

            return new JsonResponse(['success' => true, 'message' => 'Account deleted successfully']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/api/get-social-links", name="get_social_links", methods={"GET"})
     */
    public function getSocialLinks(Request $request): JsonResponse
    {
        try {
            $userId = $request->query->get('userId');

            $pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

            $statement = $pdo->prepare('SELECT link FROM user_social_links WHERE user_id = :userId');
            $statement->bindParam(':userId', $userId);
            $statement->execute();
            $socialLinks = $statement->fetchAll(PDO::FETCH_COLUMN);

            return new JsonResponse(['socialLinks' => $socialLinks]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/api/add-social-link", name="add_social_link", methods={"POST"})
     */
    public function addSocialLink(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data || !isset($data['userId']) || !isset($data['socialNetwork']) || !isset($data['link'])) {
                return new JsonResponse(['error' => 'Invalid request data'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

            $statement = $pdo->prepare('INSERT INTO user_social_links (user_id, social_network, link) VALUES (:userId, :socialNetwork, :link)');
            $statement->bindParam(':userId', $data['userId']);
            $statement->bindParam(':socialNetwork', $data['socialNetwork']); 
            $statement->bindParam(':link', $data['link']);
            $statement->execute();

            return new JsonResponse(['success' => true, 'message' => 'Social link added successfully']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
