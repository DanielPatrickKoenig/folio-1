const DataTypes = {
    STRING: 'text',
    NUMBER: 'number',
    BOOLEAN: 'checkbox',
};

function convertToRems (pixels) {
    const convertedValue = pixels / 16;
    return `${convertedValue}rem`;
}

function processPointerEvent (e) {
    const values = {};
    if (e.type.includes('touch')) {
        if (e.touches.length) {
            values.x = e.touches[0].pageX;
            values.y = e.touches[0].pageY;
        }
    }
    else {
        values.x = e.pageX;
        values.y = e.pageY;
    }
    return { x: values.x, y: values.y };
}

export { DataTypes, convertToRems, processPointerEvent };