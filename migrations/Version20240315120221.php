<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240315120221 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE imagespath (
            id SERIAL PRIMARY KEY, 
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES userRegistration(id),
            image_path VARCHAR(255) NOT NULL
        )');

    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE imagespath');

    }
}
