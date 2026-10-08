<?php

namespace Jankx\Extensions\MenuBuilder\Blocks;

use Jankx\Gutenberg\Block;

class PolymorphicMenuBlock extends Block
{
    protected $blockId = 'jankx/polymorphic-menu';

    /**
     * Render the frontend HTML from the stored menu schema.
     *
     * @param array $attributes Block attributes (contains the `schema` object).
     * @param string $content Block inner content (unused — dynamic block).
     * @param \WP_Block $block Block instance.
     */
    public function render($attributes, $content, $block): string
    {
        $schema = $this->resolveSchema($attributes);

        if (!$schema) {
            return '';
        }

        ob_start();
        include dirname(__DIR__, 2) . '/templates/menu.php';
        return (string) ob_get_clean();
    }

    protected function resolveSchema(array $attributes): ?array
    {
        $schema = $attributes['schema'] ?? null;

        if (
            is_array($schema)
            && !empty($schema['items'])
            && is_array($schema['items'])
            && !empty($schema['attributes'])
            && is_array($schema['attributes'])
        ) {
            return $schema;
        }

        return $this->getDefaultSchema();
    }

    /**
     * Fallback schema shipped as the default value of the `schema`
     * attribute inside block.json — single source of truth shared with
     * the editor (see src/studio/data/defaultMenu.ts).
     */
    protected function getDefaultSchema(): ?array
    {
        $blockJsonFile = rtrim((string) $this->blockPath, '/') . '/block.json';

        if (!file_exists($blockJsonFile)) {
            return null;
        }

        $blockJson = json_decode((string) file_get_contents($blockJsonFile), true);
        $default = $blockJson['attributes']['schema']['default'] ?? null;

        return is_array($default) && !empty($default['items']) ? $default : null;
    }
}
