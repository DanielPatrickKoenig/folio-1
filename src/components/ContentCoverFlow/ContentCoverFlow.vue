<template>
    <div class="content-coverflow">
        <div class="ccf-track">
            <div
                v-for="(slide, index) in slides"
                :key="index"
                class="ccf-item"
                :class="{ 'ccf-item-active': index === this.currentSlide }"
            >
                <slot
                    name="slide"
                    v-bind="{ slide, index }"
                >
                    CONTENT
                </slot>
            </div>
        </div>
        <ContentCarousel
            :slides="slides"
            :show-navigation="showNavigation"
            :autoplay="autoplay"
            :initial-slide="initialSlide"
            :show-dots="showDots"
            :autoplay-interval="autoplayInterval"
            @slide-change="onSlideChange"
        >
            <template #slide="{ index }">
                Empty {{ index }}
            </template>

        </ContentCarousel>
    </div>
</template>

<script>
import ContentCarousel from '../ContentCarousel/ContentCarousel.vue'
import BaseContentComponent from '../BaseContentComponent';
import { DataTypes } from '../../utils/Utilities';
export default {
    name: 'ContentCoverFlow',
    extends: BaseContentComponent,
    components: {
        ContentCarousel,
    },
    props: {
        showNavigation: {
            default: false,
            required: false,
            type: Boolean,
        },
        initialSlide: {
            default: 0,
            required: false,
            type: Number,
        },
        showDots: {
            default: false,
            required: false,
            type: Boolean,
        },
        autoplay: {
            default: false,
            required: false,
            type: Boolean,
        },
        autoplayInterval: {
            default: 3000,
            required: false,
            type: Number,
        },
    },
    data () {
        return {
            currentSlide: this.initialSlide,
        }
    },
    computed: {
        propsMap () {
            return [
                {
                    property: 'showNavigation',
                    label: 'Show Navigation',
                    type: DataTypes.BOOLEAN,
                },
                {
                    property: 'showDots',
                    label: 'Show dots',
                    type: DataTypes.BOOLEAN,
                },
                {
                    property: 'autoplay',
                    label: 'Autoplay',
                    type: DataTypes.BOOLEAN,
                },
                {
                    property: 'autoplayInterval',
                    label: 'Autoplay Interval',
                    type: DataTypes.NUMBER,
                    
                },
            ];
        },
    },
    methods: {
        onSlideChange (e) {
            this.currentSlide = e.newValue;
        },
    },
}
</script>

<style>

</style>