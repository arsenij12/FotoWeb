<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use PDO;

class DeleteAccountController extends AbstractController
{
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
}
