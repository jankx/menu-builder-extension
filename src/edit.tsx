import { useBlockProps } from '@wordpress/block-editor';
import { MenuStudio } from './studio/MenuStudio';
import { GutenbergMenuSchema } from './studio/types/menu';
import metadata from './block.json';

interface EditProps {
  attributes: { schema?: GutenbergMenuSchema };
  setAttributes: (attrs: { schema: GutenbergMenuSchema }) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps) {
  const schema =
    attributes.schema && Array.isArray(attributes.schema.items) && attributes.schema.items.length
      ? attributes.schema
      : (metadata.attributes.schema.default as unknown as GutenbergMenuSchema);

  const blockProps = useBlockProps({ className: 'gb-editor-shell' });

  return (
    <div {...blockProps}>
      <MenuStudio schema={schema} onChange={(next) => setAttributes({ schema: next })} />
    </div>
  );
}
