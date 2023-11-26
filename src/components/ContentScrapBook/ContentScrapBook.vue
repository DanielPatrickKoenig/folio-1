<template>
    <div class="content-scrap-book">
        <div
            ref="board"
            class="csa-board"
        >
            <DraggableContent
                v-for="(slide, index) in slides"
                :key="index"
                :width="`${dimensions[index].width}%`"
                :height="`${dimensions[index].height}%`"
                :left="dimensions[index].x"
                :top="dimensions[index].y"
                :item-id="index.toString()"
                class="csa-slide"
                @selected="onSelected(index)"
                @reposition="onRepositionSlide"
            >
                <div :style="{ transform: `rotate(${dimensions[index].rotation}deg)` }">
                    <slot
                        name="slide"
                        v-bind="{ slide, index }"
                    >
                        Slide {{ index }}
                    </slot>
                </div>
            </DraggableContent>
            <template v-if="selectedSlide !== null">
                <div
                    ref="rotatorMarker"
                    class="rotation-marker"
                    :style="{ left: `${markerPosition(selectedSlide).xPercent}%`, top: `${markerPosition(selectedSlide).yPercent}%` }"
                />
                <DraggableContent
                    ref="rotator"
                    item-id="rotator"
                    :width="convertToRems(24)"
                    :height="convertToRems(24)"
                    @reposition="onRotatorMoved"
                    @position-complete="onRotationComplete"
                >
                    <div class="rotation-element"></div>
                </DraggableContent>
            </template>
        </div>
    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import { DataTypes, convertToRems } from '../../utils/Utilities';
import DraggableContent from '../shared/DraggableContent.vue';
import jstrig from 'jstrig';
export default {
    name: 'ContentScrapBook',
    extends: BaseContentComponent,
    components: {
        DraggableContent,
    },
    data () {
        return {
            selectedSlide: null,
            dimensions: this.slides.map((item, index) => ({
                rotation: 0,
                width: 10,
                height: 10,
                x: 5 * index,
                y: 20,
            })),
        };
    },
    computed: {
        rotatorDistance () {
            return this.dimensions[this.selectedSlide].height * .5;
        },
        markerPosition () {
            return index => ({
                xPercent: jstrig.orbit(this.dimensions[index].xPercent, this.rotatorDistance, this.dimensions[index].rotation, 'cos'),
                yPercent: jstrig.orbit(this.dimensions[index].yPercent, this.rotatorDistance, this.dimensions[index].rotation, 'sin'),
            });
        },
    },
    methods: {
        onSelected (index) {
            console.log(index);
            this.selectedSlide = index;
        },
        onRepositionSlide (e) {
            const index = Number(e.id);
            this.dimensions[index].xPercent = e.xPercent;
            this.dimensions[index].yPercent = e.yPercent;
            this.$refs.rotator.setPositionPercent(this.markerPosition(index));
        },
        onRotatorMoved (e) {
            this.dimensions[this.selectedSlide].rotation = jstrig.angle({ x: this.dimensions[this.selectedSlide].xPercent, y: this.dimensions[this.selectedSlide].yPercent }, { x: e.xPercent, y: e.yPercent });
            this.dimensions[this.selectedSlide].width = jstrig.distance({ x: this.dimensions[this.selectedSlide].xPercent, y: this.dimensions[this.selectedSlide].yPercent }, { x: e.xPercent, y: e.yPercent }) * 2;
            this.dimensions[this.selectedSlide].height = this.dimensions[this.selectedSlide].width;
        },
        onRotationComplete () {
            this.$refs.rotator.setPositionPercent(this.markerPosition(this.selectedSlide));
        },
        convertToRems,
    },
}
</script>

<style>

</style>