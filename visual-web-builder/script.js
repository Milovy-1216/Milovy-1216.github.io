document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable-item');
    const canvas = document.getElementById('canvas');
    const exportBtn = document.getElementById('export-btn');
    const clearBtn = document.getElementById('clear-btn');
    const previewBtn = document.getElementById('preview-btn');

    // --- Drag and Drop Logic ---

    // 1. Sidebar Draggables
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('type', draggable.dataset.type);
            e.dataTransfer.effectAllowed = 'copy';
        });
    });

    // 2. Canvas Drop Zone
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'copy';

        // Visual cue for drop position could go here (finding nearest sibling)
        const afterElement = getDragAfterElement(canvas, e.clientY);
        // We could add a visual indicator line here
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');

        // If dropping a new component from sidebar
        if (type) {
            const template = document.getElementById(`tpl-${type}`);
            if (template) {
                const clone = template.content.cloneNode(true);
                const blockWrapper = createBlockWrapper(clone);

                const afterElement = getDragAfterElement(canvas, e.clientY);

                // Remove empty state if it exists
                const emptyState = canvas.querySelector('.empty-state');
                if (emptyState) emptyState.remove();

                if (afterElement == null) {
                    canvas.appendChild(blockWrapper);
                } else {
                    canvas.insertBefore(blockWrapper, afterElement);
                }
            }
        }
    });

    // --- Helper: Create Block Wrapper with Actions ---
    function createBlockWrapper(contentFragment) {
        const wrapper = document.createElement('div');
        wrapper.className = 'canvas-block';
        wrapper.draggable = true; // Allow reordering within canvas

        // Add Actions (Delete, Move Up/Down - simplified to just Delete for now)
        const actions = document.createElement('div');
        actions.className = 'block-actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.onclick = () => wrapper.remove();

        actions.appendChild(deleteBtn);
        wrapper.appendChild(actions);

        // Append the actual content
        // Note: contentFragment is a DocumentFragment, so we append its children
        wrapper.appendChild(contentFragment);

        // Reordering Logic for Canvas Blocks
        wrapper.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'reorder'); // Marker for reordering
            wrapper.classList.add('dragging');
            e.stopPropagation(); // Stop bubbling to canvas
        });

        wrapper.addEventListener('dragend', () => {
            wrapper.classList.remove('dragging');
        });

        return wrapper;
    }

    // --- Helper: Find Drop Position ---
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.canvas-block:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- Canvas Reordering Logic ---
    // We need to handle dragover on the canvas specifically for reordering too
    canvas.addEventListener('dragover', (e) => {
        const draggingItem = document.querySelector('.dragging');
        if (draggingItem) {
            e.preventDefault();
            const afterElement = getDragAfterElement(canvas, e.clientY);
            if (afterElement == null) {
                canvas.appendChild(draggingItem);
            } else {
                canvas.insertBefore(draggingItem, afterElement);
            }
        }
    });

    // --- Toolbar Actions ---

    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the canvas?')) {
            canvas.innerHTML = '<div class="empty-state"><p>Drag components here to start building</p></div>';
        }
    });

    exportBtn.addEventListener('click', () => {
        // Clone the canvas to clean it up
        const clone = canvas.cloneNode(true);

        // Remove UI elements (actions, empty state, wrapper classes)
        const blocks = clone.querySelectorAll('.canvas-block');
        let htmlOutput = '';

        // We want to extract the INNER content of each block, not the wrapper
        blocks.forEach(block => {
            // Remove the actions div
            const actions = block.querySelector('.block-actions');
            if (actions) actions.remove();

            // The rest is the content. 
            // However, we need to be careful. The wrapper contains the content directly.
            // Let's just get the innerHTML of the wrapper.
            htmlOutput += block.innerHTML + '\n';
        });

        // If empty (only empty state)
        if (blocks.length === 0) {
            alert('Canvas is empty!');
            return;
        }

        // Wrap in a basic HTML structure or just copy the body content?
        // User asked to "copy html code". Let's provide the full page or just the body.
        // Usually just the body snippets are useful, but a full page is safer.
        const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Page</title>
    <style>
        /* Basic Reset */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: sans-serif; line-height: 1.6; }
        .container { max-width: 1100px; margin: 0 auto; padding: 20px; }
        
        /* Component Styles */
        .block-header { background: #fff; border-bottom: 1px solid #eee; padding: 15px 0; }
        .block-header .container { display: flex; justify-content: space-between; align-items: center; }
        .block-header nav a { margin-left: 20px; text-decoration: none; color: #333; }
        
        .block-hero { background: #f8f9fa; padding: 80px 0; text-align: center; }
        .block-hero h1 { font-size: 3rem; margin-bottom: 20px; }
        .block-hero .btn-cta { background: #000; color: #fff; padding: 10px 20px; border: none; border-radius: 4px; margin-top: 20px; cursor: pointer; }
        
        .block-features { padding: 60px 0; background: #fff; }
        .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .feature-item { text-align: center; padding: 20px; }
        
        .block-content { padding: 40px 0; line-height: 1.6; }
        
        .block-footer { background: #333; color: #fff; padding: 40px 0; text-align: center; }
    </style>
</head>
<body>
${htmlOutput}
</body>
</html>`;

        // Copy to clipboard
        navigator.clipboard.writeText(fullHtml).then(() => {
            alert('HTML copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy HTML. Check console.');
        });
    });
});
