<template>
    <div class="content-accordion">
        <div
            v-for="(slide, index) in slides"
            :key="index"
            class="ca-row"
        >
            <h3 class="ca-row-header">
                <a @click="toggleRow(index, true)">
                    {{ slide.title ? slide.title : `Row # ${index}` }}
                </a>
            </h3>
            <div 
                class="ca-row-inner"
                :class="{ 'is-open': rowDimensions[index].open }"
                :style="rowStyle(index)"
            >
                <div :ref="`row${index}`">
                    <slot
                        name="slide"
                        v-bind="{ slide, index }"
                    />
                </div>
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
            rowDimensions: this.slides.map((item, index) => ({ height: 0, open: false, animating: false, index })),
            lastOpened: -1,
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
    watch: {
        exclusiveRows (newValue) {
            if (newValue) {
                this.rowDimensions
                    .filter(item => item.index !== this.lastOpened && item.open)
                    .forEach(item => this.toggleRow(item.index));
            }
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
        rowStyle () {
            return row => {
                return this.rowDimensions[row].animating ? { height: `${this.rowDimensions[row].height}px` } : {};
            }
        },
    },
    methods: {
        async toggleRow (row, isSource) {
            if (this.exclusiveRows && isSource) {
                this.rowDimensions
                    .filter(item => item.index !== row && item.open)
                    .forEach(item => this.toggleRow(item.index));
            }
            this.lastOpened = row;
            this.rowDimensions[row].animating = true;
            await new Promise(resolve => setTimeout(resolve, 10));
            this.rowDimensions[row].open = !this.rowDimensions[row].open;
            this.rowDimensions[row].height = this.rowDimensions[row].open ? this.$refs[`row${row}`][0].getBoundingClientRect().height : 0;
            await new Promise(resolve => setTimeout(resolve, 500));
            this.rowDimensions[row].animating = false;
        },
    }
}

</script>

<style>

</style>