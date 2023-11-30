<template>
    <div 
        class="content-polypod"
        @mousemove="move"
        @touchemove="move"
        ref="podContainer"
    >
        {{ marker }}
        <div 
            v-for="(slide, index) in slides"
            :key="index"
            class="polypod-container"
            :style="{ ...podPositions[index] }"
        >
            <ReactivePolypod
                :points="points"
                :marker-x="markerForPodIndex(index).x"
                :marker-y="markerForPodIndex(index).y"
                :ref="`pod${index}`"
            >
                <slot
                    name="slide"
                    v-bind="{ slide, index }"
                />
                <template #content="{ points }">
                    <div
                        v-for="(point, i) in points"
                        :key="i"
                        class="reactive-point"
                        :class="`reactive-point-${i}`"
                        :style="{ left: `${point.x}%`, top: `${point.y}%` }"
                    >
                        
                    </div>
                </template>
            </ReactivePolypod>
        </div>
    </div>
</template>

<script>
import BaseContentComponent from '../BaseContentComponent.js';
import ReactivePolypod from '../Shared/ReactivePolypod.vue';
import { processPointerEvent } from '../../utils/Utilities';
export default {
    name: 'ContentPolygrid',
    extends: BaseContentComponent,
    components: {
        ReactivePolypod,
    },
    props: {
        points: {
            default: 3,
            required: false,
            type: Number,
        },
    },
    data () {
        return {
            marker: {
                x: 0,
                y: 0,
            },
            podPositions: this.slides.map(() => ({ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` })),
        }
    },
    computed: {
        podPosition () {
            return index => {
                let position = { x: 0, y: 0 };
                if (this.$refs[`pod${index}`] && this.$refs[`pod${index}`][0]) {
                    const podBounds = this.$refs[`pod${index}`][0].$el.getBoundingClientRect();
                    position = { x: podBounds.left, y: podBounds.top };
                }
                return position;
            };
        },
        podPositionPercentage () {
            return index => {
                const rawPosition = this.podPosition(index);
                let position = { x: 0, y: 0 };
                if (this.$refs.podContainer){
                    const containerBounds = this.$refs.podContainer.getBoundingClientRect();
                    position = {
                        x: (rawPosition.x / containerBounds.width) * 100,
                        y: (rawPosition.y / containerBounds.width) * 100,
                    }
                }
                return position;
            }
        },
        markerForPodIndex () {
            return index => {
                const rawPosition = this.podPosition(index);
                return {
                    x: this.marker.x - rawPosition.x,
                    y: this.marker.y - rawPosition.y - document.scrollingElement.scrollTop,
                };
            }
        }
        
    },
    methods: {
        move (e) {
            const position = processPointerEvent(e);
            const containerBounds = this.$refs.podContainer.getBoundingClientRect();
            this.marker = {
                x: position.x,
                y: position.y,
                xPercent: ((position.x - containerBounds.left) / containerBounds.width) * 100,
                yPercent: ((position.y - containerBounds.top) / containerBounds.height) * 100,
             };
            //  console.log(this.marker);
        },
    },
}
</script>

<style>

</style>