<template>
    <div
        class="lazy-grid"
        @scroll="loadNext"
        ref="lazyGrid"
    >
        <div
            v-for="(column, i) in columnMatrix"
            :key="i"
            class="lg-column"
            :style="{ width: `${100 / columns}%` }"
            :ref="`column${i}`"
        >
            <div
                v-for="(slide, index) in column"
                :key="index"
                class="lg-item"
                :style="{ height: `${6 + (slide.index * 2)}rem` }"
            >
                <slot
                    name="slide"
                    v-bind="{ slide: slide.slide, index: slide.index }"
                />
            </div>
        </div>
    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import { DataTypes } from '../../utils/Utilities';
import { flatten } from 'lodash';
export default {
    name: 'ContentLazyLoader',
    extends: BaseContentComponent,
    props: {
        columns: {
            default: 1,
            required: false,
            type: Number,
        },
    },
    data () {
        return {
            columnMatrix: [],
        }
    },
    computed: {
        propsMap () {
            return [
                {
                    property: 'columns',
                    label: 'Columns',
                    type: DataTypes.NUMBER,
                },
            ];
        },
    },
    watch: {
        columns (newValue, oldValue) {
            if (newValue !== oldValue) {
                this.createColumnMatrix();
            }
        },
    },
    mounted () {
        this.createColumnMatrix();
    },
    methods: {
        async createColumnMatrix () {
            this.columnMatrix = [...new Array(this.columns).keys()].map(item => ([{ slide: this.slides[item], index: item }]));
            await new Promise(resolve => setTimeout(resolve, 100));
            this.loadNext();
        },
        async loadNext () {
            console.log('load next');
            const additoinLength = [...new Array(this.columns).keys()].filter(item => this.loadNextIntoColumn(item)).length;
            await new Promise(resolve => setTimeout(resolve, 100));
            if (additoinLength) this.loadNext();
        },
        loadNextIntoColumn (column) {
            let hasRoom = false;
            const children = this.$refs[`column${column}`][0].children;
            if (children.length) {
                const lastChild = children[children.length - 1];
                const lcBounds = lastChild.getBoundingClientRect();
                console.log(lcBounds.bottom);
                const gridBounds = this.$refs.lazyGrid.getBoundingClientRect();
                if (lcBounds.bottom < gridBounds.bottom + gridBounds.top) {
                    const nextIndex = flatten(this.columnMatrix).length;
                    console.log('has room', column);
                    if (this.slides[nextIndex]) {
                        this.columnMatrix[column].push({ slide: this.slides[nextIndex], index: nextIndex });
                        hasRoom = true;
                    }
                }
            }
            return hasRoom;
        },
        
    },
}
</script>

<style>

</style>