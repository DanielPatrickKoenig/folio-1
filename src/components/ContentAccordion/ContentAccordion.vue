<template>
    <div class="content-accordion">
        <div class="ca-row">
            <div
                v-for="(slide, index) in slides"
                :key="index"
                class="ca-inner-row"
            >
                <slot
                    name="slide"
                    v-bind="{ slide, index }"
                />
            </div>
        </div>
    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import { DataTypes } from '../../utils/Utilities';
export default {
    name: 'ContentAccordion',
    extends: BaseContentComponent,
    data () {
        return {
            DataTypes,
        };
    },
    props: {
        slides: {
            required: true,
            type: Array,
        },
        exclusiveRows: {
            default: false,
            required: false,
            type: Boolean,
        },
    },
    computed: {
        propsMap () {
            return [
                {
                    property: 'exclusiveRows',
                    label: 'Exclusive Rows',
                    type: DataTypes.BOOLEAN,
                },
            ];
        },
    }
}

</script>

<style>

</style>