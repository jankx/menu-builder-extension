<?php

namespace Jankx\Extensions\MenuBuilder;

use Jankx\Extensions\AbstractExtension;

class MenuBuilderExtension extends AbstractExtension
{
    public function init(): void
    {
        $this->name = 'menu-builder';
        $this->version = '1.0.0';
        $this->description = 'Polymorphic Menu Builder block for Gutenberg.';
        $this->author = 'Jankx';
    }

    public function register_hooks(): void
    {
        add_action('jankx/gutenberg/register-blocks', [$this, 'register_extension_blocks'], 10, 2);
    }

    public function register_extension_blocks($repository, $app): void
    {
        require_once __DIR__ . '/includes/Blocks/PolymorphicMenuBlock.php';

        $block = $app->make(\Jankx\Extensions\MenuBuilder\Blocks\PolymorphicMenuBlock::class);
        $block->setBlockPath($this->get_extension_path() . '/build');
        $repository->registerBlock($block);
    }
}
