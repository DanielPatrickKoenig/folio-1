<template>
    <div
        ref="cc"
        class="content-carousel"
        data-testid="carousel"
        @mousedown="down"
        @touchstart="down"
        @mousemove="move"
        @touchmove="move"
        @mouseup="up"
        @touchend="up"
    >
        <div class="visually-hidden">
            <div
                ref="sizingElement"
                style="display: inline-block;"
                class="cc-sizing-element"
            >
                <slot>
                    WORD
                </slot>
            </div>
        </div>

        <div
            class="cc-content-container"
            :style="cssStyle"
        >
            <div
                class="cc-slide-frame"
                :style="cssStyle"
            >
                <div
                    class="cc-slide-track"
                    :style="cssStyle"
                >
                    <div
                        v-for="(slide, index) in slides"
                        :key="index"
                        class="cc-slide"
                        :class="[`cc-slide-${index}`, { 'cc-slide-active': index === currentSlide }]"
                        :style="cssStyle"
                        data-testid="carousel-slide"
                    >
                        <slot
                            name="slide"
                            v-bind="{ slide, index }"
                        >
                            Slide {{ index }}
                        </slot>
                    </div>
                    <div
                        v-if="autoplay && loop"
                        class="cc-slide cc-slide-loop-slide"
                        :class="[`cc-slide-${slides.length - 1}`, { 'cc-slide-active': slides.length - 1 === currentSlide }]"
                        :style="cssStyle"
                        data-testid="carousel-slide"
                    >
                        <slot
                            name="slide"
                            v-bind="{ slide: slides[slides.length - 1], index: slides.length - 1 }"
                        >
                            Slide {{ slides.length - 1 }}
                        </slot>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="showNavigation"
            class="cc-navigation"
            data-testid="carousel-navigation"
        >
            <template v-for="button in ['left', 'right']">
                <div
                    v-if="shouldShowButton(button)"
                    :key="button"
                    class="cc-nav-button"
                    :class="`cc-nav-button-${button}`"
                    :data-testid="`carousel-${button}-button`"
                >
                    <div
                        aria-hidden="true"
                        class="cc-big-nav-element"
                        @click="navClicked(button, true)"
                    />
                    <button
                        class="cc-small-nav-element"
                        :aria-label="button"
                        @click="navClicked(button)"
                    >
                        <slot
                            name="button-content"
                            :data-testid="`carousel-${button}-button-small`"
                            v-bind="{ button }"
                        >
                            {{ button }}
                        </slot>
                    </button>
                </div>
            </template>
        </div>
        <ContentCarouselDots
            v-if="showDots"
            :count="slides.length"
            :current="currentSlide % slides.length"
            @selected="onDotSelected"
        />
        <div
            v-if="dragging && moveCount > 2"
            aria-hidden="true"
            class="cc-gesture-tracker"
            @mousemove="move"
            @mouseup="up"
            @touchmove="move"
            @touchend="up"
        />
    </div>
</template>

