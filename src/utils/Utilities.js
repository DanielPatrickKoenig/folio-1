const DataTypes = {
    STRING: 'text',
    NUMBER: 'number',
    BOOLEAN: 'checkbox',
};

function convertToRems (pixels) {
    const convertedValue = pixels / 16;
    return `${convertedValue}rem`;
}

export { DataTypes, convertToRems };