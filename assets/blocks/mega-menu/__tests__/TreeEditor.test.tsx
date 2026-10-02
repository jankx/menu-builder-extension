import { render, screen, fireEvent } from '@testing-library/react';
import TreeEditor, { MenuItem } from '../components/TreeEditor';

const mockItems: MenuItem[] = [
    {
        id: 'item-1',
        label: 'Products',
        url: '/products',
        type: 'mega',
        layout: 'grid',
        columns: 4,
        isOpen: true,
        children: [
            {
                id: 'item-1-1',
                label: 'Phones',
                url: '/phones',
                type: 'link',
                layout: 'list',
                columns: 1,
                children: []
            }
        ]
    },
    {
        id: 'item-2',
        label: 'Solutions',
        url: '/solutions',
        type: 'dropdown',
        layout: 'grid',
        columns: 2,
        isOpen: false,
        children: []
    }
];

describe('TreeEditor', () => {
    it('renders root items', () => {
        render(
            <TreeEditor
                items={mockItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={jest.fn()}
            />
        );

        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Solutions')).toBeInTheDocument();
    });

    it('renders nested children when expanded', () => {
        render(
            <TreeEditor
                items={mockItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={jest.fn()}
            />
        );

        expect(screen.getByText('Phones')).toBeInTheDocument();
    });

    it('hides nested children when collapsed', () => {
        const collapsedItems = [
            {
                ...mockItems[0],
                isOpen: false
            },
            mockItems[1]
        ];

        render(
            <TreeEditor
                items={collapsedItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={jest.fn()}
            />
        );

        expect(screen.queryByText('Phones')).not.toBeInTheDocument();
    });

    it('calls onSelect when item is clicked', () => {
        const onSelect = jest.fn();

        render(
            <TreeEditor
                items={mockItems}
                onSelect={onSelect}
                selectedId={null}
                onUpdateStructure={jest.fn()}
            />
        );

        fireEvent.click(screen.getByText('Products'));
        expect(onSelect).toHaveBeenCalledWith('item-1');
    });

    it('calls onUpdateStructure when item is deleted', () => {
        const onUpdateStructure = jest.fn();

        render(
            <TreeEditor
                items={mockItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={onUpdateStructure}
            />
        );

        const deleteButtons = screen.getAllByLabelText('Delete');
        fireEvent.click(deleteButtons[0]);
        expect(onUpdateStructure).toHaveBeenCalled();
    });

    it('calls onUpdateStructure when item is duplicated', () => {
        const onUpdateStructure = jest.fn();

        render(
            <TreeEditor
                items={mockItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={onUpdateStructure}
            />
        );

        const duplicateButtons = screen.getAllByLabelText('Duplicate');
        fireEvent.click(duplicateButtons[0]);
        expect(onUpdateStructure).toHaveBeenCalled();
    });

    it('calls onUpdateStructure when item is moved up', () => {
        const onUpdateStructure = jest.fn();

        render(
            <TreeEditor
                items={mockItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={onUpdateStructure}
            />
        );

        const moveUpButtons = screen.getAllByLabelText('Move up');
        fireEvent.click(moveUpButtons[1]);
        expect(onUpdateStructure).toHaveBeenCalled();
    });

    it('calls onUpdateStructure when item is moved down', () => {
        const onUpdateStructure = jest.fn();

        render(
            <TreeEditor
                items={mockItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={onUpdateStructure}
            />
        );

        const moveDownButtons = screen.getAllByLabelText('Move down');
        fireEvent.click(moveDownButtons[0]);
        expect(onUpdateStructure).toHaveBeenCalled();
    });

    it('calls onUpdateStructure when child is added', () => {
        const onUpdateStructure = jest.fn();

        render(
            <TreeEditor
                items={mockItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={onUpdateStructure}
            />
        );

        const addChildButtons = screen.getAllByLabelText('Add child');
        fireEvent.click(addChildButtons[0]);
        expect(onUpdateStructure).toHaveBeenCalled();
    });

    it('filters items based on search term', () => {
        render(
            <TreeEditor
                items={mockItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={jest.fn()}
            />
        );

        const searchInput = screen.getByPlaceholderText('Search menu items...');
        fireEvent.change(searchInput, { target: { value: 'Products' } });

        expect(screen.getByText('Products')).toBeInTheDocument();
    });

    it('shows empty state when no items', () => {
        render(
            <TreeEditor
                items={[]}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={jest.fn()}
            />
        );

        expect(screen.getByText(/No menu items yet/i)).toBeInTheDocument();
    });

    it('displays correct layout tag for grid layout', () => {
        render(
            <TreeEditor
                items={mockItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={jest.fn()}
            />
        );

        expect(screen.getByText('Grid (4)')).toBeInTheDocument();
    });

    it('displays correct layout tag for list layout', () => {
        const listItems: MenuItem[] = [
            {
                id: 'item-1',
                label: 'Simple Link',
                url: '/simple',
                type: 'link',
                layout: 'list',
                columns: 1,
                children: []
            }
        ];

        render(
            <TreeEditor
                items={listItems}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={jest.fn()}
            />
        );

        expect(screen.queryByText(/Grid|Cols/)).not.toBeInTheDocument();
    });

    it('displays badge when present', () => {
        const itemsWithBadge: MenuItem[] = [
            {
                id: 'item-1',
                label: 'Sale',
                url: '/sale',
                type: 'link',
                layout: 'list',
                columns: 1,
                badge: 'HOT',
                badgeColor: 'red',
                children: []
            }
        ];

        render(
            <TreeEditor
                items={itemsWithBadge}
                onSelect={jest.fn()}
                selectedId={null}
                onUpdateStructure={jest.fn()}
            />
        );

        expect(screen.getByText('HOT')).toBeInTheDocument();
    });
});
