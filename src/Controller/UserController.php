<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    /**
     * @Route("/api/search-users", name="search_users", methods={"GET"})
     */
    public function searchUsers(Request $request)
    {
        $username = $request->query->get('username');

        $pdo = new \PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

        $statement = $pdo->prepare('SELECT id, name, email, password FROM userregistration WHERE name = :username');

        $statement->bindParam(':username', $username);
        $statement->execute();
        $users = $statement->fetchAll(\PDO::FETCH_ASSOC);

        return new JsonResponse($users);
    }

    /**
     * @Route("/api/users/{userId}", name="api_user_profile", methods={"GET"})
     */
    public function getUserProfile($userId): JsonResponse
    {
        $pdo = new \PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

        // Получаем информацию о пользователе
        $userStatement = $pdo->prepare('SELECT id, name, email FROM userregistration WHERE id = :userId');
        $userStatement->bindParam(':userId', $userId);
        $userStatement->execute();
        $user = $userStatement->fetch(\PDO::FETCH_ASSOC);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Получаем список друзей пользователя
        $friendsStatement = $pdo->prepare('SELECT friend_id FROM friends WHERE user_id = :userId');
        $friendsStatement->bindParam(':userId', $userId);
        $friendsStatement->execute();
        $friendIds = $friendsStatement->fetchAll(\PDO::FETCH_COLUMN);

        $friends = [];
        foreach ($friendIds as $friendId) {
            $friendStatement = $pdo->prepare('SELECT id, name, email FROM userregistration WHERE id = :friendId');
            $friendStatement->bindParam(':friendId', $friendId);
            $friendStatement->execute();
            $friend = $friendStatement->fetch(\PDO::FETCH_ASSOC);
            $friends[] = $friend;
        }

        $userData = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'friends' => $friends, // Добавляем список друзей в данные пользователя
        ];

        return new JsonResponse($userData);
    }

    /**
    * @Route("/api/add-friend", name="api_add_friend", methods={"POST"})
    */
    public function addFriend(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $userId = $data['userId'];
        $friendUsername = $data['friendUsername']; 

        $pdo = new \PDO('pgsql:host=127.0.0.1;port=5432;dbname=Symfony;user=operator;password=qpwoeivb1029');

        // Получаем ID друга по его имени
        $friendStatement = $pdo->prepare('SELECT id FROM userregistration WHERE name = :friendUsername');
        $friendStatement->bindParam(':friendUsername', $friendUsername);
        $friendStatement->execute();
        $friendId = $friendStatement->fetchColumn();

        if (!$friendId) {
            return new JsonResponse(['error' => 'Friend not found'], Response::HTTP_NOT_FOUND);
        }

        // Добавляем друга в базу данных
        $statement = $pdo->prepare('INSERT INTO friends (user_id, friend_id) VALUES (:userId, :friendId)');
        $statement->bindParam(':userId', $userId);
        $statement->bindParam(':friendId', $friendId);
        $statement->execute();

        // Получаем информацию о добавленном друге
        $friendStatement = $pdo->prepare('SELECT id, name, email FROM userregistration WHERE id = :friendId');
        $friendStatement->bindParam(':friendId', $friendId);
        $friendStatement->execute();
        $friend = $friendStatement->fetch(\PDO::FETCH_ASSOC);

        return new JsonResponse(['friend' => $friend]);
    }

}
