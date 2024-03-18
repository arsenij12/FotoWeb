<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use PDO;
use Symfony\Component\HttpFoundation\File\Exception\FileException; // Импортируем FileException

class ImageController extends AbstractController
{
    /**
     * @Route("/api/upload-image", name="upload_image", methods={"POST"})
     */
    public function upload(Request $request): JsonResponse
    {
        // Получаем загруженный файл из запроса
        $image = $request->files->get('image');
        if (!$image) {
            return new JsonResponse(['error' => 'No image uploaded'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Путь для сохранения загруженного изображения
        $uploadDir = 'C:\Users\Susa\Documents\GitHub\FotoWeb\Symfony\my_project\public\images\users';
        $userId = 1;
        $imageId = uniqid(); 
        $imageFileName = $userId . '_' . $imageId . '_' . $image->getClientOriginalName();
        $imageFilePath = $uploadDir . '/' . $imageFileName; 

        // Проверяем существует ли директория для загрузки изображений
        if (!is_dir($uploadDir)) {
            // Создаем директорию, если она не существует
            mkdir($uploadDir, 0755, true);
        }

        // Перемещаем файл в целевую директорию
        try {
            $image->move($uploadDir, $imageFileName);
        } catch (FileException $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Выводим информацию о загруженном файле
        $uploadedFileInfo = [
            'file_name' => $imageFileName,
            'file_path' => $imageFilePath,
            'file_size' => $image->getSize(), // Получаем размер файла
            'mime_type' => $image->getClientMimeType(), // MIME-тип файла
        ];

        // Добавляем запись о файле в базу данных
        try {
            $pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

            $statement = $pdo->prepare('INSERT INTO imagespath (user_id, image_path) VALUES (:user_id, :image_path)');
            $statement->bindValue(':user_id', $userId);
            $statement->bindValue(':image_path', $imageFileName);

            $statement->execute();
        } catch (PDOException $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['success' => true, 'file_info' => $uploadedFileInfo]);
    }
}
