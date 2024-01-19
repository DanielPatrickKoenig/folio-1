<template>
    <div class="content-coverflow">
        
        <button 
            v-if="showNavigation && currentSlide > 0"
            class="ccf-button ccf-button-left"
            :style="{ 'z-index': slides.length + 1 }"
            @click="previos"
        >
            left
        </button>
        <button 
            v-if="showNavigation && currentSlide < slides.length - 1"
            class="ccf-button ccf-button-right"
            :style="{ 'z-index': slides.length + 1 }"
            @click="next"
        >
            right
        </button>
        
        <div class="ccf-container">
            <div 
                class="ccf-track"
                :style="{ 'margin-left': `${(inactiveWidth * currentSlide * -1) / 16}rem` }"
            >
                <div
                    v-for="(slide, index) in slides"
                    :key="index"
                    class="ccf-item"
                    :style="{ 'z-index': index >= this.currentSlide ? (slides.length + 1) - index : 0, width: index === this.currentSlide ? 'inherit' : `${inactiveWidth / 16}rem` }"
                    :class="{ 'ccf-item-active': index === this.currentSlide, 'ccf-item-before': index < this.currentSlide, 'ccf-item-after': index > this.currentSlide }"
                >
                    <slot
                        name="slide"
                        v-bind="{ slide, index }"
                    >
                        CONTENT
                    </slot>
                </div>
            </div>
        </div>
        <ContentCarousel
            ref="carousel"
            :slides="slides"
            :autoplay="autoplay"
            :initial-slide="initialSlide"
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
import { DataTypes, convertToRems } from '../../js/utils/Utilities';
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
        inactiveWidth: {
            default: 30,
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
        slideStackOrder () {
            const maxSlide = (this.slides.length - this.currentSlide) + 1;
            return this.slides.map((item, index) => this.slides.length - index);
        },
        convertToRems,
    },
    methods: {
        onSlideChange (e) {
            this.currentSlide = e.newValue;
        },
        previos () {
            this.$refs.carousel.goToSlide(this.currentSlide - 1);
        },
        next () {
            this.$refs.carousel.goToSlide(this.currentSlide + 1);
        },
    },
}
</script>

<style>

</style>