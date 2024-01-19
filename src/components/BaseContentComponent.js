import { DataTypes } from '../js/utils/Utilities';
export default{
    computed: {
        dataTypes () {
            return DataTypes;
        },
        propsMap () {
            return [];
        },
    },
    props: {
        slides: {
            required: true,
            type: Array,
        },
    }
};