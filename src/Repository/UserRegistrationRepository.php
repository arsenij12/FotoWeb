<?php

namespace App\Repository;

use App\Entity\UserRegistration;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserRegistration>
 *
 * @method UserRegistration|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserRegistration|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserRegistration[]    findAll()
 * @method UserRegistration[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRegistrationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserRegistration::class);
    }

    //    /**
    //     * @return UserRegistration[] Returns an array of UserRegistration objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?UserRegistration
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
