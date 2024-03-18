<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240318074848 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE friends (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            friend_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES userregistration(id),
            FOREIGN KEY (friend_id) REFERENCES userregistration(id)
        );'
        );
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE friends');
    }
}