<script>
    import ContentCarouselDots from './ContentCarouselDots.vue';
    import BaseContentComponent from '../BaseContentComponent.js';
    import { DataTypes } from '../../utils/Utilities';
    export default {
        name: 'ContentCarousel',
        extends: BaseContentComponent,
        components: {
            ContentCarouselDots,
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
            loop: {
                default: false,
                required: false,
                type: Boolean,
            },
        },
        data () {
            return {
                currentSlide: this.initialSlide,
                guidedDimensions: {
                    width: 300,
                    widthMobile: 300,
                },
                pointerStartData: {},
                dragging: false,
                moveCount: 0,
                moveDiffData: { x: 0, y: 0 },
                loopCount: 0,
            };
        },
        watch: {
            loop () {
                this.loopCount = 0;
                this.currentSlide = this.currentSlide % this.slides.length;
            },
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
                        property: 'loop',
                        label: 'Loop',
                        type: DataTypes.BOOLEAN,
                    },
                    {
                        property: 'autoplayInterval',
                        label: 'Autoplay Interval',
                        type: DataTypes.NUMBER,
                        
                    },
                ];
            },
            shouldShowButton () {
                return side => {
                    let shouldShow = false;
                    if (side === 'left') {
                        shouldShow = this.currentSlide > 0 + (this.loopCount * this.slides.length);
                    }
                    else if (side === 'right') {
                        shouldShow = this.currentSlide < this.slides.length - 1 + (this.loopCount * this.slides.length);
                    }
                    return shouldShow;
                };
            },
            cssStyle () {
                return {
                    '--slide-width': `${this.guidedDimensions.width}px`,
                    '--slide-width-mobile': `${this.guidedDimensions.widthMobile}px`,
                    '--carousel-width': `${this.guidedDimensions.width * this.slides.length}px`,
                    '--carousel-width-mobile': `${this.guidedDimensions.widthMobile * this.slides.length}px`,
                    '--carousel-height': this.guidedDimensions.height ? `${this.guidedDimensions.height}px` : 'auto',
                    '--carousel-height-mobile': this.guidedDimensions.height ? `${this.guidedDimensions.height}px` : 'auto',
                    '--slide-height': this.guidedDimensions.height ? `${this.guidedDimensions.height}px` : 'auto',
                    '--slide-height-mobile': this.guidedDimensions.height ? `${this.guidedDimensions.height}px` : 'auto',
                    '--carousel-offset': `${(this.guidedDimensions.width * this.currentSlide * -1) + this.moveDiffData.x}px`,
                    '--carousel-offset-mobile': `${(this.guidedDimensions.widthMobile * this.currentSlide) + this.moveDiffData.x}px`,
                    '--carousel-move-offset': `${this.moveDiffData.x}px`,
                    '--carousel-margin-left': `${this.guidedDimensions.width * this.slides.length * this.loopCount}px`,
                };
            },
        },
        mounted () {
            this.initializeScaling();
            this.autoRotate();
        },
        beforeDestroy () {
            if (this.$refs.sizingElement) {
                window.removeEventListener('resize', this.doScaling);
                document.removeEventListener('mouseleave', this.up);
            }
        },
        methods: {
            navClicked (side, fromClick) {
                const slide =  this.currentSlide + (side === 'left' ? -1 : 1);
                this.goToSlide(slide);
                if (fromClick) this.$emit('slide-change-from-click', { slide });
            },
            goToSlide (slide) {
                if ([...new Array(this.slides.length).keys()].map(item => item.toString()).find(item => item === (slide - (this.slides.length * this.loopCount)).toString())) {
                    const oldValue = this.currentSlide;
                    this.currentSlide = slide;
                    const newValue = this.currentSlide;
                    this.$emit('slide-change', { newValue, oldValue });
                }
            },
            doScaling () {
                const { sizingElement } = this.$refs;
                if (sizingElement?.getBoundingClientRect()) {
                    this.guidedDimensions.width =  sizingElement?.getBoundingClientRect().width;
                    this.guidedDimensions.widthMobile =  sizingElement?.getBoundingClientRect().width;
                    this.guidedDimensions.height =  sizingElement?.getBoundingClientRect().height;
                }
            },
            async initializeScaling () {
                while (!this.$refs.sizingElement) {
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
                this.doScaling();
                window.addEventListener('resize', this.doScaling);
                document.addEventListener('mouseleave', this.up);
            },
            processPointerEvent (e) {
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
                return values;
            },
            down (e) {
                this.moveCount = 0;
                this.pointerStartData = this.processPointerEvent(e);
                this.dragging = true;
            },
            move (e) {
                if (this.dragging) {
                    console.log(e);
                    this.moveCount++;
                    if (this.moveCount > 2) {
                        const moveData = this.processPointerEvent(e);
                        this.moveDiffData = { x: moveData.x - this.pointerStartData.x, y: moveData.y - this.pointerStartData.y };
                    }
                }
            },
            up () {
                if (this.dragging) {
                    if (Math.abs(this.moveDiffData.x) > this.guidedDimensions.width * .3) {
                        console.log('diff bigger');
                        this.navClicked(this.moveDiffData.x > 0 ? 'left' : 'right');
                    }
                    this.moveDiffData = { x: 0, y: 0 };
                }
                this.dragging = false;
                this.moveCount = 0;
            },
            onDotSelected (dot) {
                this.goToSlide(dot + (this.slides.length * this.loopCount));
            },
            async autoRotate () {
                await new Promise(resolve => setTimeout(resolve, this.autoplayInterval));
                if (this.autoplay && (this.currentSlide < this.slides.length - 1 || this.loop)) {
                    const oldValue = this.currentSlide;
                    this.currentSlide++;
                    const newValue = this.currentSlide;
                    this.$emit('slide-change', { newValue, oldValue });
                    this.loopCount = Math.floor((this.currentSlide) / this.slides.length);
                }
                if (this.$refs.cc) {
                    this.autoRotate();
                }
            },
        },
    };
</script>

<style>
.content-carousel .cc-content-container .cc-slide-frame .cc-slide-track{
    display: flex;
    width: var(--carousel-width-mobile);
    position: relative;
    transition: left .25s;
    left: var(--carousel-offset);
    margin-left: var(--carousel-margin-left);
    height: var(--slide-height-mobile);
}
.content-carousel .cc-content-container .cc-slide-frame{
    width: var(--slide-width-mobile);
    height: var(--slide-height-mobile);
    overflow: hidden;
    margin: 0 auto;
}
.content-carousel .cc-content-container .cc-slide-frame .cc-slide-track .cc-slide{
    width: var(--slide-width-mobile);
    height: var(--slide-height-mobile);
    transition: transform .25s;
}
</style>
