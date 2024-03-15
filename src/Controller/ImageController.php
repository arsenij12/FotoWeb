<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use PDO;

class ImageController extends AbstractController
{
    /**
     * @Route("/api/upload-image", name="upload_image", methods={"POST"})
     */
    public function upload(Request $request): JsonResponse
    {
        $imageName = $request->request->get('imageName');

        try {
            $pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

            $statement = $pdo->prepare('INSERT INTO user_images (image_id, user_id, image_path) VALUES (:image_id, :user_id, :image_path)');
            $statement->bindParam(':user_id', 1);
            $statement->bindParam(':image_path', "akakak");
            $statement->bindParam(':image_id', 1);

            $statement->execute();

            return new JsonResponse(['success' => true]);
        } catch (PDOException $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
