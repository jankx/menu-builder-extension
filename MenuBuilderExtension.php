<?php

namespace Jankx\Extensions\MenuBuilder;

use Jankx\Extensions\AbstractExtension;

class MenuBuilderExtension extends AbstractExtension
{
    public function init(): void
    {
    }

    public function register_hooks(): void
    {
        add_action('jankx/gutenberg/register-blocks', [$this, 'register_extension_blocks'], 10, 2);
    }

    public function register_extension_blocks($repository, $app): void
    {
        $blocks = ["MegaMenuBlock", "MegaMenuItemBlock", "MegaMenuSubmenuBlock"];

        foreach ($blocks as $blockClass) {
            $fullClass = 'Jankx\Extensions\MenuBuilder\\Blocks\\' . $blockClass;
            $block = $app->make($fullClass);
            $blockId = basename($block->getBlockId());
            $block->setBlockPath($this->get_extension_path() . '/assets/dist/' . $blockId);
            $repository->registerBlock($block);
        }
    }
}
