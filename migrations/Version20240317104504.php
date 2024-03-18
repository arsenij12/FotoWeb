<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240317104504 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE user_social_links (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            social_network VARCHAR(255) NOT NULL,
            link VARCHAR(255) NOT NULL,
            FOREIGN KEY (user_id) REFERENCES userRegistration(id)
        )');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE user_social_links');

    }
}
