<template>
    <div class="content-pages">
        <div
            v-for="(slide, i) in currentSlides"
            :key="i"
            class="cp-item"
        >
            <slot
                name="slide"
                v-bind="{ slide: slide.slide, index: slide.index }"
            />
        </div>
        <div class="cp-page-list">
            <a
                v-for="(page, i) in pageCount"
                :key="i"
                href="#"
                @click="currentPage = i"
            >
                {{ page }}
            </a>
        </div>
    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import { DataTypes } from '../../utils/Utilities';
export default {
    name: 'ContentPages',
    extends: BaseContentComponent,
    props: {
        pageLength: {
            default: 3,
            required: false,
            type: Number,
        },
    },
    data () {
        return {
            currentPage: 0,
        }
    },
    computed: {
        propsMap () {
            return [
                {
                    property: 'pageLength',
                    label: 'Page Length',
                    type: DataTypes.NUMBER,
                },
            ];
        },
        currentSlides () {
            return this.slides
                .map((slide, index) => ({ slide, index }))
                .filter((item) => Math.floor(item.index / this.pageLength) === this.currentPage);
        },
        pageCount () {
            return Math.ceil(this.slides.length / this.pageLength);
        }
    },
}
</script>

<style>

</style>